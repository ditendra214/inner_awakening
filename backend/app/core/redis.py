import json
import logging
from typing import Any, Optional
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger("inner_awakening.redis")


class RedisService:
    def __init__(self):
        self._client: Optional[aioredis.Redis] = None
        self._is_connected: bool = False
        self._memory_cache: dict = {}

    async def connect(self) -> None:
        """Attempts connection to Redis, falls back gracefully if server not available."""
        try:
            self._client = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=2.0
            )
            await self._client.ping()
            self._is_connected = True
            logger.info("Connected to Redis server successfully.")
        except Exception as exc:
            self._is_connected = False
            logger.info(f"Redis not available ({exc}); using in-memory cache fallback.")

    async def disconnect(self) -> None:
        if self._client and self._is_connected:
            await self._client.close()
            self._is_connected = False

    async def get(self, key: str) -> Optional[str]:
        if self._is_connected and self._client:
            try:
                return await self._client.get(key)
            except Exception:
                pass
        return self._memory_cache.get(key)

    async def set(self, key: str, value: Any, expire_seconds: Optional[int] = None) -> None:
        val_str = json.dumps(value) if not isinstance(value, str) else value
        if self._is_connected and self._client:
            try:
                await self._client.set(key, val_str, ex=expire_seconds)
                return
            except Exception:
                pass
        self._memory_cache[key] = val_str

    async def publish(self, channel: str, message: dict) -> None:
        if self._is_connected and self._client:
            try:
                await self._client.publish(channel, json.dumps(message))
            except Exception:
                pass


redis_service = RedisService()
