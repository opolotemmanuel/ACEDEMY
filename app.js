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

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers,
      credentials: "same-origin",
    });
  } catch (error) {
    throw new Error("AQODH API server is not available.");
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

function upsertUser(user) {
  const existing = appState.users.find((item) => item.id === user.id);
  if (existing) {
    Object.assign(existing, user);
  } else {
    appState.users.push(user);
  }
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
  backendCourse: null,
  publicCourse: null,
  publicCourseLoading: false,
  backendProgress: null,
  backendLearningLoading: false,
  adminDashboardData: null,
  instructorDashboardData: null,
  adminDashboardLoading: false,
  instructorDashboardLoading: false,
  users: [],
  session: null,
  authMessage: "",
};

const app = document.querySelector("#app");

function viewForPath(pathname) {
  if (pathname === "/student/dashboard") return "student-dashboard";
  if (pathname === "/instructor/dashboard") return "instructor-dashboard";
  if (pathname === "/admin/dashboard") return "admin-dashboard";
  if (pathname === "/login") return "login";
  if (pathname === "/register") return "register";
  if (pathname === "/profile") return "profile";
  if (pathname === "/privacy-policy") return "privacy-policy";
  if (pathname === "/terms-of-service") return "terms-of-service";
  if (pathname.startsWith("/certificates/verify/")) return "certificate-verify";
  return "home";
}

function pathForView(view) {
  const paths = {
    home: "/",
    login: "/login",
    register: "/register",
    profile: "/profile",
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
    "student-dashboard": "/student/dashboard",
    "instructor-dashboard": "/instructor/dashboard",
    "admin-dashboard": "/admin/dashboard",
  };
  return paths[view] || "/";
}

function setView(view, options = {}) {
  const protectedRole = protectedRouteRole(view);
  if (protectedRole && !canAccessRole(protectedRole)) {
    appState.authMessage = `Please log in as ${protectedRole} to access this dashboard.`;
    appState.view = "login";
    if (!options.skipHistory) window.history.pushState({}, "", "/login");
    appState.sidebarOpen = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  appState.view = view;
  if (!options.skipHistory) {
    const path = pathForView(view);
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
  }
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

function normalizeBackendCourse(courseData) {
  if (!courseData) return null;
  return {
    ...courseData,
    duration: courseData.duration || `${courseData.durationWeeks || 0} weeks`,
    level: courseData.level || "",
    mode: courseData.mode || "Online",
    certificate: courseData.certificate ?? true,
    progress: courseData.progressPercentage || 0,
    modules: (courseData.modules || []).map((module) => ({
      ...module,
      assessment: module.description || "No backend assignment configured yet.",
      status: String(module.status || "DRAFT").toLowerCase(),
      lessons: (module.lessons || []).map((lesson) => ({
        ...lesson,
        title: lesson.title,
        description: lesson.description || lesson.content || `${lesson.title} in ${module.title}.`,
        type: lesson.lessonType || "TEXT",
      })),
    })),
  };
}

function landingCourse() {
  return appState.publicCourse || course;
}

function ensurePublicCourseLoaded() {
  if (appState.publicCourse || appState.publicCourseLoading) return;
  appState.publicCourseLoading = true;
  apiRequest("/api/courses/current")
    .then(({ course: courseData }) => {
      appState.publicCourse = normalizeBackendCourse(courseData);
      appState.publicCourseLoading = false;
      if (appState.view === "home") render();
    })
    .catch(() => {
      appState.publicCourseLoading = false;
    });
}

function backendCourseList(role = "admin") {
  const data = role === "instructor" ? appState.instructorDashboardData : appState.adminDashboardData;
  return (data?.courses || []).map(normalizeBackendCourse);
}

function backendPrimaryCourse(role = "admin") {
  return backendCourseList(role)[0] || null;
}

function emptyBackendState(title, detail) {
  return `<div class="empty-state"><h2>${title}</h2><p class="muted">${detail}</p></div>`;
}

function canAccessRole(role) {
  const user = currentUser();
  return Boolean(user && user.role === role && user.status === "ACTIVE");
}

function redirectByRole(role) {
  setView(`${role.toLowerCase()}-dashboard`);
}

async function restoreCurrentUser() {
  try {
    const data = await apiRequest("/api/auth/me");
    upsertUser(data.user);
    appState.session = { userId: data.user.id, createdAt: new Date().toISOString() };
    appState.role = data.user.role;
    return data.user;
  } catch (error) {
    appState.session = null;
    return null;
  }
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
    if (appState.session) {
      await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
    }
  } catch (error) {
    // The local session is still cleared when the server cannot be reached.
  }
  appState.session = null;
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
    appState.session = { userId: data.user.id, createdAt: new Date().toISOString() };
    appState.role = data.user.role;
    appState.authMessage = "";
    redirectByRole(data.user.role);
    return;
  } catch (error) {
    appState.authMessage = error.message;
    render();
    return;
  }
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
    appState.session = { userId: data.user.id, createdAt: new Date().toISOString() };
    appState.role = data.user.role;
    appState.authMessage = "";
    redirectByRole(data.user.role);
    return;
  } catch (error) {
    appState.authMessage = error.message;
    render();
    return;
  }
}

async function requestPasswordReset(event) {
  event.preventDefault();
  const form = event.currentTarget;
  try {
    await apiRequest("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: form.email.value.trim().toLowerCase() }),
    });
    appState.authMessage = "If the email exists, a reset link will be sent.";
  } catch (error) {
    appState.authMessage = error.message;
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
  appState.authMessage = "A reset token is required.";
  render();
}

async function requestEmailVerification() {
  try {
    const data = await apiRequest("/api/auth/resend-verification", { method: "POST", body: "{}" });
    appState.authMessage = data.alreadyVerified
      ? "Email is already verified."
      : "Verification email requested.";
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
    appState.authMessage = error.message;
    render();
    return;
  }
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
    appState.authMessage = error.message;
    render();
    return;
  }
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
    appState.adminDashboardData = null;
    appState.authMessage = "Instructor created with pending status.";
    render();
    return;
  } catch (error) {
    appState.authMessage = error.message;
    render();
    return;
  }
}

