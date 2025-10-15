import asyncio
import os
import random
from typing import Dict, List, Optional, Any
from datetime import datetime
from instagrapi import Client
from instagrapi.exceptions import LoginRequired, ChallengeRequired, TwoFactorRequired
import structlog
from app.core.config import settings
from app.models.proxy_configuration import ProxyConfiguration
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logger = structlog.get_logger()

class InstagramService:
    """Enhanced Instagram service using instagrapi library"""
    
    def __init__(self):
        self.sessions_dir = "instagram_sessions"
        self.proxy_list = []
        self.current_proxy_index = 0
        
        # Create sessions directory if it doesn't exist
        if not os.path.exists(self.sessions_dir):
            os.makedirs(self.sessions_dir)
    
    def _create_client(self, proxy: Optional[str] = None) -> Client:
        """Create Instagram client with proxy support"""
        cl = Client()
        
        if proxy:
            cl.set_proxy(proxy)
        
        # Configure client settings for better stability
        cl.delay_range = [1, 3]  # Random delay between requests
        cl.request_timeout = 30
        cl.auto_patch = True
        
        return cl
    
    async def get_working_proxy(self, db: AsyncSession) -> Optional[str]:
        """Get a working proxy from the database"""
        result = await db.execute(
            select(ProxyConfiguration)
            .where(ProxyConfiguration.is_active == True)
            .order_by(ProxyConfiguration.success_count.desc())
        )
        proxies = result.scalars().all()
        
        if not proxies:
            return None
        
        # Return the proxy with highest success rate
        return proxies[0].proxy_url
    
    async def update_proxy_stats(self, db: AsyncSession, proxy_url: str, success: bool):
        """Update proxy statistics"""
        result = await db.execute(
            select(ProxyConfiguration).where(ProxyConfiguration.proxy_url == proxy_url)
        )
        proxy = result.scalar_one_or_none()
        
        if proxy:
            if success:
                proxy.success_count += 1
                proxy.is_active = True
            else:
                proxy.failure_count += 1
                # Deactivate proxy if failure rate is too high
                total_attempts = proxy.success_count + proxy.failure_count
                if total_attempts > 10 and proxy.failure_count / total_attempts > 0.7:
                    proxy.is_active = False
            
            await db.commit()
    
    async def get_profile_info(self, username: str, db: AsyncSession) -> Optional[Dict[str, Any]]:
        """Get Instagram profile information using instagrapi"""
        proxy_url = await self.get_working_proxy(db)
        
        try:
            cl = self._create_client(proxy_url)
            
            # Get user info
            user_info = cl.user_info_by_username(username)
            
            profile_info = {
                'username': user_info.username,
                'display_name': user_info.full_name,
                'biography': user_info.biography,
                'profile_picture_url': user_info.profile_pic_url_hd,
                'followers_count': user_info.follower_count,
                'following_count': user_info.following_count,
                'posts_count': user_info.media_count,
                'is_verified': user_info.is_verified,
                'is_private': user_info.is_private,
                'external_url': user_info.external_url,
                'category': user_info.category_name,
                'business_contact_method': user_info.business_contact_method
            }
            
            if proxy_url:
                await self.update_proxy_stats(db, proxy_url, True)
            
            logger.info("Profile info retrieved", username=username, posts_count=profile_info['posts_count'])
            return profile_info
            
        except Exception as e:
            logger.error("Error fetching profile", username=username, error=str(e))
            if proxy_url:
                await self.update_proxy_stats(db, proxy_url, False)
            return None
    
    async def get_recent_reels(self, username: str, max_count: int = 12, db: AsyncSession = None) -> List[Dict[str, Any]]:
        """Get recent Reels from Instagram profile using instagrapi"""
        proxy_url = await self.get_working_proxy(db) if db else None
        
        try:
            cl = self._create_client(proxy_url)
            
            # Get user ID
            user_id = cl.user_id_from_username(username)
            
            # Get user's clips (reels)
            reels_data = cl.user_clips(user_id, amount=max_count)
            
            reels = []
            for reel in reels_data:
                reel_info = {
                    'id': reel.code,
                    'url': f"https://www.instagram.com/reel/{reel.code}/",
                    'caption': reel.caption_text if reel.caption_text else '',
                    'video_url': reel.video_url,
                    'thumbnail_url': reel.thumbnail_url,
                    'likes_count': reel.like_count,
                    'comments_count': reel.comment_count,
                    'taken_at_timestamp': int(reel.taken_at.timestamp()),
                    'duration': reel.video_duration,
                    'is_video': True
                }
                reels.append(reel_info)
            
            if proxy_url and db:
                await self.update_proxy_stats(db, proxy_url, True)
            
            logger.info("Reels retrieved", username=username, count=len(reels))
            return reels
            
        except Exception as e:
            logger.error("Error fetching reels", username=username, error=str(e))
            if proxy_url and db:
                await self.update_proxy_stats(db, proxy_url, False)
            return []
    
    async def _old_get_recent_reels(self, username: str, max_count: int = 12, db: AsyncSession = None) -> List[Dict[str, Any]]:
        """Old implementation - kept for reference"""
        profile_url = f"https://www.instagram.com/{username}/"
        proxy_url = await self.get_working_proxy(db) if db else None
        
        connector = None
        if proxy_url:
            import aiohttp
            connector = aiohttp.TCPConnector()
        
        import aiohttp
        async with aiohttp.ClientSession(
            connector=connector,
            timeout=aiohttp.ClientTimeout(total=30)
        ) as session:
            try:
                async with session.get(profile_url) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        # Extract posts data from JSON
                        scripts = soup.find_all('script', type='text/javascript')
                        posts_data = None
                        
                        for script in scripts:
                            if script.string and 'window._sharedData' in script.string:
                                json_match = re.search(r'window\._sharedData\s*=\s*({.*?});', script.string)
                                if json_match:
                                    import json
                                    try:
                                        data = json.loads(json_match.group(1))
                                        posts_data = data
                                        break
                                    except json.JSONDecodeError:
                                        continue
                        
                        if not posts_data:
                            logger.warning("Could not extract posts data", username=username)
                            return []
                        
                        # Extract posts
                        user_data = posts_data.get('entry_data', {}).get('ProfilePage', [{}])[0].get('graphql', {}).get('user', {})
                        posts = user_data.get('edge_owner_to_timeline_media', {}).get('edges', [])
                        
                        reels = []
                        for post in posts[:max_count]:
                            node = post.get('node', {})
                            
                            # Only get Reels (videos)
                            if node.get('is_video', False):
                                reel_data = {
                                    'id': node.get('shortcode'),
                                    'url': f"{self.base_url}/reel/{node.get('shortcode')}/",
                                    'caption': node.get('edge_media_to_caption', {}).get('edges', [{}])[0].get('node', {}).get('text', ''),
                                    'video_url': node.get('video_url'),
                                    'thumbnail_url': node.get('display_url'),
                                    'likes_count': node.get('edge_liked_by', {}).get('count', 0),
                                    'comments_count': node.get('edge_media_to_comment', {}).get('count', 0),
                                    'taken_at_timestamp': node.get('taken_at_timestamp'),
                                    'duration': node.get('video_duration'),
                                    'is_video': node.get('is_video', False)
                                }
                                reels.append(reel_data)
                        
                        if proxy_url and db:
                            await self.update_proxy_stats(db, proxy_url, True)
                        
                        logger.info("Reels retrieved", username=username, count=len(reels))
                        return reels
                    
                    else:
                        logger.warning("Profile page returned non-200 status", username=username, status=response.status)
                        if proxy_url and db:
                            await self.update_proxy_stats(db, proxy_url, False)
                        return []
                        
            except Exception as e:
                logger.error("Error fetching reels", username=username, error=str(e))
                if proxy_url and db:
                    await self.update_proxy_stats(db, proxy_url, False)
                return []
    
    async def download_video(self, video_url: str, file_path: str, db: AsyncSession = None) -> bool:
        """Download video from Instagram"""
        proxy_url = await self.get_working_proxy(db) if db else None
        
        connector = None
        if proxy_url:
            connector = aiohttp.TCPConnector()
        
        try:
            async with aiohttp.ClientSession(
                headers=self.headers,
                connector=connector,
                timeout=aiohttp.ClientTimeout(total=120)
            ) as session:
                async with session.get(video_url) as response:
                    if response.status == 200:
                        with open(file_path, 'wb') as f:
                            async for chunk in response.content.iter_chunked(8192):
                                f.write(chunk)
                        
                        if proxy_url and db:
                            await self.update_proxy_stats(db, proxy_url, True)
                        
                        logger.info("Video downloaded successfully", file_path=file_path)
                        return True
                    else:
                        logger.warning("Failed to download video", status=response.status)
                        if proxy_url and db:
                            await self.update_proxy_stats(db, proxy_url, False)
                        return False
                        
        except Exception as e:
            logger.error("Error downloading video", error=str(e), file_path=file_path)
            if proxy_url and db:
                await self.update_proxy_stats(db, proxy_url, False)
            return False

# Global service instance
instagram_service = InstagramService()
