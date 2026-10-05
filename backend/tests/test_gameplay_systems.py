import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_complete_gameplay_progression_and_equipment():
    uid = uuid.uuid4().hex[:8]
    username = f"jinwoo_{uid}"
    email = f"jinwoo_{uid}@hunter.org"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Register Player
        reg_res = await ac.post("/api/v1/auth/register", json={
            "username": username,
            "email": email,
            "password": "AriseShadows123!",
            "character_preset": "normal_man"
        })
        assert reg_res.status_code == 201
        data = reg_res.json()
        token = data["tokens"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Check Player Profile & Appearance
        prof_res = await ac.get("/api/v1/player/me/profile", headers=headers)
        assert prof_res.status_code == 200
        prof_data = prof_res.json()
        assert prof_data["player"]["level"] == 1
        assert prof_data["player"]["rank_tier"] == "E-RANK"
        assert "strength" in prof_data["stat_totals"]

        # 3. Update Character Appearance
        app_res = await ac.put("/api/v1/player/me/appearance", headers=headers, json={
            "hair_color": "#ff007f",
            "skin_tone": "dark",
            "height_scale": 1.1,
            "muscle_scale": 1.15
        })
        assert app_res.status_code == 200
        app_data = app_res.json()
        assert app_data["hair_color"] == "#ff007f"
        assert app_data["skin_tone"] == "dark"
        assert app_data["height_scale"] == 1.1

        # 4. Check Inventory Vault
        inv_res = await ac.get("/api/v1/inventory", headers=headers)
        assert inv_res.status_code == 200
        inv_items = inv_res.json()
        assert len(inv_items) >= 7  # Starter loadout has 7 items
        owned_item_ids = [it["item_id"] for it in inv_items]
        assert "top_athletic_red_001" in owned_item_ids

        # 5. Check Equipment Overview
        eq_res = await ac.get("/api/v1/equipment", headers=headers)
        assert eq_res.status_code == 200
        eq_data = eq_res.json()
        assert eq_data["equipped_slots"]["top"] == "top_athletic_red_001"
        assert eq_data["equipped_slots"]["shoes"] == "shoe_cyber_teal_001"

        # 6. Test Unequipping Optional Slot (aura)
        unequip_res = await ac.post("/api/v1/equipment/unequip", headers=headers, json={"slot": "aura"})
        assert unequip_res.status_code == 200
        assert "aura" not in unequip_res.json()["equipped_slots"]

        # 7. Test Unequipping Mandatory Slot (top) -> Must Fail with 400
        fail_unequip = await ac.post("/api/v1/equipment/unequip", headers=headers, json={"slot": "top"})
        assert fail_unequip.status_code == 400
        assert "mandatory" in fail_unequip.json()["detail"]

        # 8. Submit High-Intensity Workout
        # 30 pushups with 95% accuracy
        workout_payload = {
            "exercise_type": "pushup",
            "reps_completed": 30,
            "target_reps": 30,
            "form_accuracy": 95.0,
            "calories_burned": 45.0,
            "duration_seconds": 60
        }
        w_res = await ac.post("/api/v1/workout/submit", headers=headers, json=workout_payload)
        assert w_res.status_code == 200
        w_data = w_res.json()
        assert w_data["xp_earned"] > 0
        assert w_data["rp_earned"] > 0
        assert w_data["coins_earned"] > 0
        assert w_data["streak_days"] >= 1
        assert w_data["new_level"] >= 1

        # 9. Verify Workout History
        hist_res = await ac.get("/api/v1/workout/history", headers=headers)
        assert hist_res.status_code == 200
        hist = hist_res.json()
        assert len(hist) == 1
        assert hist[0]["exercise_type"] == "pushup"
        assert hist[0]["reps_completed"] == 30

        # 10. Check Leaderboard
        lead_res = await ac.get("/api/v1/leaderboard", headers=headers)
        assert lead_res.status_code == 200
        lead_data = lead_res.json()
        assert lead_data["my_standing"]["username"] == username
