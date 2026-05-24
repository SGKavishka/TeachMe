# TeachMe

TeachMe is a MERN stack tutor marketplace and e-learning platform. Students search for unavailable lessons, lectures, subjects, or topics and connect with teachers who can teach them online or physically.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS, Context API, Axios, Socket.io client
- Backend: Node.js, Express.js, Socket.io
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt password encryption, role-based middleware
- Roles: Student, Teacher/Tutor, Admin

## Project Structure

```text
frontend/   React app, pages, components, contexts, hooks, mocks, styles
backend/    Express API, models, controllers, routes, database, middleware, services
docs/       Folder structure, schema design, and REST API endpoint reference
```

Detailed references:

- [Folder structure](docs/folder-structure.md)
- [Schema design](docs/schema-design.md)
- [REST API endpoints](docs/api-endpoints.md)

## Core Features

- Student and teacher registration/login
- JWT protected routes and role-based access control
- Forgot/reset password flow
- Tutor profile creation with photo URL, bio, qualifications, subjects, topics, pricing, availability, and class modes
- Search and filters by subject, topic, teacher, category, location, mode, price, and rating
- Learning request bookings with accept/reject/complete flows
- Favorites, reviews, average rating calculation
- Student dashboard, teacher dashboard, admin dashboard
- Real-time messaging and notifications with Socket.io
- Responsive dark/light mode UI

## Getting Started

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB locally, then seed demo data:

```bash
npm run seed --prefix backend
```

4. Run the full stack:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5001/api`

## Demo Accounts

After running the seed script:

- Admin: `admin@teachme.local` / `Password123`
- Student: `student@teachme.local` / `Password123`
- Teacher examples: `ariana@teachme.local`, `daniel@teachme.local`, `maya@teachme.local` / `Password123`

## Implementation Steps

1. Backend foundation: configure Express, MongoDB connection, environment loading, security middleware, rate limiting, and error handling.
2. Data layer: define `users`, `students`, `teachers`, `subjects`, `topics`, `bookings`, `messages`, `notifications`, `reviews`, and `favorites`.
3. Authentication: register/login users, hash passwords with bcrypt, issue JWTs, and protect role-specific routes.
4. Marketplace API: expose tutor listing, tutor profile, search filters, student bookings, favorites, reviews, and teacher profile management.
5. Messaging: persist messages through REST and emit live message/notification events with Socket.io.
6. Admin panel: expose analytics, user management, and tutor moderation endpoints.
7. Frontend foundation: configure Vite, Tailwind, Axios, auth context, theme context, notification context, and protected routes.
8. UI pages: build home/search, tutor listing, tutor profile, student dashboard, teacher dashboard, messages, contact, about, FAQ, and admin dashboard.
9. Production hardening: set strong secrets, configure SMTP, add file upload storage for profile photos, add payment integration if sessions are paid inside the platform, and add automated tests.

## Notes

- The frontend includes demo tutor cards so the UI remains usable before MongoDB is seeded.
- Password reset emails are skipped unless SMTP variables are configured. In development, the reset token is returned in the API response.
- Profile photos currently accept URLs. For production uploads, add a storage service such as S3, Cloudinary, or local protected uploads.
