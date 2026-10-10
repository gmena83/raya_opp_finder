# Security & Data Management Audit Summary: `raya_opp_finder`

## Executive Summary
This document summarizes the comprehensive security and data management audit conducted on the `raya_opp_finder` codebase. The scope of this audit covers front-end React architecture, environment configurations, API integrations, data handling patterns, and external communication vectors.

---

## Key Findings & Security Vulnerability Assessment

### 1. API Keys & Secrets Exposure
- **Current State**: No hardcoded production API keys, database passwords, or JWT secrets were found in source files or version control (`.env.example` contains only placeholder structure `https://your-n8n.instance/webhook/grant-bot`).
- **Risk Level**: **Low (Development)** / **Medium (Production Deployment)**.
- **Details**:
  - Environment variables are referenced via Vite's `import.meta.env` (`VITE_API_MODE`, `VITE_N8N_WEBHOOK_URL`, `VITE_GOOGLE_SHEETS_ID`).
  - Vite embeds all `VITE_*` variables directly into client-side JS bundles during build time (`npm run build`).
  - **Mitigation Recommendation**: Ensure no private secrets (e.g. n8n service keys, database passwords, LLM provider API keys) are prefixed with `VITE_` or included in frontend client builds. All sensitive backend calls must go through backend API gateways or authenticated Edge Functions.

### 2. Unauthenticated API Endpoints & CORS Risks
- **Current State**: `src/services/api.ts` connects directly to `VITE_N8N_WEBHOOK_URL` endpoints without client-side authentication headers (`Authorization: Bearer <token>`).
- **Risk Level**: **High (if webhook endpoints are exposed publicly)**.
- **Details**:
  - Endpoints such as `${N8N_WEBHOOK_URL}/submit`, `/opportunities`, `/drafts`, `/research` do not attach OAuth tokens, JWTs, or API keys.
  - If n8n webhooks are configured with public access, any unauthorized user could trigger workflows, query sensitive grant application drafts, or initiate web scraping jobs.
  - **Mitigation Recommendation**: Implement JWT-based or API-key based header authentication (`Authorization: Bearer <token>`) for all webhook requests in `src/services/api.ts`. Restrict CORS origins on the n8n instance strictly to authorized frontend domains.

### 3. Sensitive Business & PII Data Exposure in Mock Datasets
- **Current State**: The codebase contains realistic mock data representing business financials, employee numbers, and grant answers (`src/services/api.ts`, `src/services/marketMockData.ts`).
- **Risk Level**: **Low-Medium**.
- **Details**:
  - Mock datasets include mock financial figures (`$4.2M revenue`), company employee counts (`12 employees`), product margins, and legal complaint summaries.
  - While mock data is safe for local UI previewing, fallback mock data embedded in production JS bundles can expose proprietary business metrics to public inspection if bundle splitting or environment conditional stripping is not enforced.
  - **Mitigation Recommendation**: Ensure `VITE_API_MODE=live` completely bypasses mock data inclusions in production environments, or sanitize mock data to purely generic placeholders.

### 4. Direct External Link Leakage & Referrer Headers
- **Current State**: Direct Google Drive, Google Sheets, and Grants.gov links are embedded in mock data and rendered as clickable `<a>` links.
- **Risk Level**: **Low-Medium**.
- **Details**:
  - Links to sensitive documents (e.g., `https://drive.google.com/file/d/...`, `https://docs.google.com/spreadsheets/d/...`) must be protected by proper access control lists (ACLs) in Google Workspace.
  - External links without `rel="noopener noreferrer"` can leak referrer headers or allow target page window manipulation.
  - **Mitigation Recommendation**: Ensure all external links in components render with `target="_blank" rel="noopener noreferrer"`. Enforce strict Google Drive / Sheets permissions (restricted access to authorized organizational emails only).

### 5. Data Sanitation & Input Handling
- **Current State**: React JSX auto-escaping protects against basic Reflected XSS. No usages of `dangerouslySetInnerHTML`, `eval()`, or `document.cookie` were detected in `src/`.
- **Risk Level**: **Low**.
- **Details**:
  - Frontend input forms (`Submit Opportunity URL`) perform URL string trimming but lack strict URL scheme validation (`http:` or `https:` protocol checks) before submitting to the workflow handler.
  - **Mitigation Recommendation**: Add client-side URL validation (`new URL(inputUrl)`) and scheme verification (`['http:', 'https:'].includes(url.protocol)`) prior to triggering workflow submission.

---
