import feedparser
import asyncio
from typing import List, Dict
from datetime import datetime
import time

# Trusted Sources
FEEDS = [
    {"name": "BBC News", "url": "https://feeds.bbci.co.uk/news/rss.xml", "category": "World"},
    {"name": "Reuters", "url": "https://feeds.reuters.com/reuters/worldNews", "category": "World"},
    {"name": "The Hindu", "url": "https://www.thehindu.com/news/feeder/default.rss", "category": "India"},
    {"name": "The Economic Times", "url": "https://economictimes.indiatimes.com/rssfeedsdefault.cms", "category": "Business"},
]

def parse_date(entry):
    if hasattr(entry, 'published_parsed'):
        try:
            return datetime.fromtimestamp(time.mktime(entry.published_parsed))
        except:
            pass
    return datetime.utcnow()

async def fetch_feed(feed_info: Dict) -> List[Dict]:
    """Fetch and parse a single feed asynchronously"""
    # feedparser is blocking, so run in executor
    loop = asyncio.get_event_loop()
    
    def fetch():
        return feedparser.parse(feed_info["url"])
        
    try:
        feed = await loop.run_in_executor(None, fetch)
        
        items = []
        for entry in feed.entries[:10]: # Limit to top 10 per feed
            # Normalize fields
            image_url = None
            # Try to find image in media_content or links
            if 'media_content' in entry:
                 image_url = entry.media_content[0]['url']
            elif 'links' in entry:
                for link in entry.links:
                    if link.get('type', '').startswith('image/'):
                        image_url = link['href']
                        break
            
            summary = getattr(entry, 'summary', '')
            # Basic cleanup if summary contains HTML (simple tag stripping if needed, but keeping raw is often okay for now)
            
            items.append({
                "title": entry.title,
                "link": entry.link,
                "summary": summary,
                "published_at": parse_date(entry),
                "source": feed_info["name"],
                "category": feed_info["category"],
                "image_url": image_url
            })
        return items
    except Exception as e:
        print(f"Error fetching {feed_info['name']}: {e}")
        return []

async def get_all_feeds() -> List[Dict]:
    """Fetch all feeds and combine them"""
    tasks = [fetch_feed(feed) for feed in FEEDS]
    results = await asyncio.gather(*tasks)
    
    # Flatten list
    all_items = [item for sublist in results for item in sublist]
    
    # Sort by date (newest first)
    all_items.sort(key=lambda x: x['published_at'], reverse=True)
    
    return all_items