async function updateUserStatus(userId, status) {
  try {
    const data = await apiRequest(`/api/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    upsertUser(data.user);
    appState.adminDashboardData = null;
    render();
    return;
  } catch (error) {
    appState.authMessage = error.message;
    render();
    return;
  }
}

async function changeUserRole(userId, role) {
  try {
    const data = await apiRequest(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    upsertUser(data.user);
    appState.adminDashboardData = null;
    render();
    return;
  } catch (error) {
    appState.authMessage = error.message;
    render();
    return;
  }
}

async function resetUserPassword(userId) {
  try {
    const data = await apiRequest(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ password: "Password123" }),
    });
    upsertUser(data.user);
    appState.adminDashboardData = null;
    appState.authMessage = `${data.user.fullName}'s password reset to Password123.`;
    render();
    return;
  } catch (error) {
    appState.authMessage = error.message;
    render();
    return;
  }
}

function toggleSidebar() {
  appState.sidebarOpen = !appState.sidebarOpen;
  render();
}

async function enroll() {
  if (appState.session && currentUser()?.role === "student") {
    try {
      const catalog = await apiRequest("/api/courses");
      const selectedCourse = catalog.courses?.[0];
      if (selectedCourse) {
        const enrollment = await apiRequest("/api/enrollments", { method: "POST", body: JSON.stringify({ courseId: selectedCourse.id }) });
        const courseFoundation = await fetchStudentCourseFoundation(enrollment);
        applyBackendLearningState(courseFoundation);
        appState.enrolled = true;
        setView("student-dashboard");
        return;
      }
    } catch (error) {
      appState.authMessage = error.message;
      render();
      return;
    }
  }
  setView("login");
}

function unlockCertificate() {
  appState.studentProgress.progress = 100;
  appState.certificateUnlocked = false;
  persistStudentProgress();
  render();
}

async function continueLearning() {
  appState.view = "student-dashboard";
  if (appState.session) {
    try {
      const contentData = await apiRequest("/api/student/learning-state");
      const courseFoundation = await fetchStudentCourseFoundation(contentData);
      applyBackendLearningState(courseFoundation);
      render();
      return;
    } catch (error) {
      appState.authMessage = error.message;
    }
  } else {
    appState.studentProgress = fetchCurrentLearningState();
  }
  render();
}

function ensureBackendLearningLoaded() {
  if (!appState.session || currentUser()?.role !== "student" || appState.backendCourse || appState.backendLearningLoading) return;
  appState.backendLearningLoading = true;
  apiRequest("/api/student/learning-state")
    .then(fetchStudentCourseFoundation)
    .then((data) => {
      applyBackendLearningState(data);
      appState.backendLearningLoading = false;
      render();
    })
    .catch(() => {
      appState.backendLearningLoading = false;
    });
}

async function fetchStudentCourseFoundation(state) {
  if (!state?.course?.id) return state;
  const [{ course: courseData }, { modules }] = await Promise.all([
    apiRequest(`/api/courses/${state.course.id}`),
    apiRequest(`/api/courses/${state.course.id}/modules`),
  ]);
  const modulesWithLessons = await Promise.all((modules || []).map(async (module) => {
    const { lessons } = await apiRequest(`/api/modules/${module.id}/lessons`);
    return { ...module, lessons: lessons || [] };
  }));
  return {
    ...state,
    course: {
      ...courseData,
      modules: modulesWithLessons,
    },
  };
}

function ensureDashboardDataLoaded(role) {
  const key = role === "admin" ? "adminDashboardData" : "instructorDashboardData";
  const loadingKey = role === "admin" ? "adminDashboardLoading" : "instructorDashboardLoading";
  if (!appState.session || currentUser()?.role !== role || appState[key] || appState[loadingKey]) return;
  appState[loadingKey] = true;
  apiRequest(`/api/${role}/dashboard-data`)
    .then((data) => {
      appState[key] = data;
      (data.users || []).forEach(upsertUser);
      appState[loadingKey] = false;
      render();
    })
    .catch((error) => {
      appState.authMessage = error.message;
      appState[loadingKey] = false;
      render();
    });
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

function applyBackendLearningState(data) {
  appState.backendCourse = normalizeBackendCourse(data.course) || null;
  appState.backendProgress = data.progress || null;
  if (!data.progress || !data.course) return;

  const completedActivities = backendCompletedActivityKeys(data.course, data.progress);
  const activeModuleId = data.progress.currentModuleId || data.progress.activeModuleId;
  const activeLessonId = data.progress.currentLessonId || data.progress.activeLessonId;
  const activeModule = Math.max(0, appState.backendCourse.modules.findIndex((module) => module.id === activeModuleId));
  const moduleData = appState.backendCourse.modules[activeModule] || appState.backendCourse.modules[0];
  const activeLesson = moduleData ? Math.max(0, moduleData.lessons.findIndex((lesson) => lesson.id === activeLessonId)) : 0;
  appState.studentProgress = {
    ...appState.studentProgress,
    activeModule,
    activeLesson,
    activeActivity: activeLesson >= 0 ? `lesson:${activeLesson}` : "lesson:0",
    completedActivities,
    progress: Math.round(Number(data.progress.progressPercentage ?? data.progress.progressPercent ?? 0)),
  };
  if (Number.isFinite(Number(data.progress.finalGrade))) {
    appState.certificateSettings.finalGrade = Number(data.progress.finalGrade);
    persistCertificateSettings();
  }
  persistStudentProgress();
}

function backendCompletedActivityKeys(courseData, progress) {
  const keys = [];
  const completedLessons = new Set(progress.completedLessons || progress.completedLessonIds || []);
  const completedQuizzes = new Set(progress.completedQuizzes || progress.completedQuizIds || []);
  const completedAssignments = new Set(progress.completedAssignments || progress.completedAssignmentIds || []);
  (courseData.modules || []).forEach((module, moduleIndex) => {
    (module.lessons || []).forEach((lesson, index) => {
      if (completedLessons.has(lesson.id)) keys.push(`${moduleIndex}:lesson:${index}`);
    });
    (module.quizzes || []).forEach((quiz, index) => {
      if (completedQuizzes.has(quiz.id)) keys.push(`${moduleIndex}:quiz:${index}`);
    });
    (module.assignments || []).forEach((assignment, index) => {
      if (completedAssignments.has(assignment.id)) keys.push(`${moduleIndex}:assignment:${index}`);
    });
  });
  return keys;
}

function backendProgressPayload() {
  const courseData = appState.backendCourse;
  if (!courseData) {
    return {
      courseId: null,
      activeModuleId: null,
      activeLessonId: null,
      completedLessonIds: [],
      completedQuizIds: [],
      completedAssignmentIds: [],
    };
  }
  const completedLessonIds = [];
  const completedQuizIds = [];
  const completedAssignmentIds = [];
  (appState.studentProgress.completedActivities || []).forEach((key) => {
    const [moduleIndexValue, type, itemIndexValue] = key.split(":");
    const data = fetchModuleLearningData(Number(moduleIndexValue));
    const index = Number(itemIndexValue);
    if (type === "lesson" && data.lessons[index]?.id) completedLessonIds.push(data.lessons[index].id);
    if (type === "quiz" && data.quizzes[index]?.id) completedQuizIds.push(data.quizzes[index].id);
    if (type === "assignment" && data.assignments[index]?.id) completedAssignmentIds.push(data.assignments[index].id);
  });
  const activeModule = courseData.modules[appState.studentProgress.activeModule] || courseData.modules[0];
  const activeData = fetchModuleLearningData(appState.studentProgress.activeModule);
  const [type, indexValue] = appState.studentProgress.activeActivity.split(":");
  const activeLesson = type === "lesson" ? activeData.lessons[Number(indexValue)] : null;
  return {
    courseId: courseData.id,
    activeModuleId: activeModule?.id || null,
    activeLessonId: activeLesson?.id || null,
    completedLessonIds,
    completedQuizIds,
    completedAssignmentIds,
  };
}

async function syncServerLearningCursor() {
  if (!appState.session) return;
  const payload = backendProgressPayload();
  if (!payload.courseId) return;
  const progress = appState.studentProgress;
  await apiRequest("/api/student/learning-state", {
    method: "PATCH",
    body: JSON.stringify({
      currentModuleId: payload.activeModuleId,
      currentLessonId: payload.activeLessonId,
      completedLessons: payload.completedLessonIds,
      completedQuizzes: payload.completedQuizIds,
      completedAssignments: payload.completedAssignmentIds,
      progressPercentage: progress.progress,
    }),
  });
}

function fetchModuleLearningData(moduleIndex) {
  if (appState.backendCourse?.modules?.[moduleIndex]) {
    const module = appState.backendCourse.modules[moduleIndex];
    const files = (module.lessons || []).flatMap((lesson) => (lesson.files || []).map((file) => ({
      id: file.id,
      title: file.title,
      type: file.fileType,
      size: `${Math.max(1, Math.round((file.sizeBytes || 0) / 1024))} KB`,
      url: `/${file.storagePath}`,
    })));
    const videos = (module.lessons || []).flatMap((lesson) => (lesson.videos || []).map((video) => ({
      id: video.id,
      title: video.title,
      provider: video.provider,
      duration: video.duration || "Self-paced",
      url: video.videoUrl,
    })));
    return {
      module: {
        id: module.id,
        title: module.title,
        assessment: module.assessment || module.description || "No backend assignment configured yet.",
        status: String(module.status || "PUBLISHED").toLowerCase(),
        lessons: module.lessons || [],
      },
      lessons: (module.lessons || []).map((lesson, index) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || lesson.content || `${lesson.title} in ${module.title}.`,
        type: lesson.lessonType || lesson.type || "TEXT",
        order: lesson.lessonOrder || index + 1,
      })),
      documents: files,
      videos,
      quizzes: (module.quizzes || []).map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions?.length || 0,
        questionsList: quiz.questions || [],
        passingScore: quiz.passingScore,
      })),
      assignments: (module.assignments || []).map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        due: assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : "Open",
        submissionType: "Typed answer",
        instructions: assignment.instructions,
      })),
    };
  }
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
  if (appState.session && appState.backendCourse) {
    if (!progress.completedActivities.includes(key)) {
      progress.completedActivities.push(key);
    }
    progress.progress = calculateStudentProgress();
    try {
      await syncServerLearningCursor();
      moveToNextActivity();
      persistStudentProgress();
      render();
      return;
    } catch (error) {
      appState.authMessage = error.message;
      render();
      return;
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
  const courseData = appState.backendCourse;
  if (!courseData) return 0;
  const total = courseData.modules.reduce((sum, module, index) => {
    const data = fetchModuleLearningData(index);
    return sum + data.lessons.length + data.documents.length + data.videos.length + data.quizzes.length + data.assignments.length;
  }, 0);
  return total ? Math.round((appState.studentProgress.completedActivities.length / total) * 100) : 0;
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

  const courseData = appState.backendCourse || course;
  const nextModule = Math.min(progress.activeModule + 1, courseData.modules.length - 1);
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
  const user = currentUser();
  document.body.classList.toggle("dashboard-page", isDashboardShell);
  app.innerHTML = `
    <div class="app-shell ${isDashboardShell ? "dashboard-shell" : "public-shell"}">
      <header class="topbar">
        <button class="hamburger" onclick="toggleSidebar()" aria-label="Open sidebar">☰</button>
        <a class="brand" href="#" onclick="setView('home')">
          <span class="brand-mark"><img src="/assets/aqodh-logo.svg" alt="AQODH Academy logo" /></span>
          <span class="brand-text"><strong>AQODH Academy</strong><small>Ethical Computing</small></span>
        </a>
        <label class="header-search" aria-label="Search">
          <input placeholder="Search courses, lessons, learners" />
        </label>
        <nav class="nav" aria-label="Main navigation">
          ${navButton("Home", "home")}
          ${navButton("Curriculum", "course")}
          ${navButton("Register", "register")}
          ${user?.role === "admin" ? navButton("Verify", "certificate-verify") : ""}
        </nav>
        <div class="user-menu header-actions">
          ${user ? `<button class="ghost-button signin-button" onclick="setView('profile')">Profile</button>` : `<button class="ghost-button signin-button" onclick="setView('login')">Sign In</button>`}
          <button class="primary-button enroll-button" onclick="enroll()">Enroll</button>
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
  ensurePublicCourseLoaded();
  const featuredCourse = landingCourse();
  const moduleCount = featuredCourse.modules?.length || course.modules.length;
  const lessonCount = (featuredCourse.modules || course.modules).reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
  return `
    <main class="public-main">
      <section class="hero">
        <div class="hero-ambient" aria-hidden="true"></div>
        <div class="hero-content">
          <div class="hero-copy">
            <p class="eyebrow">Building Technology That Protects Humanity</p>
            <h1>Building Technology That Protects Humanity</h1>
            <p>Learn Ethical Computing, Responsible AI, Digital Rights, Privacy, and Technology Governance through a serious academy platform built for trust.</p>
            <div class="hero-actions">
              <button class="primary-button hero-primary" onclick="enroll()">Start learning</button>
              <button class="ghost-button" onclick="setView('course')">Explore Curriculum</button>
              <button class="ghost-button" onclick="setView('login')">Login</button>
            </div>
          </div>
          <div class="hero-panel institutional-illustration" aria-label="AQODH Academy ethical computing focus areas">
            <div class="hero-panel-top">
              <span class="pill">AQODH Academy</span>
              <span class="hero-logo-mini"><img src="/assets/aqodh-logo.svg" alt="" /></span>
            </div>
            <h2>Ethical Computing Institution</h2>
            <div class="network-map" aria-hidden="true">
              <span class="network-node center">ETHICS</span>
              <span class="network-node ai">AI</span>
              <span class="network-node privacy">Privacy</span>
              <span class="network-node security">Security</span>
              <span class="network-node rights">Rights</span>
              <span class="network-node gov">Governance</span>
            </div>
            <div class="hero-signal-grid">
              <span><strong>${moduleCount}</strong> Modules</span>
              <span><strong>${lessonCount || "24+"}</strong> Lessons</span>
              <span><strong>QR</strong> Certificate</span>
            </div>
          </div>
        </div>
        <div class="hero-bottom-strip">
          <span>Students</span>
          <span>Instructors</span>
          <span>Administrators</span>
          <span>Certificates</span>
          <span>Progress Tracking</span>
        </div>
      </section>
      ${whyAqodhSection()}
      ${problemSection()}
      ${frameworkSection()}
      ${featuredCourseSection(featuredCourse)}
      ${learningExperienceSection()}
      ${certificateTrustSection()}
      ${futureVisionSection()}
      ${finalCallout()}
    </main>
  `;
}

function whyAqodhSection() {
  const items = [
    ["EA", "Ethical AI", "Understand fairness, accountability, transparency, and human oversight in AI systems."],
    ["DR", "Digital Rights", "Study privacy, consent, dignity, access, and the responsibilities of digital institutions."],
    ["RI", "Responsible Innovation", "Move from ideas to products using ethical review, governance, and impact thinking."],
  ];

  return `
    <section class="section why-section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <p class="eyebrow">Why AQODH</p>
            <h2>A serious home for ethical technology education.</h2>
            <p>AQODH Academy connects academic discipline with practical technology governance, helping learners build systems people can trust.</p>
          </div>
        </div>
        <div class="premium-card-grid">
          ${items.map(([icon, title, body]) => `
            <article class="premium-card why-card">
              <span class="premium-icon">${icon}</span>
              <h3>${title}</h3>
              <p>${body}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function problemSection() {
  const items = [
    ["AI Bias", "Growing concern", "Automated systems can reproduce unfair outcomes when data, design, and oversight are weak."],
    ["Privacy Breaches", "Critical challenge", "Digital services collect sensitive information faster than many users can understand or control."],
    ["Cybercrime", "Critical challenge", "Security decisions increasingly shape safety, trust, and access to essential digital services."],
    ["Digital Exclusion", "Growing concern", "Technology can leave communities behind when equity and accessibility are treated as afterthoughts."],
  ];

  return `
    <section class="section problem-section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <p class="eyebrow">The Problem</p>
            <h2>Technology is advancing faster than ethics.</h2>
            <p>The academy prepares learners to recognize serious digital risks and respond with practical, accountable methods.</p>
          </div>
        </div>
        <div class="insight-grid">
          ${items.map(([title, status, body]) => `
            <article class="insight-card">
              <span class="pill">${status}</span>
              <h3>${title}</h3>
              <p>${body}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function frameworkSection() {
  const steps = ["Awareness", "Knowledge", "Application", "Certification", "Leadership"];
  return `
    <section class="section framework-section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <p class="eyebrow">AQODH Framework</p>
            <h2>A clear journey from awareness to leadership.</h2>
            <p>Each learner moves through a structured path that turns ethical concern into professional competence.</p>
          </div>
        </div>
        <div class="framework-timeline">
          ${steps.map((step, index) => `
            <article class="framework-step">
              <span>${index + 1}</span>
              <strong>${step}</strong>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function featuredCourseSection(featuredCourse) {
  const modules = featuredCourse.modules || course.modules;
  const details = [
    [`${featuredCourse.duration || course.duration}`, "Duration"],
    [featuredCourse.level || course.level, "Level"],
    ["Certificate included", "Credential"],
    [`${modules.length} modules`, "Structure"],
    ["Quizzes and assignments", "Assessment"],
    ["Progress tracking", "Dashboard"],
  ];

  return `
    <section class="section featured-course-section">
      <div class="section-inner featured-course-layout">
        <div class="featured-course-copy">
          <p class="eyebrow">Featured Course</p>
          <h2>${featuredCourse.title || course.title}</h2>
          <p>${featuredCourse.description || "A foundational course for students, professionals, instructors, and organizations seeking practical ethical computing capability."}</p>
          <div class="featured-detail-grid">
            ${details.map(([value, label]) => `
              <article>
                <strong>${value}</strong>
                <span>${label}</span>
              </article>
            `).join("")}
          </div>
          <button class="primary-button" onclick="enroll()">Enroll Now</button>
        </div>
        <div class="curriculum-preview">
          ${modules.slice(0, 6).map((module, index) => `
            <article>
              <span>Module ${index + 1}</span>
              <strong>${module.title}</strong>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function learningExperienceSection() {
  const features = [
    ["Student dashboard", "Focused learning space for modules, lessons, progress, and certificates."],
    ["Continue Learning", "Return to the current module, lesson, and unfinished activity."],
    ["Module tabs", "Move through course sections without leaving the dashboard."],
    ["Quizzes", "Objective checks support auto-marking and feedback."],
    ["Assignments", "Long-answer work supports review and instructor override."],
    ["Certificate engine", "Eligibility, QR verification, and certificate status stay controlled."],
    ["AI insights for admin", "Operational signals help administrators review progress and risk."],
  ];

  return `
    <section class="section learning-section">
      <div class="section-inner learning-layout">
        <div class="dashboard-preview" aria-label="AQODH dashboard preview">
          <div class="preview-sidebar"></div>
          <div class="preview-main">
            <div class="preview-bar"></div>
            <div class="preview-cards">
              <span></span><span></span><span></span>
            </div>
            <div class="preview-workspace"></div>
          </div>
        </div>
        <div>
          <p class="eyebrow">Learning Experience</p>
          <h2>Everything important happens inside the platform.</h2>
          <div class="feature-list">
            ${features.map(([title, body]) => `
              <article>
                <span class="status-dot done"></span>
                <div>
                  <strong>${title}</strong>
                  <p>${body}</p>
                </div>
              </article>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function certificateTrustSection() {
  return `
    <section class="section certificate-trust-section">
      <div class="section-inner certificate-trust-layout">
        <div>
          <p class="eyebrow">Certificate Trust</p>
          <h2>Credentials should be verifiable, controlled, and professional.</h2>
          <p>AQODH certificate records are designed around eligibility checks, certificate numbers, QR verification, and status control.</p>
          <button class="ghost-button" onclick="openVerification()">View verification</button>
        </div>
        <article class="certificate-preview-card">
          <span class="certificate-seal">AQODH</span>
          <p class="label">Certificate Preview</p>
          <h3>Student Name</h3>
          <p>has completed</p>
          <strong>Ethical Computing Fundamentals</strong>
          <div class="certificate-meta">
            <span>No. AQODH-ECF-0001</span>
            <span>QR verification</span>
          </div>
          <div class="qr-preview" aria-hidden="true"></div>
        </article>
      </div>
    </section>
  `;
}

function futureVisionSection() {
  const roadmap = ["Academy", "Certification Authority", "AI Auditing", "Digital Rights Center", "Research Institute"];
  return `
    <section class="section future-section">
      <div class="section-inner">
        <div class="section-title">
          <div>
            <p class="eyebrow">Future Vision</p>
            <h2>From learning platform to ethical technology institution.</h2>
            <p>AQODH Academy is the foundation for a broader mission in certification, auditing, rights protection, and research.</p>
          </div>
        </div>
        <div class="future-roadmap">
          ${roadmap.map((item, index) => `
            <article>
              <span>${index + 1}</span>
              <strong>${item}</strong>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function impactStrip() {
  const items = [
    ["Role-secure", "Dashboards protect student, instructor, and admin workflows."],
    ["Practice-led", "Quizzes, assignments, and case reviews turn ethics into action."],
    ["Verifiable", "Completion can lead to QR-backed certificate verification."],
  ];

  return `
    <section class="impact-strip">
      <div class="section-inner impact-grid">
        ${items.map(([title, body]) => `
          <article class="impact-item">
            <span class="impact-icon">${title.slice(0, 2)}</span>
            <div>
              <strong>${title}</strong>
              <p>${body}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function experienceSection() {
  const lanes = [
    ["Student", "Learn inside one dashboard, continue from the last unfinished activity, and watch your progress move."],
    ["Instructor", "Build modules, upload documents, manage quizzes, review submissions, and override grades when judgment matters."],
    ["Admin", "Approve users, manage payments, configure certificate rules, and keep records accountable."],
  ];

  return `
    <section class="section experience-section">
      <div class="section-inner experience-layout">
        <div class="experience-copy">
          <p class="eyebrow">One platform, clear responsibility</p>
          <h2>A learning experience designed for trust from the first click.</h2>
          <p>Every part of AQODH Academy points learners toward responsible decisions: secure access, structured modules, meaningful assessments, and certificate checks that preserve credibility.</p>
          <div class="hero-actions">
            <button class="primary-button" onclick="setView('register')">Create account</button>
            <button class="ghost-button" onclick="setView('student-dashboard')">Preview dashboard</button>
          </div>
        </div>
        <div class="experience-board" aria-label="Role pathways">
          ${lanes.map(([role, body], index) => `
            <article class="experience-lane">
              <span class="lane-number">0${index + 1}</span>
              <div>
                <h3>${role}</h3>
                <p>${body}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function finalCallout() {
  return `
    <section class="final-callout">
      <div class="section-inner final-callout-inner">
        <div>
          <p class="eyebrow">Join the movement</p>
          <h2>Join the Movement for Ethical Technology</h2>
          <p>Learn, teach, partner, and help build digital systems worthy of public trust.</p>
        </div>
        <div class="hero-actions">
          <button class="primary-button" onclick="enroll()">Enroll Today</button>
          <button class="ghost-button" onclick="setView('register')">Partner With AQODH</button>
        </div>
      </div>
    </section>
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
  return authShell("Login", "Use the email and password for your AQODH Academy account.", `
    <form class="form-grid auth-form" onsubmit="loginUser(event)">
      <label class="full-field">Email<input name="email" type="email" required autocomplete="email" /></label>
      <label class="full-field">Password<input name="password" type="password" required autocomplete="current-password" /></label>
      <button class="primary-button" type="submit">Login</button>
      <button class="ghost-button" type="button" onclick="setView('forgot-password')">Forgot Password</button>
      <button class="ghost-button" type="button" onclick="setView('register')">Create Account</button>
    </form>
  `);
}

function registerPage() {
  return authShell("Register", "Create a student account for Ethical Computing Fundamentals.", `
    <form class="form-grid auth-form" onsubmit="registerUser(event)">
      <label>Full Name<input name="fullName" required autocomplete="name" /></label>
      <label>Email<input name="email" type="email" required autocomplete="email" /></label>
      <label class="full-field">Password<input name="password" type="password" required autocomplete="new-password" /></label>
      <button class="primary-button" type="submit">Register</button>
      <button class="ghost-button" type="button" onclick="setView('login')">Login Instead</button>
    </form>
  `);
}

function forgotPasswordPage() {
  return authShell("Forgot Password", "Request a password reset for an existing account.", `
    <form class="form-grid auth-form" onsubmit="requestPasswordReset(event)">
      <label class="full-field">Email<input name="email" type="email" required autocomplete="email" /></label>
      <button class="primary-button" type="submit">Send Reset Link</button>
      <button class="ghost-button" type="button" onclick="setView('reset-password')">Go To Reset</button>
    </form>
  `);
}

function resetPasswordPage() {
  return authShell("Reset Password", "Set a new password with a valid reset token.", `
    <form class="form-grid auth-form" onsubmit="resetPassword(event)">
      <label>Email<input name="email" type="email" required autocomplete="email" /></label>
      <label>Reset Token<input name="resetToken" placeholder="Paste token from Forgot Password" /></label>
      <label>New Password<input name="password" type="password" required autocomplete="new-password" /></label>
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
  ensureBackendLearningLoaded();
  const user = currentUser();
  const courseData = appState.backendCourse;
  if (!courseData) {
    return dashboardLayout(
      "Student",
      "Student Dashboard",
      "Backend course, enrollment, and progress data",
      dashboardSidebarItems("student"),
      `<article class="card data-card">${emptyBackendState(appState.backendLearningLoading ? "Loading course data" : "No backend course data", appState.backendLearningLoading ? "Fetching your enrollment and progress from PostgreSQL." : "The student dashboard only displays course data returned by Prisma.")}</article>`
    );
  }
  const progress = appState.certificateUnlocked ? 100 : appState.studentProgress.progress;
  const activeModule = Math.min(appState.studentProgress.activeModule, Math.max(0, courseData.modules.length - 1));
  const moduleData = fetchModuleLearningData(activeModule);
  const sidebar = dashboardSidebarItems("student");
  const section = activeDashboardSection("student");
  const dashboardOverview = `
    <div class="v1-row top-row">
      <article class="card data-card welcome-card span-65">
        <span class="label">Welcome</span>
        <h2>Welcome back, ${user ? user.fullName : "Student"}</h2>
        <p><strong>Course:</strong> ${courseData.title}</p>
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
      ${courseData.modules.map((module, index) => `
        <div class="module-row">
          <div>
            <h3>Module ${index + 1}: ${module.title}</h3>
            <p class="muted">${module.assessment}</p>
          </div>
          <span>${module.lessons.length} lessons</span>
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
        ${emptyBackendState("No backend tasks yet", "Quizzes and assignments are not in the current Prisma foundation, so no sample tasks are shown here.")}
      </article>
      <article class="card data-card span-50 task-grade-card">
        <span class="label">Grades Summary</span>
        ${grade("Final grade", appState.certificateSettings.finalGrade || 0)}
        <p><strong>Progress record:</strong> ${appState.backendProgress ? "Loaded from PostgreSQL" : "Not available"}</p>
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
    Quizzes: `<article class="card data-card"><span class="label">Quizzes</span>${emptyBackendState("No backend quizzes yet", "Quiz tables are planned, but are not part of the current Prisma foundation.")}</article>`,
    Assignments: `<article class="card data-card"><span class="label">Assignments</span>${emptyBackendState("No backend assignments yet", "Assignment tables are planned, but are not part of the current Prisma foundation.")}</article>`,
    Grades: `<article class="card data-card task-grade-card"><span class="label">Grades</span>${grade("Final grade", appState.certificateSettings.finalGrade || 0)}</article>`,
    Certificate: studentCertificateSection(),
    Announcements: announcementsSection,
  };

  return dashboardLayout("Student", "Student Dashboard", "Welcome → Progress → Modules → Tasks → Grades → Certificate", sidebar, sectionContent[section] || sectionContent.Dashboard);
}

function moduleTabs(activeModule) {
  const courseData = appState.backendCourse || { modules: [] };
  return `
    <div class="module-tabs" role="tablist" aria-label="Course modules">
      ${courseData.modules.map((module, index) => `
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
    const documentAction = item.url
      ? `<a class="ghost-button" href="${item.url}" target="_blank" rel="noopener">${item.type === "PPTX" || item.type === "PPT" ? "Download PowerPoint" : "Open Document"}</a>`
      : `<button class="ghost-button">${item.type === "PPTX" ? "Download PowerPoint" : "Open Document"}</button>`;
    return `
      <span class="label">Document</span>
      <h2>${item.title}</h2>
      <div class="document-viewer">
        <strong>${item.type} learning material</strong>
        <span>${item.size}</span>
        ${documentAction}
      </div>
      <p class="muted">Documents and PowerPoint downloads open inside the student dashboard workspace.</p>
      ${completeButton}
    `;
  }

  if (activityType === "video") {
    return `
      <span class="label">Video</span>
      <h2>${item.title}</h2>
      <div class="video-frame">Embedded ${item.provider} player · ${item.duration}${item.url ? `<br><a href="${item.url}" target="_blank" rel="noopener">Open source link</a>` : ""}</div>
      <p class="muted">Video playback remains inside /student/dashboard.</p>
      ${completeButton}
    `;
  }

  if (activityType === "quiz") {
    const firstQuestion = item.questionsList?.[0];
    const quizSubmit = item.id && firstQuestion
      ? `<button class="primary-button" onclick="submitActiveQuiz('${item.id}', '${firstQuestion.id}')">Submit Quiz</button>`
      : completeButton;
    return `
      <span class="label">Quiz</span>
      <h2>${item.title}</h2>
      <p>${item.questions} objective questions · Passing score ${item.passingScore}%</p>
      <div class="quiz-card">
        <strong>${firstQuestion ? "Question 1" : "Sample question"}</strong>
        <p>${firstQuestion ? firstQuestion.prompt : "What does AI stand for?"}</p>
        ${(firstQuestion?.options || ["Artificial Intelligence", "Automated Internet"]).map((option) => `
          <label><input type="radio" name="quiz-${item.id || "sample"}" value="${option}" /> ${option}</label>
        `).join("")}
      </div>
      ${quizSubmit}
    `;
  }

  if (activityType === "assignment") {
    const assignmentSubmit = item.id
      ? `<button class="primary-button" onclick="submitActiveAssignment('${item.id}')">Submit Assignment</button>`
      : completeButton;
    return `
      <span class="label">Assignment</span>
      <h2>${item.title}</h2>
      <p class="muted">Due ${item.due} · ${item.submissionType}</p>
      ${item.instructions ? `<p>${item.instructions}</p>` : ""}
      <textarea id="assignment-${item.id || "local"}" placeholder="Type your response inside the dashboard workspace..."></textarea>
      ${assignmentSubmit}
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

async function submitActiveQuiz(quizId, questionId) {
  const selected = document.querySelector(`input[name="quiz-${quizId}"]:checked`);
  if (!selected) {
    appState.authMessage = "Choose an answer before submitting the quiz.";
    render();
    return;
  }
  try {
    await apiRequest(`/api/content/quizzes/${quizId}/attempts`, {
      method: "POST",
      body: JSON.stringify({ answers: { [questionId]: selected.value } }),
    });
    await completeActiveActivity();
  } catch (error) {
    appState.authMessage = error.message;
    render();
  }
}

async function submitActiveAssignment(assignmentId) {
  const field = document.querySelector(`#assignment-${assignmentId}`);
  const content = field ? field.value.trim() : "";
  if (!content) {
    appState.authMessage = "Type your assignment response before submitting.";
    render();
    return;
  }
  try {
    await apiRequest(`/api/content/assignments/${assignmentId}/submissions`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    await completeActiveActivity();
  } catch (error) {
    appState.authMessage = error.message;
    render();
  }
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
  return `
    <article class="card data-card certificate-engine">
      <span class="label">Certificate Engine</span>
      ${emptyBackendState("No backend certificates yet", "Certificate eligibility and verification tables are planned, but are not part of the current Prisma foundation.")}
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

function legalPage(title, intro, sections) {
  return `
    <main class="public-main legal-main">
      <section class="legal-hero">
        <div class="legal-container">
          <p class="eyebrow">AQODH Academy Policy</p>
          <h1>${title}</h1>
          <p>${intro}</p>
          <span class="legal-updated">Last updated: June 24, 2026</span>
        </div>
      </section>
      <section class="legal-body">
        <div class="legal-container">
          <aside class="legal-note">
            This document is provided for platform transparency and should be reviewed by a qualified legal professional before production launch.
          </aside>
          ${sections.map(([heading, body]) => `
            <article class="legal-section">
              <h2>${heading}</h2>
              <p>${body}</p>
            </article>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}

function privacyPolicyPage() {
  return legalPage("Privacy Policy", "This Privacy Policy explains how AQODH Academy handles information for learners, instructors, administrators, certificate verification, and platform operations.", [
    ["Introduction", "AQODH Academy is an Ethical Computing learning platform. We collect and use information to provide secure accounts, course access, learning dashboards, assessments, payment status checks, progress tracking, and certificate verification."],
    ["Information we collect", "We may collect information you provide directly, information generated by your learning activity, technical information from your device or browser, and administrative records needed to operate the academy."],
    ["Account information", "Account records may include your name, email address, role, login status, password security metadata, contact details, and account status. Passwords must be stored securely and are not displayed in platform responses."],
    ["Course and learning data", "The platform may process enrollments, current course, current module, lesson activity, quiz attempts, assignment submissions, grades, completion records, and progress percentages."],
    ["Payment-related data", "AQODH Academy may store payment status information such as pending payment, fully paid, manual approval, free course access, and related administrative approval records. Full payment processing details should be handled by secure payment providers when integrated."],
    ["Certificate and verification data", "Certificate records may include student name, course name, grade, issue date, certificate number, QR verification link, certificate status, revocation status, and verification logs."],
    ["How we use information", "We use information to authenticate users, enforce role-based access, deliver course content, track progress, evaluate assessments, manage payments, issue certificates, verify credentials, improve platform reliability, and support administrative oversight."],
    ["How we protect information", "The platform should use secure authentication, password hashing, authorization middleware, input validation, controlled file uploads, environment-based secrets, and reasonable operational safeguards."],
    ["Data sharing and third parties", "We do not sell learner data. Information may be shared with service providers needed for hosting, email, payments, analytics, file storage, or certificate verification, subject to appropriate controls."],
    ["Student rights and choices", "Students may request access to account information, correction of inaccurate details, support with account status, or information about certificate records where applicable."],
    ["Cookies/local storage", "The platform may use cookies, secure sessions, or browser local storage to maintain login state, remember learning progress in demo mode, support certificate settings, and improve user experience."],
    ["Data retention", "Records are retained as long as needed for learning access, legal, security, accounting, certificate verification, and institutional reporting purposes. Retention rules should be finalized before production launch."],
    ["Children/minors note", "AQODH Academy is intended for responsible educational use. If minors use the platform, appropriate guardian, school, or institutional consent requirements should be reviewed before production launch."],
    ["Contact information", "For privacy questions or account support, contact AQODH Academy at hello@aqodh.academy."],
  ]);
}

function termsOfServicePage() {
  return legalPage("Terms of Service", "These Terms of Service describe the basic expectations for using AQODH Academy as a student, instructor, administrator, or certificate verifier.", [
    ["Introduction", "By using AQODH Academy, users agree to use the platform responsibly and in support of ethical learning, privacy, security, accountability, and professional digital education."],
    ["User accounts", "Users are responsible for providing accurate account information, protecting login credentials, and using only the role and permissions assigned to them by the platform."],
    ["Acceptable use", "Users must not attempt unauthorized access, disrupt platform services, upload unsafe files, misuse learning materials, impersonate others, or bypass payment, progress, certificate, or role-based access rules."],
    ["Course access", "Course access may depend on registration, enrollment, payment status, manual approval, instructor assignment, or administrative settings. Students should complete learning activities inside the student dashboard where required."],
    ["Payments and refunds placeholder", "Payment terms, refund rules, taxes, manual approval procedures, and third-party payment provider terms should be finalized before production launch."],
    ["Assignments, quizzes, and academic integrity", "Students must submit their own work, follow assessment instructions, and avoid cheating, plagiarism, or manipulation of auto-marking and grading workflows."],
    ["Certificates and verification", "Certificates may be issued only when eligibility rules are met. AQODH Academy may revoke, regenerate, or verify certificates according to platform records and administrative controls."],
    ["Intellectual property", "Course content, platform design, certificate assets, AQODH branding, lecturer signatures, official seals, and learning materials are protected by their respective owners and may not be misused."],
    ["Platform availability", "AQODH Academy aims to provide reliable access, but availability may be affected by maintenance, hosting, network issues, upgrades, security events, or third-party service interruptions."],
    ["Limitation of liability placeholder", "Liability limitations, warranties, disclaimers, and jurisdiction-specific terms should be reviewed and finalized by a qualified legal professional before production launch."],
    ["Account suspension", "AQODH Academy may suspend or restrict accounts that violate these terms, threaten platform security, misuse course access, or interfere with certificate integrity."],
    ["Changes to terms", "These terms may be updated as the platform evolves. Material changes should be communicated through reasonable platform or email notices where appropriate."],
    ["Contact information", "For terms, account, or platform support questions, contact AQODH Academy at hello@aqodh.academy."],
  ]);
}

function instructorDashboard() {
  ensureDashboardDataLoaded("instructor");
  const sidebar = dashboardSidebarItems("instructor");
  const active = activeDashboardSection("instructor");
  const dashboardData = appState.instructorDashboardData;
  const courseData = backendPrimaryCourse("instructor");
  const summary = dashboardData?.summary || {};
  const stats = [
    ["Total Students", summary.totalStudents || 0],
    ["Total Modules", summary.totalModules || 0],
    ["Total Lessons", summary.totalLessons || 0],
    ["Average Completion", `${summary.averageProgress || 0}%`],
  ];
  const longMark = markLongAnswer(longAnswerReview.answer, longAnswerReview.keywords, longAnswerReview.maxMarks);
  if (!dashboardData) {
    return dashboardLayout(
      "Instructor",
      "Instructor Dashboard",
      "Courses, modules, lessons, enrollments, and progress from Prisma",
      sidebar,
      `<article class="card data-card">${emptyBackendState(appState.instructorDashboardLoading ? "Loading instructor data" : "No instructor backend data", appState.instructorDashboardLoading ? "Fetching your courses and learners from PostgreSQL." : "The instructor dashboard only displays records returned by Prisma.")}</article>`
    );
  }
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
        ${(courseData?.modules || []).map((module, index) => `
          <div class="structure-line">
            <div><strong>Module ${index + 1}: ${module.title}</strong><p class="muted">${module.lessons.length} lessons · ${index < 3 ? "Published" : "Draft"}</p></div>
            <button class="ghost-button">Edit</button>
          </div>
        `).join("") || emptyBackendState("No modules yet", "Create modules through the backend before they appear here.")}
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
        ${emptyBackendState("No backend documents yet", "Document file tables are not part of the current Prisma foundation.")}
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
        ${emptyBackendState("No backend videos yet", "Video tables are not part of the current Prisma foundation.")}
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
        ${emptyBackendState("No backend quizzes yet", "Quiz and attempt tables are planned, but not in the current Prisma foundation.")}
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
        ${emptyBackendState("No backend submissions yet", "Assignment submissions are not in the current Prisma foundation.")}
      </article>
    </div>

    <article class="card data-card">
      <span class="label">Submissions</span>
      ${submissionsTable()}
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
    "My Courses": `<article class="card data-card"><span class="label">My Courses</span>${courseData ? `<h2>${courseData.title}</h2>${simpleRows([["Duration", courseData.duration], ["Modules", courseData.modules.length], ["Lessons", summary.totalLessons || 0], ["Status", courseData.status]])}` : emptyBackendState("No courses assigned", "No Prisma courses are linked to this instructor.")}</article>`,
    Modules: `<article class="card data-card"><span class="label">Modules</span><h2>Course Structure</h2>${(courseData?.modules || []).map((module, index) => `<div class="structure-line"><div><strong>Module ${index + 1}: ${module.title}</strong><p class="muted">${module.assessment}</p></div><button class="ghost-button">Edit</button></div>`).join("") || emptyBackendState("No modules yet", "No Prisma modules are linked to this instructor course.")}</article>`,
    Lessons: `<article class="card data-card"><span class="label">Lessons</span><h2>Add lesson content</h2><form class="form-grid" onsubmit="event.preventDefault();"><label>Select Module${moduleSelect()}</label><label>Lesson Type${optionSelect(lessonTypes)}</label><label class="full-field">Lesson Title<input value="Why ethics matters in technology" /></label><button class="primary-button">Save Lesson</button></form></article>`,
    Documents: `<article class="card data-card"><span class="label">Documents</span>${emptyBackendState("No backend documents yet", "Document file tables are not part of the current Prisma foundation.")}</article>`,
    Videos: `<article class="card data-card"><span class="label">Videos</span>${emptyBackendState("No backend videos yet", "Video tables are not part of the current Prisma foundation.")}</article>`,
    Quizzes: `<article class="card data-card"><span class="label">Quizzes</span>${emptyBackendState("No backend quizzes yet", "Quiz tables are planned, but not in the current Prisma foundation.")}</article>`,
    Assignments: `<article class="card data-card"><span class="label">Assignments</span>${emptyBackendState("No backend assignments yet", "Assignment tables are planned, but not in the current Prisma foundation.")}</article>`,
    Submissions: `<article class="card data-card"><span class="label">Submissions</span>${submissionsTable()}</article>`,
    Grades: `<article class="card data-card"><span class="label">Grades</span>${studentProgressTable()}</article>`,
    Announcements: `<article class="card data-card"><span class="label">Announcements</span><h2>Course Messages</h2>${simpleRows([["Welcome note", "Published to current cohort"], ["Assessment reminder", "Draft"], ["Certificate guidance", "Published"]])}</article>`,
  };

  return dashboardLayout("Instructor", "Instructor Dashboard", "Create modules, lessons, documents, videos, quizzes, assignments, submissions, and grades.", sidebar, sectionContent[active] || content);
}

function moduleSelect() {
  const courseData = appState.backendCourse || backendPrimaryCourse("instructor") || backendPrimaryCourse("admin") || course;
  return `<select>${(courseData.modules || []).map((module, index) => `<option>Module ${index + 1}: ${module.title}</option>`).join("")}</select>`;
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
  ensureDashboardDataLoaded("admin");
  const sidebar = dashboardSidebarItems("admin");
  const active = activeDashboardSection("admin");
  const dashboardData = appState.adminDashboardData;
  const summary = dashboardData?.summary || {};
  const courses = backendCourseList("admin");
  const stats = [
    ["Total Users", summary.totalUsers || 0],
    ["Total Students", summary.totalStudents || 0],
    ["Total Courses", summary.totalCourses || 0],
    ["Enrollments", summary.totalEnrollments || 0],
  ];
  if (!dashboardData) {
    return dashboardLayout(
      "Admin",
      "Admin Dashboard",
      "Users, courses, enrollments, and progress from Prisma",
      sidebar,
      `<article class="card data-card">${emptyBackendState(appState.adminDashboardLoading ? "Loading admin data" : "No admin backend data", appState.adminDashboardLoading ? "Fetching users, courses, enrollments, and progress from PostgreSQL." : "The admin dashboard only displays records returned by Prisma.")}</article>`
    );
  }
  const content = `
    <div class="v1-row stat-row">${stats.map(([label, value]) => statCard(label, value)).join("")}</div>
    <div class="v1-row analytics-row">
      <article class="card data-card span-60">
        <span class="label">Course Foundation</span>
        <h2>PostgreSQL records</h2>
        ${simpleRows([["Courses", summary.totalCourses || 0], ["Modules", summary.totalModules || 0], ["Lessons", summary.totalLessons || 0], ["Active enrollments", summary.activeEnrollments || 0]])}
      </article>
      <article class="card data-card span-40 revenue-card">
        <span class="label">Payments</span>
        ${paymentsTable()}
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
    "AI Insights": `<article class="card data-card"><span class="label">AI Insights</span>${emptyBackendState("No backend AI insights yet", "AI insights are planned, but are not part of the current Prisma foundation.")}</article>`,
    Users: userManagement,
    Courses: `<article class="card data-card"><span class="label">Courses</span>${courses.map((courseItem) => `<div class="structure-line"><div><strong>${courseItem.title}</strong><p class="muted">${courseItem.description || "No description"} · ${courseItem.status}</p></div><span class="pill">${courseItem.modules.length} modules</span></div>`).join("") || emptyBackendState("No backend courses found", "Seed or create courses before they appear here.")}</article>`,
    Instructors: `<article class="card data-card"><span class="label">Instructors</span>${adminUsersTable("instructor")}</article>`,
    Students: `<article class="card data-card"><span class="label">Students</span>${studentProgressTable()}</article>`,
    Payments: `<article class="card data-card"><span class="label">Payments</span>${paymentsTable()}</article>`,
    Certificates: `<article class="card data-card"><span class="label">Certificates Approval</span>${certificatesTable()}</article><article class="card data-card"><span class="label">Certificate Engine Settings</span>${adminCertificateControls()}</article>`,
    Reports: `<article class="card data-card"><span class="label">Reports</span><h2>System Reports</h2>${simpleRows([["Total users", summary.totalUsers || 0], ["Total students", summary.totalStudents || 0], ["Total instructors", summary.totalInstructors || 0], ["Total courses", summary.totalCourses || 0], ["Average progress", `${summary.averageProgress || 0}%`]])}</article>`,
    Settings: `<article class="card data-card"><span class="label">Settings</span>${adminCertificateControls()}</article>`,
  };

  return dashboardLayout("Admin", "Admin Dashboard", "Stats → Enrollment Analytics → Revenue → Users → Payments → Certificates", sidebar, sectionContent[active] || content);
}

function adminUsersTable(roleFilter = "") {
  const users = roleFilter ? appState.users.filter((user) => user.role === roleFilter) : appState.users;
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
      <tbody>
        ${users.map((user) => `
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
        `).join("") || `<tr><td colspan="6">No backend users found.</td></tr>`}
      </tbody>
    </table></div>
  `;
}

function adminCertificateControls() {
  return emptyBackendState("No backend certificate settings yet", "Certificate settings, certificate records, and verification logs need Prisma tables before this panel can manage real data.");
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
          <h2>Existing AQODH account</h2>
          <p class="muted">Sign in with your approved student, instructor, or admin account.</p>
          <div class="split-actions">
            <button class="ghost-button" onclick="setView('login')">Login</button>
            <button class="ghost-button" onclick="setView('register')">Register</button>
          </div>
        </article>
      </div>
    </main>
  `;
}

function studentTable() {
  const rows = appState.instructorDashboardData?.students || appState.adminDashboardData?.users?.filter((user) => user.role === "student") || [];
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Role</th></tr></thead>
      <tbody>
        ${rows.map((student) => `
          <tr>
            <td><strong>${student.fullName}</strong></td>
            <td>${student.email}</td>
            <td><span class="pill">${student.status}</span></td>
            <td>${student.role}</td>
          </tr>
        `).join("") || `<tr><td colspan="4">No backend students found.</td></tr>`}
      </tbody>
    </table></div>
  `;
}

function statCard(label, value) {
  return `<article class="card stat-card"><span class="label">${label}</span><strong>${value}</strong></article>`;
}

function studentProgressTable() {
  const rows = appState.instructorDashboardData?.progressRecords || appState.adminDashboardData?.progressRecords || [];
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Student Name</th><th>Email</th><th>Course</th><th>Current Module</th><th>Current Lesson</th><th>Progress</th><th>Final Grade</th><th>Updated</th></tr></thead>
      <tbody>
        ${rows.map((record) => `
          <tr>
            <td><strong>${record.student?.fullName || "Unknown student"}</strong></td>
            <td>${record.student?.email || "-"}</td>
            <td>${record.course?.title || appState.adminDashboardData?.courses?.find((courseItem) => courseItem.id === record.courseId)?.title || "-"}</td>
            <td>${record.currentModule?.title || "-"}</td>
            <td>${record.currentLesson?.title || "-"}</td>
            <td>${Math.round(Number(record.progressPercentage || 0))}%</td>
            <td>${Math.round(Number(record.finalGrade || 0))}%</td>
            <td>${record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "-"}</td>
          </tr>
        `).join("") || `<tr><td colspan="8">No backend progress records found.</td></tr>`}
      </tbody>
    </table></div>
  `;
}

function submissionsTable() {
  return emptyBackendState("No backend submissions yet", "Assignment submission tables are not part of the current Prisma foundation.");
}

function recentUsersTable() {
  const rows = (appState.adminDashboardData?.users || appState.users).slice(0, 6);
  return `
    <div class="table-wrap"><table>
      <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Joined Date</th><th>Status</th></tr></thead>
      <tbody>
        ${rows.map((user) => `
          <tr>
            <td><strong>${user.fullName}</strong></td>
            <td>${user.role}</td>
            <td>${user.email}</td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
            <td><span class="pill">${user.status}</span></td>
          </tr>
        `).join("") || `<tr><td colspan="5">No backend users found.</td></tr>`}
      </tbody>
    </table></div>
  `;
}

function paymentsTable() {
  return emptyBackendState("No backend payments yet", "Payment tables are planned, but are not part of the current Prisma foundation.");
}

function certificatesTable() {
  return emptyBackendState("No backend certificates yet", "Certificate tables are planned, but are not part of the current Prisma foundation.");
}

function simpleRows(rows) {
  return `<ul class="plain-list">${rows.map(([name, value]) => `<li class="table-row"><span class="status-dot done"></span><strong>${name}</strong><span class="pill">${value}</span></li>`).join("")}</ul>`;
}

function footer() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <section class="footer-brand-column">
          <a class="footer-brand" href="#" onclick="setView('home')">
            <span class="brand-mark"><img src="/assets/aqodh-logo.svg" alt="AQODH Academy logo" /></span>
            <span>AQODH Academy</span>
          </a>
          <p>Building Technology That Protects Humanity through ethical computing education, responsible AI, privacy, digital rights, and technology governance.</p>
          <form class="newsletter-form" onsubmit="event.preventDefault()">
            <label for="newsletter-email">Newsletter</label>
            <div>
              <input id="newsletter-email" type="email" placeholder="Email address" aria-label="Email address" />
              <button class="primary-button" type="submit">Subscribe</button>
            </div>
          </form>
        </section>
        <section>
          <h3>Learning</h3>
          <button onclick="setView('course')">Curriculum</button>
          <button onclick="enroll()">Enroll Today</button>
          <button onclick="setView('student-dashboard')">Student Dashboard</button>
          <button onclick="setView('certificate-verify')">Certificate Verification</button>
        </section>
        <section>
          <h3>Research</h3>
          <button onclick="setView('home')">Ethical AI</button>
          <button onclick="setView('home')">Digital Rights</button>
          <button onclick="setView('home')">Technology Governance</button>
          <button onclick="setView('home')">Responsible Innovation</button>
        </section>
        <section>
          <h3>Contact</h3>
          <p>hello@aqodh.academy</p>
          <p>AQODH Academy</p>
          <div class="social-links" aria-label="Social links">
            <span>in</span>
            <span>X</span>
            <span>YT</span>
          </div>
        </section>
      </div>
      <div class="footer-bottom">
        <span>© 2026 AQODH Academy. All rights reserved.</span>
        <div>
          <button onclick="setView('privacy-policy')">Privacy Policy</button>
          <button onclick="setView('terms-of-service')">Terms of Service</button>
          <button onclick="setView('login')">Sign In</button>
        </div>
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
    "privacy-policy": privacyPolicyPage,
    "terms-of-service": termsOfServicePage,
    "student-dashboard": studentDashboard,
    "instructor-dashboard": instructorDashboard,
    "admin-dashboard": adminDashboard,
    "certificate-verify": verificationPage,
  };

  shell((views[appState.view] || home)());
}

async function initializeApp() {
  const requestedView = viewForPath(window.location.pathname);
  appState.view = requestedView;
  const requestedRole = protectedRouteRole(requestedView);
  const user = await restoreCurrentUser();

  if (requestedRole && (!user || user.role !== requestedRole || user.status !== "ACTIVE")) {
    appState.authMessage = `Please log in as ${requestedRole} to access this dashboard.`;
    setView("login");
    return;
  }

  if (user && appState.view === "login") {
    redirectByRole(user.role);
    return;
  }

  render();
}

window.addEventListener("popstate", () => {
  setView(viewForPath(window.location.pathname), { skipHistory: true });
});

initializeApp();
