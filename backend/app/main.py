from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base, check_database_health
from app.api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("inner_awakening.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown hooks."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.PROJECT_VERSION} in {settings.ENVIRONMENT} mode...")
    
    # Initialize database tables
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database connection and schema verified successfully.")
    except Exception as exc:
        logger.warning(f"Database initialization notice: {exc}")

    yield

    logger.info(f"Shutting down {settings.PROJECT_NAME}...")
    await engine.dispose()
    logger.info("Database engine connections closed.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=(
        "Production-grade backend foundation for INNER AWAKENING — a gamified fitness "
        "and RPG progression platform connecting Unity clients and Web viewers."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set up CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    tags=["System Health"],
    summary="Root Service Health Check",
    status_code=status.HTTP_200_OK
)
async def root_health_check():
    """Primary health check endpoint requested by game client & load balancer."""
    return {
        "status": "ok",
        "service": "inner-awakening-backend"
    }


@app.get("/", tags=["Root"])
async def root_info():
    """Returns basic service metadata and links to OpenAPI documentation."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }


# Include API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)
