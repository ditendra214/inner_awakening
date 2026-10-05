from typing import Dict, Any, Tuple
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.player import Player
from app.repositories.player_repo import player_repository
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.schemas.player import PlayerResponse, AppearanceResponse
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.core.config import settings
from app.core.seeder import seed_initial_items


def serialize_player(player: Player) -> PlayerResponse:
    """Helper to convert Player ORM model into PlayerResponse schema."""
    equipped_map = {}
    if player.equipment:
        for eq in player.equipment:
            equipped_map[eq.slot] = eq.item_id

    appearance_data = None
    if player.appearance:
        appearance_data = AppearanceResponse.model_validate(player.appearance)

    return PlayerResponse(
        id=player.id,
        username=player.username,
        email=player.email,
        character_preset=player.character_preset,
        level=player.level,
        xp=player.xp,
        rank_points=player.rank_points,
        rank_tier=player.rank_tier,
        fit_coins=player.fit_coins,
        blue_crystals=player.blue_crystals,
        streak_days=player.streak_days,
        is_active=player.is_active,
        is_superuser=player.is_superuser,
        created_at=player.created_at,
        appearance=appearance_data,
        equipped_slots=equipped_map
    )


class AuthService:
    async def register(self, db: AsyncSession, user_in: UserRegister) -> Tuple[TokenResponse, PlayerResponse]:
        """Registers a new hunter, ensures item catalog is seeded, and returns JWT tokens."""
        # 1. Ensure initial items exist so foreign keys resolve
        await seed_initial_items(db)

        # 2. Check for existing username or email
        existing_user = await player_repository.get_by_username(db, user_in.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Hunter codename (username) is already registered."
            )

        existing_email = await player_repository.get_by_email(db, user_in.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already associated with an account."
            )

        # 3. Create Player with Starter Loadout
        player = await player_repository.create(db, user_in)

        # 4. Generate Tokens
        claims = {
            "username": player.username,
            "rank_tier": player.rank_tier,
            "level": player.level
        }
        access_token = create_access_token(subject=player.id, claims=claims)
        refresh_token = create_refresh_token(subject=player.id)

        token_response = TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        return token_response, serialize_player(player)

    async def login(self, db: AsyncSession, login_data: UserLogin) -> Tuple[TokenResponse, PlayerResponse]:
        """Authenticates hunter credentials and returns JWT tokens."""
        player = await player_repository.get_by_email_or_username(db, login_data.email_or_username)
        if not player or not verify_password(login_data.password, player.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Verify username/email and password.",
                headers={"WWW-Authenticate": "Bearer"}
            )

        if not player.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Hunter account has been deactivated."
            )

        claims = {
            "username": player.username,
            "rank_tier": player.rank_tier,
            "level": player.level
        }
        access_token = create_access_token(subject=player.id, claims=claims)
        refresh_token = create_refresh_token(subject=player.id)

        token_response = TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        return token_response, serialize_player(player)

    async def refresh_access_token(self, db: AsyncSession, refresh_token_str: str) -> TokenResponse:
        """Validates a refresh token and generates a new access token."""
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token."
            )

        player_id = payload.get("sub")
        if not player_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Malformed token claims."
            )

        player = await player_repository.get_by_id(db, player_id)
        if not player or not player.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Hunter account no longer active."
            )

        claims = {
            "username": player.username,
            "rank_tier": player.rank_tier,
            "level": player.level
        }
        new_access_token = create_access_token(subject=player.id, claims=claims)
        new_refresh_token = create_refresh_token(subject=player.id)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )


auth_service = AuthService()
