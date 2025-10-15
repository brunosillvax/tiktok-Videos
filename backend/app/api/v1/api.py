from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, profiles, reels, logs, dashboard, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["monitored-profiles"])
api_router.include_router(reels.router, prefix="/reels", tags=["posted-reels"])
api_router.include_router(logs.router, prefix="/logs", tags=["application-logs"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
