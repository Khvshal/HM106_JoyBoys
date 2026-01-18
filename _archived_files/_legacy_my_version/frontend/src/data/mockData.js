export const MOCK_USERS = {
    GUEST: null,
    USER: {
        id: 1,
        name: "Alex Johnson",
        role: "user",
        avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
        stats: {
            articlesAnalyzed: 12,
            savedArticles: 5,
            trustScore: 85
        }
    },
    ADMIN: {
        id: 99,
        name: "Sarah Chen",
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
        permissions: ["view_analytics", "flag_content", "manage_sources"]
    }
};

export const MOCK_ACTIVITIES = [
    {
        id: 101,
        title: "New vaccine claims circulate on social media",
        source: "HealthWeekly",
        date: "2 hours ago",
        score: 35,
        status: "High Risk",
        result: "Potentially Misleading"
    },
    {
        id: 102,
        title: "Global markets rally after rate cut announcement",
        source: "FinanceToday",
        date: "1 day ago",
        score: 92,
        status: "Reliable",
        result: "Likely Reliable"
    },
    {
        id: 103,
        title: "Breakthrough in renewable energy storage",
        source: "TechInsider",
        date: "3 days ago",
        score: 65,
        status: "Mixed",
        result: "Mixed Signals"
    }
];

export const MOCK_SUBMISSIONS = [
    { id: 1, url: "https://example.com/article1", status: "Analyzed", date: "2023-10-25" },
    { id: 2, url: "https://example.com/article2", status: "Under Review", date: "2023-10-26" },
    { id: 3, url: "https://suspicious-site.net/shocking-news", status: "Flagged", date: "2023-10-27" }
];

export const ADMIN_STATS = {
    totalArticles: 1243,
    highRiskDetected: 156,
    activeUsers: 842,
    flaggedSources: 23,
    recentReports: 12
};

export const MOCK_SOURCES = [
    { id: 1, name: "The Daily Truth", type: "Mainstream", score: 95, status: "Trusted" },
    { id: 2, name: "HealthWeekly", type: "Blog", score: 45, status: "Watchlist" },
    { id: 3, name: "TechInsider", type: "Tech News", score: 88, status: "Trusted" },
    { id: 4, name: "ViralBuzzNow", type: "Social Aggregator", score: 12, status: "Banned" },
    { id: 5, name: "Global Finance", type: "Financial", score: 92, status: "Trusted" }
];

export const FLAGGED_CONTENT = [
    {
        id: 201,
        title: "Miracle cure found in common pantry item",
        source: "ViralBuzzNow",
        claims: "Cures all known diseases instantly",
        reports: 15,
        date: "5 hours ago"
    },
    {
        id: 202,
        title: "Secret government moon base revealed",
        source: "ConspiracyHub",
        claims: "Aliens living among us",
        reports: 8,
        date: "1 day ago"
    }
];
