import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_root_health_check():
    """Verify GET /health returns 200 and the exact expected payload."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data == {
            "status": "ok",
            "service": "inner-awakening-backend"
        }


@pytest.mark.asyncio
async def test_api_v1_health_check():
    """Verify GET /api/v1/health returns 200 and contains status and service."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "ok"
        assert data.get("service") == "inner-awakening-backend"
