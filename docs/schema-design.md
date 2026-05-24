# MongoDB Schema Design

## users
- `name`, `email`, `phone`
- `password` encrypted with bcrypt
- `role`: `student`, `teacher`, `admin`
- `avatar`, `status`, `lastLoginAt`
- password reset token fields

## students
- `user` reference to `users`
- `level`, `institution`, `interests`, `learningGoals`
- `location`

## teachers
- `user` reference to `users`
- `headline`, `bio`, `photo`
- `qualifications`, `experienceYears`
- `subjects`: subject, category, topics
- `pricing`: hourly rate and currency
- `availability`: day, start, end
- `classModes`: online and physical flags
- `location`, `contact`
- `ratingAverage`, `ratingCount`
- `profileStatus`, `isVerified`

## subjects
- `name`, `category`, `description`, `isActive`

## topics
- `subject` reference to `subjects`
- `name`, `slug`, `description`

## bookings
- `student` reference to `users`
- `teacher` reference to `teachers`
- `subject`, `topic`, `mode`
- `preferredSchedule`, `message`
- `status`: pending, accepted, rejected, completed, cancelled
- `price`, `notes`

## messages
- `conversationId`
- `sender`, `receiver` references to `users`
- optional `booking`
- `body`, `readAt`

## notifications
- `user` reference to `users`
- `type`, `title`, `body`
- `metadata`, `isRead`

## reviews
- `student` reference to `users`
- `teacher` reference to `teachers`
- optional `booking`
- `rating`, `comment`

## favorites
- `student` reference to `users`
- `teacher` reference to `teachers`
- unique compound index for one favorite per student and teacher

