# AGENTS.md

## AQODH Academy Development Agent Instructions

These instructions are mandatory for any AI coding agent working on the AQODH Academy online course platform.

The platform is for an online course on Ethical Computing. The system must support students, instructors, and administrators with secure authentication, course management, learning dashboards, assessments, payments, progress tracking, and certificate generation.

---

## 1. Core Development Principles

The agent must always follow these principles:

1. Build simple, clean, maintainable code.
2. Prefer reusable components over repeated code.
3. Use existing stable libraries instead of writing unnecessary custom logic.
4. Keep the codebase modular.
5. Follow security best practices from the beginning.
6. Never break existing functionality when adding new features.
7. Never create fake production logic unless clearly marked as temporary.
8. Every feature must respect role-based access control.
9. Every dashboard must be responsive.
10. All learning activities must remain inside the student dashboard.

---

## 2. Project Scope

The first version of AQODH Academy must include:

- Authentication
- Role-based dashboards
- Student learning dashboard
- Instructor course management
- Admin management dashboard
- Course modules
- Lessons
- PDF and PowerPoint uploads
- Video links
- Quizzes
- Assignments
- Auto-marking
- Progress tracking
- Payment status checking
- Certificate engine
- QR certificate verification

Do not add unnecessary features outside this scope unless explicitly requested.

---

## 3. Required User Roles

The system must support exactly these roles in V1:

```txt
ADMIN
INSTRUCTOR
STUDENT
```

### Student Can

- Register
- Login
- Enroll in a course
- Access student dashboard
- Continue learning
- View modules
- Watch videos
- Read PDFs
- Download PowerPoint files
- Take quizzes
- Submit assignments
- View progress
- Generate certificate when eligible

### Instructor Can

- Login
- View instructor dashboard
- Create modules
- Add lessons
- Upload PDFs
- Upload PowerPoint files
- Add video links
- Create quizzes
- Create assignments
- View submissions
- Review auto-marked work
- Override grades

### Admin Can

- Manage users
- Approve instructors
- Suspend users
- Manage courses
- Manage payments
- Manage certificate settings
- Use the system-provided AQODH logo
- Use the system-provided lecturer signatures
- Use the system-provided official seal
- Revoke certificates
- Regenerate certificates
- View reports

---

## 4. Authentication Rules

Authentication must be built first.

### Required Auth Features

- Register
- Login
- Logout
- Password hashing
- JWT or secure session authentication
- Protected routes
- Role-based redirects
- Current user endpoint
- Change password
- Forgot/reset password if possible in V1

### Backend Auth Routes

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Strict Auth Requirements

- Never store plain text passwords.
- Always hash passwords using bcrypt or an equivalent secure hashing library.
- Never expose password hashes in API responses.
- Never trust frontend role values.
- Always verify roles on the backend.
- Never allow unauthenticated access to protected dashboards.
- Never allow a student to access instructor or admin routes.
- Never allow an instructor to access admin routes.
- Always validate input before saving to the database.

---

## 5. Dashboard Layout Rules

The application must use a fixed header, fixed left sidebar, and responsive main content layout.

### Required Layout

```txt
HEADER
SIDEBAR | MAIN CONTENT
```

### Header Rules

- Header must stay fixed at the top.
- Header height should be 72px on desktop.
- Header must not overlap sidebar or content.
- Header must contain logo, title/search area, notifications, and profile menu.

### Sidebar Rules

- Sidebar must be fixed to the extreme left.
- Sidebar must begin below the header.
- Sidebar width should be 260px on desktop.
- Sidebar must not cover the header.
- Sidebar must not cover main content.
- Sidebar becomes a drawer on mobile.

### Main Content Rules

- Main content must start after the sidebar width.
- Main content must start below the header.
- No content should appear behind the sidebar.
- No content should appear behind the header.
- Cards and tables must stay inside the content area.
- Tables must be horizontally scrollable if needed.

### Do Not

- Do not use floating sidebars on desktop.
- Do not allow content to overlap.
- Do not allow cards to stretch outside the viewport.
- Do not create random routes for dashboard content.
- Do not open dashboard actions in uncontrolled browser tabs.

---

## 6. Student Dashboard Rules

The student must do all learning inside:

```txt
/student/dashboard
```

### Required Student Dashboard Sections

- Welcome card
- Progress card
- Continue Learning button
- Indexed module tabs
- Learning workspace
- Lesson viewer
- Quiz area
- Assignment area
- Certificate section

### Continue Learning Behavior

When the student clicks Continue Learning:

