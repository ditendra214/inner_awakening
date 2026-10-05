import json
import logging
from typing import Dict, List, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, status

from app.core.security import decode_token

logger = logging.getLogger("inner_awakening.websockets")
router = APIRouter()


class ConnectionManager:
    def __init__(self):
        # player_id -> list of active WebSockets (supports multi-device/tab)
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, player_id: str):
        await websocket.accept()
        if player_id not in self.active_connections:
            self.active_connections[player_id] = []
        self.active_connections[player_id].append(websocket)
        logger.info(f"WebSocket client connected: player_id={player_id}")

    def disconnect(self, websocket: WebSocket, player_id: str):
        if player_id in self.active_connections:
            if websocket in self.active_connections[player_id]:
                self.active_connections[player_id].remove(websocket)
            if not self.active_connections[player_id]:
                del self.active_connections[player_id]
        logger.info(f"WebSocket client disconnected: player_id={player_id}")

    async def send_personal_message(self, message: dict, player_id: str):
        if player_id in self.active_connections:
            for connection in self.active_connections[player_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    pass

    async def broadcast_to_all(self, message: dict):
        for player_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    pass


ws_manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: Optional[str] = Query(None)
):
    """
    WebSocket endpoint for real-time multiplayer telemetry and lobby events.
    Authenticates via query parameter: ws://host:port/api/v1/ws?token=<jwt>
    """
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    player_id = payload.get("sub", "unknown")
    username = payload.get("username", "Hunter")

    await ws_manager.connect(websocket, player_id)

    # Send Welcome / Handshake Packet
    await websocket.send_text(json.dumps({
        "event": "CONNECTED",
        "player_id": player_id,
        "username": username,
        "message": f"Welcome to Inner Awakening realm, Hunter {username}."
    }))

    try:
        while True:
            raw_data = await websocket.receive_text()
            try:
                msg = json.loads(raw_data)
                event_type = msg.get("event")

                if event_type == "PING":
                    await websocket.send_text(json.dumps({"event": "PONG"}))
                
                elif event_type == "EQUIPMENT_CHANGED":
                    # Broadcast equipment change to peers
                    await ws_manager.broadcast_to_all({
                        "event": "PLAYER_GEAR_UPDATED",
                        "player_id": player_id,
                        "slot": msg.get("slot"),
                        "item_id": msg.get("item_id")
                    })
                
                elif event_type == "WORKOUT_REP_COMPLETED":
                    # Real-time workout sync
                    await ws_manager.broadcast_to_all({
                        "event": "PEER_REP_COMPLETED",
                        "player_id": player_id,
                        "username": username,
                        "exercise": msg.get("exercise"),
                        "rep": msg.get("rep")
                    })

            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, player_id)
