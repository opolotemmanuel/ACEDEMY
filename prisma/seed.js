require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("../src/lib/prisma");

const modules = [
  {
    title: "Introduction to Ethical Computing",
    description: "Core concepts, responsibilities, and real-world technology failures.",
    lessons: ["What is ethical computing?", "Why ethics matters in technology", "Real-world technology failures"],
  },
  {
    title: "Data Privacy and Digital Rights",
    description: "Data ownership, consent, privacy by design, and user rights.",
    lessons: ["Data ownership", "Consent", "Privacy by design", "Digital rights"],
  },
  {
    title: "AI Ethics and Algorithm Accountability",
    description: "Fairness, transparency, bias, and accountable automated decisions.",
    lessons: ["AI bias", "Fairness", "Transparency", "Accountability"],
  },
  {
    title: "Cybersecurity Ethics",
    description: "Responsible security work, disclosure, monitoring, and privacy.",
    lessons: ["Ethical hacking", "Responsible disclosure", "Monitoring and privacy"],
  },
  {
    title: "Social Media and Digital Society",
    description: "Misinformation, deepfakes, platform responsibility, and digital well-being.",
    lessons: ["Misinformation", "Deepfakes", "Platform responsibility", "Digital well-being"],
  },
  {
    title: "Building Ethical Technologies",
    description: "Practical ethical impact assessment and responsible innovation.",
    lessons: ["Ethical impact assessment", "Responsible innovation", "Ethical design checklist"],
  },
];

async function hashed(password) {
  return bcrypt.hash(password, 12);
}

async function upsertUser({ email, fullName, password, role, phone, country }) {
  return prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      role,
      status: "ACTIVE",
      phone,
      country,
    },
    create: {
      fullName,
      email,
      passwordHash: await hashed(password),
      role,
      status: "ACTIVE",
      phone,
      country,
      profilePhotoUrl: "",
    },
  });
}

async function main() {
  const admin = await upsertUser({
    fullName: "AQODH Admin",
    email: "admin@aqodh.academy",
    password: "admin123",
    role: "ADMIN",
    phone: "+256 700 000 001",
    country: "Uganda",
  });

  const instructor = await upsertUser({
    fullName: "Dr. Miriam Achieng",
    email: "instructor@aqodh.academy",
    password: "instructor123",
    role: "INSTRUCTOR",
    phone: "+256 700 000 002",
    country: "Uganda",
  });

  const student = await upsertUser({
    fullName: "Amina Kato",
    email: "student@aqodh.academy",
    password: "student123",
    role: "STUDENT",
    phone: "+256 700 000 003",
    country: "Uganda",
  });

  const course = await prisma.course.upsert({
    where: { slug: "ethical-computing-fundamentals" },
    update: {
      title: "Ethical Computing Fundamentals",
      description: "Building Technology That Protects Humanity.",
      level: "Beginner",
      durationWeeks: 6,
      price: 50000,
      isFree: false,
      status: "PUBLISHED",
      createdBy: instructor.id,
    },
    create: {
      title: "Ethical Computing Fundamentals",
      slug: "ethical-computing-fundamentals",
      description: "Building Technology That Protects Humanity.",
      level: "Beginner",
      durationWeeks: 6,
      price: 50000,
      isFree: false,
      status: "PUBLISHED",
      createdBy: instructor.id,
    },
  });

  for (const [moduleIndex, moduleData] of modules.entries()) {
    const courseModule = await prisma.courseModule.upsert({
      where: { courseId_moduleOrder: { courseId: course.id, moduleOrder: moduleIndex + 1 } },
      update: {
        title: moduleData.title,
        description: moduleData.description,
        status: "PUBLISHED",
      },
      create: {
        courseId: course.id,
        title: moduleData.title,
        description: moduleData.description,
        moduleOrder: moduleIndex + 1,
        status: "PUBLISHED",
      },
    });

    for (const [lessonIndex, lessonTitle] of moduleData.lessons.entries()) {
      await prisma.lesson.upsert({
        where: { moduleId_lessonOrder: { moduleId: courseModule.id, lessonOrder: lessonIndex + 1 } },
        update: {
          title: lessonTitle,
          status: "PUBLISHED",
        },
        create: {
          moduleId: courseModule.id,
          title: lessonTitle,
          description: `${lessonTitle} in ${moduleData.title}.`,
          lessonType: "TEXT",
          content: `${lessonTitle} in ${moduleData.title}.`,
          lessonOrder: lessonIndex + 1,
          isRequired: true,
          status: "PUBLISHED",
        },
      });
    }
  }

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: { enrollmentStatus: "ACTIVE" },
    create: {
      studentId: student.id,
      courseId: course.id,
      enrollmentStatus: "ACTIVE",
    },
  });

  await prisma.studentProgress.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: {},
    create: {
      studentId: student.id,
      courseId: course.id,
      progressPercentage: 0,
      finalGrade: 0,
    },
  });

  console.log(`Seeded AQODH Academy foundation with admin ${admin.email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