1. Fetch current course.
2. Fetch current module.
3. Fetch current lesson.
4. Fetch last unfinished activity.
5. Load the content inside the dashboard learning workspace.

The student must not be redirected to random pages.

### Module Tab Behavior

- Module tabs must be indexed.
- Clicking a module tab must only update the learning workspace.
- Tabs must not open new pages.
- Tabs must not open new browser tabs.
- Tabs must not reload the entire application.

### Lesson Types

The dashboard must support:

```txt
PDF preview
PowerPoint download
Video link player
Text lesson
Quiz
Assignment
```

### Do Not

- Do not send students to `/lesson/:id`.
- Do not send students to `/module/:id`.
- Do not send students to `/quiz/:id`.
- Do not send students to `/assignment/:id`.
- Do not make the student leave the dashboard for learning activities.

---

## 7. Instructor Dashboard Rules

The instructor dashboard must be available at:

```txt
/instructor/dashboard
```

### Required Instructor Sections

- Summary cards
- Course structure
- Quick actions
- Module manager
- Lesson manager
- Document upload
- Video link manager
- Quiz builder
- Assignment builder
- Student progress table
- Submissions table
- Grade review panel

### Instructor Content Upload

The instructor must be able to add:

```txt
PDF documents
PowerPoint PPT/PPTX files
Video links
Text lessons
Objective quizzes
Long-answer assignments
```

### Recommended Libraries

Use available packages to reduce codebase size:

```txt
react-hook-form
zod
react-dropzone
react-pdf
react-player
TanStack Table
Recharts
multer
Prisma
bcrypt
jsonwebtoken
pdf-lib
qrcode
```

### Assignment Marking

Objective questions must be auto-marked.

Long-answer questions may use keyword-based auto-marking in V1.

The instructor must always be able to override auto-generated grades.

### Do Not

- Do not build a complex custom document viewer for PowerPoint in V1.
- Do not write custom video player logic when react-player can handle it.
- Do not make auto-marking final without instructor override for long answers.
- Do not let instructors modify admin-only certificate rules unless permitted.

---

## 8. Admin Dashboard Rules

The admin dashboard must be available at:

```txt
/admin/dashboard
```

### Required Admin Sections

- Total users
- Total students
- Total instructors
- Total courses
- Payments summary
- Certificates issued
- User management
- Course settings
- Payment settings
- Certificate settings
- Reports

### Admin Controls

Admin must be able to:

- Create users
- Approve instructors
- Suspend users
- Reactivate users
- Change roles
- Set course price
- Mark course as free or paid
- Approve manual payments
- Manage certificate rules and system-provided certificate assets
- Revoke certificates
- Regenerate certificates

### Do Not

- Do not allow non-admin users to change certificate eligibility rules.
- Do not allow non-admin users to approve payments.
- Do not allow non-admin users to revoke certificates.

---

## 9. Course Structure Rules

The first course is:

```txt
Ethical Computing Fundamentals
```

### Required Modules

```txt
Module 1: Introduction to Ethical Computing
Module 2: Data Privacy and Digital Rights
Module 3: AI Ethics and Algorithm Accountability
Module 4: Cybersecurity Ethics
Module 5: Social Media and Digital Society
Module 6: Building Ethical Technologies
```

Each module should support:

- Video lesson
- PDF notes
- PowerPoint slides
- Quiz
- Assignment
- Discussion prompt if needed later

---

## 10. Progress Tracking Rules

The system must track:

- Current course
- Current module
- Current lesson
- Last activity
- Completed lessons
- Completed quizzes
- Completed assignments
- Overall progress percentage
- Final grade

### Progress Formula

```txt
Progress = completed required activities / total required activities * 100
```

### Do Not

- Do not calculate progress only on the frontend.
- Do not allow students to manually set progress.
- Do not mark a course complete until all required activities are complete.

---

## 11. Payment and Access Rules

The system must support:

```txt
FREE_COURSE
PAID_COURSE
MANUAL_APPROVAL
FULLY_PAID
PENDING_PAYMENT
```

Certificate access depends on course settings.

### Certificate Eligibility

A student can access a certificate only if:

1. Progress is 100%.
2. Final grade meets the minimum pass mark.
3. Course is free OR payment is complete OR admin approved access.
4. Certificate has not been revoked.

### Do Not

- Do not show certificate download before eligibility.
- Do not generate certificate before eligibility.
- Do not bypass payment checks on the frontend only.

---

## 12. Certificate Engine Rules

The certificate engine must generate a professional certificate PDF.

### Certificate Must Include

