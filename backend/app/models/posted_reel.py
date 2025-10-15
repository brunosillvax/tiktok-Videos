from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, ARRAY, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class PostedReel(Base):
    __tablename__ = "posted_reels"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("monitored_profiles.id", ondelete="CASCADE"), nullable=False)
    instagram_reel_code = Column(String(50), unique=True, index=True, nullable=False)
    instagram_reel_url = Column(Text)
    tiktok_post_id = Column(String(255))
    tiktok_post_url = Column(Text)
    status = Column(String(50), default="pending", nullable=False)
    error_message = Column(Text)
    video_file_path = Column(Text)
    caption = Column(Text)
    hashtags = Column(ARRAY(Text))
    posted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    profile = relationship("MonitoredProfile", back_populates="posted_reels")
    
    # Indexes
    __table_args__ = (
        Index('idx_profile_reels', 'profile_id'),
        Index('idx_reel_status', 'status'),
        Index('idx_instagram_code', 'instagram_reel_code'),
    )
