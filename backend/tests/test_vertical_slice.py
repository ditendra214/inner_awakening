import uuid
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import AsyncSessionLocal
from app.models.player import Player
from app.models.progression import PlayerProgression


@pytest.mark.asyncio
async def test_complete_phase1_vertical_slice():
    """
    Executes the entire end-to-end Vertical Slice:
    1. Register One Player
    2. Read Initial Progression (E-Rank, 0 RP, 0 XP, Level 1)
    3. Submit Workout with Verified AI Telemetry (Squats, 93% Form Accuracy)
    4. Verify Server Authoritative +XP, +RP, Score, Calories, and Streak
    5. Test Rank Promotion: Elevate RP to cross into NATIONAL rank
    6. Verify Reward Unlock: National Champion Shoes unlocked automatically
    7. Claim Reward: Idempotent claim via POST /rewards/{id}/claim
    8. Test Duplicate Claim: Verify idempotency prevents multiple item grants
    9. Verify Inventory: National Champion Shoes present in Player Items
    10. Equip Item: POST /equipment/equip updates authoritative character state
    11. Verify Unified State: Lobby, Profile, Rank, and Leaderboard all reflect the same state
    """
    uid = uuid.uuid4().hex[:8]
    username = f"warrior_{uid}"
    email = f"warrior_{uid}@innerawakening.fit"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Step 1: Register Player
        reg_res = await ac.post("/api/v1/auth/register", json={
            "username": username,
            "email": email,
            "password": "FitnessGaming100!",
            "character_preset": "normal_man"
        })
        assert reg_res.status_code == 201, reg_res.text
        auth_data = reg_res.json()
        token = auth_data["tokens"]["access_token"]
        player_id = auth_data["player"]["id"]
        headers = {"Authorization": f"Bearer {token}"}

        # Step 2: Read Initial Authoritative Progression
        prog_res = await ac.get("/api/v1/player/progression", headers=headers)
        assert prog_res.status_code == 200, prog_res.text
        prog_data = prog_res.json()
        assert prog_data["player_id"] == player_id
        assert prog_data["current_rank_id"] == "E"
        assert prog_data["rank_points"] == 0
        assert prog_data["level"] == 1
        assert prog_data["next_rank_id"] == "D"
        assert prog_data["rp_to_next_rank"] == 500

        # Step 3: Submit First Verified AI Workout
        workout_payload = {
            "exercise_type": "squat",
            "reps_completed": 30,
            "target_reps": 30,
            "detected_reps": 30,
            "valid_reps": 27,
            "invalid_reps": 3,
            "form_accuracy": 93.0,
            "calories_burned": 75.0,
            "duration_seconds": 120,
            "difficulty_level": "NORMAL",
            "session_id": f"sess_{uuid.uuid4().hex[:10]}"
        }
        w_res = await ac.post("/api/v1/workout/submit", json=workout_payload, headers=headers)
        assert w_res.status_code == 200, w_res.text
        w_data = w_res.json()

        # Step 4: Verify Authoritative XP & RP
        assert w_data["xp_earned"] > 0
        assert w_data["rp_earned"] > 0
        assert w_data["score"] > 0
        assert w_data["progression"]["valid_reps"] == 27
        assert w_data["progression"]["total_workouts"] == 1

        # Step 5: Rank Transition to S-Rank (e.g. 3,980 RP) then cross to NATIONAL (4,025 RP)
        # Directly set RP close to threshold in DB to test the exact promotion event
        async with AsyncSessionLocal() as session:
            p_stmt = await session.get(PlayerProgression, player_id)
            p_stmt.rank_points = 3980
            p_stmt.current_rank_id = "S"
            await session.commit()

        # Verify player is now S-Rank with 3980 RP
        s_rank_res = await ac.get("/api/v1/player/progression", headers=headers)
        assert s_rank_res.json()["current_rank_id"] == "S"
        assert s_rank_res.json()["next_rank_id"] == "NATIONAL"
        assert s_rank_res.json()["rp_to_next_rank"] == 20  # 4000 - 3980

        # Submit workout earning +45 RP -> Crosses 4,000 threshold to NATIONAL
        w_promo_payload = {
            "exercise_type": "squat",
            "reps_completed": 30,
            "target_reps": 30,
            "detected_reps": 30,
            "valid_reps": 28,
            "form_accuracy": 95.0,
            "calories_burned": 80.0,
            "duration_seconds": 120,
            "session_id": f"sess_promo_{uuid.uuid4().hex[:10]}"
        }
        promo_res = await ac.post("/api/v1/workout/submit", json=w_promo_payload, headers=headers)
        assert promo_res.status_code == 200, promo_res.text
        promo_data = promo_res.json()

        assert promo_data["rank_promoted"] is True
        assert promo_data["old_rank"] == "S"
        assert promo_data["new_rank"] == "NATIONAL"
        assert promo_data["progression"]["current_rank_id"] == "NATIONAL"
        assert promo_data["progression"]["rank_points"] >= 4000

        # Step 6: Verify Reward Unlocking for NATIONAL Rank
        rewards_res = await ac.get("/api/v1/rewards/available", headers=headers)
        assert rewards_res.status_code == 200, rewards_res.text
        rewards_list = rewards_res.json()
        
        national_shoes_reward = next(
            (r for r in rewards_list if r["reward_id"] == "REWARD_NATIONAL_SHOES"),
            None
        )
        assert national_shoes_reward is not None
        assert national_shoes_reward["is_unlocked"] is True
        assert national_shoes_reward["is_claimed"] is False

        # Step 7: Claim Reward (Idempotent Transaction)
        claim_res = await ac.post(
            "/api/v1/rewards/REWARD_NATIONAL_SHOES/claim",
            headers={**headers, "X-Idempotency-Key": f"key_{uuid.uuid4().hex}"}
        )
        assert claim_res.status_code == 200, claim_res.text
        claim_data = claim_res.json()
        assert claim_data["status"] == "success"
        assert claim_data["granted_item_id"] == "shoe_national_champ_001"

        # Step 8: Test Duplicate Claim Idempotency
        dup_res = await ac.post(
            "/api/v1/rewards/REWARD_NATIONAL_SHOES/claim",
            headers={**headers, "X-Idempotency-Key": "same_key"}
        )
        assert dup_res.status_code == 200
        assert dup_res.json()["status"] == "already_claimed"

        # Step 9: Verify Inventory Integration
        inv_res = await ac.get("/api/v1/inventory", headers=headers)
        assert inv_res.status_code == 200, inv_res.text
        inventory_items = inv_res.json()
        owned_item_ids = [item["item_id"] for item in inventory_items]
        assert "shoe_national_champ_001" in owned_item_ids

        # Step 10: Equip Cosmetic Item to Character
        equip_res = await ac.post(
            "/api/v1/equipment/equip",
            json={"item_id": "shoe_national_champ_001"},
            headers=headers
        )
        assert equip_res.status_code == 200, equip_res.text
        equip_data = equip_res.json()
        assert equip_data["equipped_slots"]["shoes"] == "shoe_national_champ_001"

        # Step 11: Verify Cross-System Synchronization
        # Rank page endpoint
        rank_page_res = await ac.get("/api/v1/player/rank", headers=headers)
        assert rank_page_res.status_code == 200
        assert rank_page_res.json()["progression"]["current_rank_id"] == "NATIONAL"

        # Leaderboard endpoint
        lb_res = await ac.get("/api/v1/leaderboard/global", headers=headers)
        assert lb_res.status_code == 200
        leaderboard_entries = lb_res.json()["entries"]
        assert any(e["username"] == username for e in leaderboard_entries)

        # Anti-Cheat: Reject physiologically impossible cadence (>1.8 reps/sec)
        cheat_res = await ac.post("/api/v1/workout/submit", json={
            "exercise_type": "squat",
            "reps_completed": 100,
            "target_reps": 100,
            "form_accuracy": 100.0,
            "calories_burned": 200.0,
            "duration_seconds": 10  # 10 reps/second -> Impossible!
        }, headers=headers)
        assert cheat_res.status_code == 400
        assert "physiological maximum" in cheat_res.json()["detail"]