- AQODH logo
- AQODH Academy name
- Certificate title
- Student full name
- Course name
- Completion statement
- Final grade
- Completion date
- Issue date
- Certificate number
- QR code
- Verification link
- Instructor name
- Instructor signature
- Director/admin signature if available
- AQODH seal/stamp if available
- Certificate status

### Verification Route

```txt
/certificates/verify/:certificateNumber
```

### Certificate Status

```txt
VALID
REVOKED
PENDING
INVALID
```

### Do Not

- Do not generate duplicate certificates unnecessarily.
- Do not allow students to edit certificate data.
- Do not allow revoked certificates to verify as valid.
- Do not create unverifiable certificates.

---

## 13. Database Rules

Use a relational database such as PostgreSQL or MySQL.

Recommended ORM:

```txt
Prisma
```

### Core Tables

```txt
users
courses
modules
lessons
lesson_files
lesson_videos
quizzes
quiz_questions
quiz_attempts
assignments
assignment_questions
assignment_submissions
grades
payments
student_progress
certificates
announcements
settings
```

### Do Not

- Do not store file blobs in the database unless required.
- Store file paths or URLs instead.
- Do not duplicate user data across multiple tables unnecessarily.
- Do not create unstructured data when relational structure is needed.

---

## 14. API Rules

All API endpoints must:

- Validate input.
- Return consistent JSON.
- Use proper HTTP status codes.
- Enforce authentication.
- Enforce role permissions.
- Handle errors gracefully.
- Avoid exposing sensitive data.

### Do Not

- Do not expose stack traces to users.
- Do not return password hashes.
- Do not trust client-side role checks.
- Do not create endpoints without authorization middleware.

---

## 15. UI/UX Rules

Use a clean professional style suitable for AQODH Academy.

### Brand Style

Use:

```txt
AQODH Blue
AQODH Gold
White
Light Gray
Dark Gray
```

### UI Requirements

- Responsive design
- Clean spacing
- Clear buttons
- Accessible contrast
- Consistent cards
- Consistent forms
- Consistent tables
- Clear error messages
- Loading states
- Empty states

### Do Not

- Do not use childish designs.
- Do not use fake-looking gradients everywhere.
- Do not overload pages with colors.
- Do not use inconsistent button styles.
- Do not hide important actions.

---

## 16. Security Rules

The agent must follow secure development practices.

### Required

- Password hashing
- Input validation
- Authorization middleware
- Secure file upload validation
- File type restrictions
- Rate limiting for auth routes if possible
- Environment variables for secrets
- No secrets in the repository
- Proper CORS configuration

### File Upload Security

Allowed file types:

```txt
.pdf
.ppt
.pptx
.doc
.docx
.mp4 optional
```

### Do Not

- Do not allow executable file uploads.
- Do not expose upload directories without control.
- Do not hardcode secrets.
- Do not store JWT secrets in source code.
- Do not disable security checks to make code work faster.

---

## 17. Development Workflow

The agent must work in small safe steps.

### Required Order

1. Authentication
2. Role-based routing
3. Dashboard layout
4. Course structure
5. Lesson system
6. File uploads
7. Video links
8. Quiz system
9. Assignment system
10. Progress tracking
11. Payment status
12. Certificate engine
13. Reports

### Before Editing

The agent should inspect existing files before making changes.

### After Editing

The agent should:

- Run linting if available.
- Run tests if available.
- Check for build errors.
- Summarize changed files.
- Explain how to test the feature.

### Do Not

- Do not rewrite the entire project without permission.
- Do not delete existing working code.
- Do not rename major folders without permission.
- Do not install unnecessary dependencies.
- Do not introduce breaking changes silently.

---

## 18. Code Quality Rules

Code must be:

- Modular
- Readable
- Typed where possible
- Validated
- Reusable
- Secure
- Commented only where useful

### Do Not

- Do not write huge files with unrelated logic.
- Do not mix frontend and backend logic.
- Do not repeat the same layout code everywhere.
- Do not create unused components.
- Do not leave console logs in production code.
- Do not leave TODOs for critical security features.

---

## 19. Testing Rules

The agent should test:

- Register
- Login
- Logout
- Protected routes
- Role redirects
- File uploads
- Quiz auto-marking
- Assignment submission
- Progress updates
- Certificate eligibility
- Certificate verification

### Do Not

- Do not mark a task complete without testing.
- Do not assume a route works without checking it.
- Do not skip auth testing.

---

## 20. Final Rule

The system must always support the AQODH Academy mission:

```txt
Building Technology That Protects Humanity
```

Every technical decision should support trust, ethical learning, privacy, security, accountability, and professional digital education.
