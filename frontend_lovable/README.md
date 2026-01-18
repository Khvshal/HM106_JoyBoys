# HackMatrix Frontend

The frontend interface for HackMatrix, built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Charts**: Recharts
- **API Client**: Axios

## Project Structure

```
src/
├── components/     # Reusable UI components (ArticleCard, CredibilityScore, Header, etc.)
├── pages/          # Route pages (Index, ArticleDetail, SourceProfile, AdminDashboard)
├── services/       # API integration (api.ts)
├── hooks/          # Custom hooks
├── lib/            # Utilities
└── types/          # TypeScript definitions
```

## Key Features

- **Credibility Feed**: Displays articles with credibility badges and scores.
- **Article Analysis**: Detailed breakdown of credibility factors (Source, NLP, Community, Cross-Source).
- **User Profile**: Track personal credibility score and voting history.
- **Admin Dashboard**: Moderation tools for soft-locking articles and overriding scores.
- **Source Profiles**: Deep dive into source reliability and metrics.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## API Configuration

Ensure the backend is running on `http://localhost:8000`.
Configure the API URL in `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```
