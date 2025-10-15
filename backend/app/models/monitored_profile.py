from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MonitoredProfile(Base):
    __tablename__ = "monitored_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    instagram_username = Column(String(255), nullable=False)
    display_name = Column(String(255))
    profile_picture_url = Column(String)
    is_active = Column(Boolean, default=True)
    last_checked_at = Column(DateTime(timezone=True))
    last_posted_at = Column(DateTime(timezone=True))
    check_interval_minutes = Column(Integer, default=60)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="monitored_profiles")
    posted_reels = relationship("PostedReel", back_populates="profile", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_instagram_unique', 'user_id', 'instagram_username', unique=True),
        Index('idx_active_profiles', 'is_active'),
        Index('idx_last_checked', 'last_checked_at'),
    )
