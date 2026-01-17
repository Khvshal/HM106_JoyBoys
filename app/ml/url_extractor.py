"""
URL Detection and Article Extraction Module

This module provides utilities to:
1. Detect if user input is a URL
2. Extract article text content from news URLs using newspaper3k
"""

import re
from newspaper import Article


def is_url(text: str) -> bool:
    """
    Check if the given text is a URL.
    
    Args:
        text: Input string to check
        
    Returns:
        True if input starts with http:// or https://, False otherwise
    """
    if not text:
        return False
    stripped = text.strip()
    return stripped.startswith("http://") or stripped.startswith("https://")


def extract_article_from_url(url: str) -> str:
    """
    Fetch and extract article text content from a news URL.
    
    Uses newspaper3k library to download, parse and extract
    the main article text from a webpage.
    
    Args:
        url: The URL of the news article
        
    Returns:
        Extracted article text content
        
    Raises:
        Exception: If article cannot be downloaded or parsed
    """
    article = Article(url)
    article.download()
    article.parse()
    
    if not article.text:
        raise ValueError("No article content could be extracted from the URL")
    
    return article.text
