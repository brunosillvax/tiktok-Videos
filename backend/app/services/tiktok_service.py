import httpx
import asyncio
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.schemas.tiktok_credentials import TikTokCredentialsResponse
import structlog

logger = structlog.get_logger()

class TikTokService:
    """Service for TikTok API integration using official APIs"""
    
    def __init__(self):
        self.base_url = "https://open.tiktokapis.com"
        self.client_key = settings.TIKTOK_CLIENT_KEY
        self.client_secret = settings.TIKTOK_CLIENT_SECRET
        self.redirect_uri = settings.TIKTOK_REDIRECT_URI
    
    async def get_authorization_url(self, state: str) -> str:
        """Generate TikTok OAuth authorization URL"""
        auth_url = (
            f"{self.base_url}/v2/oauth/authorize/"
            f"?client_key={self.client_key}"
            f"&scope=user.info.basic,video.publish"
            f"&response_type=code"
            f"&redirect_uri={self.redirect_uri}"
            f"&state={state}"
        )
        return auth_url
    
    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token"""
        token_url = f"{self.base_url}/v2/oauth/token/"
        
        data = {
            "client_key": self.client_key,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            response.raise_for_status()
            return response.json()
    
    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh access token using refresh token"""
        token_url = f"{self.base_url}/v2/oauth/token/"
        
        data = {
            "client_key": self.client_key,
            "client_secret": self.client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            response.raise_for_status()
            return response.json()
    
    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """Get user profile information using Display API"""
        user_url = f"{self.base_url}/v2/user/info/"
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        params = {
            "fields": "open_id,union_id,avatar_url,display_name"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(user_url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
    
    async def get_user_videos(self, access_token: str, max_count: int = 20) -> Dict[str, Any]:
        """Get user's recent videos using Display API"""
        videos_url = f"{self.base_url}/v2/video/list/"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "max_count": max_count
        }
        
        params = {
            "fields": "id,title,video_description,duration,cover_image_url,embed_link"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                videos_url, 
                headers=headers, 
                params=params,
                json=data
            )
            response.raise_for_status()
            return response.json()
    
    async def post_video_direct(
        self, 
        access_token: str, 
        video_url: str, 
        caption: str = "",
        privacy_level: str = "SELF_ONLY"
    ) -> Dict[str, Any]:
        """Post video directly to TikTok using Content Posting API"""
        post_url = f"{self.base_url}/v2/post/publish/video/init/"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "video_url": video_url,
            "post_info": {
                "title": caption,
                "description": caption,
                "privacy_level": privacy_level,
                "disable_duet": False,
                "disable_comment": False,
                "disable_stitch": False,
                "video_cover_timestamp_ms": 1000
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(post_url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()
    
    async def check_post_status(self, access_token: str, publish_id: str) -> Dict[str, Any]:
        """Check the status of a video post"""
        status_url = f"{self.base_url}/v2/post/publish/status/fetch/"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "publish_id": publish_id
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(status_url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()
    
    async def upload_video(
        self, 
        access_token: str, 
        video_file_path: str, 
        caption: str = "",
        privacy_level: str = "SELF_ONLY"
    ) -> Dict[str, Any]:
        """Upload video file to TikTok using Content Posting API"""
        # Step 1: Initialize upload
        init_url = f"{self.base_url}/v2/post/publish/video/init/"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "post_info": {
                "title": caption,
                "description": caption,
                "privacy_level": privacy_level,
                "disable_duet": False,
                "disable_comment": False,
                "disable_stitch": False,
                "video_cover_timestamp_ms": 1000
            }
        }
        
        async with httpx.AsyncClient() as client:
            # Initialize upload
            response = await client.post(init_url, headers=headers, json=data)
            response.raise_for_status()
            init_result = response.json()
            
            upload_url = init_result["data"]["upload_url"]
            publish_id = init_result["data"]["publish_id"]
            
            # Step 2: Upload video file
            with open(video_file_path, "rb") as video_file:
                upload_headers = {
                    "Content-Type": "video/mp4"
                }
                upload_response = await client.post(
                    upload_url, 
                    headers=upload_headers, 
                    content=video_file.read()
                )
                upload_response.raise_for_status()
            
            return {
                "publish_id": publish_id,
                "status": "uploaded"
            }

# Global service instance
tiktok_service = TikTokService()
