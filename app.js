const CERTIFICATE_TEMPLATE_VERSION = "professional-blue-gold-v2";

const course = {
  title: "Ethical Computing Fundamentals",
  duration: "6 weeks",
  level: "Beginner",
  certificate: true,
  mode: "Online",
  progress: 68,
  modules: [
    {
      title: "Introduction to Ethical Computing",
      lessons: ["What is ethical computing?", "Why ethics matters in technology", "Real-world technology failures"],
      assessment: "Analyze one unethical technology case.",
      status: "completed",
    },
    {
      title: "Data Privacy and Digital Rights",
      lessons: ["Data ownership", "Consent", "Privacy by design", "Digital rights"],
      assessment: "Review a privacy policy.",
      status: "completed",
    },
    {
      title: "AI and Algorithm Ethics",
      lessons: ["AI bias", "Fairness", "Transparency", "Accountability"],
      assessment: "Identify bias in a sample dataset.",
      status: "active",
    },
    {
      title: "Cybersecurity Ethics",
      lessons: ["Ethical hacking", "Responsible disclosure", "Monitoring and privacy"],
      assessment: "Discuss when security becomes surveillance.",
      status: "locked",
    },
    {
      title: "Social Media and Digital Society",
      lessons: ["Misinformation", "Deepfakes", "Platform responsibility", "Digital well-being"],
      assessment: "Analyze misinformation online.",
      status: "locked",
    },
    {
      title: "Building Ethical Technologies",
      lessons: ["Ethical impact assessment", "Responsible innovation", "Ethical design checklist"],
      assessment: "Create an Ethical Technology Assessment Report.",
      status: "locked",
    },
  ],
};

const students = [
  { name: "Amina Kato", email: "amina@aqodh.academy", progress: 92, quiz: 88, project: "Submitted", risk: "Low", lastActive: "Today", joined: "Jun 01", role: "Student", status: "Active" },
  { name: "David Okello", email: "david@aqodh.academy", progress: 68, quiz: 74, project: "Draft", risk: "Medium", lastActive: "Yesterday", joined: "Jun 02", role: "Student", status: "Active" },
  { name: "Nabirye Grace", email: "grace@aqodh.academy", progress: 41, quiz: 59, project: "Missing", risk: "High", lastActive: "Jun 08", joined: "Jun 03", role: "Student", status: "At risk" },
  { name: "Jonah Mwangi", email: "jonah@aqodh.academy", progress: 76, quiz: 82, project: "Submitted", risk: "Low", lastActive: "Today", joined: "Jun 04", role: "Student", status: "Active" },
];

const tasks = [
  { name: "AI Bias Quiz", type: "Quiz", due: "June 14", state: "Open" },
  { name: "Privacy Policy Review", type: "Assignment", due: "June 16", state: "Due soon" },
  { name: "Final Project Proposal", type: "Project", due: "June 21", state: "Upcoming" },
];

const submissions = [
  { student: "Amina Kato", assignment: "Privacy Policy Review", submitted: "Jun 08", status: "Reviewed", grade: "84%" },
  { student: "David Okello", assignment: "AI Bias Practical", submitted: "Jun 09", status: "Pending", grade: "-" },
  { student: "Nabirye Grace", assignment: "Case Analysis", submitted: "Jun 07", status: "Needs revision", grade: "58%" },
];

const payments = [
  { student: "Amina Kato", course: "Ethical Computing", amount: "UGX 50,000", status: "Completed", date: "Jun 01" },
  { student: "David Okello", course: "Ethical Computing", amount: "UGX 150,000", status: "Pending", date: "Jun 02" },
  { student: "Jonah Mwangi", course: "Ethical Computing", amount: "UGX 50,000", status: "Completed", date: "Jun 04" },
];

const certificates = [
  { student: "Amina Kato", course: "Ethical Computing Fundamentals", completion: "100%", grade: "88%", status: "Pending" },
  { student: "Jonah Mwangi", course: "Ethical Computing Fundamentals", completion: "100%", grade: "82%", status: "Approved" },
  { student: "David Okello", course: "Ethical Computing Fundamentals", completion: "68%", grade: "74%", status: "Locked" },
];

const lessonTypes = ["PDF Document", "PowerPoint Document", "Video Link", "Text Lesson"];

const documentFiles = [
  { title: "Ethical Computing Primer", type: "PDF", lesson: "What is ethical computing?", size: "1.8 MB" },
  { title: "AI Fairness Slides", type: "PPTX", lesson: "Fairness", size: "4.2 MB" },
];

const videoLessons = [
  { title: "Privacy by Design Walkthrough", provider: "YouTube", duration: "12 min", url: "https://youtube.com/watch?v=aqodh-privacy" },
  { title: "Responsible Disclosure Case", provider: "Vimeo", duration: "9 min", url: "https://vimeo.com/aqodh-security" },
];

const quizQuestions = [
  { type: "Multiple Choice", question: "What does AI stand for?", correct: "Artificial Intelligence", marks: 2, studentAnswer: "artificial intelligence" },
  { type: "True / False", question: "Privacy by design should be considered only after launch.", correct: "False", marks: 1, studentAnswer: "false" },
  { type: "Short Objective Answer", question: "Name one core ethical AI value.", correct: "fairness", marks: 2, studentAnswer: "Fairness" },
];

const longAnswerReview = {
  student: "David Okello",
  assignment: "Explain why ethical computing is important in AI.",
  submitted: "Jun 09",
  answer: "Ethical computing in AI reduces bias, improves fairness, supports transparency, creates accountability, and protects user privacy.",
  keywords: ["bias", "fairness", "transparency", "accountability", "privacy"],
  maxMarks: 10,
  status: "Pending review",
};

function defaultUsers() {
  const now = new Date().toISOString();
  return [
    { id: "usr_admin", fullName: "AQODH Admin", email: "admin@aqodh.academy", passwordHash: demoHash("admin123"), role: "admin", status: "ACTIVE", phone: "+256 700 000 001", profilePhoto: "", createdAt: now, updatedAt: now },
    { id: "usr_instructor", fullName: "Dr. Miriam Achieng", email: "instructor@aqodh.academy", passwordHash: demoHash("instructor123"), role: "instructor", status: "ACTIVE", phone: "+256 700 000 002", profilePhoto: "", createdAt: now, updatedAt: now },
    { id: "usr_student", fullName: "Amina Kato", email: "student@aqodh.academy", passwordHash: demoHash("student123"), role: "student", status: "ACTIVE", phone: "+256 700 000 003", profilePhoto: "", createdAt: now, updatedAt: now },
  ];
}

function demoHash(password) {
  return `demo_hash_${btoa(password).replace(/=+$/, "")}`;
}

function loadUsers() {
  try {
    const saved = window.localStorage.getItem("aqodhUsers");
    return saved ? JSON.parse(saved) : defaultUsers();
  } catch (error) {
    return defaultUsers();
  }
}

function persistUsers() {
  try {
    window.localStorage.setItem("aqodhUsers", JSON.stringify(appState.users));
  } catch (error) {
    // Users still update in memory when storage is blocked.
  }
}

function loadSession() {
  try {
    const saved = window.localStorage.getItem("aqodhSession");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function persistSession() {
  try {
    if (appState.session) {
      window.localStorage.setItem("aqodhSession", JSON.stringify(appState.session));
    } else {
      window.localStorage.removeItem("aqodhSession");
    }
  } catch (error) {
    // Session still updates in memory when storage is blocked.
  }
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (appState.session && appState.session.token) {
    headers.Authorization = `Bearer ${appState.session.token}`;
  }
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers,
    });
  } catch (error) {
    const apiError = new Error("AQODH API server is not available. Falling back to local demo mode.");
    apiError.apiUnavailable = true;
    throw apiError;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const apiError = new Error("AQODH API server is not available. Start it with npm start.");
    apiError.apiUnavailable = response.status === 404;
    throw apiError;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function shouldUseLocalAuthFallback(error) {
  return location.protocol === "file:" || error.apiUnavailable;
}

function upsertUser(user) {
  const existing = appState.users.find((item) => item.id === user.id);
  if (existing) {
    Object.assign(existing, user);
  } else {
    appState.users.push(user);
  }
  persistUsers();
}

function loadStudentProgress() {
  try {
    const saved = window.localStorage.getItem("aqodhStudentProgress");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Local storage may be unavailable in some embedded previews.
  }

  return {
    activeModule: 2,
    activeLesson: 0,
    activeActivity: "lesson:0",
    completedActivities: ["0:lesson:0", "0:lesson:1", "0:lesson:2", "0:quiz:0", "1:lesson:0", "1:lesson:1", "1:document:0", "1:assignment:0"],
    progress: 40,
  };
}

function loadCertificateSettings() {
  try {
    const saved = window.localStorage.getItem("aqodhCertificateSettings");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Keep defaults if storage is unavailable.
  }

  return {
    courseIsFree: false,
    requireFullPayment: true,
    requireManualApproval: true,
    adminApproved: false,
    certificateRevoked: false,
    paymentStatus: "balance_due",
    amountDue: "UGX 50,000",
    minimumPassMark: 60,
    finalGrade: 78,
    lecturerName: "Dr. Miriam Achieng",
    directorName: "Jeremiah Malinzi",
    designTheme: "Premium Blue and Gold",
    primaryColor: "#1e3a8a",
    accentColor: "#d99a2b",
  };
}

function loadCertificateRecord() {
  try {
    const saved = window.localStorage.getItem("aqodhCertificateRecord");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function loadVerificationLogs() {
  try {
    const saved = window.localStorage.getItem("aqodhCertificateVerificationLogs");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function loadAiInsightStatuses() {
  try {
    const saved = window.localStorage.getItem("aqodhAiInsightStatuses");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

function persistStudentProgress() {
  try {
    window.localStorage.setItem("aqodhStudentProgress", JSON.stringify(appState.studentProgress));
  } catch (error) {
    // Progress still updates in memory when storage is blocked.
  }
}

function persistCertificateSettings() {
  try {
    window.localStorage.setItem("aqodhCertificateSettings", JSON.stringify(appState.certificateSettings));
  } catch (error) {
    // Settings still update in memory when storage is blocked.
  }
}

function persistCertificateRecord() {
  try {
    if (appState.certificateRecord) {
      window.localStorage.setItem("aqodhCertificateRecord", JSON.stringify(appState.certificateRecord));
    } else {
      window.localStorage.removeItem("aqodhCertificateRecord");
    }
  } catch (error) {
    // Record still updates in memory when storage is blocked.
  }
}

function persistVerificationLogs() {
  try {
    window.localStorage.setItem("aqodhCertificateVerificationLogs", JSON.stringify(appState.verificationLogs));
  } catch (error) {
    // Logs still update in memory when storage is blocked.
  }
}

function persistAiInsightStatuses() {
  try {
    window.localStorage.setItem("aqodhAiInsightStatuses", JSON.stringify(appState.aiInsightStatuses));
  } catch (error) {
    // AI insight review state still works in memory when storage is blocked.
  }
}

const appState = {
  view: "home",
  role: "student",
  enrolled: false,
  certificateUnlocked: false,
  sidebarOpen: false,
  studentProgress: loadStudentProgress(),
  certificateSettings: loadCertificateSettings(),
  certificateRecord: loadCertificateRecord(),
  verificationLogs: loadVerificationLogs(),
  aiInsightStatuses: loadAiInsightStatuses(),
  certificateReviewOpen: false,
  dashboardSections: {
    student: "Dashboard",
    instructor: "Dashboard",
    admin: "Dashboard",
  },
  users: loadUsers(),
  session: loadSession(),
  authMessage: "",
};

const app = document.querySelector("#app");

function setView(view) {
  const protectedRole = protectedRouteRole(view);
  if (protectedRole && !canAccessRole(protectedRole)) {
    appState.authMessage = `Please log in as ${protectedRole} to access this dashboard.`;
    appState.view = "login";
    appState.sidebarOpen = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  appState.view = view;
  appState.sidebarOpen = false;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openVerification(certificateNumber = "") {
  appState.view = "certificate-verify";
  appState.verifyCertificateNumber = certificateNumber || (appState.certificateRecord ? appState.certificateRecord.certificateNumber : "");
  logCertificateVerification(appState.verifyCertificateNumber);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setRole(role) {
  appState.role = role;
  setView(`${role}-dashboard`);
}

function protectedRouteRole(view) {
  if (view === "student-dashboard") return "student";
  if (view === "instructor-dashboard") return "instructor";
  if (view === "admin-dashboard") return "admin";
  return "";
}

function currentUser() {
  return appState.session ? appState.users.find((user) => user.id === appState.session.userId) : null;
}

function canAccessRole(role) {
  const user = currentUser();
  return Boolean(user && user.role === role && user.status === "ACTIVE");
}

function redirectByRole(role) {
  setView(`${role}-dashboard`);
}

function activeDashboardSection(role, fallback = "Dashboard") {
  return appState.dashboardSections[role.toLowerCase()] || fallback;
}

function setDashboardSection(role, item) {
  const normalizedRole = role.toLowerCase();
  if (item === "Logout") {
    logout();
    return;
  }
  appState.dashboardSections[normalizedRole] = item;
  appState.view = `${normalizedRole}-dashboard`;
  appState.sidebarOpen = false;
  render();
}

async function logout() {
  try {
    if (appState.session && appState.session.token) {
      await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
    }
  } catch (error) {
    // Local fallback still clears the session.
  }
  appState.session = null;
  persistSession();
  appState.authMessage = "You have logged out.";
  setView("login");
}

async function loginUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    upsertUser(data.user);
    appState.session = { userId: data.user.id, token: data.token, createdAt: new Date().toISOString() };
    appState.role = data.user.role;
    appState.authMessage = "";
    persistSession();
    redirectByRole(data.user.role);
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }

  const user = appState.users.find((item) => item.email.toLowerCase() === email);

  if (!user || user.passwordHash !== demoHash(password)) {
    appState.authMessage = "Invalid email or password.";
    render();
    return;
  }
  if (user.status !== "ACTIVE") {
    appState.authMessage = `Your account is ${user.status.toLowerCase()}. Contact admin.`;
    render();
    return;
  }

  appState.session = {
    userId: user.id,
    token: `demo_jwt_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  appState.role = user.role;
  appState.authMessage = "";
  persistSession();
  redirectByRole(user.role);
}

async function loginDemo(role) {
  const emailByRole = {
    student: "student@aqodh.academy",
    instructor: "instructor@aqodh.academy",
    admin: "admin@aqodh.academy",
  };
  const passwordByRole = {
    student: "student123",
    instructor: "instructor123",
    admin: "admin123",
  };
  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: emailByRole[role], password: passwordByRole[role] }),
    });
    upsertUser(data.user);
    appState.session = { userId: data.user.id, token: data.token, createdAt: new Date().toISOString() };
    appState.role = data.user.role;
    appState.authMessage = "";
    persistSession();
    redirectByRole(data.user.role);
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  const user = appState.users.find((item) => item.email === emailByRole[role]);
  if (!user) return;
  appState.session = {
    userId: user.id,
    token: `demo_jwt_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  appState.role = user.role;
  appState.authMessage = "";
  persistSession();
  redirectByRole(user.role);
}

async function registerUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim().toLowerCase();

  try {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: form.fullName.value.trim(),
        email,
        password: form.password.value,
      }),
    });
    upsertUser(data.user);
    appState.session = { userId: data.user.id, token: data.token, createdAt: new Date().toISOString() };
    appState.role = data.user.role;
    appState.authMessage = data.verificationToken ? `Demo email verification token: ${data.verificationToken}` : "";
    persistSession();
    redirectByRole(data.user.role);
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }

  if (appState.users.some((user) => user.email.toLowerCase() === email)) {
    appState.authMessage = "An account with this email already exists.";
    render();
    return;
  }

  const now = new Date().toISOString();
  const user = {
    id: `usr_${Date.now()}`,
    fullName: form.fullName.value.trim(),
    email,
    passwordHash: demoHash(form.password.value),
    role: "student",
    status: "ACTIVE",
    phone: "",
    profilePhoto: "",
    createdAt: now,
    updatedAt: now,
  };
  appState.users.push(user);
  persistUsers();
  appState.session = { userId: user.id, token: `demo_jwt_${Date.now()}`, createdAt: now };
  appState.role = "student";
  appState.authMessage = "";
  persistSession();
  redirectByRole("student");
}

async function requestPasswordReset(event) {
  event.preventDefault();
  const form = event.currentTarget;
  try {
    const data = await apiRequest("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: form.email.value.trim().toLowerCase() }),
    });
    appState.authMessage = data.resetToken
      ? `Demo reset token: ${data.resetToken}`
      : "If the email exists, a reset link was generated.";
  } catch (error) {
    appState.authMessage = "Password reset link generated for this V1 demo. Use Reset Password to set a new password.";
  }
  render();
}

async function resetPassword(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.resetToken && form.resetToken.value) {
    try {
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: form.resetToken.value.trim(), password: form.password.value }),
      });
      appState.authMessage = "Password reset. Please log in.";
      setView("login");
      return;
    } catch (error) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  const email = form.email.value.trim().toLowerCase();
  const user = appState.users.find((item) => item.email.toLowerCase() === email);
  if (!user) {
    appState.authMessage = "No user found for that email.";
    render();
    return;
  }
  user.passwordHash = demoHash(form.password.value);
  user.updatedAt = new Date().toISOString();
  persistUsers();
  appState.authMessage = "Password reset. Please log in.";
  setView("login");
}

