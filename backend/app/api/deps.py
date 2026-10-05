from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_token
from app.models.player import Player
from app.repositories.player_repo import player_repository

# HTTP Bearer authentication scheme
security_bearer = HTTPBearer(auto_error=True)


async def get_current_player(
    auth: HTTPAuthorizationCredentials = Depends(security_bearer),
    db: AsyncSession = Depends(get_db)
) -> Player:
    """Dependency that authenticates and injects the active Player into endpoints."""
    token = auth.credentials
    payload = decode_token(token)
    
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    player_id: Optional[str] = payload.get("sub")
    if not player_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    player = await player_repository.get_by_id(db, player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated hunter profile not found."
        )

    if not player.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hunter profile is deactivated."
        )

    return player


async def get_current_active_superuser(
    current_player: Player = Depends(get_current_player)
) -> Player:
    """Dependency that enforces superuser/admin privileges."""
    if not current_player.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required."
        )
    return current_player
