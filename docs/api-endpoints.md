# REST API Endpoints

Base URL: `http://localhost:5000/api`

## Auth
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register student or teacher |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Authenticated | Current user |
| POST | `/auth/forgot-password` | Public | Create reset token and send email |
| PATCH | `/auth/reset-password/:token` | Public | Update password |

## Teachers
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/teachers` | Public | Search/filter tutors |
| GET | `/teachers/:id` | Public | Tutor profile and reviews |
| GET | `/teachers/me` | Teacher | Own tutor profile |
| PATCH | `/teachers/me` | Teacher | Update tutor profile |

## Students
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/students/dashboard` | Student | Student dashboard data |
| PATCH | `/students/profile` | Student | Update student profile |

## Bookings
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/bookings` | Authenticated | Current user's bookings |
| POST | `/bookings` | Student | Send learning request |
| PATCH | `/bookings/:id/status` | Teacher/Admin | Accept, reject, or complete request |
| PATCH | `/bookings/:id/cancel` | Student/Admin | Cancel request |

## Messages
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/messages/:userId` | Authenticated | Conversation with a user |
| POST | `/messages` | Authenticated | Send persisted message |

Socket.io events:
- Client emits `message:send`
- Server emits `message:new`
- Server emits `notification:new`

## Reviews
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/reviews/teacher/:teacherId` | Public | Tutor reviews |
| POST | `/reviews` | Student | Add review after completed booking |

## Favorites
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/favorites` | Student | Saved tutors |
| POST | `/favorites/:teacherId` | Student | Toggle saved tutor |

## Notifications
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/notifications` | Authenticated | Notification list |
| PATCH | `/notifications/:id/read` | Authenticated | Mark read |

## Subjects and Topics
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/subjects` | Public | List subjects |
| GET | `/subjects/:subjectId/topics` | Public | List subject topics |
| POST | `/subjects` | Admin | Create subject |
| POST | `/subjects/:subjectId/topics` | Admin | Create topic |

## Admin
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/admin/analytics` | Admin | Dashboard analytics |
| GET | `/admin/users` | Admin | Manage users |
| PATCH | `/admin/users/:id/status` | Admin | Block or activate account |
| PATCH | `/admin/teachers/:id/moderation` | Admin | Verify/block tutor profile |

