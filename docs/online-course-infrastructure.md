# AQODH Online Course Infrastructure

This document describes the infrastructure and system workflow for launching the first AQODH Academy online course: **Ethical Computing Fundamentals**.

## 1. Main System Users

```txt
Admin
Instructor
Student
```

## 2. Main System Modules

```txt
User Management
Course Management
Module Management
Lesson Management
Video Management
Document Management
Quiz Management
Assignment Management
Payment Management
Progress Tracking
Certificate Engine
Notification System
Reports & Analytics
```

## 3. Student Flow

```txt
Student registers
↓
Student logs in
↓
Student enrolls in Ethical Computing Fundamentals
↓
System checks payment/free access
↓
Student dashboard opens
↓
Student clicks Continue Learning
↓
System loads current module inside dashboard
↓
Student watches videos / reads PDFs / downloads PPTs
↓
Student takes quizzes
↓
Student submits assignments
↓
System tracks progress
↓
Student reaches 100%
↓
System checks certificate eligibility
↓
Certificate is generated
↓
Student reviews and downloads certificate
```

## 4. Instructor Flow

```txt
Instructor logs in
↓
Creates course modules
↓
Adds lessons
↓
Uploads PDFs / PowerPoint files
↓
Adds video links
↓
Creates quizzes
↓
Creates assignments
↓
Publishes content
↓
Views student progress
↓
Reviews submissions
↓
Overrides grades if needed
```

## 5. Admin Flow

```txt
Admin logs in
↓
Manages users
↓
Approves instructors
↓
Creates courses
↓
Sets course price/free status
↓
Manages payments
↓
Controls certificate rules
↓
Views reports
↓
Revokes/regenerates certificates
```

For the current V1 demo, the AQODH logo, lecturer signature, director/admin signature, and official seal are built into the system automatically.

## 6. Course Structure

### Course

```txt
Ethical Computing Fundamentals
```

### Modules

```txt
Module 1: Introduction to Ethical Computing
Module 2: Data Privacy and Digital Rights
Module 3: AI Ethics and Algorithm Accountability
Module 4: Cybersecurity Ethics
Module 5: Social Media and Digital Society
Module 6: Building Ethical Technologies
```

Each module contains:

```txt
Video Lesson
PDF Notes
PowerPoint Slides
Quiz
Assignment
Discussion Prompt
```

## 7. Student Dashboard Working Model

Route:

```txt
/student/dashboard
```

The student should not leave the dashboard while learning.

Inside the dashboard:

```txt
Welcome Card
Progress Card
Continue Learning Button
Module Tabs
Learning Workspace
Quiz Area
Assignment Area
Certificate Section
```

### Continue Learning

When clicked:

```txt
Fetch currentModuleId
Fetch currentLessonId
Fetch lastActivity
Load content inside dashboard
```

Example:

```txt
Student stopped at Module 2, Lesson 3

Next login:
Continue Learning opens Module 2, Lesson 3 directly
```

## 8. Instructor Dashboard Working Model

Route:

```txt
/instructor/dashboard
```

Sections:

```txt
Course Summary Cards
Course Structure
Quick Actions
Student Progress Table
Pending Submissions
Content Upload Area
```

Instructor can add:

```txt
PDF
PowerPoint
Video link
Text lesson
Objective quiz
Long-answer assignment
```

## 9. Admin Dashboard Working Model

Route:

```txt
/admin/dashboard
```

Sections:

```txt
Total Students
Total Courses
Revenue
Certificates Issued
Pending Payments
Pending Certificates
System Reports
```

Admin controls:

```txt
Course price
Free/paid access
Certificate eligibility
Instructor permissions
Student access
Platform settings
```

## 10. System Architecture

```txt
Frontend
React + Tailwind CSS

Backend
Node.js + Express

Database
PostgreSQL or MySQL

File Storage
Local server storage first
Cloud storage later

Authentication
JWT / Session login

Certificate Engine
PDF generator + QR code

Payment
Mobile Money / Flutterwave / manual approval first
```

## 11. Main Database Tables

```txt
users
roles
courses
modules
lessons
lesson_files
lesson_videos
quizzes
quiz_questions
quiz_attempts
assignments
assignment_submissions
grades
payments
student_progress
certificates
announcements
settings
```

## 12. Progress Tracking Logic

The system records:

```txt
Completed lessons
Completed quizzes
Completed assignments
Current module
Current lesson
Overall percentage
Final grade
Last activity
```

Progress formula:

```txt
Progress = completed activities / total activities x 100
```

## 13. Certificate Engine

Certificate appears only when:

```txt
Progress = 100%
Final grade >= pass mark
Payment cleared OR course is free OR admin approved
Certificate is not revoked
```

Certificate includes:

```txt
Student name
Course name
Completion date
Final grade
Certificate number
AQODH logo
Lecturer signature
Director/admin signature
Official seal/stamp
QR code
Verification link
Certificate status
```

Verification route:

```txt
/certificates/verify/AQODH-ECF-2026-0001
```

## 14. V1 Development Priority

Build in this order:

```txt
1. Authentication
2. Role-based dashboards
3. Course/module/lesson system
4. Student dashboard learning workspace
5. Quiz system
6. Assignment system
7. Progress tracking
8. Payment approval
9. Certificate engine
10. Reports and analytics
```

This infrastructure is enough to launch the first AQODH online ethical computing course professionally.
