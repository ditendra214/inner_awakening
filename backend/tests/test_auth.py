import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_auth_registration_and_login_flow():
    uid = uuid.uuid4().hex[:8]
    username = f"hunter_{uid}"
    email = f"hunter_{uid}@innerawakening.fit"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Register a new player
        reg_payload = {
            "username": username,
            "email": email,
            "password": "Sololeveling99!",
            "character_preset": "normal_man"
        }
        res_reg = await ac.post("/api/v1/auth/register", json=reg_payload)
        assert res_reg.status_code == 201, res_reg.text
        data_reg = res_reg.json()

        assert "tokens" in data_reg
        assert "player" in data_reg
        tokens = data_reg["tokens"]
        player = data_reg["player"]

        assert tokens["token_type"] == "bearer"
        assert tokens["access_token"]
        assert tokens["refresh_token"]

        assert player["username"] == username
        assert player["email"] == email
        assert player["character_preset"] == "normal_man"
        assert player["level"] == 1
        assert player["rank_tier"] == "E-RANK"
        assert player["fit_coins"] == 500
        assert player["blue_crystals"] == 50
        assert "top" in player["equipped_slots"]
        assert player["equipped_slots"]["top"] == "top_athletic_red_001"

        access_token = tokens["access_token"]
        refresh_token = tokens["refresh_token"]

        # 2. Test Duplicate Registration (Username)
        dup_user_payload = {
            "username": username,
            "email": f"other_{uid}@innerawakening.fit",
            "password": "Sololeveling99!",
            "character_preset": "michelle"
        }
        res_dup = await ac.post("/api/v1/auth/register", json=dup_user_payload)
        assert res_dup.status_code == 400
        assert "already registered" in res_dup.json()["detail"]

        # 3. Test Duplicate Registration (Email)
        dup_email_payload = {
            "username": f"other_hunter_{uid}",
            "email": email,
            "password": "Sololeveling99!",
            "character_preset": "michelle"
        }
        res_dup_email = await ac.post("/api/v1/auth/register", json=dup_email_payload)
        assert res_dup_email.status_code == 400
        assert "already associated" in res_dup_email.json()["detail"]

        # 4. Login with Username
        login_res = await ac.post("/api/v1/auth/login", json={
            "email_or_username": username,
            "password": "Sololeveling99!"
        })
        assert login_res.status_code == 200
        login_data = login_res.json()
        assert login_data["tokens"]["access_token"]
        assert login_data["player"]["username"] == username

        # 5. Login with Email
        login_email_res = await ac.post("/api/v1/auth/login", json={
            "email_or_username": email,
            "password": "Sololeveling99!"
        })
        assert login_email_res.status_code == 200

        # 6. Login with Bad Password
        bad_login = await ac.post("/api/v1/auth/login", json={
            "email_or_username": username,
            "password": "WrongPassword!"
        })
        assert bad_login.status_code == 401

        # 7. Access /me with Valid Token
        me_res = await ac.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["username"] == username
        assert me_data["appearance"]["character_model"] == "normal_man"

        # 8. Access /me without Token
        me_unauth = await ac.get("/api/v1/auth/me")
        assert me_unauth.status_code == 403 or me_unauth.status_code == 401

        # 9. Refresh Token
        ref_res = await ac.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        assert ref_res.status_code == 200
        ref_data = ref_res.json()
        assert ref_data["access_token"]
        assert ref_data["refresh_token"]


@pytest.mark.asyncio
async def test_register_michelle_preset():
    uid = uuid.uuid4().hex[:8]
    username = f"michelle_{uid}"
    email = f"michelle_{uid}@innerawakening.fit"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/v1/auth/register", json={
            "username": username,
            "email": email,
            "password": "ValkyriePower123!",
            "character_preset": "michelle"
        })
        assert res.status_code == 201
        data = res.json()
        assert data["player"]["character_preset"] == "michelle"
        assert data["player"]["appearance"]["gender"] == "female"
        assert data["player"]["appearance"]["character_model"] == "michelle"