async function requestEmailVerification() {
  try {
    const data = await apiRequest("/api/auth/resend-verification", { method: "POST", body: "{}" });
    appState.authMessage = data.alreadyVerified
      ? "Email is already verified."
      : `Demo email verification token: ${data.verificationToken}`;
  } catch (error) {
    appState.authMessage = error.message;
  }
  render();
}

async function verifyEmail(event) {
  event.preventDefault();
  const form = event.currentTarget;
  try {
    const data = await apiRequest("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token: form.verificationToken.value.trim() }),
    });
    upsertUser(data.user);
    appState.authMessage = "Email verified.";
    setView("profile");
  } catch (error) {
    appState.authMessage = error.message;
    render();
  }
}

async function updateProfile(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) {
    setView("login");
    return;
  }
  const form = event.currentTarget;
  try {
    const data = await apiRequest("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify({ fullName: form.fullName.value.trim(), phone: form.phone.value.trim() }),
    });
    upsertUser(data.user);
    appState.authMessage = "Profile updated.";
    render();
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  user.fullName = form.fullName.value.trim();
  user.phone = form.phone.value.trim();
  user.updatedAt = new Date().toISOString();
  persistUsers();
  appState.authMessage = "Profile updated.";
  render();
}

async function changeOwnPassword(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) {
    setView("login");
    return;
  }
  const form = event.currentTarget;
  try {
    await apiRequest("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: form.currentPassword.value, newPassword: form.newPassword.value }),
    });
    appState.authMessage = "Password changed.";
    render();
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  if (user.passwordHash !== demoHash(form.currentPassword.value)) {
    appState.authMessage = "Current password is incorrect.";
    render();
    return;
  }
  user.passwordHash = demoHash(form.newPassword.value);
  user.updatedAt = new Date().toISOString();
  persistUsers();
  appState.authMessage = "Password changed.";
  render();
}

async function createInstructor(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim().toLowerCase();
  try {
    const data = await apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify({
        fullName: form.fullName.value.trim(),
        email,
        password: form.password.value,
        role: "instructor",
        status: "PENDING",
      }),
    });
    upsertUser(data.user);
    appState.authMessage = "Instructor created with pending status.";
    render();
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  if (appState.users.some((user) => user.email.toLowerCase() === email)) {
    appState.authMessage = "That instructor email already exists.";
    render();
    return;
  }
  const now = new Date().toISOString();
  appState.users.push({
    id: `usr_${Date.now()}`,
    fullName: form.fullName.value.trim(),
    email,
    passwordHash: demoHash(form.password.value),
    role: "instructor",
    status: "PENDING",
    phone: "",
    profilePhoto: "",
    createdAt: now,
    updatedAt: now,
  });
  persistUsers();
  appState.authMessage = "Instructor created with pending status.";
  render();
}

