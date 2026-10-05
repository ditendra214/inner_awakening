from typing import Optional, Dict
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "inner-awakening-backend"
    version: Optional[str] = None
    database: Optional[str] = None
    redis: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "ok",
                "service": "inner-awakening-backend"
            }
        }
    }
