from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, player, inventory, equipment, workout, leaderboard, websockets, rewards

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["System Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(player.router, prefix="/player", tags=["Player & Character"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory & Vault"])
api_router.include_router(equipment.router, prefix="/equipment", tags=["Character Equipment"])
api_router.include_router(workout.router, prefix="/workout", tags=["Workouts & Fitness AI"])
api_router.include_router(rewards.router, prefix="/rewards", tags=["Milestone Rewards & Claiming"])
api_router.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboards & Ranks"])
api_router.include_router(websockets.router, tags=["WebSockets & Real-Time"])
