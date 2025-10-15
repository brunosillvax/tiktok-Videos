from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta
from app.core.database import get_db_session
from app.models.posted_reel import PostedReel
from app.models.monitored_profile import MonitoredProfile
from app.models.application_log import ApplicationLog
import structlog

logger = structlog.get_logger()
router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db_session)):
    """Get real dashboard statistics"""
    try:
        # Total de vídeos publicados
        total_videos_result = await db.execute(
            select(func.count(PostedReel.id))
        )
        total_videos = total_videos_result.scalar() or 0

        # Perfis ativos
        active_profiles_result = await db.execute(
            select(func.count(MonitoredProfile.id))
            .where(MonitoredProfile.is_active == True)
        )
        active_profiles = active_profiles_result.scalar() or 0

        # Posts hoje
        today = datetime.utcnow().date()
        posts_today_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(func.date(PostedReel.created_at) == today)
        )
        posts_today = posts_today_result.scalar() or 0

        # Taxa de sucesso (videos com status 'posted' vs total)
        success_rate_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(PostedReel.status == 'posted')
        )
        successful_posts = success_rate_result.scalar() or 0
        
        success_rate = (successful_posts / total_videos * 100) if total_videos > 0 else 0

        # Posts ontem para comparação
        yesterday = (datetime.utcnow() - timedelta(days=1)).date()
        posts_yesterday_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(func.date(PostedReel.created_at) == yesterday)
        )
        posts_yesterday = posts_yesterday_result.scalar() or 0

        # Crescimento mensal (últimos 30 dias vs mês anterior)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        sixty_days_ago = datetime.utcnow() - timedelta(days=60)
        
        posts_last_30_days_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(PostedReel.created_at >= thirty_days_ago)
        )
        posts_last_30_days = posts_last_30_days_result.scalar() or 0

        posts_previous_30_days_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(
                and_(
                    PostedReel.created_at >= sixty_days_ago,
                    PostedReel.created_at < thirty_days_ago
                )
            )
        )
        posts_previous_30_days = posts_previous_30_days_result.scalar() or 0

        monthly_growth = 0
        if posts_previous_30_days > 0:
            monthly_growth = ((posts_last_30_days - posts_previous_30_days) / posts_previous_30_days) * 100

        return {
            "total_videos": total_videos,
            "active_profiles": active_profiles,
            "posts_today": posts_today,
            "success_rate": round(success_rate, 1),
            "posts_yesterday": posts_yesterday,
            "monthly_growth": round(monthly_growth, 1)
        }
        
    except Exception as e:
        logger.error("Error getting dashboard stats", error=str(e))
        return {
            "total_videos": 0,
            "active_profiles": 0,
            "posts_today": 0,
            "success_rate": 0,
            "posts_yesterday": 0,
            "monthly_growth": 0
        }

@router.get("/recent-activity")
async def get_recent_activity(db: AsyncSession = Depends(get_db_session)):
    """Get recent activity logs"""
    try:
        # Últimos 10 logs
        result = await db.execute(
            select(ApplicationLog)
            .order_by(ApplicationLog.created_at.desc())
            .limit(10)
        )
        logs = result.scalars().all()
        
        activity = []
        for log in logs:
            activity.append({
                "id": log.id,
                "level": log.level,
                "message": log.message,
                "created_at": log.created_at.isoformat(),
                "context": log.context
            })
        
        return {"activity": activity}
        
    except Exception as e:
        logger.error("Error getting recent activity", error=str(e))
        return {"activity": []}

@router.get("/top-performing-reels")
async def get_top_performing_reels(db: AsyncSession = Depends(get_db_session)):
    """Get top performing reels (simulated data for now)"""
    try:
        # Por enquanto, retornamos dados simulados
        # Futuramente, isso virá de analytics reais do TikTok
        return {
            "top_reels": [
                {
                    "title": "Workout Routine 2024",
                    "views": 15420,
                    "likes": 892,
                    "engagement": 12.5
                },
                {
                    "title": "Healthy Breakfast Ideas", 
                    "views": 8930,
                    "likes": 456,
                    "engagement": 9.8
                },
                {
                    "title": "Morning Motivation",
                    "views": 7650,
                    "likes": 334,
                    "engagement": 8.1
                }
            ]
        }
        
    except Exception as e:
        logger.error("Error getting top performing reels", error=str(e))
        return {"top_reels": []}