async function updateUserStatus(userId, status) {
  try {
    const data = await apiRequest(`/api/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    upsertUser(data.user);
    render();
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  const user = appState.users.find((item) => item.id === userId);
  if (!user) return;
  user.status = status;
  user.updatedAt = new Date().toISOString();
  persistUsers();
  render();
}

async function changeUserRole(userId, role) {
  try {
    const data = await apiRequest(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    upsertUser(data.user);
    render();
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  const user = appState.users.find((item) => item.id === userId);
  if (!user) return;
  user.role = role;
  user.updatedAt = new Date().toISOString();
  persistUsers();
  render();
}

async function resetUserPassword(userId) {
  try {
    const data = await apiRequest(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ password: "Password123" }),
    });
    upsertUser(data.user);
    appState.authMessage = `${data.user.fullName}'s password reset to Password123.`;
    render();
    return;
  } catch (error) {
    if (!shouldUseLocalAuthFallback(error)) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  const user = appState.users.find((item) => item.id === userId);
  if (!user) return;
  user.passwordHash = demoHash("Password123");
  user.updatedAt = new Date().toISOString();
  appState.authMessage = `${user.fullName}'s password reset to Password123.`;
  persistUsers();
  appState.sidebarOpen = false;
  render();
}

function toggleSidebar() {
  appState.sidebarOpen = !appState.sidebarOpen;
  render();
}

async function enroll() {
  if (appState.session?.token && currentUser()?.role === "student") {
    try {
      const data = await apiRequest("/api/enrollments", { method: "POST", body: JSON.stringify({}) });
      applyServerLearningState(data);
      appState.enrolled = true;
      setView("student-dashboard");
      return;
    } catch (error) {
      if (!shouldUseLocalAuthFallback(error)) {
        appState.authMessage = error.message;
        render();
        return;
      }
    }
  }
  appState.enrolled = true;
  setView("register");
}

function unlockCertificate() {
  appState.studentProgress.progress = 100;
  appState.certificateUnlocked = false;
  persistStudentProgress();
  render();
}

async function continueLearning() {
  appState.view = "student-dashboard";
  if (appState.session?.token) {
    try {
      const data = await apiRequest("/api/student/learning-state");
      applyServerLearningState(data);
    } catch (error) {
      if (!shouldUseLocalAuthFallback(error)) {
        appState.authMessage = error.message;
      }
      appState.studentProgress = fetchCurrentLearningState();
    }
  } else {
    appState.studentProgress = fetchCurrentLearningState();
  }
  render();
}

function fetchCurrentLearningState() {
  return {
    ...appState.studentProgress,
  };
}

function applyServerLearningState(data) {
  if (data.progress) {
    appState.studentProgress = {
      activeModule: data.progress.activeModule,
      activeLesson: data.progress.activeLesson,
      activeActivity: data.progress.activeActivity,
      completedActivities: data.progress.completedActivities || [],
      progress: data.progress.progressPercent || 0,
    };
    if (Number.isFinite(data.progress.finalGrade)) {
      appState.certificateSettings.finalGrade = data.progress.finalGrade;
    }
    persistStudentProgress();
  }

  if (data.payment) {
    appState.certificateSettings.paymentStatus = data.payment.status === "FULLY_PAID" ? "paid" : "balance_due";
    appState.certificateSettings.amountDue = data.payment.status === "FULLY_PAID" ? "UGX 0" : `UGX ${Number(data.payment.amountUgx || 0).toLocaleString()}`;
    persistCertificateSettings();
  }

  if (data.certificate) {
    appState.certificateRecord = {
      ...(appState.certificateRecord || {}),
      certificateNumber: data.certificate.certificateNumber,
      status: data.certificate.status.toLowerCase(),
      revoked: data.certificate.status === "REVOKED",
      finalGrade: data.certificate.finalGrade,
      verificationUrl: data.certificate.verificationUrl,
    };
    appState.certificateSettings.adminApproved = data.certificate.status === "VALID";
    appState.certificateSettings.certificateRevoked = data.certificate.status === "REVOKED";
    persistCertificateRecord();
    persistCertificateSettings();
  }
}

async function syncServerLearningCursor() {
  if (!appState.session?.token) return;
  const progress = appState.studentProgress;
  await apiRequest("/api/student/learning-state", {
    method: "PATCH",
    body: JSON.stringify({
      activeModule: progress.activeModule,
      activeLesson: progress.activeLesson,
      activeActivity: progress.activeActivity,
    }),
  });
}

function fetchModuleLearningData(moduleIndex) {
  const module = course.modules[moduleIndex];
  return {
    module,
    lessons: module.lessons.map((title, index) => ({
      title,
      description: `${title} in ${module.title}.`,
      type: "Text Lesson",
      order: index + 1,
    })),
    documents: [
      { title: `${module.title} Study Notes`, type: "PDF", size: "1.4 MB" },
      { title: `${module.title} Slide Deck`, type: "PPTX", size: "3.2 MB" },
    ],
    videos: [
      { title: `${module.title} Video Lesson`, provider: "YouTube", duration: "11 min" },
    ],
    quizzes: [
      { title: `${module.title} Knowledge Check`, questions: 10, passingScore: 60 },
    ],
    assignments: [
      { title: module.assessment, due: "June 21", submissionType: "Typed answer" },
    ],
  };
}

function openStudentModule(moduleIndex) {
  const data = fetchModuleLearningData(moduleIndex);
  appState.view = "student-dashboard";
  appState.studentProgress.activeModule = moduleIndex;
  appState.studentProgress.activeLesson = 0;
  appState.studentProgress.activeActivity = data.lessons.length ? "lesson:0" : "document:0";
  persistStudentProgress();
  syncServerLearningCursor().catch(() => {});
  render();
}

function openStudentActivity(activityType, activityIndex) {
  appState.view = "student-dashboard";
  appState.studentProgress.activeActivity = `${activityType}:${activityIndex}`;
  if (activityType === "lesson") {
    appState.studentProgress.activeLesson = activityIndex;
  }
  persistStudentProgress();
  syncServerLearningCursor().catch(() => {});
  render();
}

async function completeActiveActivity() {
  const progress = appState.studentProgress;
  const key = `${progress.activeModule}:${progress.activeActivity}`;
  if (appState.session?.token) {
    try {
      const data = await apiRequest("/api/student/activities/complete", {
        method: "POST",
        body: JSON.stringify({ activityKey: key }),
      });
      applyServerLearningState(data);
      moveToNextActivity();
      await syncServerLearningCursor();
      persistStudentProgress();
      render();
      return;
    } catch (error) {
      if (!shouldUseLocalAuthFallback(error)) {
        appState.authMessage = error.message;
        render();
        return;
      }
    }
  }
  if (!progress.completedActivities.includes(key)) {
    progress.completedActivities.push(key);
  }
  progress.progress = calculateStudentProgress();
  moveToNextActivity();
  persistStudentProgress();
  render();
}

function calculateStudentProgress() {
  const total = course.modules.reduce((sum, module, index) => {
    const data = fetchModuleLearningData(index);
    return sum + data.lessons.length + data.documents.length + data.videos.length + data.quizzes.length + data.assignments.length;
  }, 0);
  return Math.round((appState.studentProgress.completedActivities.length / total) * 100);
}

function moveToNextActivity() {
  const progress = appState.studentProgress;
  const activities = getModuleActivities(progress.activeModule);
  const currentIndex = activities.findIndex((activity) => activity.key === progress.activeActivity);
  const next = activities[currentIndex + 1];

  if (next) {
    progress.activeActivity = next.key;
    if (next.type === "lesson") {
      progress.activeLesson = next.index;
    }
    return;
  }

  const nextModule = Math.min(progress.activeModule + 1, course.modules.length - 1);
  if (nextModule !== progress.activeModule) {
    progress.activeModule = nextModule;
    progress.activeLesson = 0;
    progress.activeActivity = "lesson:0";
  }
}

function getModuleActivities(moduleIndex) {
  const data = fetchModuleLearningData(moduleIndex);
  return [
    ...data.lessons.map((item, index) => ({ type: "lesson", index, key: `lesson:${index}`, item })),
    ...data.documents.map((item, index) => ({ type: "document", index, key: `document:${index}`, item })),
    ...data.videos.map((item, index) => ({ type: "video", index, key: `video:${index}`, item })),
    ...data.quizzes.map((item, index) => ({ type: "quiz", index, key: `quiz:${index}`, item })),
    ...data.assignments.map((item, index) => ({ type: "assignment", index, key: `assignment:${index}`, item })),
  ];
}

function navButton(label, view) {
  return `<button class="${appState.view === view ? "active" : ""}" onclick="setView('${view}')">${label}</button>`;
}

function shell(content) {
  const isDashboardShell = appState.view.includes("dashboard") || (appState.view === "profile" && currentUser());
  document.body.classList.toggle("dashboard-page", isDashboardShell);
  app.innerHTML = `
    <div class="app-shell ${isDashboardShell ? "dashboard-shell" : "public-shell"}">
      <header class="topbar">
        <button class="hamburger" onclick="toggleSidebar()" aria-label="Open sidebar">☰</button>
        <a class="brand" href="#" onclick="setView('home')">
          <span class="brand-mark"><img src="assets/aqodh-logo.svg" alt="" /></span>
          <span>AQODH Academy</span>
        </a>
        <label class="header-search" aria-label="Search">
          <input placeholder="Search courses, lessons, learners" />
        </label>
        <nav class="nav" aria-label="Main navigation">
          ${navButton("Home", "home")}
          ${navButton("Course", "course")}
          ${navButton("Register", "register")}
          ${navButton("Verify", "certificate-verify")}
        </nav>
        <div class="user-menu">
          <span class="notify-dot"></span>
        </div>
      </header>
      ${content}
      ${isDashboardShell ? "" : footer()}
    </div>
  `;
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function home() {
  return `
    <main class="public-main">
      <section class="hero">
        <div class="hero-content">
          <p class="eyebrow">AQODH Academy online course</p>
          <h1>${course.title}</h1>
          <p>Learn how to make responsible technology decisions across privacy, AI, cybersecurity, social media, and ethical product design.</p>
          <div class="hero-actions">
            <button class="primary-button" onclick="enroll()">Enroll now</button>
            <button class="ghost-button" onclick="setView('course')">View modules</button>
          </div>
        </div>
      </section>
      ${overview()}
      ${modulePreview()}
      ${pricing()}
    </main>
  `;
}

function overview() {
  const items = [
    ["Duration", course.duration],
    ["Level", course.level],
    ["Certificate", "Yes"],
    ["Mode", course.mode],
  ];

  return `
    <section class="section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <h2>Course Overview</h2>
            <p>A focused first course for students, professionals, and organizations starting a practical ethics program.</p>
          </div>
        </div>
        <div class="grid">
          ${items.map(([label, value]) => `<article class="card metric"><span class="label">${label}</span><strong>${value}</strong></article>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function modulePreview() {
  return `
    <section class="section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <h2>Modules Preview</h2>
            <p>Six practical modules move learners from foundational ethics to a final technology assessment report.</p>
          </div>
          <button class="ghost-button" onclick="setView('student-dashboard')">Open dashboard</button>
        </div>
        <div class="grid">
          ${course.modules.map((module, index) => `
            <article class="card module-card">
              <span class="pill">Module ${index + 1}</span>
              <h3>${module.title}</h3>
              <p class="muted">${module.assessment}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function pricing() {
  const plans = [
    ["Student", "UGX 50,000", "Individual access, quizzes, assignments, and certificate eligibility."],
    ["Professional", "UGX 150,000", "Career-focused access with graded final project feedback."],
    ["Organization", "Custom", "Team enrollment, progress reporting, and instructor support."],
  ];

  return `
    <section class="section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <h2>Pricing</h2>
            <p>Start simple, then expand into cohorts, organization reporting, and payment integrations.</p>
          </div>
        </div>
        <div class="grid">
          ${plans.map(([name, price, body], index) => `
            <article class="card price-card ${index === 1 ? "featured" : ""}">
              <span class="label">${name}</span>
              <div class="price">${price}</div>
              <p class="muted">${body}</p>
              <button class="${index === 1 ? "primary-button" : "ghost-button"}" onclick="setView('enroll')">Choose plan</button>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function authNotice() {
  return appState.authMessage ? `<div class="auth-notice">${appState.authMessage}</div>` : "";
}

function authShell(title, subtitle, body) {
  return `
    <main class="dashboard auth-page">
      <section class="card data-card auth-card">
        <span class="label">AQODH Authentication V1</span>
        <h1>${title}</h1>
        <p class="muted">${subtitle}</p>
        ${authNotice()}
        ${body}
      </section>
    </main>
  `;
}

function loginPage() {
  return authShell("Login", "Use your email and password. Demo accounts: student@aqodh.academy, instructor@aqodh.academy, admin@aqodh.academy. Passwords are student123, instructor123, admin123.", `
    <form class="form-grid auth-form" onsubmit="loginUser(event)">
      <label class="full-field">Email<input name="email" type="email" required value="student@aqodh.academy" /></label>
      <label class="full-field">Password<input name="password" type="password" required value="student123" /></label>
      <button class="primary-button" type="submit">Login</button>
      <button class="ghost-button" type="button" onclick="setView('forgot-password')">Forgot Password</button>
      <button class="ghost-button" type="button" onclick="setView('register')">Create Account</button>
    </form>
    <div class="demo-login-row">
      <button class="ghost-button" onclick="loginDemo('student')">Demo Student</button>
      <button class="ghost-button" onclick="loginDemo('instructor')">Demo Instructor</button>
      <button class="ghost-button" onclick="loginDemo('admin')">Demo Admin</button>
    </div>
  `);
}

function registerPage() {
  return authShell("Register", "Create a student account for Ethical Computing Fundamentals.", `
    <form class="form-grid auth-form" onsubmit="registerUser(event)">
      <label>Full Name<input name="fullName" required value="New Student" /></label>
      <label>Email<input name="email" type="email" required value="new.student@aqodh.academy" /></label>
      <label class="full-field">Password<input name="password" type="password" required value="student123" /></label>
      <button class="primary-button" type="submit">Register</button>
      <button class="ghost-button" type="button" onclick="setView('login')">Login Instead</button>
    </form>
  `);
}

function forgotPasswordPage() {
  return authShell("Forgot Password", "Generate a demo reset flow for an existing account.", `
    <form class="form-grid auth-form" onsubmit="requestPasswordReset(event)">
      <label class="full-field">Email<input name="email" type="email" required value="student@aqodh.academy" /></label>
      <button class="primary-button" type="submit">Send Reset Link</button>
      <button class="ghost-button" type="button" onclick="setView('reset-password')">Go To Reset</button>
    </form>
  `);
}

function resetPasswordPage() {
  return authShell("Reset Password", "Set a new password for a demo account.", `
    <form class="form-grid auth-form" onsubmit="resetPassword(event)">
      <label>Email<input name="email" type="email" required value="student@aqodh.academy" /></label>
      <label>Reset Token<input name="resetToken" placeholder="Paste token from Forgot Password" /></label>
      <label>New Password<input name="password" type="password" required value="student123" /></label>
      <button class="primary-button" type="submit">Reset Password</button>
      <button class="ghost-button" type="button" onclick="setView('login')">Back To Login</button>
    </form>
  `);
}

function verifyEmailPage() {
  return authShell("Verify Email", "Confirm the email address for the current AQODH Academy account.", `
    <form class="form-grid auth-form" onsubmit="verifyEmail(event)">
      <label class="full-field">Verification Token<input name="verificationToken" required placeholder="Paste token from verification request" /></label>
      <button class="primary-button" type="submit">Verify Email</button>
      <button class="ghost-button" type="button" onclick="requestEmailVerification()">Request Token</button>
      <button class="ghost-button" type="button" onclick="setView('profile')">Back To Profile</button>
    </form>
  `);
}

function profilePage() {
  const user = currentUser();
  if (!user) {
    appState.authMessage = "Please log in to view your profile.";
    return loginPage();
  }

  const content = `
    <section class="card data-card profile-card">
      <span class="label">Profile</span>
      <h1>${user.fullName}</h1>
      <p class="muted">${user.email} · ${user.role} · ${user.status}</p>
      <p><span class="pill ${user.emailVerifiedAt ? "success-pill" : "warning-pill"}">${user.emailVerifiedAt ? "Email verified" : "Email not verified"}</span></p>
      ${authNotice()}
      <div class="v1-row">
        <form class="form-grid span-50" onsubmit="updateProfile(event)">
          <label>Full Name<input name="fullName" value="${user.fullName}" /></label>
          <label>Phone<input name="phone" value="${user.phone || ""}" /></label>
          <button class="primary-button" type="submit">Save Profile</button>
          ${user.emailVerifiedAt ? "" : `<button class="ghost-button" type="button" onclick="requestEmailVerification()">Request Email Token</button><button class="ghost-button" type="button" onclick="setView('verify-email')">Verify Email</button>`}
        </form>
        <form class="form-grid span-50" onsubmit="changeOwnPassword(event)">
          <label>Current Password<input name="currentPassword" type="password" required /></label>
          <label>New Password<input name="newPassword" type="password" required /></label>
          <button class="ghost-button" type="submit">Change Password</button>
          <button class="ghost-button" type="button" onclick="logout()">Logout</button>
        </form>
      </div>
    </section>
  `;

  return dashboardLayout(roleLabel(user.role), "Profile", "Manage your own AQODH Academy account details.", dashboardSidebarItems(user.role), content);
}

function roleLabel(role) {
  return String(role || "").charAt(0).toUpperCase() + String(role || "").slice(1);
}

function dashboardSidebarItems(role) {
  if (role === "student") {
    return ["Dashboard", "My Course", "Lessons", "Quizzes", "Assignments", "Grades", "Certificate", "Announcements", "Logout"];
  }

  if (role === "instructor") {
    return ["Dashboard", "My Courses", "Modules", "Lessons", "Documents", "Videos", "Quizzes", "Assignments", "Submissions", "Grades", "Announcements", "Logout"];
  }

  return ["Dashboard", "AI Insights", "Users", "Courses", "Instructors", "Students", "Payments", "Certificates", "Reports", "Settings", "Logout"];
}

function dashboardHeader(title, subtitle) {
  return `
    <div class="dashboard-header">
      <div>
        <p class="eyebrow" style="color: var(--blue)">AQODH LMS</p>
        <h1>${title}</h1>
        <p class="muted">${subtitle}</p>
      </div>
      <div class="role-panel">
        <span class="label">Role</span>
        <select onchange="setRole(this.value)" aria-label="Select role">
          ${["student", "instructor", "admin"].map((role) => `<option value="${role}" ${appState.role === role ? "selected" : ""}>${role}</option>`).join("")}
        </select>
      </div>
    </div>
  `;
}

function dashboardLayout(role, title, subtitle, sidebarItems, content) {
  const user = currentUser();
  const normalizedRole = role.toLowerCase();
  const activeItem = activeDashboardSection(normalizedRole);
  return `
    <main class="dashboard-layout ${appState.sidebarOpen ? "sidebar-open" : ""}">
      <aside class="sidebar" aria-label="${role} sidebar">
        <div class="sidebar-title">${role}</div>
        ${user ? `
          <button class="sidebar-profile ${appState.view === "profile" ? "active" : ""}" onclick="setView('profile')" aria-label="Open your profile">
            <span class="sidebar-avatar">${initials(user.fullName)}</span>
            <span class="sidebar-profile-text">
              <strong>${user.fullName}</strong>
              <small>${user.email}</small>
              <span>${user.role}</span>
            </span>
          </button>
        ` : ""}
        ${sidebarItems.map((item) => `<button class="${item === activeItem && appState.view !== "profile" ? "active" : ""}" onclick="setDashboardSection('${normalizedRole}', '${item}')">${item}</button>`).join("")}
      </aside>
      <div class="sidebar-backdrop" onclick="toggleSidebar()"></div>
      <section class="dashboard-main main-content">
        ${dashboardHeader(title, subtitle)}
        ${content}
        ${appState.certificateReviewOpen ? certificateReviewPanel() : ""}
      </section>
    </main>
  `;
}

function studentDashboard() {
  const user = currentUser();
  const progress = appState.certificateUnlocked ? 100 : appState.studentProgress.progress;
  const activeModule = appState.studentProgress.activeModule;
  const moduleData = fetchModuleLearningData(activeModule);
  const sidebar = dashboardSidebarItems("student");
  const section = activeDashboardSection("student");
  const dashboardOverview = `
    <div class="v1-row top-row">
      <article class="card data-card welcome-card span-65">
        <span class="label">Welcome</span>
        <h2>Welcome back, ${user ? user.fullName : "Student"}</h2>
        <p><strong>Course:</strong> ${course.title}</p>
        <p><strong>Current Module:</strong> Module ${activeModule + 1}: ${moduleData.module.title}</p>
        <button class="primary-button" onclick="continueLearning()">Continue Learning</button>
      </article>
      <article class="card data-card progress-card span-35">
        <span class="label">Course Progress</span>
        <div class="circle-progress" style="--progress: ${progress * 3.6}deg"><strong>${progress}%</strong></div>
        <p class="muted">Resume: ${formatActivityLabel(appState.studentProgress.activeActivity)}</p>
      </article>
    </div>
  `;

  const learningSection = `
    <article class="card data-card learning-workspace">
      <div class="split-actions">
        <div>
          <span class="label">Learning Workspace</span>
          <h2>Module ${activeModule + 1}: ${moduleData.module.title}</h2>
        </div>
        <span class="pill">Route: /student/dashboard</span>
      </div>
      ${moduleTabs(activeModule)}
      ${learningWorkspace(moduleData)}
    </article>
  `;

  const courseSection = `
    <article class="card data-card module-stack">
      <div class="split-actions"><span class="label">Course Modules</span><span class="muted">Full course path</span></div>
      ${course.modules.map((module, index) => `
        <div class="module-row">
          <div>
            <h3>Module ${index + 1}: ${module.title}</h3>
            <p class="muted">${module.assessment}</p>
          </div>
          <span>${module.lessons.length} lessons · ${index === 0 ? "1 quiz" : "1 task"}</span>
          <span class="pill">${index === 0 ? "Completed" : module.status === "active" ? "In progress" : "Locked"}</span>
          <button class="ghost-button" onclick="openStudentModule(${index})">Open Module</button>
        </div>
      `).join("")}
    </article>
  `;

  const tasksSection = `
    <div class="v1-row">
      <article class="card data-card span-50 task-grade-card">
        <span class="label">Upcoming Tasks</span>
        ${tasks.map((task) => `
          <div class="task-line">
            <div><strong>${task.name}</strong><p class="muted">Due ${task.due} · ${task.state}</p></div>
            <button class="ghost-button">Submit</button>
          </div>
        `).join("")}
      </article>
      <article class="card data-card span-50 task-grade-card">
        <span class="label">Grades Summary</span>
        ${grade("Quiz average", 82)}
        ${grade("Assignment score", 76)}
        ${grade("Overall grade", appState.certificateUnlocked ? 88 : 78)}
        <p><strong>Final project status:</strong> ${appState.certificateUnlocked ? "Passed" : "Not submitted"}</p>
      </article>
    </div>
  `;

  const announcementsSection = `
    <article class="card data-card">
      <span class="label">Announcements</span>
      <h2>Course Updates</h2>
      ${simpleRows([["Module 3 clinic", "Extra support session for AI bias and accountability."], ["Assignment reminder", "Privacy policy review closes this week."], ["Certificate note", "Certificates unlock only after progress, grade, and payment checks pass."]])}
    </article>
  `;

  const sectionContent = {
    Dashboard: `${dashboardOverview}${learningSection}${tasksSection}`,
    "My Course": courseSection,
    Lessons: learningSection,
    Quizzes: `<article class="card data-card"><span class="label">Quizzes</span><h2>Knowledge Checks</h2>${objectiveMarkingRows()}<button class="primary-button" onclick="openStudentActivity('quiz', 0)">Open Active Quiz</button></article>`,
    Assignments: `<article class="card data-card"><span class="label">Assignments</span>${tasks.map((task) => `<div class="task-line"><div><strong>${task.name}</strong><p class="muted">${task.type} · Due ${task.due} · ${task.state}</p></div><button class="ghost-button">Submit</button></div>`).join("")}</article>`,
    Grades: `<article class="card data-card task-grade-card"><span class="label">Grades</span>${grade("Quiz average", 82)}${grade("Assignment score", 76)}${grade("Overall grade", appState.certificateUnlocked ? 88 : 78)}</article>`,
    Certificate: studentCertificateSection(),
    Announcements: announcementsSection,
  };

  return dashboardLayout("Student", "Student Dashboard", "Welcome → Progress → Modules → Tasks → Grades → Certificate", sidebar, sectionContent[section] || sectionContent.Dashboard);
}

function moduleTabs(activeModule) {
  return `
    <div class="module-tabs" role="tablist" aria-label="Course modules">
      ${course.modules.map((module, index) => `
        <button class="${index === activeModule ? "active" : ""}" onclick="openStudentModule(${index})" role="tab" aria-selected="${index === activeModule}">
          ${index + 1}
        </button>
      `).join("")}
    </div>
  `;
}

function learningWorkspace(moduleData) {
  const [activityType, activityIndexValue] = appState.studentProgress.activeActivity.split(":");
  const activityIndex = Number(activityIndexValue);
  const activities = getModuleActivities(appState.studentProgress.activeModule);
  const active = activities.find((activity) => activity.key === appState.studentProgress.activeActivity) || activities[0];

  return `
    <div class="learning-grid">
      <aside class="activity-rail">
        <h3>Lessons</h3>
        ${activityButtons("lesson", moduleData.lessons)}
        <h3>Documents</h3>
        ${activityButtons("document", moduleData.documents)}
        <h3>Videos</h3>
        ${activityButtons("video", moduleData.videos)}
        <h3>Quizzes</h3>
        ${activityButtons("quiz", moduleData.quizzes)}
        <h3>Assignments</h3>
        ${activityButtons("assignment", moduleData.assignments)}
      </aside>
      <section class="activity-panel">
        ${renderActivityPanel(activityType, activityIndex, active)}
      </section>
    </div>
  `;
}

function activityButtons(type, items) {
  return items.map((item, index) => {
    const key = `${type}:${index}`;
    const completed = appState.studentProgress.completedActivities.includes(`${appState.studentProgress.activeModule}:${key}`);
    const active = appState.studentProgress.activeActivity === key;
    return `<button class="${active ? "active" : ""}" onclick="openStudentActivity('${type}', ${index})"><span>${item.title}</span><small>${completed ? "Completed" : formatActivityLabel(key)}</small></button>`;
  }).join("");
}

function renderActivityPanel(activityType, activityIndex, active) {
  if (!active) {
    return `<div class="empty-state"><h2>No activity found</h2><p class="muted">Choose a module tab or learning item.</p></div>`;
  }

  const item = active.item;
  const completed = appState.studentProgress.completedActivities.includes(`${appState.studentProgress.activeModule}:${active.key}`);
  const completeButton = `<button class="primary-button" onclick="completeActiveActivity()">${completed ? "Save Progress Again" : "Mark Complete and Save Progress"}</button>`;

  if (activityType === "document") {
    return `
      <span class="label">Document</span>
      <h2>${item.title}</h2>
      <div class="document-viewer">
        <strong>${item.type} learning material</strong>
        <span>${item.size}</span>
        <button class="ghost-button">${item.type === "PPTX" ? "Download PowerPoint" : "Open Document"}</button>
      </div>
      <p class="muted">Documents and PowerPoint downloads open inside the student dashboard workspace.</p>
      ${completeButton}
    `;
  }

  if (activityType === "video") {
    return `
      <span class="label">Video</span>
      <h2>${item.title}</h2>
      <div class="video-frame">Embedded ${item.provider} player · ${item.duration}</div>
      <p class="muted">Video playback remains inside /student/dashboard.</p>
      ${completeButton}
    `;
  }

  if (activityType === "quiz") {
    return `
      <span class="label">Quiz</span>
      <h2>${item.title}</h2>
      <p>${item.questions} objective questions · Passing score ${item.passingScore}%</p>
      <div class="quiz-card">
        <strong>Sample question</strong>
        <p>What does AI stand for?</p>
        <label><input type="radio" name="student-quiz" /> Artificial Intelligence</label>
        <label><input type="radio" name="student-quiz" /> Automated Internet</label>
      </div>
      ${completeButton}
    `;
  }

  if (activityType === "assignment") {
    return `
      <span class="label">Assignment</span>
      <h2>${item.title}</h2>
      <p class="muted">Due ${item.due} · ${item.submissionType}</p>
      <textarea>Type your response inside the dashboard workspace...</textarea>
      ${completeButton}
    `;
  }

  return `
    <span class="label">Lesson ${activityIndex + 1}</span>
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    <div class="lesson-content">
      <p>This lesson introduces the key ideas, examples, and reflection prompts for ${item.title.toLowerCase()}.</p>
      <p>Students continue learning here without leaving the dashboard route.</p>
    </div>
    ${completeButton}
  `;
}

function formatActivityLabel(activityKey) {
  const [type, index] = activityKey.split(":");
  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${Number(index) + 1}`;
}

function evaluateCertificateEligibility() {
  const settings = appState.certificateSettings;
  const completionOk = appState.studentProgress.progress >= 100;
  const gradeOk = settings.finalGrade >= settings.minimumPassMark;
  const paymentOk = settings.courseIsFree || settings.paymentStatus === "paid" || settings.adminApproved || !settings.requireFullPayment;
  const approvalOk = !settings.requireManualApproval || settings.adminApproved;
  const notRevoked = !settings.certificateRevoked;

  let reason = "eligible";
  if (!completionOk) reason = "completion";
  else if (!gradeOk) reason = "grade";
  else if (!paymentOk) reason = "payment";
  else if (!approvalOk) reason = "approval";
  else if (!notRevoked) reason = "revoked";

  return {
    eligible: completionOk && gradeOk && paymentOk && approvalOk && notRevoked,
    reason,
    completionOk,
    gradeOk,
    paymentOk,
    approvalOk,
    notRevoked,
  };
}

function studentCertificateSection() {
  const eligibility = evaluateCertificateEligibility();
  const settings = appState.certificateSettings;
  const record = appState.certificateRecord;

  let action = `<button class="ghost-button" onclick="unlockCertificate()">Simulate 100% Completion</button>`;
  let status = "Locked";
  let detail = `Complete the course and score at least ${settings.minimumPassMark}%.`;

  if (record && !settings.certificateRevoked) {
    status = `Generated (${record.status || "valid"})`;
    detail = `Certificate ${record.certificateNumber} generated on ${record.completionDate}.`;
    action = `<button class="primary-button" onclick="openCertificateReview()">Review Certificate</button><button class="ghost-button" onclick="openVerification('${record.certificateNumber}')">Verify</button>`;
  } else if (eligibility.eligible) {
    status = "Eligible";
    detail = "All certificate requirements are met.";
    action = `<button class="primary-button" onclick="generateCertificate()">Generate Certificate</button>`;
  } else if (eligibility.reason === "payment") {
    status = "Payment Required";
    detail = `Balance due: ${settings.amountDue}.`;
    action = `<button class="primary-button" onclick="payCertificateBalance()">Pay Balance</button>`;
  } else if (eligibility.reason === "approval") {
    status = "Pending Admin Approval";
    detail = "Your completion is waiting for admin certificate approval.";
    action = `<span class="pill warning-pill">Pending Admin Approval</span>`;
  } else if (eligibility.reason === "revoked") {
    status = "Revoked";
    detail = "This certificate has been revoked by admin.";
    action = `<span class="pill danger-pill">Certificate Revoked</span>`;
  } else if (eligibility.reason === "grade") {
    status = "Grade Below Pass Mark";
    detail = `Final grade ${settings.finalGrade}% is below ${settings.minimumPassMark}%.`;
  }

  return `
    <article class="card data-card certificate-engine">
      <div>
        <span class="label">Certificate Engine</span>
        <h2>${status}</h2>
        <p class="muted">${detail}</p>
        <div class="certificate-checks">
          ${certificateCheck("100% completion", eligibility.completionOk)}
          ${certificateCheck(`Final grade ${settings.finalGrade}%`, eligibility.gradeOk)}
          ${certificateCheck(settings.courseIsFree ? "Free course" : "Payment complete", eligibility.paymentOk)}
          ${certificateCheck("Admin approval", eligibility.approvalOk)}
        </div>
        ${record ? `<p class="muted">Verification: ${record.verificationUrl}</p>` : ""}
      </div>
      <div class="certificate-actions">${action}</div>
    </article>
  `;
}

function certificateCheck(label, passed) {
  return `<span class="pill ${passed ? "success-pill" : "warning-pill"}">${passed ? "OK" : "WAIT"} ${label}</span>`;
}

function aiInsights() {
  const pendingPayments = payments.filter((payment) => payment.status !== "Completed");
  const highRiskStudents = students.filter((student) => student.progress < 50 || student.risk === "High");
  const readyCertificates = certificates.filter((certificate) => certificate.completion === "100%" && certificate.status !== "Approved");
  const moduleThree = course.modules[2];
  const baseInsights = [
    {
      id: "ai_system_summary",
      type: "SYSTEM_SUMMARY",
      title: "Daily System Summary",
      summary: `${students.length} tracked learners, ${highRiskStudents.length} learner risk alerts, ${pendingPayments.length} pending payment issue, and ${readyCertificates.length} certificate item requiring review.`,
      recommendation: "Review the highest-priority learner and certificate queues before making manual decisions.",
      priority: highRiskStudents.length ? "HIGH" : "MEDIUM",
      source: "Students, payments, certificates, and course progress tables.",
    },
    {
      id: "ai_student_risk",
      type: "STUDENT_RISK",
      title: "Learner Risk Alerts",
      summary: highRiskStudents.length ? `${highRiskStudents.map((student) => student.name).join(", ")} need attention based on progress or risk status.` : "No high-risk learner pattern is visible in the current dashboard data.",
      recommendation: "Instructor should review progress and contact learners manually where appropriate.",
      priority: highRiskStudents.length ? "HIGH" : "LOW",
      source: "Progress percentage, risk labels, quiz scores, and project status.",
    },
    {
      id: "ai_course_performance",
      type: "COURSE_PERFORMANCE",
      title: "Course Performance Pattern",
      summary: `${moduleThree.title} is the active challenge point and includes AI bias, fairness, transparency, and accountability lessons.`,
      recommendation: "Consider adding a simpler explainer video or extra PDF notes for the AI ethics module.",
      priority: "MEDIUM",
      source: "Active module, assessment labels, and quiz/assignment examples.",
    },
    {
      id: "ai_payment_risk",
      type: "PAYMENT_RISK",
      title: "Payment Risk",
      summary: `${pendingPayments.length} payment record is pending and may block certificate access.`,
      recommendation: "Review pending balances and send manual reminders if appropriate.",
      priority: pendingPayments.length ? "HIGH" : "LOW",
      source: "Payment status table and certificate payment rules.",
    },
    {
      id: "ai_certificate_readiness",
      type: "CERTIFICATE_READINESS",
      title: "Certificate Readiness",
      summary: `${readyCertificates.length} learner has completed the course but still needs certificate review or approval.`,
      recommendation: "Review pending certificate approvals manually. Do not issue certificates automatically.",
      priority: readyCertificates.length ? "HIGH" : "LOW",
      source: "Certificate completion, grade, and status table.",
    },
    {
      id: "ai_instructor_activity",
      type: "INSTRUCTOR_ACTIVITY",
      title: "Instructor Activity",
      summary: `${submissions.length} submissions are visible, with ${submissions.filter((item) => item.status === "Pending").length} pending review item.`,
      recommendation: "Keep grading review time under 48 hours and manually prioritize pending submissions.",
      priority: "MEDIUM",
      source: "Submissions table and grade review panel.",
    },
  ];

  return baseInsights.map((insight) => ({
    ...insight,
    status: appState.aiInsightStatuses[insight.id] || "NEW",
    createdAt: new Date().toLocaleDateString(),
  }));
}

function setAiInsightStatus(id, status) {
  appState.aiInsightStatuses[id] = status;
  persistAiInsightStatuses();
  render();
}

function aiInsightCard(insight) {
  const priorityClass = insight.priority === "HIGH" || insight.priority === "CRITICAL" ? "danger-pill" : insight.priority === "MEDIUM" ? "warning-pill" : "success-pill";
  return `
    <article class="card data-card ai-insight-card">
      <div class="split-actions">
        <span class="label">AI Insight · ${insight.type}</span>
        <span class="pill ${priorityClass}">${insight.priority}</span>
      </div>
      <h3>${insight.title}</h3>
      <p>${insight.summary}</p>
      <p><strong>AI Suggestion:</strong> ${insight.recommendation}</p>
      <p class="muted"><strong>Data used:</strong> ${insight.source}</p>
      <div class="ai-safe-note">Recommendation only · Requires admin approval · No automatic execution</div>
      <div class="split-actions">
        <button class="ghost-button" onclick="setAiInsightStatus('${insight.id}', 'VIEWED')">View Details</button>
        <button class="ghost-button" onclick="setAiInsightStatus('${insight.id}', 'REVIEWED')">Mark as Reviewed</button>
        <button class="ghost-button" onclick="setAiInsightStatus('${insight.id}', 'DISMISSED')">Dismiss</button>
      </div>
    </article>
  `;
}

function aiCommandCenter() {
  const insights = aiInsights();
  const byType = Object.fromEntries(insights.map((insight) => [insight.type, insight]));
  return `
    <article class="card data-card">
      <div class="split-actions">
        <div>
          <span class="label">AI Command Center</span>
          <h2>Advisory Insights Only</h2>
          <p class="muted">AI summarizes patterns and suggests manual actions. It cannot approve payments, suspend users, change grades, issue certificates, modify content, delete records, change roles, or send official messages.</p>
        </div>
        <span class="pill warning-pill">Human approval required</span>
      </div>
    </article>
    ${aiInsightCard(byType.SYSTEM_SUMMARY)}
    <div class="v1-row">
      <div class="span-50">${aiInsightCard(byType.STUDENT_RISK)}</div>
      <div class="span-50">${aiInsightCard(byType.PAYMENT_RISK)}</div>
    </div>
    <div class="v1-row">
      <div class="span-50">${aiInsightCard(byType.COURSE_PERFORMANCE)}</div>
      <div class="span-50">${aiInsightCard(byType.CERTIFICATE_READINESS)}</div>
    </div>
    ${aiInsightCard(byType.INSTRUCTOR_ACTIVITY)}
    <article class="card data-card">
      <span class="label">AI Suggestions Table</span>
      <div class="table-wrap"><table>
        <thead><tr><th>Type</th><th>Title</th><th>Priority</th><th>Recommendation</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>
          ${insights.map((insight) => `
            <tr>
              <td>${insight.type}</td>
              <td><strong>${insight.title}</strong></td>
              <td><span class="pill">${insight.priority}</span></td>
              <td>${insight.recommendation}</td>
              <td><span class="pill">${insight.status}</span></td>
              <td>${insight.createdAt}</td>
              <td class="action-set">
                <button class="ghost-button table-button" onclick="setAiInsightStatus('${insight.id}', 'REVIEWED')">Reviewed</button>
                <button class="ghost-button table-button" onclick="setAiInsightStatus('${insight.id}', 'DISMISSED')">Dismiss</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table></div>
    </article>
  `;
}

function payCertificateBalance() {
  appState.certificateSettings.paymentStatus = "paid";
  appState.certificateSettings.amountDue = "UGX 0";
  persistCertificateSettings();
  render();
}

function certificateNumber() {
  return `AQODH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
}

function verificationUrl(certificateNo) {
  return `${window.location.origin}/certificates/verify/${certificateNo}`;
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function createTextImage(text, width, height, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  context.fillStyle = options.background || "transparent";
  if (options.background) context.fillRect(0, 0, width, height);
  context.fillStyle = options.color || "#1e3a8a";
  context.font = options.font || "700 42px Inter, Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, height / 2);
  return canvas.toDataURL("image/png");
}

function createAqodhLogoDataUrl() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  context.fillStyle = "#f8fafc";
  roundRect(context, 0, 0, 512, 512, 96);
  context.fill();

  context.fillStyle = "#1e3a8a";
  drawShield(context, 256, 42, 428, 112, 428, 238, 256, 470, 84, 238, 84, 112);
  context.fill();

  context.fillStyle = "#f8fafc";
  drawShield(context, 256, 74, 396, 132, 396, 240, 256, 432, 116, 240, 116, 132);
  context.fill();

  context.fillStyle = "#1e3a8a";
  drawShield(context, 256, 104, 366, 150, 366, 243, 256, 398, 146, 243, 146, 150);
  context.fill();

  context.fillStyle = "#d99a2b";
  context.beginPath();
  context.arc(256, 226, 78, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#1e3a8a";
  context.font = "900 116px Inter, Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("AQ", 256, 226);

  context.strokeStyle = "#d99a2b";
  context.lineCap = "round";
  context.lineWidth = 18;
  context.beginPath();
  context.moveTo(178, 326);
  context.lineTo(334, 326);
  context.stroke();

  context.lineWidth = 12;
  context.beginPath();
  context.moveTo(205, 354);
  context.lineTo(307, 354);
  context.stroke();

  return canvas.toDataURL("image/png");
}

function createSignatureDataUrl(name) {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 120;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#111827";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(34, 78);
  context.bezierCurveTo(95, 24, 122, 88, 166, 54);
  context.bezierCurveTo(203, 25, 242, 92, 286, 53);
  context.bezierCurveTo(320, 25, 354, 70, 390, 48);
  context.stroke();
  context.fillStyle = "#111827";
  context.font = "italic 30px Georgia, serif";
  context.textAlign = "center";
  context.fillText(name, 210, 62);
  return canvas.toDataURL("image/png");
}

function createOfficialSealDataUrl() {
  const canvas = document.createElement("canvas");
  canvas.width = 260;
  canvas.height = 260;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#d99a2b";
  context.fillStyle = "rgba(217, 154, 43, 0.08)";
  context.lineWidth = 10;
  context.beginPath();
  context.arc(130, 130, 105, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.lineWidth = 3;
  context.beginPath();
  context.arc(130, 130, 82, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#1e3a8a";
  context.font = "900 30px Inter, Arial";
  context.textAlign = "center";
  context.fillText("AQODH", 130, 118);
  context.fillStyle = "#d99a2b";
  context.font = "800 18px Inter, Arial";
  context.fillText("OFFICIAL SEAL", 130, 146);
  context.fillStyle = "#1e3a8a";
  context.font = "700 13px Inter, Arial";
  context.fillText("ACADEMY", 130, 170);
  return canvas.toDataURL("image/png");
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawShield(context, topX, topY, rightX, rightY, rightBottomX, rightBottomY, bottomX, bottomY, leftBottomX, leftBottomY, leftX, leftY) {
  context.beginPath();
  context.moveTo(topX, topY);
  context.lineTo(rightX, rightY);
  context.lineTo(rightBottomX, rightBottomY);
  context.bezierCurveTo(rightBottomX, 340, 350, 420, bottomX, bottomY);
  context.bezierCurveTo(162, 420, leftBottomX, 340, leftBottomX, leftBottomY);
  context.lineTo(leftX, leftY);
  context.closePath();
}

async function createQrCodeDataUrl(text) {
  if (window.QRCode && window.QRCode.toDataURL) {
    return window.QRCode.toDataURL(text, {
      margin: 1,
      width: 180,
      color: {
        dark: "#1e3a8a",
        light: "#ffffff",
      },
    });
  }

  return createVerificationCodeDataUrl(text);
}

function createVerificationCodeDataUrl(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 180;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 180, 180);
  context.fillStyle = "#1e3a8a";
  context.fillRect(10, 10, 42, 42);
  context.fillRect(128, 10, 42, 42);
  context.fillRect(10, 128, 42, 42);
  context.fillStyle = "#ffffff";
  context.fillRect(20, 20, 22, 22);
  context.fillRect(138, 20, 22, 22);
  context.fillRect(20, 138, 22, 22);

  let seed = 0;
  for (let index = 0; index < text.length; index += 1) {
    seed = (seed + text.charCodeAt(index) * (index + 3)) % 9973;
  }

  context.fillStyle = "#1e3a8a";
  for (let row = 0; row < 13; row += 1) {
    for (let col = 0; col < 13; col += 1) {
      const inFinder = (row < 4 && col < 4) || (row < 4 && col > 8) || (row > 8 && col < 4);
      if (!inFinder && ((row * 17 + col * 31 + seed) % 5 < 2)) {
        context.fillRect(18 + col * 11, 18 + row * 11, 8, 8);
      }
    }
  }

  context.fillStyle = "#1e3a8a";
  context.font = "700 12px Inter, Arial";
  context.textAlign = "center";
  context.fillText("VERIFY", 90, 96);
  return canvas.toDataURL("image/png");
}

async function embedImage(pdfDoc, source) {
  const data = source || createTextImage("AQODH", 320, 120, { color: "#1e3a8a", font: "800 52px Inter, Arial" });
  const bytes = dataUrlToUint8Array(data);
  if (data.startsWith("data:image/jpeg") || data.startsWith("data:image/jpg")) {
    return pdfDoc.embedJpg(bytes);
  }
  return pdfDoc.embedPng(bytes);
}

function hexToPdfRgb(hex, fallback) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback;
  const red = parseInt(hex.slice(1, 3), 16) / 255;
  const green = parseInt(hex.slice(3, 5), 16) / 255;
  const blue = parseInt(hex.slice(5, 7), 16) / 255;
  return window.PDFLib.rgb(red, green, blue);
}

async function generateCertificatePdf(record) {
  if (!window.PDFLib) {
    throw new Error("pdf-lib is not loaded");
  }

  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // Landscape A4 points.
  const { width, height } = page.getSize();
  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await pdfDoc.embedFont(StandardFonts.TimesItalic);
  const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const blue = hexToPdfRgb(appState.certificateSettings.primaryColor, rgb(0.12, 0.23, 0.54));
  const navy = rgb(0.06, 0.12, 0.28);
  const gold = hexToPdfRgb(appState.certificateSettings.accentColor, rgb(0.85, 0.60, 0.17));
  const paleGold = rgb(0.99, 0.95, 0.84);
  const muted = rgb(0.38, 0.44, 0.50);

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.985, 0.99, 1) });
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: blue, borderWidth: 5 });
  page.drawRectangle({ x: 38, y: 38, width: width - 76, height: height - 76, borderColor: gold, borderWidth: 2 });
  page.drawRectangle({ x: 54, y: 54, width: width - 108, height: height - 108, borderColor: blue, borderWidth: 0.75 });
  page.drawRectangle({ x: 42, y: height - 118, width: width - 84, height: 58, color: paleGold, opacity: 0.65 });

  page.drawText("AQODH", { x: 230, y: 235, size: 94, font: serifBold, color: blue, opacity: 0.07 });
  page.drawText("VERIFIED LEARNING", { x: 255, y: 210, size: 26, font: sansBold, color: blue, opacity: 0.08 });

  const logo = await embedImage(pdfDoc, createAqodhLogoDataUrl());
  page.drawImage(logo, { x: 74, y: 480, width: 112, height: 44 });
  page.drawText("AQODH Academy", { x: 196, y: 501, size: 23, font: sansBold, color: blue });
  page.drawText("Ethical technology education and professional certification", { x: 198, y: 484, size: 9.5, font: sans, color: muted });

  page.drawText("Certificate of Completion", { x: 242, y: 415, size: 37, font: serifBold, color: navy });
  page.drawText("This certificate is proudly presented to", { x: 312, y: 374, size: 13, font: sans, color: muted });
  page.drawText(record.studentName, { x: 263, y: 330, size: 34, font: serifBold, color: navy });
  page.drawLine({ start: { x: 220, y: 318 }, end: { x: 622, y: 318 }, thickness: 1, color: gold });
  page.drawText("for successfully completing the AQODH Academy course", { x: 277, y: 288, size: 13, font: sans, color: muted });
  page.drawText(record.courseName, { x: 231, y: 254, size: 24, font: serifBold, color: blue });

  page.drawText(`Final Grade: ${record.finalGrade}%`, { x: 92, y: 206, size: 11, font: sansBold, color: navy });
  page.drawText(`Completion Date: ${record.completionDate}`, { x: 245, y: 206, size: 11, font: sansBold, color: navy });
  page.drawText(`Issue Date: ${record.issueDate}`, { x: 455, y: 206, size: 11, font: sansBold, color: navy });
  page.drawText(`Status: ${record.status.toUpperCase()}`, { x: 620, y: 206, size: 11, font: sansBold, color: record.status === "valid" ? rgb(0.09, 0.39, 0.20) : rgb(0.60, 0.11, 0.11) });
  page.drawText(`Certificate No: ${record.certificateNumber}`, { x: 92, y: 184, size: 10, font: sans, color: muted });
  page.drawText(`Verify: ${record.verificationUrl}`, { x: 292, y: 184, size: 10, font: sans, color: muted });

  const qr = await embedImage(pdfDoc, record.qrCodeDataUri);
  page.drawImage(qr, { x: 692, y: 372, width: 76, height: 76 });
  page.drawText("Scan to verify", { x: 700, y: 357, size: 9, font: sansBold, color: blue });

  const seal = await embedImage(pdfDoc, createOfficialSealDataUrl());
  page.drawImage(seal, { x: 635, y: 88, width: 92, height: 92, opacity: 0.92 });

  const lecturerSignature = await embedImage(pdfDoc, createSignatureDataUrl(record.lecturerName));
  page.drawImage(lecturerSignature, { x: 140, y: 104, width: 145, height: 44 });
  page.drawLine({ start: { x: 116, y: 96 }, end: { x: 310, y: 96 }, thickness: 1, color: blue });
  page.drawText(record.lecturerName, { x: 142, y: 78, size: 10.5, font: sansBold, color: navy });
  page.drawText("Instructor", { x: 176, y: 63, size: 9, font: sans, color: muted });

  if (record.directorName) {
    const directorSignature = await embedImage(pdfDoc, createSignatureDataUrl(record.directorName));
    page.drawImage(directorSignature, { x: 392, y: 104, width: 145, height: 44 });
    page.drawLine({ start: { x: 368, y: 96 }, end: { x: 562, y: 96 }, thickness: 1, color: blue });
    page.drawText(record.directorName, { x: 398, y: 78, size: 10.5, font: sansBold, color: navy });
    page.drawText("Director / Admin", { x: 421, y: 63, size: 9, font: sans, color: muted });
  }

  page.drawText("Official certificate issued by AQODH Academy. Verification status is controlled by the certificate registry.", { x: 93, y: 43, size: 8.5, font: serifItalic, color: muted });

  return pdfDoc.saveAsBase64({ dataUri: true });
}

async function generateCertificate(force = false) {
  const eligibility = evaluateCertificateEligibility();
  if (!eligibility.eligible) {
    render();
    return;
  }

  if (appState.certificateRecord && !force) {
    openCertificateReview();
    return;
  }

  const record = {
    studentName: "Amina Kato",
    courseName: course.title,
    finalGrade: appState.certificateSettings.finalGrade,
    completionDate: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" }),
    certificateNumber: force && appState.certificateRecord ? appState.certificateRecord.certificateNumber : certificateNumber(),
    lecturerName: appState.certificateSettings.lecturerName,
    directorName: appState.certificateSettings.directorName,
    issueDate: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" }),
    status: "valid",
    templateVersion: CERTIFICATE_TEMPLATE_VERSION,
    generatedAt: new Date().toISOString(),
    revoked: false,
  };

  try {
    record.verificationUrl = verificationUrl(record.certificateNumber);
    record.qrCodeDataUri = await createQrCodeDataUrl(record.verificationUrl);
    record.qrCodeUrl = record.qrCodeDataUri;
    record.pdfDataUri = await generateCertificatePdf(record);
    record.pdfUrl = record.pdfDataUri;
    appState.certificateRecord = record;
    appState.certificateSettings.certificateRevoked = false;
    persistCertificateSettings();
    persistCertificateRecord();
    appState.certificateReviewOpen = true;
    render();
  } catch (error) {
    alert("Certificate PDF generation needs pdf-lib to load first. Check your connection and try again.");
  }
}

function certificateNeedsRegeneration(record) {
  return !record
    || record.templateVersion !== CERTIFICATE_TEMPLATE_VERSION
    || !record.qrCodeDataUri
    || !record.verificationUrl
    || !record.pdfDataUri;
}

async function openCertificateReview() {
  if (!appState.certificateRecord) {
    const eligibility = evaluateCertificateEligibility();
    if (eligibility.eligible) {
      await generateCertificate();
      scrollToCertificateReview();
      return;
    }
    alert("No generated certificate is available yet. The student must meet certificate eligibility first.");
    return;
  }

  if (certificateNeedsRegeneration(appState.certificateRecord)) {
    await refreshCertificatePdfFromExistingRecord();
  }

  appState.certificateReviewOpen = true;
  render();
  scrollToCertificateReview();
}

function scrollToCertificateReview() {
  window.setTimeout(() => {
    const panel = document.querySelector(".certificate-review");
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 0);
}

async function refreshCertificatePdfFromExistingRecord() {
  const record = appState.certificateRecord;
  if (!record) return;
  try {
    record.verificationUrl = verificationUrl(record.certificateNumber);
    record.qrCodeDataUri = await createQrCodeDataUrl(record.verificationUrl);
    record.qrCodeUrl = record.qrCodeDataUri;
    record.templateVersion = CERTIFICATE_TEMPLATE_VERSION;
    record.status = record.revoked ? "revoked" : (record.status || "valid");
    record.pdfDataUri = await generateCertificatePdf(record);
    record.pdfUrl = record.pdfDataUri;
    persistCertificateRecord();
  } catch (error) {
    alert("Certificate preview could not be refreshed because the PDF library is not ready. Check your connection and try again.");
  }
}

function closeCertificateReview() {
  appState.certificateReviewOpen = false;
  render();
}

function downloadReviewedCertificate() {
  downloadCertificate();
  closeCertificateReview();
}

function certificateReviewPanel() {
  const record = appState.certificateRecord;
  if (!record) return "";

  return `
    <article class="card data-card certificate-review">
      <div class="split-actions">
        <div>
          <span class="label">Certificate Review</span>
          <h2>Review before downloading</h2>
          <p class="muted">Please check the certificate details. Do you want to download it now?</p>
        </div>
        <span class="pill success-pill">${record.status || "valid"}</span>
      </div>
      <div class="certificate-review-grid">
        <div class="certificate-preview-frame">
          <iframe title="Certificate preview" src="${record.pdfDataUri}"></iframe>
        </div>
        <div class="certificate-review-details">
          <p><strong>Student:</strong> ${record.studentName}</p>
          <p><strong>Course:</strong> ${record.courseName}</p>
          <p><strong>Final grade:</strong> ${record.finalGrade}%</p>
          <p><strong>Completion date:</strong> ${record.completionDate}</p>
          <p><strong>Issue date:</strong> ${record.issueDate}</p>
          <p><strong>Certificate number:</strong> ${record.certificateNumber}</p>
          <p><strong>Verification:</strong> ${record.verificationUrl}</p>
          <div class="certificate-actions">
            <button class="primary-button" onclick="downloadReviewedCertificate()">Yes, Download</button>
            <button class="ghost-button" onclick="closeCertificateReview()">Not Now</button>
            <button class="ghost-button" onclick="openVerification('${record.certificateNumber}')">Verify</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function downloadCertificate() {
  const record = appState.certificateRecord;
  if (!record || !record.pdfDataUri) return;
  const link = document.createElement("a");
  link.href = record.pdfDataUri;
  link.download = `${record.certificateNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function viewCertificate() {
  openCertificateReview();
}

function updateCertificateSetting(key, value) {
  const settings = appState.certificateSettings;
  if (["courseIsFree", "requireFullPayment", "requireManualApproval", "adminApproved", "certificateRevoked"].includes(key)) {
    settings[key] = value === "true";
  } else if (key === "minimumPassMark" || key === "finalGrade") {
    settings[key] = Number(value);
  } else {
    settings[key] = value;
  }
  persistCertificateSettings();
  render();
}

function revokeCertificate() {
  appState.certificateSettings.certificateRevoked = true;
  if (appState.certificateRecord) {
    appState.certificateRecord.revoked = true;
    appState.certificateRecord.status = "revoked";
  }
  persistCertificateSettings();
  persistCertificateRecord();
  render();
}

function regenerateCertificate() {
  appState.certificateSettings.certificateRevoked = false;
  if (appState.certificateRecord) {
    appState.certificateRecord.revoked = false;
    appState.certificateRecord.status = "valid";
  }
  persistCertificateSettings();
  persistCertificateRecord();
  generateCertificate(true);
}

function certificateVerificationStatus(certificateNo) {
  const record = appState.certificateRecord;
  if (!certificateNo || !record || certificateNo !== record.certificateNumber) {
    return { status: "invalid", title: "Invalid Certificate", detail: "No certificate exists for this certificate number." };
  }
  if (record.revoked || appState.certificateSettings.certificateRevoked || record.status === "revoked") {
    return { status: "revoked", title: "Certificate Revoked", detail: "This certificate was issued by AQODH Academy but has been revoked." };
  }
  if (record.status === "pending") {
    return { status: "pending", title: "Certificate Pending", detail: "This certificate is waiting for final approval." };
  }
  return { status: "valid", title: "Certificate Valid", detail: "This certificate is valid and currently recognized by AQODH Academy." };
}

function logCertificateVerification(certificateNo) {
  const result = certificateVerificationStatus(certificateNo);
  appState.verificationLogs.unshift({
    certificateNumber: certificateNo || "none",
    status: result.status,
    checkedAt: new Date().toLocaleString(),
  });
  appState.verificationLogs = appState.verificationLogs.slice(0, 20);
  persistVerificationLogs();
}

function verificationPage() {
  const certificateNo = appState.verifyCertificateNumber || "";
  const result = certificateVerificationStatus(certificateNo);
  const record = appState.certificateRecord;
  return `
    <main class="public-main verification-page">
      <section class="verification-card card data-card">
        <span class="label">AQODH Certificate Verification</span>
        <h1>${result.title}</h1>
        <p class="muted">${result.detail}</p>
        <div class="verification-status ${result.status}">${result.status.toUpperCase()}</div>
        <form class="verify-form" onsubmit="event.preventDefault(); openVerification(this.certificateNumber.value);">
          <input name="certificateNumber" value="${certificateNo}" placeholder="Enter certificate number" />
          <button class="primary-button">Verify Certificate</button>
        </form>
        ${record && certificateNo === record.certificateNumber ? `
          <div class="verification-details">
            <p><strong>Student:</strong> ${record.studentName}</p>
            <p><strong>Course:</strong> ${record.courseName}</p>
            <p><strong>Final grade:</strong> ${record.finalGrade}%</p>
            <p><strong>Issue date:</strong> ${record.issueDate}</p>
            <p><strong>Certificate number:</strong> ${record.certificateNumber}</p>
          </div>
        ` : ""}
      </section>
    </main>
  `;
}

function grade(label, score) {
  return `
    <div style="margin: 16px 0">
      <div class="split-actions"><strong>${label}</strong><span>${score}%</span></div>
      <div class="progress-bar"><span style="width: ${score}%"></span></div>
    </div>
  `;
}

function coursePage() {
  return `
    <main class="dashboard">
      ${dashboardHeader(course.title, "Lesson sequence, assessments, and module completion state.")}
      <div class="grid">
        ${course.modules.map((module, index) => `
          <article class="card data-card half">
            <div class="split-actions">
              <span class="pill">Module ${index + 1}</span>
              <span class="pill">${module.status}</span>
            </div>
            <h2>${module.title}</h2>
            <ul class="plain-list">
              ${module.lessons.map((lesson) => `<li class="lesson-row"><span class="status-dot ${module.status === "completed" ? "done" : ""}"></span><span>${lesson}</span></li>`).join("")}
            </ul>
            <p class="muted" style="margin-top: 14px"><strong>Assessment:</strong> ${module.assessment}</p>
          </article>
        `).join("")}
      </div>
    </main>
  `;
}

function instructorDashboard() {
  const sidebar = dashboardSidebarItems("instructor");
  const active = activeDashboardSection("instructor");
  const stats = [["Total Students", "120"], ["Total Modules", course.modules.length], ["Pending Submissions", "34"], ["Average Completion", "56%"]];
  const longMark = markLongAnswer(longAnswerReview.answer, longAnswerReview.keywords, longAnswerReview.maxMarks);
  const content = `
    <div class="v1-row stat-row">${stats.map(([label, value]) => statCard(label, value)).join("")}</div>

    <div class="v1-row">
      <article class="card data-card span-60">
        <span class="label">Modules</span>
        <h2>Create course module</h2>
        <form class="form-grid" onsubmit="event.preventDefault();">
          <label>Module Title<input value="Module 1: Introduction to Ethical Computing" /></label>
          <label>Module Order<input type="number" value="1" /></label>
          <label class="full-field">Module Description<textarea>Foundations of ethical computing, real-world failures, and responsible decision-making.</textarea></label>
          <label>Status<select><option>Published</option><option>Draft</option></select></label>
          <button class="primary-button">Save Module</button>
        </form>
      </article>
      <article class="card data-card span-40 quick-actions">
        <span class="label">Ready Modules</span>
        ${course.modules.map((module, index) => `
          <div class="structure-line">
            <div><strong>Module ${index + 1}: ${module.title}</strong><p class="muted">${module.lessons.length} lessons · ${index < 3 ? "Published" : "Draft"}</p></div>
            <button class="ghost-button">Edit</button>
          </div>
        `).join("")}
      </article>
    </div>

    <div class="v1-row">
      <article class="card data-card span-50">
        <span class="label">Lessons</span>
        <h2>Add lesson content</h2>
        <form class="form-grid" onsubmit="event.preventDefault();">
          <label>Select Module${moduleSelect()}</label>
          <label>Lesson Type${optionSelect(lessonTypes)}</label>
          <label>Lesson Title<input value="Why ethics matters in technology" /></label>
          <label>Lesson Order<input type="number" value="2" /></label>
          <label class="full-field">Lesson Description<textarea>Explain how technical choices affect people, institutions, and public trust.</textarea></label>
          <label>Publish Status<select><option>Published</option><option>Draft</option></select></label>
          <button class="primary-button">Save Lesson</button>
        </form>
      </article>
      <article class="card data-card span-50">
        <span class="label">Documents</span>
        <h2>Upload learning material</h2>
        <form class="form-grid" onsubmit="event.preventDefault();">
          <label>Select Module${moduleSelect()}</label>
          <label>Select Lesson<select><option>What is ethical computing?</option><option>Fairness</option><option>Privacy by design</option></select></label>
          <label>Document Title<input value="Ethical Computing Primer" /></label>
          <label>Document Type<select><option>PDF</option><option>PPT</option><option>PPTX</option><option>DOC/DOCX</option></select></label>
          <label class="full-field">Short Description<textarea>Core reading for the first module.</textarea></label>
          <label class="upload-box full-field"><input type="file" /><strong>Drop PDF, PPT, PPTX, or DOC/DOCX here</strong><span>PowerPoint files are stored for download in V1.</span></label>
          <button class="primary-button">Save Document</button>
        </form>
        <div class="preview-grid">
          ${documentFiles.map((file) => `<div class="preview-card"><strong>${file.title}</strong><span>${file.type} · ${file.size}</span><small>${file.lesson}</small></div>`).join("")}
        </div>
      </article>
    </div>

    <div class="v1-row">
      <article class="card data-card span-50">
        <span class="label">Videos</span>
        <h2>Add video lesson</h2>
        <form class="form-grid" onsubmit="event.preventDefault();">
          <label>Select Module${moduleSelect()}</label>
          <label>Select Lesson<select><option>Privacy by design</option><option>Responsible disclosure</option></select></label>
          <label>Video Title<input value="Privacy by Design Walkthrough" /></label>
          <label>Duration<input value="12 min" /></label>
          <label class="full-field">Video URL<input value="https://youtube.com/watch?v=aqodh-privacy" /></label>
          <label class="full-field">Video Description<textarea>Short walkthrough of privacy-by-design choices in a learner app.</textarea></label>
          <button class="primary-button">Save Video</button>
        </form>
      </article>
      <article class="card data-card span-50">
        <span class="label">Video Display</span>
        <div class="video-frame">Embedded player preview</div>
        ${videoLessons.map((video) => `<div class="structure-line"><div><strong>${video.title}</strong><p class="muted">${video.provider} · ${video.duration}</p></div><button class="ghost-button">Mark as complete</button></div>`).join("")}
      </article>
    </div>

    <div class="v1-row">
      <article class="card data-card span-50">
        <span class="label">Objective Quizzes</span>
        <h2>Create objective question</h2>
        <form class="form-grid" onsubmit="event.preventDefault();">
          <label>Select Module${moduleSelect()}</label>
          <label>Question Type<select><option>Multiple Choice</option><option>True / False</option><option>Short Objective Answer</option></select></label>
          <label>Quiz Title<input value="AI Ethics Check" /></label>
          <label>Time Limit<input value="20 minutes" /></label>
          <label>Passing Score<input type="number" value="60" /></label>
          <label>Marks<input type="number" value="2" /></label>
          <label class="full-field">Instructions<textarea>Answer all questions. Objective items are auto-marked.</textarea></label>
          <label class="full-field">Question Text<textarea>What does AI stand for?</textarea></label>
          <label>Option A<input value="Artificial Intelligence" /></label>
          <label>Option B<input value="Automated Internet" /></label>
          <label>Option C<input value="Applied Interface" /></label>
          <label>Option D<input value="Advanced Input" /></label>
          <label>Correct Answer<input value="Artificial Intelligence" /></label>
          <button class="primary-button">Save Question</button>
          <button class="ghost-button">Publish Quiz</button>
        </form>
      </article>
      <article class="card data-card span-50">
        <span class="label">Auto Marking</span>
        <h2>Objective marking demo</h2>
        ${objectiveMarkingRows()}
      </article>
    </div>

    <div class="v1-row">
      <article class="card data-card span-50">
        <span class="label">Assignments</span>
        <h2>Create long-answer assignment</h2>
        <form class="form-grid" onsubmit="event.preventDefault();">
          <label>Select Module${moduleSelect()}</label>
          <label>Maximum Marks<input type="number" value="${longAnswerReview.maxMarks}" /></label>
          <label>Assignment Title<input value="AI Ethics Reflection" /></label>
          <label>Due Date<input type="date" value="2026-06-21" /></label>
          <label>Submission Type<select><option>Both</option><option>Typed answer</option><option>File upload</option></select></label>
          <label class="full-field">Question<textarea>${longAnswerReview.assignment}</textarea></label>
          <label class="full-field">Instructions<textarea>Use examples from AI bias, fairness, accountability, transparency, and privacy.</textarea></label>
          <label class="full-field">Expected Keywords<input value="${longAnswerReview.keywords.join(", ")}" /></label>
          <label class="full-field">Rubric<textarea>Clear explanation, relevant ethical concepts, practical examples, and concise writing.</textarea></label>
          <button class="primary-button">Publish Assignment</button>
        </form>
      </article>
      <article class="card data-card span-50">
        <span class="label">Review Submission</span>
        <h2>${longAnswerReview.student}</h2>
        <p class="answer-box">${longAnswerReview.answer}</p>
        <div class="keyword-columns">
          <div><strong>Matched keywords</strong>${keywordList(longMark.matched, "success")}</div>
          <div><strong>Missing keywords</strong>${keywordList(longMark.missing, "warning")}</div>
        </div>
        <p><strong>Auto score:</strong> ${longMark.score}/${longAnswerReview.maxMarks}</p>
        <label>Instructor score<input type="number" value="${longMark.score}" /></label>
        <label>Feedback<textarea>Good coverage of the expected ethical AI concepts. Add one concrete example before final grade.</textarea></label>
        <button class="primary-button">Save Grade</button>
      </article>
    </div>

    <article class="card data-card">
      <span class="label">Submissions</span>
      ${assignmentMarkingTable(longMark.score)}
    </article>

    <article class="card data-card">
      <span class="label">Implementation Notes</span>
      <div class="tech-list">
        ${["react-dropzone for document upload", "react-pdf for PDF preview", "react-player for video links", "react-hook-form + zod for forms", "TanStack Table for tables", "multer + Prisma for backend uploads and data"].map((item) => `<span>${item}</span>`).join("")}
      </div>
    </article>

    <article class="card data-card">
      <span class="label">Student Progress</span>
      ${studentProgressTable()}
    </article>
  `;

  const sectionContent = {
    Dashboard: content,
    "My Courses": `<article class="card data-card"><span class="label">My Courses</span><h2>${course.title}</h2>${simpleRows([["Duration", course.duration], ["Modules", course.modules.length], ["Mode", course.mode], ["Certificate", "Enabled"]])}</article>`,
    Modules: `<article class="card data-card"><span class="label">Modules</span><h2>Course Structure</h2>${course.modules.map((module, index) => `<div class="structure-line"><div><strong>Module ${index + 1}: ${module.title}</strong><p class="muted">${module.assessment}</p></div><button class="ghost-button">Edit</button></div>`).join("")}</article>`,
    Lessons: `<article class="card data-card"><span class="label">Lessons</span><h2>Add lesson content</h2><form class="form-grid" onsubmit="event.preventDefault();"><label>Select Module${moduleSelect()}</label><label>Lesson Type${optionSelect(lessonTypes)}</label><label class="full-field">Lesson Title<input value="Why ethics matters in technology" /></label><button class="primary-button">Save Lesson</button></form></article>`,
    Documents: `<article class="card data-card"><span class="label">Documents</span><h2>Document Library</h2><div class="preview-grid">${documentFiles.map((file) => `<div class="preview-card"><strong>${file.title}</strong><span>${file.type} · ${file.size}</span><small>${file.lesson}</small></div>`).join("")}</div></article>`,
    Videos: `<article class="card data-card"><span class="label">Videos</span><h2>Video Lessons</h2>${videoLessons.map((video) => `<div class="structure-line"><div><strong>${video.title}</strong><p class="muted">${video.provider} · ${video.duration}</p></div><button class="ghost-button">Edit</button></div>`).join("")}</article>`,
    Quizzes: `<article class="card data-card"><span class="label">Quizzes</span><h2>Objective Marking</h2>${objectiveMarkingRows()}</article>`,
    Assignments: `<article class="card data-card"><span class="label">Assignments</span><h2>Create long-answer assignment</h2><p class="answer-box">${longAnswerReview.assignment}</p>${keywordList(longAnswerReview.keywords, "success")}</article>`,
    Submissions: `<article class="card data-card"><span class="label">Submissions</span>${assignmentMarkingTable(longMark.score)}</article>`,
    Grades: `<article class="card data-card"><span class="label">Grades</span><h2>Grade Review Panel</h2><p><strong>Auto score:</strong> ${longMark.score}/${longAnswerReview.maxMarks}</p><label>Instructor score<input type="number" value="${longMark.score}" /></label><label>Feedback<textarea>Good coverage. Add one concrete example before final grade.</textarea></label><button class="primary-button">Save Grade</button></article>`,
    Announcements: `<article class="card data-card"><span class="label">Announcements</span><h2>Course Messages</h2>${simpleRows([["Welcome note", "Published to current cohort"], ["Assessment reminder", "Draft"], ["Certificate guidance", "Published"]])}</article>`,
  };

  return dashboardLayout("Instructor", "Instructor Dashboard", "Create modules, lessons, documents, videos, quizzes, assignments, submissions, and grades.", sidebar, sectionContent[active] || content);
}

function moduleSelect() {
  return `<select>${course.modules.map((module, index) => `<option>Module ${index + 1}: ${module.title}</option>`).join("")}</select>`;
}

function optionSelect(options) {
  return `<select>${options.map((option) => `<option>${option}</option>`).join("")}</select>`;
}

function markObjective(studentAnswer, correctAnswer) {
  return studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

function markLongAnswer(answer, keywords, maxMarks) {
  const normalized = answer.toLowerCase();
  const matched = keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  const missing = keywords.filter((keyword) => !normalized.includes(keyword.toLowerCase()));
  return {
    matched,
    missing,
    score: Math.round((matched.length / keywords.length) * maxMarks * 10) / 10,
  };
}

function objectiveMarkingRows() {
  return quizQuestions.map((item) => {
    const correct = markObjective(item.studentAnswer, item.correct);
    return `
      <div class="marking-row">
        <div>
          <strong>${item.question}</strong>
          <p class="muted">${item.type} · Student answer: ${item.studentAnswer}</p>
        </div>
        <span class="pill ${correct ? "success-pill" : "danger-pill"}">${correct ? "Correct" : "Incorrect"}</span>
        <span>${correct ? item.marks : 0}/${item.marks} marks</span>
      </div>
    `;
  }).join("");
}

function keywordList(items, tone) {
  const className = tone === "success" ? "success-pill" : "warning-pill";
  return `<div class="badge-row">${items.map((item) => `<span class="pill ${className}">${item}</span>`).join("") || "<span class=\"muted\">None</span>"}</div>`;
}

function assignmentMarkingTable(autoScore) {
  const rows = [
    { student: longAnswerReview.student, assignment: "AI Ethics Reflection", submitted: longAnswerReview.submitted, score: `${autoScore}/${longAnswerReview.maxMarks}`, status: longAnswerReview.status },
    { student: "Amina Kato", assignment: "Privacy Policy Review", submitted: "Jun 08", score: "8/10", status: "Reviewed" },
    { student: "Nabirye Grace", assignment: "Case Analysis", submitted: "Jun 07", score: "5.5/10", status: "Needs override" },
  ];

  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Student Name</th><th>Assignment Title</th><th>Submitted Date</th><th>Auto Score</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td><strong>${row.student}</strong></td>
            <td>${row.assignment}</td>
            <td>${row.submitted}</td>
            <td>${row.score}</td>
            <td><span class="pill">${row.status}</span></td>
            <td><button class="ghost-button table-button">Review Submission</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function adminDashboard() {
  const sidebar = dashboardSidebarItems("admin");
  const active = activeDashboardSection("admin");
  const stats = [["Total Users", "250"], ["Total Students", "210"], ["Revenue", "UGX 5,250,000"], ["Certificates", "45"]];
  const content = `
    <div class="v1-row stat-row">${stats.map(([label, value]) => statCard(label, value)).join("")}</div>
    <div class="v1-row analytics-row">
      <article class="card data-card span-60">
        <span class="label">Enrollment Chart</span>
        <h2>Monthly enrollments</h2>
        <div class="bar-chart">
          ${[34, 48, 63, 57, 82, 96].map((height, index) => `<span style="height:${height}%"><em>${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</em></span>`).join("")}
        </div>
      </article>
      <article class="card data-card span-40 revenue-card">
        <span class="label">Revenue</span>
        <h2>UGX 5,250,000</h2>
        ${simpleRows([["Pending payments", "18"], ["Completed payments", "142"], ["Failed payments", "5"]])}
      </article>
    </div>
    <div class="v1-row recent-row">
      <article class="card data-card span-50">
        <span class="label">Recent Users</span>
        ${recentUsersTable()}
      </article>
      <article class="card data-card span-50">
        <span class="label">Recent Payments</span>
        ${paymentsTable()}
      </article>
    </div>
    <article class="card data-card">
      <span class="label">Certificates Approval</span>
      ${certificatesTable()}
    </article>
    <article class="card data-card">
      <span class="label">Certificate Engine Settings</span>
      ${adminCertificateControls()}
    </article>
    <article class="card data-card">
      <span class="label">Admin User Management</span>
      ${authNotice()}
      <div class="v1-row">
        <form class="form-grid span-40" onsubmit="createInstructor(event)">
          <h2 class="full-field">Create Instructor</h2>
          <label>Full Name<input name="fullName" required value="New Instructor" /></label>
          <label>Email<input name="email" type="email" required value="new.instructor@aqodh.academy" /></label>
          <label class="full-field">Temporary Password<input name="password" required value="instructor123" /></label>
          <button class="primary-button" type="submit">Create Instructor</button>
        </form>
        <div class="span-60">
          ${adminUsersTable()}
        </div>
      </div>
    </article>
  `;

  const userManagement = `
    <article class="card data-card">
      <span class="label">Admin User Management</span>
      ${authNotice()}
      <div class="v1-row">
        <form class="form-grid span-40" onsubmit="createInstructor(event)">
          <h2 class="full-field">Create Instructor</h2>
          <label>Full Name<input name="fullName" required value="New Instructor" /></label>
          <label>Email<input name="email" type="email" required value="new.instructor@aqodh.academy" /></label>
          <label class="full-field">Temporary Password<input name="password" required value="instructor123" /></label>
          <button class="primary-button" type="submit">Create Instructor</button>
        </form>
        <div class="span-60">${adminUsersTable()}</div>
      </div>
    </article>
  `;

  const sectionContent = {
    Dashboard: content,
    "AI Insights": aiCommandCenter(),
    Users: userManagement,
    Courses: `<article class="card data-card"><span class="label">Courses</span><h2>${course.title}</h2>${simpleRows([["Modules", course.modules.length], ["Mode", course.mode], ["Certificate", "Enabled"], ["Pricing", appState.certificateSettings.courseIsFree ? "Free" : "Paid"]])}</article>`,
    Instructors: `<article class="card data-card"><span class="label">Instructors</span>${adminUsersTable()}</article>`,
    Students: `<article class="card data-card"><span class="label">Students</span>${studentProgressTable()}</article>`,
    Payments: `<article class="card data-card"><span class="label">Payments</span>${paymentsTable()}</article>`,
    Certificates: `<article class="card data-card"><span class="label">Certificates Approval</span>${certificatesTable()}</article><article class="card data-card"><span class="label">Certificate Engine Settings</span>${adminCertificateControls()}</article>`,
    Reports: `<article class="card data-card"><span class="label">Reports</span><h2>System Reports</h2>${simpleRows([["Total users", "250"], ["Total students", "210"], ["Certificates issued", "45"], ["Pending payments", "18"]])}</article>`,
    Settings: `<article class="card data-card"><span class="label">Settings</span>${adminCertificateControls()}</article>`,
  };

  return dashboardLayout("Admin", "Admin Dashboard", "Stats → Enrollment Analytics → Revenue → Users → Payments → Certificates", sidebar, sectionContent[active] || content);
}

function adminUsersTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
      <tbody>
        ${appState.users.map((user) => `
          <tr>
            <td><strong>${user.fullName}</strong></td>
            <td>${user.email}</td>
            <td>
              <select onchange="changeUserRole('${user.id}', this.value)">
                ${["student", "instructor", "admin"].map((role) => `<option value="${role}" ${user.role === role ? "selected" : ""}>${role}</option>`).join("")}
              </select>
            </td>
            <td><span class="pill">${user.status}</span></td>
            <td>${new Date(user.updatedAt).toLocaleDateString()}</td>
            <td class="action-set">
              <button class="ghost-button table-button" onclick="updateUserStatus('${user.id}', 'ACTIVE')">Approve/Reactivate</button>
              <button class="ghost-button table-button" onclick="updateUserStatus('${user.id}', 'SUSPENDED')">Suspend</button>
              <button class="ghost-button table-button" onclick="resetUserPassword('${user.id}')">Reset Password</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function adminCertificateControls() {
  const settings = appState.certificateSettings;
  const record = appState.certificateRecord;

  return `
    <div class="certificate-admin-grid">
      <label>Course pricing
        <select onchange="updateCertificateSetting('courseIsFree', this.value)">
          <option value="false" ${!settings.courseIsFree ? "selected" : ""}>Paid course</option>
          <option value="true" ${settings.courseIsFree ? "selected" : ""}>Free course</option>
        </select>
      </label>
      <label>Require full payment
        <select onchange="updateCertificateSetting('requireFullPayment', this.value)">
          <option value="true" ${settings.requireFullPayment ? "selected" : ""}>Required</option>
          <option value="false" ${!settings.requireFullPayment ? "selected" : ""}>Not required</option>
        </select>
      </label>
      <label>Payment status
        <select onchange="updateCertificateSetting('paymentStatus', this.value)">
          <option value="balance_due" ${settings.paymentStatus === "balance_due" ? "selected" : ""}>Balance due</option>
          <option value="paid" ${settings.paymentStatus === "paid" ? "selected" : ""}>Paid</option>
        </select>
      </label>
      <label>Manual approval
        <select onchange="updateCertificateSetting('requireManualApproval', this.value)">
          <option value="true" ${settings.requireManualApproval ? "selected" : ""}>Required</option>
          <option value="false" ${!settings.requireManualApproval ? "selected" : ""}>Not required</option>
        </select>
      </label>
      <label>Admin approval
        <select onchange="updateCertificateSetting('adminApproved', this.value)">
          <option value="false" ${!settings.adminApproved ? "selected" : ""}>Pending</option>
          <option value="true" ${settings.adminApproved ? "selected" : ""}>Approved</option>
        </select>
      </label>
      <label>Minimum pass mark
        <input type="number" value="${settings.minimumPassMark}" onchange="updateCertificateSetting('minimumPassMark', this.value)" />
      </label>
      <label>Student final grade
        <input type="number" value="${settings.finalGrade}" onchange="updateCertificateSetting('finalGrade', this.value)" />
      </label>
      <label>Primary color
        <input type="color" value="${settings.primaryColor}" onchange="updateCertificateSetting('primaryColor', this.value)" />
      </label>
      <label>Accent color
        <input type="color" value="${settings.accentColor}" onchange="updateCertificateSetting('accentColor', this.value)" />
      </label>
      <label>Design theme
        <select onchange="updateCertificateSetting('designTheme', this.value)">
          <option ${settings.designTheme === "Premium Blue and Gold" ? "selected" : ""}>Premium Blue and Gold</option>
          <option ${settings.designTheme === "Formal Minimal" ? "selected" : ""}>Formal Minimal</option>
        </select>
      </label>
      <div class="system-certificate-assets full-field">
        <strong>Built-in demo certificate assets</strong>
        <span>Lecturer: ${settings.lecturerName}</span>
        <span>Director/admin: ${settings.directorName}</span>
        <span>AQODH logo, lecturer signature, director signature, and official seal are generated automatically by the system.</span>
      </div>
    </div>
    <div class="certificate-admin-actions">
      <button class="ghost-button" onclick="revokeCertificate()">Revoke Certificate</button>
      <button class="ghost-button" onclick="viewCertificate()">View Certificate</button>
      <button class="primary-button" onclick="regenerateCertificate()">Regenerate Certificate</button>
      <span class="pill ${record && !settings.certificateRevoked ? "success-pill" : "warning-pill"}">${record ? `Saved: ${record.certificateNumber}` : "No certificate generated"}</span>
    </div>
    ${verificationLogsTable()}
  `;
}

function verificationLogsTable() {
  return `
    <div class="verification-log-block">
      <h3>Certificate Verification Logs</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Certificate Number</th><th>Status</th><th>Checked At</th></tr></thead>
        <tbody>
          ${appState.verificationLogs.map((log) => `<tr><td>${log.certificateNumber}</td><td><span class="pill">${log.status}</span></td><td>${log.checkedAt}</td></tr>`).join("") || `<tr><td colspan="3">No verification checks yet.</td></tr>`}
        </tbody>
      </table></div>
    </div>
  `;
}

function enrollPage() {
  return `
    <main class="dashboard">
      ${dashboardHeader("Enroll", "Create an account and start Ethical Computing Fundamentals.")}
      <div class="grid">
        <form class="card data-card half" onsubmit="event.preventDefault(); enroll();">
          <span class="label">Student Registration</span>
          <h2>Create learner account</h2>
          <input required placeholder="Full name" aria-label="Full name" />
          <input required type="email" placeholder="Email address" aria-label="Email address" />
          <select aria-label="Plan">
            <option>Student · UGX 50,000</option>
            <option>Professional · UGX 150,000</option>
            <option>Organization · Custom</option>
          </select>
          <button class="primary-button" type="submit">Register and enroll</button>
        </form>
        <article class="card data-card half">
          <span class="label">Login</span>
          <h2>Demo role access</h2>
          <p class="muted">Switch roles to preview protected dashboard experiences for students, instructors, and admins.</p>
          <div class="split-actions">
            <button class="ghost-button" onclick="setRole('student')">Student login</button>
            <button class="ghost-button" onclick="setRole('instructor')">Instructor login</button>
            <button class="ghost-button" onclick="setRole('admin')">Admin login</button>
          </div>
        </article>
      </div>
    </main>
  `;
}

function studentTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Progress</th><th>Quiz</th><th>Project</th><th>Risk</th></tr></thead>
      <tbody>
        ${students.map((student) => `
          <tr>
            <td><strong>${student.name}</strong></td>
            <td>${student.progress}%</td>
            <td>${student.quiz}%</td>
            <td>${student.project}</td>
            <td><span class="pill">${student.risk}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function statCard(label, value) {
  return `<article class="card stat-card"><span class="label">${label}</span><strong>${value}</strong></article>`;
}

function studentProgressTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Student Name</th><th>Email</th><th>Progress</th><th>Last Active</th><th>Quiz Average</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${students.map((student) => `
          <tr>
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td>${student.progress}%</td>
            <td>${student.lastActive}</td>
            <td>${student.quiz}%</td>
            <td><span class="pill">${student.status}</span></td>
            <td><button class="ghost-button table-button">View Details</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function submissionsTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Student</th><th>Assignment</th><th>Submitted Date</th><th>Status</th><th>Grade</th><th>Action</th></tr></thead>
      <tbody>
        ${submissions.map((submission) => `
          <tr>
            <td><strong>${submission.student}</strong></td>
            <td>${submission.assignment}</td>
            <td>${submission.submitted}</td>
            <td><span class="pill">${submission.status}</span></td>
            <td>${submission.grade}</td>
            <td><button class="ghost-button table-button">View Details</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function recentUsersTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Joined Date</th><th>Status</th></tr></thead>
      <tbody>
        ${students.map((student) => `
          <tr>
            <td><strong>${student.name}</strong></td>
            <td>${student.role}</td>
            <td>${student.email}</td>
            <td>${student.joined}</td>
            <td><span class="pill">${student.status}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function paymentsTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        ${payments.map((payment) => `
          <tr>
            <td><strong>${payment.student}</strong></td>
            <td>${payment.course}</td>
            <td>${payment.amount}</td>
            <td><span class="pill">${payment.status}</span></td>
            <td>${payment.date}</td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function certificatesTable() {
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Student</th><th>Course</th><th>Completion %</th><th>Final Grade</th><th>Certificate Status</th><th>Action</th></tr></thead>
      <tbody>
        ${certificates.map((certificate) => `
          <tr>
            <td><strong>${certificate.student}</strong></td>
            <td>${certificate.course}</td>
            <td>${certificate.completion}</td>
            <td>${certificate.grade}</td>
            <td><span class="pill">${certificate.status}</span></td>
            <td class="action-set"><button class="ghost-button table-button">Approve</button><button class="ghost-button table-button">Reject</button><button class="ghost-button table-button" onclick="viewCertificate()">View</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>
  `;
}

function simpleRows(rows) {
  return `<ul class="plain-list">${rows.map(([name, value]) => `<li class="table-row"><span class="status-dot done"></span><strong>${name}</strong><span class="pill">${value}</span></li>`).join("")}</ul>`;
}

function footer() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <strong>AQODH Academy</strong>
        <span>Contact: hello@aqodh.academy</span>
        <span>LinkedIn · X · YouTube</span>
      </div>
    </footer>
  `;
}

function render() {
  const views = {
    home,
    course: coursePage,
    enroll: enrollPage,
    login: loginPage,
    register: registerPage,
    "forgot-password": forgotPasswordPage,
    "reset-password": resetPasswordPage,
    "verify-email": verifyEmailPage,
    profile: profilePage,
    "student-dashboard": studentDashboard,
    "instructor-dashboard": instructorDashboard,
    "admin-dashboard": adminDashboard,
    "certificate-verify": verificationPage,
  };

  shell((views[appState.view] || home)());
}

render();
