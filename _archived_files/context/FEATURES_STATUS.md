# Feature Implementation Status

Detailed analysis of features from `functionalities.txt` vs current codebase state.

## 🟢 Fully Implemented

### Authentication & Roles
1.  **User Authentication & Role-Based Access**: implemented with JWT, `User` model, and `auth` middleware.

### Article Ingestion & Sources
2.  **Hybrid Article Ingestion System**: API supports creating articles.
3.  **Source Metadata & Credibility**: `Source` model exists with credibility tracking. **[FIXED]** `SourceProfile` UI now connects to real backend data.

### Credibility Engine
4.  **Multi-Factor Credibility Scoring**: `CredibilityScoreManager` implements 4-factor algorithm.
5.  **Score Breakdown Visualization**: Pie chart present in `ArticleDetail`.
6.  **Credibility Status States**: Logic for `Under Review`, `Widely Corroborated`, `High Risk` exists.
7.  **Credibility Change Log (Audit Trail)**: `AuditLog` model tracks changes.
8.  **Soft Lock**: `is_soft_locked` logic exists. **[FIXED]** Admin UI now wired to `soft_lock` endpoint.

### Community Interaction
11. **User Credibility Profile**: `UserProfile` exists. **[FIXED]** Removed mock data, connects to `usersAPI`.
12. **Structured Commenting System**: `Comment` model has `reason` field.

### Anti-Manipulation
15. **Spam Detection**: `SuspiciousActivity` flags exist.
16. **Spammer Flagging**: Admin can flag users.
17. **Admin Moderation Dashboard**: **[FIXED]** Dashboard connected to real stats and endpoints.
18. **Admin Override**: **[FIXED]** UI connected to `override_score` endpoint with justification.

### Architecture
28. **Modular Architecture**: Frontend/Backend separated.
32. **End-to-End Prototype**: Core flow (Auth -> Feed -> Article -> Rate -> Admin) works.

## 🟡 Partially Implemented / Mismatch

9.  **Weighted User Opinions**: Logic exists in `CredibilityScoreManager` (uses `user.credibility_score`), but simple linear weighting.
10. **Category-Specific Credibility**: Database has `category_credibility` JSON, but scoring logic primarily uses global score.
13. **Post & Comment Voting**:
    *   **Post**: Implemented as **Slider (0-100)** instead of Up/Down binary.
    *   **Comment**: **MISSING**. Backend `Comment` model has no voting fields.
22. **Sensational Language Detection**: Implemented but **Rule-Based** (regex) only, not ML/AI.
23. **Fact-Based Content ID**: Basic regex heuristic.
25. **Credibility-Focused Visual Language**: Badges exist, but "Contextual Tooltips" (Feature 26) are minimal.

## 🔴 Not Implemented / Missing

14. **Misclassification Reporting System**: `Report` model exists, but "upheld/rejected" affects on reporter credibility is **NOT** implemented in scoring engine.
19. **Cross-Source Claim Extraction**: **MISSING**. `Claim` model exists but is empty; no extraction logic.
20. **Independent Source Corroboration**: **MISSING**. Depends on Claim Extraction.
21. **Source Corroboration Weighting**: **MISSING**.
24. **Fact vs Opinion Ratio**: **MISSING**.
26. **Contextual Media Literacy Tooltips**: **MISSING**.
29. **Background Processing Pipeline**: **MISSING**. Everything runs synchronously in API requests (e.g., scoring updates).
