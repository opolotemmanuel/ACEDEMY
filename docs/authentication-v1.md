# AQODH Authentication V1

Authentication V1 establishes the account, login, session, role access, profile, and admin user-management foundation for AQODH Academy.

## 1. User Module

Users:

```txt
Admin
Instructor
Student
```

Fields:

```txt
id
fullName
email
passwordHash
role
status
createdAt
updatedAt
```

Status values:

```txt
ACTIVE
PENDING
SUSPENDED
```

## 2. Auth Module

Features:

```txt
Register
Login
Logout
Forgot Password
Reset Password
Change Password
Email Verification optional for V1
```

## 3. Role-Based Access Module

Rules:

```txt
Student -> /student/dashboard
Instructor -> /instructor/dashboard
Admin -> /admin/dashboard
```

Protected routes:

```txt
Only admin accesses admin pages
Only instructor accesses instructor pages
Only student accesses student pages
```

## 4. Profile Module

Features:

```txt
View profile
Edit name
Edit phone optional
Change password
Upload profile photo optional
```

## 5. Admin User Management Module

Admin can:

```txt
View all users
Create instructor
Approve instructor
Suspend user
Reactivate user
Change user role
Reset user password
```

## Recommended Stack

```txt
Frontend: React
Backend: Node.js + Express
Database: PostgreSQL/MySQL
ORM: Prisma
Password hashing: bcrypt
Token: JWT
Validation: Zod
Forms: React Hook Form
```

## Authentication Flow

```txt
User registers
↓
Password is hashed using bcrypt
↓
User is saved in database
↓
User logs in
↓
System checks email + password
↓
JWT token is generated
↓
Token is stored securely
↓
System redirects user by role
```

## Backend Routes Needed

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
GET  /api/auth/me
```

## Admin User Routes

```txt
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/status
```

## Frontend Pages

```txt
/login
/register
/forgot-password
/reset-password
/student/dashboard
/instructor/dashboard
/admin/dashboard
/profile
```

## First Development Order

```txt
1. Database user model
2. Register API
3. Login API
4. JWT middleware
5. Role middleware
6. React login/register pages
7. Protected routes
8. Role-based redirect
9. Admin user management
10. Profile page
```

The current prototype implements this as a localStorage-backed V1 demo. The production backend should replace demo hashes with bcrypt, demo sessions with JWT/session storage, and localStorage persistence with PostgreSQL/MySQL through Prisma.
