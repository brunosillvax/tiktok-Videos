from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.tiktok_credentials import TikTokCredentials
from app.schemas.tiktok_credentials import TikTokCredentialsResponse
from app.services.tiktok_service import tiktok_service
import structlog
import secrets

logger = structlog.get_logger()
router = APIRouter()

@router.get("/auth/url")
async def get_tiktok_auth_url(
    current_user: User = Depends(get_current_user)
):
    """Get TikTok OAuth authorization URL"""
    state = secrets.token_urlsafe(32)
    auth_url = await tiktok_service.get_authorization_url(state)
    
    logger.info("Generated TikTok auth URL", user_id=current_user.id, state=state)
    
    return {
        "auth_url": auth_url,
        "state": state
    }

@router.post("/auth/callback")
async def handle_tiktok_callback(
    code: str = Query(...),
    state: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Handle TikTok OAuth callback and store credentials"""
    try:
        # Exchange code for tokens
        token_data = await tiktok_service.exchange_code_for_token(code)
        
        if token_data.get("error", {}).get("code") != "ok":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"TikTok API error: {token_data.get('error', {}).get('message', 'Unknown error')}"
            )
        
        # Get user info to verify token
        user_info = await tiktok_service.get_user_info(token_data["data"]["access_token"])
        
        if user_info.get("error", {}).get("code") != "ok":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get TikTok user info"
            )
        
        # Store or update credentials
        existing_credentials = await db.execute(
            select(TikTokCredentials).where(TikTokCredentials.user_id == current_user.id)
        )
        credentials = existing_credentials.scalar_one_or_none()
        
        if credentials:
            # Update existing credentials
            credentials.access_token = token_data["data"]["access_token"]
            credentials.refresh_token = token_data["data"]["refresh_token"]
            credentials.expires_in = token_data["data"]["expires_in"]
            credentials.open_id = user_info["data"]["user"]["open_id"]
            credentials.scope = token_data["data"].get("scope", "")
        else:
            # Create new credentials
            credentials = TikTokCredentials(
                user_id=current_user.id,
                access_token=token_data["data"]["access_token"],
                refresh_token=token_data["data"]["refresh_token"],
                expires_in=token_data["data"]["expires_in"],
                open_id=user_info["data"]["user"]["open_id"],
                scope=token_data["data"].get("scope", "")
            )
            db.add(credentials)
        
        await db.commit()
        await db.refresh(credentials)
        
        logger.info(
            "TikTok credentials saved", 
            user_id=current_user.id, 
            open_id=credentials.open_id
        )
        
        return {
            "message": "TikTok account connected successfully",
            "user_info": user_info["data"]["user"]
        }
        
    except httpx.HTTPStatusError as e:
        logger.error("TikTok API error", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to connect TikTok account"
        )
    except Exception as e:
        logger.error("TikTok callback error", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/credentials", response_model=TikTokCredentialsResponse)
async def get_tiktok_credentials(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Get user's TikTok credentials"""
    result = await db.execute(
        select(TikTokCredentials).where(TikTokCredentials.user_id == current_user.id)
    )
    credentials = result.scalar_one_or_none()
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok account not connected"
        )
    
    return TikTokCredentialsResponse.from_orm(credentials)

@router.delete("/credentials")
async def disconnect_tiktok(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Disconnect TikTok account"""
    result = await db.execute(
        select(TikTokCredentials).where(TikTokCredentials.user_id == current_user.id)
    )
    credentials = result.scalar_one_or_none()
    
    if credentials:
        await db.delete(credentials)
        await db.commit()
        
        logger.info("TikTok account disconnected", user_id=current_user.id)
        
        return {"message": "TikTok account disconnected successfully"}
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="TikTok account not connected"
    )

@router.get("/user/info")
async def get_tiktok_user_info(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Get TikTok user information"""
    result = await db.execute(
        select(TikTokCredentials).where(TikTokCredentials.user_id == current_user.id)
    )
    credentials = result.scalar_one_or_none()
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok account not connected"
        )
    
    try:
        user_info = await tiktok_service.get_user_info(credentials.access_token)
        return user_info["data"]
    except Exception as e:
        logger.error("Failed to get TikTok user info", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get TikTok user information"
        )

@router.get("/videos")
async def get_tiktok_videos(
    max_count: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Get user's TikTok videos"""
    result = await db.execute(
        select(TikTokCredentials).where(TikTokCredentials.user_id == current_user.id)
    )
    credentials = result.scalar_one_or_none()
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok account not connected"
        )
    
    try:
        videos = await tiktok_service.get_user_videos(credentials.access_token, max_count)
        return videos["data"]
    except Exception as e:
        logger.error("Failed to get TikTok videos", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get TikTok videos"
        )
