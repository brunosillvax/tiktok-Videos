from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TikTokCredentialsBase(BaseModel):
    open_id: str
    scope: Optional[str] = None

class TikTokCredentialsResponse(TikTokCredentialsBase):
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

