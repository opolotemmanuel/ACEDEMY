# AQODH Academy Course Platform

First-version online course platform prototype for **Ethical Computing Fundamentals**.

## What is included

- Public landing page with hero, course overview, module preview, pricing, and footer.
- Student registration/login demo and dashboard.
- Instructor dashboard for learners, content, submissions, and announcements.
- Instructor Dashboard V1 with module creation, lesson forms, document upload UI, video link UI, objective quiz auto-marking, keyword-based long-answer marking, submission review, and manual grade override.
- Admin dashboard for users, payments, certificates, reports, and analytics.
- Certificate unlock simulation after completion.
- PostgreSQL-ready MVP schema in `schema.sql`.
- System infrastructure and workflow documentation in `docs/online-course-infrastructure.md`.
- Authentication V1 documentation in `docs/authentication-v1.md`.

## Run locally

Run the local server:

```bash
npm start
```

Then open:

```txt
http://localhost:3000
```

Opening `index.html` directly still works for the static prototype, but the Authentication V1 API is available through the local Node server.

## Next backend step

Use `schema.sql` as the production database shape, then replace the file-backed V1 API with Express, Prisma, bcrypt, JWT secret management, payment provider webhooks, and production certificate storage.
