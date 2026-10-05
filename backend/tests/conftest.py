import pytest
import pytest_asyncio
from app.core.database import engine, Base
from app.core.seeder import seed_initial_items
from app.core.database import AsyncSessionLocal
import app.models  # ensure all models registered


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        await seed_initial_items(session)

    yield
