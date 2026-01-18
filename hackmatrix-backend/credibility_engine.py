"""
Credibility Scoring Engine
Combines ML models with rule-based logic for transparent credibility assessment
"""

import random
import json
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import Article, Rating, User, Claim, AuditLog
import re
try:
    from ml_models.inference import NewsInference
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("Warning: ML models not available, falling back to heuristics")


class CredibilityEngine:
    """Main credibility scoring engine"""
    
    def __init__(self):
        self.weights = {
            "source_trust": 0.30,
            "nlp_analysis": 0.25,
            "community_feedback": 0.30,
            "cross_source": 0.15
        }
        self.ml_inference = NewsInference() if ML_AVAILABLE else None
    
    def compute_article_score(
        self, 
        article: Article, 
        db: Session
    ) -> Tuple[float, str]:
        """
        Compute overall credibility score for an article
        Returns: (score, status)
        """
        
        # Get component scores
        source_score = self._compute_source_trust(article, db)
        nlp_score = self._compute_nlp_score(article)
        community_score = self._compute_community_score(article, db)
        cross_source_score = self._compute_cross_source_score(article, db)
        
        # Fact vs Opinion Logic (Feature 3)
        article.fact_opinion_ratio = self._analyze_fact_opinion_ratio(article.content)
        
        # Compute weighted average
        overall_score = (
            source_score * self.weights["source_trust"] +
            nlp_score * self.weights["nlp_analysis"] +
            community_score * self.weights["community_feedback"] +
            cross_source_score * self.weights["cross_source"]
        )
        
        # Determine status
        status = self._determine_status(overall_score, article)

        # Extract Signals for Highlighting (Feature 1)
        signals = self._extract_signals(article.content)
        article.hype_sentences = json.dumps(signals['hype_sentences'])
        article.factual_sentences = json.dumps(signals['factual_sentences'])
        
        # Check for manipulation
        is_suspicious = self._detect_manipulation(article, db)
        
        # Auto soft-lock if suspicious
        if is_suspicious and not article.is_soft_locked:
            article.is_soft_locked = True
            article.suspicious_activity_detected = True
            article.soft_lock_reason = "Automatic soft-lock: Suspicious activity detected (voting pattern anomaly)"
            
        # Extract claims if none exist (one-time extraction)
        if not article.claims:
            self._extract_claims(article, db)
        
        return overall_score, status, is_suspicious
        return overall_score, status, is_suspicious

    def _extract_signals(self, text: str) -> Dict[str, List[str]]:
        """Extract sentences for highlighting"""
        import re
        # Rudimentary sentence splitting
        sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', text)
        
        hype = []
        factual = []
        
        hype_keywords = [
            "shocking", "bombshell", "destroyed", "eviscerated", "you won't believe", 
            "miracle", "secret", "exposed", "shameful", "betrayal", "crisis", 
            "catastrophe", "urgent", "breaking", "nightmare"
        ]
        
        factual_keywords = [
            "according to", "reported by", "study shows", "data indicates", 
            "percent", "%", "evidence", "confirmed", "official", "stated",
            "researchers", "statistics"
        ]
        
        for sent in sentences:
            s_lower = sent.lower()
            
            # Hype priority
            if any(k in s_lower for k in hype_keywords) or "!!!" in sent:
                hype.append(sent)
            # Factual
            elif any(k in s_lower for k in factual_keywords) or re.search(r'\d+', sent):
                factual.append(sent)
                
        return {"hype_sentences": hype, "factual_sentences": factual}
    
    def _compute_source_trust(self, article: Article, db: Session) -> float:
        """
        Compute source credibility score
        Based on: historical performance, articles published, corroboration rate
        """
        if article.source:
            # Use actual source score with a confidence modifier
            base_score = article.source.credibility_score or 50.0
            
            # Boost if many articles published
            pub_boost = min((article.source.articles_published / 100) * 5, 5)
            
            # Boost based on corroboration rate
            corr_boost = article.source.corroboration_rate * 10
            
            score = min(100, base_score + pub_boost + corr_boost)
            return score
        
        # Default for new sources
        return 45.0
    
    def _compute_nlp_score(self, article: Article) -> float:
        """
        NLP-based analysis: Hybrid approach using ML Model (if available) + Heuristics
        Returns 0-100 score
        """
        heuristic_score = 50.0
        content = article.content.lower()
        
        # --- Heuristic Layer ---
        # Sensationalism detection (negative indicators)
        sensational_words = [
            "shocking", "amazing", "unbelievable", "viral", "explosive",
            "exclusive", "breaking", "urgent", "scandal", "bizarre"
        ]
        sensational_count = sum(1 for word in sensational_words if word in content)
        heuristic_score -= sensational_count * 3
        
        # Factuality indicators (positive)
        factual_patterns = [
            r'\b\d+%\b',  # percentages
            r'\b\d{4}-\d{2}-\d{2}\b',  # dates
            r'according to',
            r'research shows',
            r'study found',
            r'data indicates'
        ]
        factual_count = sum(1 for pattern in factual_patterns if re.search(pattern, content))
        heuristic_score += factual_count * 5
        
        # Length check (longer = usually more detailed)
        if len(content) > 500:
            heuristic_score += 5
        elif len(content) < 100:
            heuristic_score -= 10
            
        heuristic_score = max(0, min(100, heuristic_score))

        # --- ML Layer ---
        if self.ml_inference:
            res = self.ml_inference.predict(article.content)
            if "error" not in res:
                # Prediction: 1 = Credible, 0 = Unreliable
                # Confidence: 0.5 - 1.0 (usually)
                ml_confidence = res['confidence']
                is_credible = res['prediction'] == 1
                
                # Map to 0-100 score
                if is_credible:
                    ml_score = 50 + (ml_confidence * 50) # 75-100 usually
                else:
                    ml_score = 50 - (ml_confidence * 50) # 0-25 usually
                
                # Weighted average: 70% ML, 30% Heuristic
                final_score = (ml_score * 0.7) + (heuristic_score * 0.3)
                return final_score
        
        return heuristic_score
    
    def _compute_community_score(self, article: Article, db: Session) -> float:
        """
        Community weighted opinion score
        Based on user ratings weighted by user credibility
        """
        ratings = db.query(Rating).filter(Rating.article_id == article.id).all()
        
        if not ratings:
            return 50.0  # Neutral if no ratings
        
        # Calculate weighted average
        total_weight = 0
        weighted_sum = 0
        
        for rating in ratings:
            user = rating.user
            # Vote weight logic:
            # Base weight comes from rating.vote_weight (defaults to 1.0)
            # Users with high credibility (>75) get 2x impact
            # Users with low credibility (<40) get 0.5x impact
            user_impact = 1.0
            if user.credibility_score > 75:
                user_impact = 2.0
            elif user.credibility_score < 40:
                user_impact = 0.5
                
            vote_weight = rating.vote_weight * user_impact
            
            weighted_sum += rating.credibility_rating * vote_weight
            total_weight += vote_weight
        
        if total_weight == 0:
            return 50.0
        
        return weighted_sum / total_weight
    
    def _analyze_fact_opinion_ratio(self, content: str) -> float:
        """
        Estimate Fact vs Opinion ratio (0.0 = Pure Opinion, 1.0 = Pure Fact)
        """
        content = content.lower()
        
        # Fact indicators
        fact_patterns = [
            r'\d+%', r'\d{4}', r'\$', r'according to', r'report', r'study', 
            r'evidence', r'data', r'statistics', r'record', r'official'
        ]
        
        # Opinion indicators
        opinion_patterns = [
            r'i think', r'believe', r'feel', r'opinion', r'should', 
            r'must', r'best', r'worst', r'amazing', r'terrible', r'wrong'
        ]
        
        fact_hits = sum(1 for p in fact_patterns if re.search(p, content))
        opinion_hits = sum(1 for p in opinion_patterns if re.search(p, content))
        
        total = fact_hits + opinion_hits
        if total == 0:
            return 0.5
            
        return fact_hits / total
    
    def _compute_cross_source_score(self, article: Article, db: Session) -> float:
        """
        Check corroboration across independent sources
        Higher = more sources confirm the claim
        """
        claims = db.query(Claim).filter(Claim.article_id == article.id).all()
        
        if not claims:
            return 40.0  # Low score if no claims extracted
        
        total_corroboration = 0
        for claim in claims:
            corr_count = claim.corroboration_count
            # Score based on # of sources: 1=20, 2-3=50, 4+=90
            if corr_count >= 4:
                total_corroboration += 90
            elif corr_count >= 2:
                total_corroboration += 50
            elif corr_count >= 1:
                total_corroboration += 20
        
        avg_corroboration = total_corroboration / len(claims) if claims else 40
        return avg_corroboration
    
    def _determine_status(self, score: float, article: Article) -> str:
        """Determine credibility status badge"""
        if score >= 70:
            return "Widely Corroborated"
        elif score >= 45:
            return "Under Review"
        else:
            return "High Risk"
    
    def _detect_manipulation(self, article: Article, db: Session) -> bool:
        """
        Detect suspicious activity patterns:
        - Sudden voting spikes
        - New account mass voting
        - Coordinated rating patterns
        - Extreme score divergence
        """
        ratings = db.query(Rating).filter(Rating.article_id == article.id).all()
        
        if len(ratings) < 3:
            return False
        
        # 1. Check for time-based spike (many ratings in short time)
        now = datetime.utcnow()
        recent_ratings = [r for r in ratings if (now - r.created_at).total_seconds() < 3600]
        
        if len(recent_ratings) >= 5 and len(recent_ratings) > len(ratings) * 0.7:
            # 70% of ratings in last hour = suspicious
            return True
        
        # 2. Check for new account activity
        new_accounts = [r for r in ratings if (now - r.user.created_at).days < 1]
        if len(new_accounts) > len(ratings) * 0.5 and len(ratings) >= 5:
            return True
        
        # 3. Check for extreme score clustering
        if len(ratings) >= 5:
            scores = [r.credibility_rating for r in ratings]
            avg_score = sum(scores) / len(scores)
            
            # If all ratings are similar (within 15 points) = suspicious uniformity
            score_variance = sum((s - avg_score) ** 2 for s in scores) / len(scores)
            if score_variance < 50:  # Very low variance = coordinated voting
                return True
        
        
        if len(ratings) >= 10:
            scores = [r.credibility_rating for r in ratings]
            high_ratings = len([s for s in scores if s > 75])
            low_ratings = len([s for s in scores if s < 25])
            
            if (high_ratings + low_ratings) / len(scores) > 0.8:
                # More than 80% are extreme = manipulation
                return True
        
        # 5. Check for IP Clustering (Brigading)
        # Assuming model has ip_address field now
        if len(ratings) >= 5:
            # Filter for ratings with IP
            valid_ips = [r.ip_address for r in ratings if getattr(r, 'ip_address', None)]
            if valid_ips:
                from collections import Counter
                ip_counts = Counter(valid_ips)
                # If any single IP accounts for > 40% of votes
                most_common_ip, count = ip_counts.most_common(1)[0]
                if count > len(ratings) * 0.4 and count > 2:
                    return True

        return False

    def _extract_claims(self, article: Article, db: Session):
        """
        Extract checkable claims from content using regex heuristics
        Examples: quotes, statistics, 'according to'
        """
        content = article.content
        
        # Regex for quotes
        quotes = re.findall(r'"([^"]*)"', content)
        
        # Regex for stats
        stats = re.findall(r'(\d+(?:%| percent| million| billion))', content)
        
        for quote in quotes:
            if len(quote.split()) > 5: # Only long enough quotes
                claim = Claim(
                    article_id=article.id,
                    claim_text=f"Quote: {quote[:450]}",
                    corroboration_count=0
                )
                db.add(claim)
                
        for stat in stats:
            claim = Claim(
                article_id=article.id,
                claim_text=f"Statistic: {stat} found in text",
                corroboration_count=0
            )
            db.add(claim)
        
        # Commit not needed here if called within compute_article_score transaction context 
        # but to be safe we can flush. compute_article_score usually doesn't flush.
        # We'll rely on the caller's commit.


