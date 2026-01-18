from fastapi import APIRouter
from rss_service import fetch_rss_feeds

router = APIRouter()

@router.get("/")
def get_rss_feed():
    """
    Get latest articles from RSS feeds
    """
    return fetch_rss_feeds()
