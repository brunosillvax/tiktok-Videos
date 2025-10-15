from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_users():
    """List users - placeholder"""
    return {"users": []}

