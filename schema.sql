CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(24) UNIQUE NOT NULL CHECK (name IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(220) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(24) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  status VARCHAR(24) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ACTIVE', 'PENDING', 'SUSPENDED')),
  phone VARCHAR(40),
  profile_photo_url TEXT,
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  duration_weeks INTEGER NOT NULL,
  level VARCHAR(80) NOT NULL,
  mode VARCHAR(80) NOT NULL,
  price_student_ugx INTEGER NOT NULL,
  price_professional_ugx INTEGER NOT NULL,
  certificate_enabled BOOLEAN NOT NULL DEFAULT true,
  is_free BOOLEAN NOT NULL DEFAULT false,
  require_full_payment_for_certificate BOOLEAN NOT NULL DEFAULT true,
  require_manual_certificate_approval BOOLEAN NOT NULL DEFAULT true,
  minimum_certificate_pass_mark INTEGER NOT NULL DEFAULT 60,
  certificate_design_settings JSONB NOT NULL DEFAULT '{}',
  aqodh_logo_url TEXT,
  official_seal_url TEXT,
  created_by BIGINT REFERENCES users(id)
);

CREATE TABLE modules (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  position INTEGER NOT NULL,
  summary TEXT
);

CREATE TABLE lessons (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  lesson_type VARCHAR(48) NOT NULL DEFAULT 'Text Lesson',
  content_url TEXT,
  body TEXT,
  position INTEGER NOT NULL,
  publish_status VARCHAR(32) NOT NULL DEFAULT 'Draft'
);

CREATE TABLE lesson_files (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  file_type VARCHAR(24) NOT NULL CHECK (file_type IN ('PDF', 'PPT', 'PPTX', 'DOC', 'DOCX')),
  file_url TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lesson_videos (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  video_url TEXT NOT NULL,
  provider VARCHAR(80) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE enrollments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE TABLE quizzes (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  passing_score INTEGER NOT NULL DEFAULT 70
);

CREATE TABLE quiz_questions (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type VARCHAR(48) NOT NULL CHECK (question_type IN ('Multiple Choice', 'True / False', 'Short Objective Answer')),
  prompt TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assignments (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  instructions TEXT NOT NULL,
  submission_type VARCHAR(32) NOT NULL DEFAULT 'Typed answer',
  rubric TEXT,
  due_at TIMESTAMPTZ
);

CREATE TABLE assignment_questions (
  id BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  expected_keywords TEXT[] NOT NULL DEFAULT '{}',
  max_marks INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  auto_score NUMERIC(5,2),
  matched_keywords TEXT[] NOT NULL DEFAULT '{}',
  missing_keywords TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(32) NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE grades (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  item_type VARCHAR(32) NOT NULL,
  item_id BIGINT NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  auto_score NUMERIC(5,2),
  instructor_override BOOLEAN NOT NULL DEFAULT false,
  feedback TEXT,
  graded_by BIGINT REFERENCES users(id)
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount_ugx INTEGER NOT NULL,
  provider VARCHAR(80) NOT NULL,
  status VARCHAR(32) NOT NULL,
  paid_at TIMESTAMPTZ
);

CREATE TABLE certificates (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number VARCHAR(80) UNIQUE NOT NULL,
  final_grade NUMERIC(5,2) NOT NULL,
  lecturer_name VARCHAR(160) NOT NULL,
  lecturer_signature_url TEXT,
  director_name VARCHAR(160),
  director_signature_url TEXT,
  seal_url TEXT,
  qr_code_url TEXT,
  verification_url TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked', 'pending', 'invalid')),
  certificate_url TEXT,
  approved_by BIGINT REFERENCES users(id),
  revoked_at TIMESTAMPTZ,
  revoked_by BIGINT REFERENCES users(id),
  regenerated_from BIGINT REFERENCES certificates(id),
  issued_at TIMESTAMPTZ,
  UNIQUE (user_id, course_id)
);

CREATE TABLE certificate_verification_logs (
  id BIGSERIAL PRIMARY KEY,
  certificate_id BIGINT REFERENCES certificates(id) ON DELETE SET NULL,
  certificate_number VARCHAR(80) NOT NULL,
  status VARCHAR(32) NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address VARCHAR(80),
  user_agent TEXT
);

CREATE TABLE ai_insights (
  id BIGSERIAL PRIMARY KEY,
  insight_type VARCHAR(48) NOT NULL CHECK (insight_type IN (
    'SYSTEM_SUMMARY',
    'STUDENT_RISK',
    'COURSE_PERFORMANCE',
    'PAYMENT_RISK',
    'CERTIFICATE_READINESS',
    'INSTRUCTOR_ACTIVITY',
    'CONTENT_GAP',
    'SECURITY_ALERT'
  )),
  title VARCHAR(220) NOT NULL,
  summary TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  priority VARCHAR(24) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status VARCHAR(24) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'REVIEWED', 'DISMISSED', 'ARCHIVED')),
  related_entity_type VARCHAR(80),
  related_entity_id VARCHAR(120),
  generated_by VARCHAR(80) NOT NULL DEFAULT 'PYTHON_RULES_V1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by BIGINT REFERENCES users(id)
);

CREATE TABLE ai_suggestion_logs (
  id BIGSERIAL PRIMARY KEY,
  insight_id BIGINT REFERENCES ai_insights(id) ON DELETE SET NULL,
  admin_id BIGINT REFERENCES users(id),
  action VARCHAR(32) NOT NULL CHECK (action IN ('VIEWED', 'REVIEWED', 'DISMISSED', 'TASK_CREATED', 'GENERATED', 'AI_SERVICE_FALLBACK')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  author_id BIGINT NOT NULL REFERENCES users(id),
  title VARCHAR(220) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
