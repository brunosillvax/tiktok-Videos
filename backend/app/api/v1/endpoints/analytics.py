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

@router.get("/metrics")
async def get_analytics_metrics(
    time_range: str = Query("7d", description="Time range: 7d, 30d, 90d, 1y"),
    db: AsyncSession = Depends(get_db_session)
):
    """Get analytics metrics"""
    try:
        # Definir período baseado no time_range
        now = datetime.utcnow()
        if time_range == "7d":
            start_date = now - timedelta(days=7)
        elif time_range == "30d":
            start_date = now - timedelta(days=30)
        elif time_range == "90d":
            start_date = now - timedelta(days=90)
        elif time_range == "1y":
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=7)

        # Total de visualizações (simulado)
        total_views_result = await db.execute(
            select(func.count(PostedReel.id))
            .where(PostedReel.status == 'posted')
        )
        posted_reels = total_views_result.scalar() or 0
        total_views = posted_reels * 15000  # Média simulada

        # Total de curtidas (simulado)
        total_likes = posted_reels * 800  # Média simulada

        # Total de compartilhamentos (simulado)
        total_shares = posted_reels * 120  # Média simulada

        # Engajamento médio
        avg_engagement = round((total_likes / total_views * 100), 1) if total_views > 0 else 0

        # Crescimento percentual (simulado)
        growth_percentage = 12.5  # Simulado

        return {
            "total_views": total_views,
            "total_likes": total_likes,
            "total_shares": total_shares,
            "avg_engagement": avg_engagement,
            "growth_percentage": growth_percentage,
            "time_range": time_range
        }
        
    except Exception as e:
        logger.error("Error getting analytics metrics", error=str(e))
        return {
            "total_views": 0,
            "total_likes": 0,
            "total_shares": 0,
            "avg_engagement": 0,
            "growth_percentage": 0,
            "time_range": time_range
        }

@router.get("/top-reels")
async def get_top_performing_reels(db: AsyncSession = Depends(get_db_session)):
    """Get top performing reels for analytics"""
    try:
        # Buscar reels publicados
        result = await db.execute(
            select(PostedReel)
            .where(PostedReel.status == 'posted')
            .order_by(PostedReel.created_at.desc())
            .limit(20)
        )
        reels = result.scalars().all()
        
        top_reels = []
        for reel in reels:
            # Simular dados de performance
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
        
        return {"top_reels": top_reels[:10]}  # Top 10
        
    except Exception as e:
        logger.error("Error getting top performing reels", error=str(e))
        return {"top_reels": []}

@router.get("/audience-insights")
async def get_audience_insights(db: AsyncSession = Depends(get_db_session)):
    """Get audience insights (simulated data)"""
    try:
        # Dados simulados - futuramente virá de analytics reais
        return {
            "demographics": {
                "top_country": "Brasil",
                "country_percentage": 65,
                "age_range": "18-34",
                "age_percentage": 78,
                "device": "Mobile",
                "device_percentage": 85
            },
            "engagement_patterns": {
                "best_posting_time": "19:00-21:00",
                "best_day": "Sexta-feira",
                "avg_watch_time": "45 segundos",
                "completion_rate": 68
            },
            "content_performance": {
                "most_engaging_type": "Tutoriais",
                "avg_engagement_rate": 8.2,
                "viral_threshold": 10000,
                "top_hashtags": ["#fitness", "#motivacao", "#saude"]
            }
        }
        
    except Exception as e:
        logger.error("Error getting audience insights", error=str(e))
        return {
            "demographics": {
                "top_country": "Brasil",
                "country_percentage": 65,
                "age_range": "18-34", 
                "age_percentage": 78,
                "device": "Mobile",
                "device_percentage": 85
            },
            "engagement_patterns": {
                "best_posting_time": "19:00-21:00",
                "best_day": "Sexta-feira",
                "avg_watch_time": "45 segundos",
                "completion_rate": 68
            },
            "content_performance": {
                "most_engaging_type": "Tutoriais",
                "avg_engagement_rate": 8.2,
                "viral_threshold": 10000,
                "top_hashtags": ["#fitness", "#motivacao", "#saude"]
            }
        }

@router.get("/performance-chart")
async def get_performance_chart(
    time_range: str = Query("7d", description="Time range for chart data"),
    db: AsyncSession = Depends(get_db_session)
):
    """Get performance chart data"""
    try:
        # Definir período
        now = datetime.utcnow()
        if time_range == "7d":
            days = 7
        elif time_range == "30d":
            days = 30
        elif time_range == "90d":
            days = 90
        elif time_range == "1y":
            days = 365
        else:
            days = 7

        # Gerar dados simulados para o gráfico
        chart_data = []
        for i in range(days):
            date = now - timedelta(days=days-i-1)
            
            # Simular dados diários
            views = hash(f"{date.date()}_views") % 5000 + 1000
            likes = hash(f"{date.date()}_likes") % 300 + 50
            posts = hash(f"{date.date()}_posts") % 5 + 1
            
            chart_data.append({
                "date": date.date().isoformat(),
                "views": views,
                "likes": likes,
                "posts": posts,
                "engagement": round((likes / views * 100), 1) if views > 0 else 0
            })
        
        return {"chart_data": chart_data}
        
    except Exception as e:
        logger.error("Error getting performance chart data", error=str(e))
        return {"chart_data": []}
