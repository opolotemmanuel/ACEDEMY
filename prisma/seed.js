require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("../src/lib/prisma");

const SEED_PASSWORD = "Password@123";

const modules = [
  {
    title: "Introduction to Ethical Computing",
    moduleOrder: 1,
    lessons: [
      { title: "What is Ethics?", lessonOrder: 1 },
      { title: "Why Ethical Computing Matters", lessonOrder: 2 },
    ],
  },
  {
    title: "Data Privacy and Digital Rights",
    moduleOrder: 2,
    lessons: [
      { title: "Understanding Personal Data", lessonOrder: 1 },
      { title: "Privacy by Design", lessonOrder: 2 },
    ],
  },
  {
    title: "AI Ethics and Algorithm Accountability",
    moduleOrder: 3,
    lessons: [
      { title: "Bias in Artificial Intelligence", lessonOrder: 1 },
      { title: "Algorithm Accountability", lessonOrder: 2 },
    ],
  },
  {
    title: "Cybersecurity Ethics",
    moduleOrder: 4,
    lessons: [
      { title: "Responsible Security Practices", lessonOrder: 1 },
      { title: "Ethical Hacking and Disclosure", lessonOrder: 2 },
    ],
  },
  {
    title: "Social Media and Digital Society",
    moduleOrder: 5,
    lessons: [
      { title: "Digital Well-being and Online Communities", lessonOrder: 1 },
      { title: "Misinformation and Platform Responsibility", lessonOrder: 2 },
    ],
  },
  {
    title: "Building Ethical Technologies",
    moduleOrder: 6,
    lessons: [
      { title: "Responsible Technology Development", lessonOrder: 1 },
      { title: "Ethical Impact Assessment", lessonOrder: 2 },
    ],
  },
];

async function passwordHash() {
  return bcrypt.hash(SEED_PASSWORD, 12);
}

async function upsertUser({ fullName, email, role }) {
  return prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      role,
      status: "ACTIVE",
      passwordHash: await passwordHash(),
    },
    create: {
      fullName,
      email,
      passwordHash: await passwordHash(),
      role,
      status: "ACTIVE",
      phone: "",
      country: "",
      profilePhotoUrl: "",
    },
  });
}

async function main() {
  const admin = await upsertUser({
    fullName: "AQODH Administrator",
    email: "admin@aqodhacademy.org",
    role: "ADMIN",
  });

  const instructor = await upsertUser({
    fullName: "Dr. Ethical Computing",
    email: "instructor@aqodhacademy.org",
    role: "INSTRUCTOR",
  });

  const student = await upsertUser({
    fullName: "John Student",
    email: "student@aqodhacademy.org",
    role: "STUDENT",
  });

  const course = await prisma.course.upsert({
    where: { slug: "ethical-computing-fundamentals" },
    update: {
      title: "Ethical Computing Fundamentals",
      description:
        "A foundational course covering ethical computing, AI ethics, digital rights, privacy, cybersecurity ethics, and responsible technology development.",
      level: "BEGINNER",
      durationWeeks: 6,
      price: 0,
      isFree: true,
      status: "PUBLISHED",
      createdBy: instructor.id,
    },
    create: {
      title: "Ethical Computing Fundamentals",
      slug: "ethical-computing-fundamentals",
      description:
        "A foundational course covering ethical computing, AI ethics, digital rights, privacy, cybersecurity ethics, and responsible technology development.",
      level: "BEGINNER",
      durationWeeks: 6,
      price: 0,
      isFree: true,
      status: "PUBLISHED",
      createdBy: instructor.id,
    },
  });

  let currentModuleId = null;
  let currentLessonId = null;

  for (const moduleData of modules) {
    const courseModule = await prisma.courseModule.upsert({
      where: {
        courseId_moduleOrder: {
          courseId: course.id,
          moduleOrder: moduleData.moduleOrder,
        },
      },
      update: {
        title: moduleData.title,
        description: moduleData.title,
        status: "PUBLISHED",
      },
      create: {
        courseId: course.id,
        title: moduleData.title,
        description: moduleData.title,
        moduleOrder: moduleData.moduleOrder,
        status: "PUBLISHED",
      },
    });

    if (moduleData.moduleOrder === 1) currentModuleId = courseModule.id;

    for (const lessonData of moduleData.lessons) {
      const lesson = await prisma.lesson.upsert({
        where: {
          moduleId_lessonOrder: {
            moduleId: courseModule.id,
            lessonOrder: lessonData.lessonOrder,
          },
        },
        update: {
          title: lessonData.title,
          description: lessonData.title,
          lessonType: "TEXT",
          content: lessonData.title,
          isRequired: true,
          status: "PUBLISHED",
        },
        create: {
          moduleId: courseModule.id,
          title: lessonData.title,
          description: lessonData.title,
          lessonType: "TEXT",
          content: lessonData.title,
          lessonOrder: lessonData.lessonOrder,
          isRequired: true,
          status: "PUBLISHED",
        },
      });

      if (moduleData.moduleOrder === 1 && lessonData.lessonOrder === 1) {
        currentLessonId = lesson.id;
      }
    }
  }

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course.id,
      },
    },
    update: {
      enrollmentStatus: "ACTIVE",
      completedAt: null,
    },
    create: {
      studentId: student.id,
      courseId: course.id,
      enrollmentStatus: "ACTIVE",
    },
  });

  await prisma.studentProgress.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course.id,
      },
    },
    update: {
      currentModuleId,
      currentLessonId,
      progressPercentage: 10,
      finalGrade: 0,
    },
    create: {
      studentId: student.id,
      courseId: course.id,
      currentModuleId,
      currentLessonId,
      completedLessons: [],
      completedQuizzes: [],
      completedAssignments: [],
      progressPercentage: 10,
      finalGrade: 0,
    },
  });

  console.log(`Seed completed successfully.
Admin:
${admin.email}

Instructor:
${instructor.email}

Student:
${student.email}

Password:
${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
