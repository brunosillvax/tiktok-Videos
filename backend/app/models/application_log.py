from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class ApplicationLog(Base):
    __tablename__ = "application_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    level = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    context = Column(JSONB)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="application_logs")
    
    # Indexes
    __table_args__ = (
        Index('idx_logs_user_id', 'user_id'),
        Index('idx_logs_timestamp', 'timestamp'),
        Index('idx_logs_level', 'level'),
        Index('idx_logs_user_timestamp', 'user_id', 'timestamp'),
    )
