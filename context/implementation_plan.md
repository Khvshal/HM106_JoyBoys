# Implementation Plan - UI Connectivity Fixes

## Goal
Connect isolated UI components to the backend API to ensure "End-to-End" functionality as requested. Focus on `AdminDashboard` actions and `SourceProfile` data fetching.

## Proposed Changes

### Frontend (`frontend_lovable`)

#### [MODIFY] [AdminDashboard.tsx](file:///c:/Users/Admin/Downloads/Hackathon/frontend_lovable/src/pages/AdminDashboard.tsx)
-   **Lock Article**: Call `adminAPI.softLock` (need to verify if this exists or add it).
-   **Unlock Article**: Call `adminAPI.removeSoftLock` (exists).
-   **Override Score**: Call `adminAPI.overrideScore` (exists).
-   *Note*: The current `api.ts` has `removeSoftLock` but might miss `softLock` (which is often just a backend flag but maybe exposed as an action). I will check `admin.py` to see if there is an explicit lock endpoint or if I need to use `overrideScore` or similar.

#### [MODIFY] [SourceProfile.tsx](file:///c:/Users/Admin/Downloads/Hackathon/frontend_lovable/src/pages/SourceProfile.tsx)
-   Remove `mockSources`, `mockArticles`.
-   Use `api.get('/sources/{id}')` (need to check if `sourcesAPI` exists in `api.ts` or add it).
-   Use `articlesAPI.getAll({ source_id: id })` or similar to fetch source-specific articles.

#### [MODIFY] [api.ts](file:///c:/Users/Admin/Downloads/Hackathon/frontend_lovable/src/services/api.ts)
-   Add `sourcesAPI` objects if missing:
    -   `getById(id)`
    -   `getTrend(id)` (if available, otherwise mock or calculate from articles).
-   Add `softLock` endpoint to `adminAPI` if missing.

### Backend (`hackmatrix-backend`)

#### [VERIFY] [admin.py](file:///c:/Users/Admin/Downloads/Hackathon/hackmatrix-backend/admin.py)
-   Ensure `POST /admin/{article_id}/soft-lock` exists.

#### [VERIFY] [main.py] or [sources.py]
-   Ensure `GET /sources/{id}` exists. I recall `SourceResponse` schema but need to check if the route exists.

## Verification Plan

### Automated
-   None (UI heavy).

### Manual
1.  **Admin Dashboard**:
    -   Login as Admin.
    -   Click "Lock" on an article -> Verify toast and persistence on refresh.
    -   Click "Override" -> Verify score update persists.
2.  **Source Profile**:
    -   Click a source name from an article.
    -   Verify Source Profile loads with real name/score (not "The Daily Truth" mock).
    -   Verify "Recent Articles" list shows actual articles from that source.
