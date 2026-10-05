from typing import Optional, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.player import Player
from app.schemas.leaderboard import LeaderboardEntry, LeaderboardResponse


class LeaderboardService:
    async def get_leaderboard(
        self,
        db: AsyncSession,
        timeframe: str = "global",
        limit: int = 50,
        current_player_id: Optional[str] = None
    ) -> LeaderboardResponse:
        """Calculates global ranked hunter standings."""
        # Query top players by RP then XP
        stmt = (
            select(Player)
            .where(Player.is_active == True)
            .order_by(Player.rank_points.desc(), Player.xp.desc())
            .limit(limit)
        )
        res = await db.execute(stmt)
        top_players = list(res.scalars().all())

        # Count total active players
        count_stmt = select(func.count(Player.id)).where(Player.is_active == True)
        total_count = (await db.execute(count_stmt)).scalar() or 0

        entries: List[LeaderboardEntry] = []
        my_standing: Optional[LeaderboardEntry] = None

        for idx, p in enumerate(top_players, start=1):
            entry = LeaderboardEntry(
                rank_position=idx,
                player_id=p.id,
                username=p.username,
                character_preset=p.character_preset,
                rank_tier=p.rank_tier,
                rank_points=p.rank_points,
                level=p.level,
                streak_days=p.streak_days
            )
            entries.append(entry)
            if current_player_id and p.id == current_player_id:
                my_standing = entry

        # If current player was not in top list, compute their absolute rank position
        if current_player_id and not my_standing:
            player_stmt = select(Player).where(Player.id == current_player_id)
            p = (await db.execute(player_stmt)).scalar_one_or_none()
            if p:
                rank_pos_stmt = select(func.count(Player.id)).where(
                    Player.is_active == True,
                    (Player.rank_points > p.rank_points) |
                    ((Player.rank_points == p.rank_points) & (Player.xp > p.xp))
                )
                higher_count = (await db.execute(rank_pos_stmt)).scalar() or 0
                my_standing = LeaderboardEntry(
                    rank_position=higher_count + 1,
                    player_id=p.id,
                    username=p.username,
                    character_preset=p.character_preset,
                    rank_tier=p.rank_tier,
                    rank_points=p.rank_points,
                    level=p.level,
                    streak_days=p.streak_days
                )

        return LeaderboardResponse(
            timeframe=timeframe,
            total_participants=total_count,
            entries=entries,
            my_standing=my_standing
        )


leaderboard_service = LeaderboardService()
