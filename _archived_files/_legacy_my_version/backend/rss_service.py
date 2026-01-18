import feedparser
import time

RSS_FEEDS = {
    "BBC News": {
        "url": "https://feeds.bbci.co.uk/news/rss.xml",
        "type": "International",
        "color": "#b80000"
    },
    "The Hindu": {
        "url": "https://www.thehindu.com/news/feeder/default.rss",
        "type": "National",
        "color": "#2c3e50"
    },
    "Economic Times": {
        "url": "https://economictimes.indiatimes.com/rssfeedsdefault.cms", 
        "type": "Business",
        "color": "#e9d564"
    },
    "Reuters World": {
        "url": "https://feeds.reuters.com/reuters/worldNews",
        "type": "Wire Agency",
        "color": "#ff8000"
    }
}

def fetch_rss_feeds():
    """
    Fetches and merges articles from configured RSS feeds.
    Returns a list of structured article dictionaries.
    """
    all_articles = []
    
    for source_name, config in RSS_FEEDS.items():
        try:
            print(f"Fetching RSS feed from: {source_name}")
            feed = feedparser.parse(config["url"])
            
            # Process up to 5 entries per feed to keep it fast
            for entry in feed.entries[:5]:
                # Extract image if available (some RSS feeds include it in media_content or links)
                image_url = None
                if 'media_content' in entry:
                    image_url = entry.media_content[0]['url']
                elif 'media_thumbnail' in entry:
                    image_url = entry.media_thumbnail[0]['url']
                
                article = {
                    "id": entry.get("id", entry.get("link")),
                    "headline": entry.get("title", "No Title"),
                    "description": entry.get("summary", "No summary available.")[:200] + "...",
                    "articleUrl": entry.get("link"),
                    "source": source_name,
                    "sourceColor": config["color"],
                    "sourceType": config["type"],
                    "timestamp": get_published_time(entry),
                    "thumbnail": image_url,
                    # Mock fields for frontend compatibility (will be updated if analyzed)
                    "status": "pending", 
                    "trustScore": 0,
                    "likes": 0,
                    "comments": 0
                }
                all_articles.append(article)
                
        except Exception as e:
            print(f"Error fetching feed {source_name}: {e}")
            continue

    # Sort checks by published time (simplistic sort for now)
    return all_articles

def get_published_time(entry):
    if 'published' in entry:
        return entry.published
    elif 'updated' in entry:
        return entry.updated
    return "Just now"
