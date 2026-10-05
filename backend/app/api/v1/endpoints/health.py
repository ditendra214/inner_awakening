from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter()


@router.get("", response_model=HealthResponse, summary="Service Health Check")
async def health_check() -> HealthResponse:
    """Primary health check endpoint verifying service availability."""
    return HealthResponse(
        status="ok",
        service="inner-awakening-backend",
        version=settings.PROJECT_VERSION
    )
