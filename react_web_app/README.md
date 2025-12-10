# Python Snippet Manager (React)

A lightweight React app to manage Python questions and code snippets with a clean, modern UI.

## Overview

- Add questions with description and Python code
- Expand/collapse cards to view details
- Copy code to clipboard
- Edit in place and delete
- Persists to browser localStorage by default
- API-ready data service abstraction

Runs on port 3000 using the existing preview system.

## Getting Started

Install and start:

- npm install
- npm start

Open http://localhost:3000 to view in your browser.

## Usage

- Fill in the "Question title" and "Code (Python)" fields (both required).
- Optionally add a description.
- Click Add to create a new snippet. It will appear in the list below.
- Use Expand to see details and the code block with a Copy button.
- Click Edit to populate the form; Save updates the selected snippet. Cancel exits edit mode.
- Click Delete to remove a snippet.

All snippets are saved under the localStorage key snippet_items_v1.

## Data Service & Environment Variables

By default, data persists to localStorage. The app includes an abstraction layer to switch to a REST API without changing UI components.

Environment variables read at build time:
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

API usage is enabled automatically if either REACT_APP_API_BASE or REACT_APP_BACKEND_URL is set (non-empty). Expected endpoints (for future integration):
- GET    /snippets
- POST   /snippets
- PUT    /snippets/:id
- DELETE /snippets/:id

If no API is available, localStorage is used and nothing else is required.

## Styling

- Light theme with primary #3b82f6 and accent #06b6d4
- Minimal dependencies (vanilla CSS)
- Monospace code block with Copy button

## Notes

- Do not modify the preview start/stop system; this app already runs on port 3000.
- This project uses React functional components and hooks only.

## License

MIT
