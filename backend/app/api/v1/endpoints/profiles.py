from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db_session
from app.models.monitored_profile import MonitoredProfile
from app.models.posted_reel import PostedReel
import structlog

logger = structlog.get_logger()
router = APIRouter()

@router.get("/")
async def list_profiles(db: AsyncSession = Depends(get_db_session)):
    """List monitored profiles with real data"""
    try:
        # Buscar todos os perfis
        result = await db.execute(
            select(MonitoredProfile)
            .order_by(MonitoredProfile.created_at.desc())
        )
        profiles = result.scalars().all()
        
        profiles_data = []
        for profile in profiles:
            # Contar posts publicados para este perfil
            posts_count_result = await db.execute(
                select(func.count(PostedReel.id))
                .where(PostedReel.profile_id == profile.id)
            )
            posts_count = posts_count_result.scalar() or 0
            
            profiles_data.append({
                "id": profile.id,
                "username": profile.instagram_username,
                "display_name": profile.display_name,
                "profile_picture_url": profile.profile_picture_url,
                "is_active": profile.is_active,
                "last_checked_at": profile.last_checked_at.isoformat() if profile.last_checked_at else None,
                "last_posted_at": profile.last_posted_at.isoformat() if profile.last_posted_at else None,
                "check_interval_minutes": profile.check_interval_minutes,
                "posts_count": posts_count,
                "created_at": profile.created_at.isoformat()
            })
        
        return {"profiles": profiles_data}
        
    except Exception as e:
        logger.error("Error listing profiles", error=str(e))
        return {"profiles": []}

@router.get("/stats")
async def get_profiles_stats(db: AsyncSession = Depends(get_db_session)):
    """Get profiles statistics"""
    try:
        # Total de perfis
        total_profiles_result = await db.execute(
            select(func.count(MonitoredProfile.id))
        )
        total_profiles = total_profiles_result.scalar() or 0

        # Perfis ativos
        active_profiles_result = await db.execute(
            select(func.count(MonitoredProfile.id))
            .where(MonitoredProfile.is_active == True)
        )
        active_profiles = active_profiles_result.scalar() or 0

        # Total de posts publicados
        total_posts_result = await db.execute(
            select(func.count(PostedReel.id))
        )
        total_posts = total_posts_result.scalar() or 0

        return {
            "total_profiles": total_profiles,
            "active_profiles": active_profiles,
            "total_posts": total_posts
        }
        
    except Exception as e:
        logger.error("Error getting profiles stats", error=str(e))
        return {
            "total_profiles": 0,
            "active_profiles": 0,
            "total_posts": 0
        }

