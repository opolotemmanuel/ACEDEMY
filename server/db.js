const fs = require("fs");
const path = require("path");
const { hashPassword } = require("./auth");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "auth-db.json");
const COURSE_ID = "course_ethical_computing_fundamentals";

function now() {
  return new Date().toISOString();
}

function createDefaultDb() {
  const timestamp = now();
  const lmsData = createDefaultLmsData(timestamp);
  if (process.env.NODE_ENV === "production") {
    const email = String(process.env.BOOTSTRAP_ADMIN_EMAIL || "").trim().toLowerCase();
    const password = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || "");
    const fullName = String(process.env.BOOTSTRAP_ADMIN_NAME || "AQODH Admin").trim();

    if (!email || password.length < 12) {
      throw new Error("BOOTSTRAP_ADMIN_EMAIL and a 12+ character BOOTSTRAP_ADMIN_PASSWORD are required for first production startup");
    }

    return {
      users: [
        {
          id: "usr_admin",
          fullName,
          email,
          passwordHash: hashPassword(password),
          role: "admin",
          status: "ACTIVE",
          phone: "",
          profilePhotoUrl: "",
          emailVerifiedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      revokedTokens: [],
      authSessions: [],
      authEvents: [],
      passwordResets: [],
      emailVerificationTokens: [],
      ...lmsData,
    };
  }

  return {
    users: [
      {
        id: "usr_admin",
        fullName: "AQODH Admin",
        email: "admin@aqodh.academy",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        status: "ACTIVE",
        phone: "+256 700 000 001",
        profilePhotoUrl: "",
        emailVerifiedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "usr_instructor",
        fullName: "Dr. Miriam Achieng",
        email: "instructor@aqodh.academy",
        passwordHash: hashPassword("instructor123"),
        role: "instructor",
        status: "ACTIVE",
        phone: "+256 700 000 002",
        profilePhotoUrl: "",
        emailVerifiedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "usr_student",
        fullName: "Amina Kato",
        email: "student@aqodh.academy",
        passwordHash: hashPassword("student123"),
        role: "student",
        status: "ACTIVE",
        phone: "+256 700 000 003",
        profilePhotoUrl: "",
        emailVerifiedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    revokedTokens: [],
    authSessions: [],
    authEvents: [],
    passwordResets: [],
    emailVerificationTokens: [],
    ...lmsData,
  };
}

function createDefaultLmsData(timestamp) {
  return {
    courses: [
      {
        id: COURSE_ID,
        title: "Ethical Computing Fundamentals",
        slug: "ethical-computing-fundamentals",
        duration: "6 weeks",
        level: "Beginner",
        mode: "Online",
        isFree: false,
        priceStudentUgx: 50000,
        certificateEnabled: true,
        requireFullPaymentForCertificate: true,
        requireManualCertificateApproval: true,
        minimumCertificatePassMark: 60,
        createdAt: timestamp,
        updatedAt: timestamp,
        modules: [
          {
            id: "mod_intro",
            title: "Introduction to Ethical Computing",
            position: 1,
            assessment: "Analyze one unethical technology case.",
            lessons: ["What is ethical computing?", "Why ethics matters in technology", "Real-world technology failures"],
          },
          {
            id: "mod_privacy",
            title: "Data Privacy and Digital Rights",
            position: 2,
            assessment: "Review a privacy policy.",
            lessons: ["Data ownership", "Consent", "Privacy by design", "Digital rights"],
          },
          {
            id: "mod_ai_ethics",
            title: "AI Ethics and Algorithm Accountability",
            position: 3,
            assessment: "Identify bias in a sample dataset.",
            lessons: ["AI bias", "Fairness", "Transparency", "Accountability"],
          },
          {
            id: "mod_cybersecurity",
            title: "Cybersecurity Ethics",
            position: 4,
            assessment: "Discuss when security becomes surveillance.",
            lessons: ["Ethical hacking", "Responsible disclosure", "Monitoring and privacy"],
          },
          {
            id: "mod_social_media",
            title: "Social Media and Digital Society",
            position: 5,
            assessment: "Analyze misinformation online.",
            lessons: ["Misinformation", "Deepfakes", "Platform responsibility", "Digital well-being"],
          },
          {
            id: "mod_building_ethics",
            title: "Building Ethical Technologies",
            position: 6,
            assessment: "Create an Ethical Technology Assessment Report.",
            lessons: ["Ethical impact assessment", "Responsible innovation", "Ethical design checklist"],
          },
        ],
      },
    ],
    enrollments: [],
    studentProgress: [],
    payments: [],
    certificates: [],
    certificateVerificationLogs: [],
    aiInsights: [],
    aiSuggestionLogs: [],
    settings: {
      certificateNumberPrefix: "AQODH-ECF",
    },
  };
}

function normalizeDb(db) {
  const defaults = createDefaultLmsData(now());
  for (const [key, value] of Object.entries(defaults)) {
    if (db[key] === undefined) db[key] = value;
  }
  if (!Array.isArray(db.revokedTokens)) db.revokedTokens = [];
  if (!Array.isArray(db.authSessions)) db.authSessions = [];
  if (!Array.isArray(db.authEvents)) db.authEvents = [];
  if (!Array.isArray(db.passwordResets)) db.passwordResets = [];
  if (!Array.isArray(db.emailVerificationTokens)) db.emailVerificationTokens = [];
  if (!Array.isArray(db.aiInsights)) db.aiInsights = [];
  if (!Array.isArray(db.aiSuggestionLogs)) db.aiSuggestionLogs = [];
  return db;
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(createDefaultDb(), null, 2));
  }
}

function readDb() {
  ensureDb();
  return normalizeDb(JSON.parse(fs.readFileSync(DB_PATH, "utf8")));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function nextId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = {
  readDb,
  writeDb,
  nextId,
  now,
};