class CredibilityScoreManager:
    """Manage and update credibility scores"""
    
    def __init__(self, db: Session):
        self.db = db
        self.engine = CredibilityEngine()
    
    def update_article_scores(self, article: Article) -> float:
        """Update article credibility scores"""
        score, status, is_suspicious = self.engine.compute_article_score(article, self.db)
        
        # Log the change
        old_score = article.overall_credibility
        
        article.overall_credibility = score
        article.credibility_status = status
        article.suspicious_activity_detected = is_suspicious
        
        # Apply soft lock if suspicious
        if is_suspicious:
            article.is_soft_locked = True
            article.soft_lock_reason = "Unusual voting activity detected"
        
        # Create audit log
        audit_log = AuditLog(
            article_id=article.id,
            old_score=old_score,
            new_score=score,
            reason=f"Auto-computed: {status}",
            is_admin_action=False
        )
        self.db.add(audit_log)
        
        self.db.commit()
        return score
    
    def recompute_user_credibility(self, user: User) -> float:
        """
        Recompute user credibility based on rating accuracy
        Compare user ratings to actual article scores
        """
        ratings = self.db.query(Rating).filter(Rating.user_id == user.id).all()
        
        if not ratings or len(ratings) < 5:
            return 50.0  # Need minimum sample
        
        # Check accuracy: how close user ratings are to actual scores
        accurate_ratings = 0
        for rating in ratings:
            article = rating.article
            difference = abs(rating.credibility_rating - article.overall_credibility)
            
            if difference < 10:  # Within 10 points = accurate
                accurate_ratings += 1
        
        accuracy_percentage = (accurate_ratings / len(ratings)) * 100
        
        # Map accuracy to credibility score (40-80 range)
        credibility = 40 + (accuracy_percentage / 100) * 40
        
        user.credibility_score = credibility
        self.db.commit()
        
        return credibility


# Demo scoring for articles
def demo_article_scores() -> Dict:
    """Generate demo credibility scores (for testing without ML models)"""
    return {
        "source_trust_score": random.uniform(30, 90),
        "nlp_score": random.uniform(40, 85),
        "community_score": random.uniform(35, 80),
        "cross_source_score": random.uniform(25, 95),
        "overall_credibility": random.uniform(45, 85)
    }
