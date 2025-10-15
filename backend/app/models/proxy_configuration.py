from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index
from sqlalchemy.sql import func
from app.core.database import Base

class ProxyConfiguration(Base):
    __tablename__ = "proxy_configurations"
    
    id = Column(Integer, primary_key=True, index=True)
    proxy_url = Column(String, nullable=False)
    proxy_type = Column(String(20), default="http", nullable=False)
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True))
    success_count = Column(Integer, default=0)
    failure_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Indexes
    __table_args__ = (
        Index('idx_active_proxies', 'is_active'),
        Index('idx_proxy_success_rate', 'success_count', 'failure_count'),
    )
