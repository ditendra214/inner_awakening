from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern="^[a-zA-Z0-9_-]+$")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    character_preset: Literal["normal_man", "michelle"] = "normal_man"


class UserLogin(BaseModel):
    email_or_username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    username: Optional[str] = None
    type: Optional[str] = None
    exp: Optional[int] = None
