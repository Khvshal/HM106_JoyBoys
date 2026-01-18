from fastapi import APIRouter
from rss_service import get_all_feeds
from typing import List, Dict, Any

router = APIRouter()

@router.get("/feed", response_model=List[Dict[str, Any]])
async def get_live_feed():
    """Get aggregated live news feed from RSS"""
    return await get_all_feeds()
