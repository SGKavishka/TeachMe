# Folder Structure

```text
teachme-mern-platform/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── controllers/
│   │   ├── database/
│   │   │   ├── connect.js
│   │   │   └── seed.js
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── tutors/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── mocks/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── api-endpoints.md
│   ├── folder-structure.md
│   └── schema-design.md
├── package.json
└── README.md
```

The backend is separated by responsibility: routes only define HTTP surfaces, controllers handle request logic, models define MongoDB collections, services handle reusable integrations, middleware handles cross-cutting request behavior, database connection and seed logic live under `database/`, and Socket.io is isolated under `socket/`.

The frontend separates application state (`context`), API access (`api`), reusable UI (`components`), routes (`pages`), mock/demo data (`mocks`), global styles (`styles`), and small reusable hooks (`hooks`).

## Placement Guide

- `backend/src/config`: environment variables and application configuration.
- `backend/src/database`: MongoDB connection setup, seed scripts, and future migrations.
- `backend/src/models`: Mongoose schemas and indexes.
- `backend/src/controllers`: request handlers and route-level business logic.
- `backend/src/routes`: Express route declarations and middleware composition.
- `backend/src/services`: reusable integrations such as email, tokens, notifications, storage, and payments.
- `backend/src/middleware`: authentication, authorization, validation, error handling, and rate limiting.
- `backend/src/utils`: small pure helpers shared across backend modules.
- `backend/src/socket`: Socket.io server setup and real-time event handlers.
- `frontend/src/api`: Axios client and API-specific helpers.
- `frontend/src/components/common`: reusable design-system components such as buttons, inputs, badges, cards, and protected routes.
- `frontend/src/components/layout`: navigation, footer, dashboard shell, and page layout components.
- `frontend/src/components/<domain>`: domain-specific reusable UI such as tutor cards and chat windows.
- `frontend/src/context`: React context providers for auth, theme, and notifications.
- `frontend/src/hooks`: reusable React hooks.
- `frontend/src/mocks`: demo data and local placeholders.
- `frontend/src/pages`: route-level page components.
- `frontend/src/styles`: global CSS and Tailwind entry files.
