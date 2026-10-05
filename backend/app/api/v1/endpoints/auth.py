from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    RefreshTokenRequest,
    TokenResponse
)
from app.schemas.player import PlayerResponse
from app.services.auth_service import auth_service, serialize_player

router = APIRouter()


@router.post(
    "/register",
    response_model=Dict[str, Any],
    status_code=status.HTTP_201_CREATED,
    summary="Register New Hunter Account"
)
async def register(
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Registers a new hunter account:
    - Generates password hash with bcrypt
    - Creates base player record
    - Instantiates customized 3D character appearance (normal_man or michelle)
    - Automatically seeds and equips starter fitness gear
    - Issues cryptographically signed JWT access and refresh tokens
    """
    token_response, player_data = await auth_service.register(db, user_in)
    return {
        "tokens": token_response,
        "player": player_data
    }


@router.post(
    "/login",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Authenticate Hunter"
)
async def login(
    login_in: UserLogin,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Authenticates a hunter via email or codename/username and password.
    Returns access & refresh tokens along with current character loadout.
    """
    token_response, player_data = await auth_service.login(db, login_in)
    return {
        "tokens": token_response,
        "player": player_data
    }


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh Access Token"
)
async def refresh_token(
    refresh_in: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """Exchange a valid refresh token for a newly signed access token."""
    return await auth_service.refresh_access_token(db, refresh_in.refresh_token)


@router.get(
    "/me",
    response_model=PlayerResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated Hunter Profile & Loadout"
)
async def get_me(
    current_player: Player = Depends(get_current_player)
) -> PlayerResponse:
    """Returns the authenticated player's full profile, level, rank, and equipped items."""
    return serialize_player(current_player)
