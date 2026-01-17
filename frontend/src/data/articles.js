// Demo articles data for the News Feed
// These are static articles with real URLs for analysis

export const demoArticles = [
    {
        id: 1,
        headline: "Global Summit Reaches Historic Climate Agreement",
        source: "The Daily Global",
        sourceColor: "#2563eb",
        thumbnail: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400&h=250&fit=crop",
        timestamp: "2h ago",
        trustScore: 92,
        status: "high",
        statusLabel: "High Confidence",
        description: "Nations unite to commit to aggressive carbon reduction targets by 2030, signaling a major shift in policy.",
        likes: 1240,
        comments: 85,
        articleUrl: "https://www.reuters.com/business/environment/cop29-climate-summit-final-stretch-deal-still-elusive-2024-11-22/"
    },
    {
        id: 2,
        headline: "New Study Claims Chocolate Cures All Ailments",
        source: "HealthBuzz",
        sourceColor: "#dc2626",
        thumbnail: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=250&fit=crop",
        timestamp: "4h ago",
        trustScore: 35,
        status: "low",
        statusLabel: "Low Credibility",
        description: "A controversial report suggests that daily chocolate consumption boosts immunity significantly.",
        likes: 45,
        comments: 320,
        articleUrl: "https://indianexpress.com/article/lifestyle/health/dark-chocolate-benefits-health-9752835/"
    },
    {
        id: 3,
        headline: "Tech Giant Unveils AI That Can Predict Weather",
        source: "TechInsider",
        sourceColor: "#7c3aed",
        thumbnail: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
        timestamp: "6h ago",
        trustScore: 65,
        status: "mixed",
        statusLabel: "Mixed Sources",
        description: "Revolutionary neural network claims to forecast local weather patterns with unprecedented accuracy.",
        likes: 890,
        comments: 156,
        articleUrl: "https://www.bbc.com/news/technology-67307727"
    },
    {
        id: 4,
        headline: "Stock Markets Hit Record Highs Amid Economic Recovery",
        source: "Financial Times",
        sourceColor: "#0891b2",
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
        timestamp: "1h ago",
        trustScore: 88,
        status: "high",
        statusLabel: "High Confidence",
        description: "Major indices surge as investors react positively to strong employment data and GDP growth.",
        likes: 2100,
        comments: 234,
        articleUrl: "https://www.ft.com/markets"
    },
    {
        id: 5,
        headline: "Miracle Diet Pill Guarantees Weight Loss Without Exercise",
        source: "QuickHealth",
        sourceColor: "#f97316",
        thumbnail: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=250&fit=crop",
        timestamp: "3h ago",
        trustScore: 22,
        status: "low",
        statusLabel: "Low Credibility",
        description: "New supplement claims to burn fat while you sleep with zero side effects.",
        likes: 120,
        comments: 890,
        articleUrl: "https://www.webmd.com/diet/obesity/features/truth-about-weight-loss-pills"
    },
    {
        id: 6,
        headline: "Scientists Discover New Species in Deep Ocean",
        source: "Nature Weekly",
        sourceColor: "#059669",
        thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop",
        timestamp: "5h ago",
        trustScore: 78,
        status: "mixed",
        statusLabel: "Mixed Sources",
        description: "Marine biologists report finding previously unknown creatures at record ocean depths.",
        likes: 567,
        comments: 89,
        articleUrl: "https://www.nationalgeographic.com/animals/article/new-species-discovered-deep-ocean"
    }
];

// Get filter options
export const filterOptions = [
    { id: "all", label: "All", color: "#6366f1" },
    { id: "high", label: "High Credibility", color: "#10b981" },
    { id: "mixed", label: "Mixed", color: "#f59e0b" },
    { id: "low", label: "High Risk", color: "#ef4444" }
];
