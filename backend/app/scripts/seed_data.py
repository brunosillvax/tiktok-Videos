import asyncio
import sys
import os
from datetime import datetime, timedelta
import random

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import async_session_factory
from app.models.user import User
from app.models.monitored_profile import MonitoredProfile
from app.models.posted_reel import PostedReel
from app.models.application_log import ApplicationLog
# from app.core.security import get_password_hash

async def seed_data():
    """Seed the database with sample data"""
    async with async_session_factory() as db:
        try:
            # Create a sample user (using pre-hashed password)
            user = User(
                email="demo@autoreel.com",
                password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LejCb6V1dRZzHj2yK",  # "demo"
                first_name="Demo",
                last_name="User",
                is_active=True,
                is_verified=True
            )
            db.add(user)
            await db.flush()  # Get the user ID

            # Create sample monitored profiles
            profiles_data = [
                {
                    "username": "@fitnessmodel",
                    "display_name": "Fitness Model",
                    "is_active": True,
                    "check_interval_minutes": 30
                },
                {
                    "username": "@lifestyleblogger", 
                    "display_name": "Lifestyle Blogger",
                    "is_active": True,
                    "check_interval_minutes": 45
                },
                {
                    "username": "@foodlover",
                    "display_name": "Food Lover",
                    "is_active": False,
                    "check_interval_minutes": 60
                },
                {
                    "username": "@traveler",
                    "display_name": "Traveler",
                    "is_active": True,
                    "check_interval_minutes": 20
                }
            ]

            profiles = []
            for profile_data in profiles_data:
                profile = MonitoredProfile(
                    user_id=user.id,
                    instagram_username=profile_data["username"],
                    display_name=profile_data["display_name"],
                    is_active=profile_data["is_active"],
                    check_interval_minutes=profile_data["check_interval_minutes"],
                    last_checked_at=datetime.utcnow() - timedelta(minutes=random.randint(5, 120)),
                    last_posted_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48))
                )
                db.add(profile)
                profiles.append(profile)

            await db.flush()  # Get profile IDs

            # Create sample posted reels
            reel_titles = [
                "Workout Routine 2024",
                "Healthy Breakfast Ideas",
                "Morning Motivation",
                "Quick Fitness Tips",
                "Healthy Recipes",
                "Travel Adventures",
                "Lifestyle Tips",
                "Motivational Quotes",
                "Fitness Challenges",
                "Healthy Snacks",
                "Travel Destinations",
                "Workout Motivation",
                "Healthy Lifestyle",
                "Fitness Journey",
                "Travel Tips"
            ]

            for i, title in enumerate(reel_titles):
                profile = random.choice(profiles)
                status = random.choice(["pending", "posted", "failed"])
                
                reel = PostedReel(
                    profile_id=profile.id,
                    instagram_reel_code=f"reel_{i+1:03d}",
                    instagram_reel_url=f"https://instagram.com/reel/reel_{i+1:03d}",
                    caption=title,
                    status=status,
                    video_file_path=f"/videos/reel_{i+1:03d}.mp4" if status != "pending" else None,
                    tiktok_post_id=f"tiktok_{i+1:03d}" if status == "posted" else None,
                    tiktok_post_url=f"https://tiktok.com/@user/video/tiktok_{i+1:03d}" if status == "posted" else None,
                    posted_at=datetime.utcnow() - timedelta(hours=random.randint(1, 168)) if status == "posted" else None,
                    created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 240))
                )
                db.add(reel)

            # Create sample application logs
            log_messages = [
                "New Reel detected: reel_001 from @fitnessmodel",
                "Reel posted successfully to TikTok",
                "Profile monitoring started for @lifestyleblogger",
                "Proxy connection established",
                "TikTok API token refreshed",
                "New Reel detected: reel_002 from @foodlover",
                "Failed to download video: network timeout",
                "Profile @traveler checked for updates",
                "Reel posted successfully to TikTok",
                "System maintenance completed",
                "New Reel detected: reel_003 from @fitnessmodel",
                "Proxy rotation completed",
                "TikTok API rate limit reached",
                "Video processing completed",
                "Profile monitoring completed"
            ]

            for i, message in enumerate(log_messages):
                log = ApplicationLog(
                    user_id=user.id,
                    level=random.choice(["INFO", "WARNING", "ERROR"]),
                    message=message,
                    context={
                        "task_id": f"task_{i+1:03d}",
                        "timestamp": (datetime.utcnow() - timedelta(hours=random.randint(1, 72))).isoformat()
                    }
                )
                db.add(log)

            await db.commit()
            print("✅ Sample data seeded successfully!")
            print(f"Created:")
            print(f"- 1 user (demo@autoreel.com)")
            print(f"- {len(profiles_data)} monitored profiles")
            print(f"- {len(reel_titles)} posted reels")
            print(f"- {len(log_messages)} application logs")

        except Exception as e:
            await db.rollback()
            print(f"❌ Error seeding data: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(seed_data())
