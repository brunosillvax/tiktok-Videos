from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta
from app.core.database import get_db_session
from app.models.posted_reel import PostedReel
from app.models.monitored_profile import MonitoredProfile
import structlog

logger = structlog.get_logger()
router = APIRouter()

@router.get("/")
async def list_reels(
    status: str = Query(None, description="Filter by status: pending, posted, failed"),
    db: AsyncSession = Depends(get_db_session)
):
    """List posted reels with real data"""
    try:
        query = select(PostedReel).order_by(PostedReel.created_at.desc())
        
        if status:
            query = query.where(PostedReel.status == status)
        
        result = await db.execute(query)
        reels = result.scalars().all()
        
        reels_data = []
        for reel in reels:
            # Buscar informações do perfil
            profile_result = await db.execute(
                select(MonitoredProfile)
                .where(MonitoredProfile.id == reel.profile_id)
            )
            profile = profile_result.scalar_one_or_none()
            
            # Simular dados de analytics (futuramente virá do TikTok API)
            views = 0
            likes = 0
            if reel.status == 'posted':
                views = hash(reel.instagram_reel_code) % 50000 + 1000  # Simular views
                likes = hash(reel.instagram_reel_code) % 5000 + 100    # Simular likes
            
            reels_data.append({
                "id": reel.id,
                "instagram_reel_code": reel.instagram_reel_code,
                "instagram_reel_url": reel.instagram_reel_url,
                "caption": reel.caption,
                "status": reel.status,
                "video_file_path": reel.video_file_path,
                "tiktok_video_id": reel.tiktok_video_id,
                "tiktok_video_url": reel.tiktok_video_url,
                "posted_at": reel.posted_at.isoformat() if reel.posted_at else None,
                "created_at": reel.created_at.isoformat(),
                "profile": {
                    "username": profile.instagram_username if profile else "Unknown",
                    "display_name": profile.display_name if profile else "Unknown"
                } if profile else None,
                "analytics": {
                    "views": views,
                    "likes": likes,
                    "engagement": round((likes / views * 100), 1) if views > 0 else 0
                } if reel.status == 'posted' else None
            })
        
        return {"reels": reels_data}
        
    except Exception as e:
        logger.error("Error listing reels", error=str(e))
        return {"reels": []}

@router.get("/stats")
async def get_reels_stats(db: AsyncSession = Depends(get_db_session)):
    """Get reels statistics"""
    try:
        # Total de reels
        total_reels_result = await db.execute(
            select(func.count(PostedReel.id))
        )
        total_reels = total_reels_result.scalar() or 0

        # Reels baixados (pending)
        downloaded_reels_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(PostedReel.status == 'pending')
        )
        downloaded_reels = downloaded_reels_result.scalar() or 0

        # Reels publicados
        posted_reels_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(PostedReel.status == 'posted')
        )
        posted_reels = posted_reels_result.scalar() or 0

        # Simular total de views e likes (futuramente virá do TikTok API)
        total_views = posted_reels * 15000  # Média simulada
        total_likes = posted_reels * 800    # Média simulada

        return {
            "total_reels": total_reels,
            "downloaded_reels": downloaded_reels,
            "posted_reels": posted_reels,
            "total_views": total_views,
            "total_likes": total_likes
        }
        
    except Exception as e:
        logger.error("Error getting reels stats", error=str(e))
        return {
            "total_reels": 0,
            "downloaded_reels": 0,
            "posted_reels": 0,
            "total_views": 0,
            "total_likes": 0
        }

@router.get("/top-performing")
async def get_top_performing_reels(db: AsyncSession = Depends(get_db_session)):
    """Get top performing reels"""
    try:
        # Buscar reels publicados
        result = await db.execute(
            select(PostedReel)
            .where(PostedReel.status == 'posted')
            .order_by(PostedReel.created_at.desc())
            .limit(10)
        )
        reels = result.scalars().all()
        
        top_reels = []
        for reel in reels:
            # Simular dados de performance (futuramente virá do TikTok API)
            views = hash(reel.instagram_reel_code) % 50000 + 5000
            likes = hash(reel.instagram_reel_code) % 3000 + 200
            engagement = round((likes / views * 100), 1) if views > 0 else 0
            
            top_reels.append({
                "title": reel.caption[:50] + "..." if reel.caption and len(reel.caption) > 50 else reel.caption or "Untitled",
                "views": views,
                "likes": likes,
                "engagement": engagement,
                "posted_at": reel.posted_at.isoformat() if reel.posted_at else None
            })
        
        # Ordenar por views
        top_reels.sort(key=lambda x: x['views'], reverse=True)
        
        return {"top_reels": top_reels[:5]}  # Top 5
        
    except Exception as e:
        logger.error("Error getting top performing reels", error=str(e))
        return {"top_reels": []}

