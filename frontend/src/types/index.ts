export type CredibilityLevel = 'high' | 'medium' | 'low' | 'neutral';

export type ArticleStatus = 'verified' | 'under_review' | 'disputed' | 'user_submitted';

export interface Source {
  id: string;
  name: string;
  domain: string;
  credibilityScore: number;
  articlesPublished: number;
  reportFrequency: number;
  historicalTrend: number[];
}

export interface CredibilityBreakdown {
  sourceTrust: number;
  communityScore: number;
  nlpAnalysis: number;
  crossSourceSupport: number;
}

export interface CrossSource {
  id: string;
  sourceName: string;
  sourceCredibility: number;
  url: string;
  headline: string;
}

export interface HighlightedText {
  text: string;
  type: 'emotional' | 'factual' | 'normal';
}

export interface Article {
  id: string;
  headline: string;
  summary: string;
  content: HighlightedText[];
  source: Source;
  publishedAt: Date;
  imageUrl?: string;
  credibilityScore: number;
  status: ArticleStatus;
  breakdown: CredibilityBreakdown;
  crossSources: CrossSource[];
  category: string;
  isLocked?: boolean;
  lockReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  overallCredibility: number;
  categoryCredibility: Record<string, number>;
  votingHistory: number;
  reportsSubmitted: number;
  reportsUpheld: number;
  joinedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userCredibility: number;
  content: string;
  reasonTag: string;
  createdAt: Date;
}

export interface Rating {
  score: number;
  reason: string;
}
