import { connectDb } from "./connect.js";
import { Booking } from "../models/Booking.js";
import { Dispute } from "../models/Dispute.js";
import { Favorite } from "../models/Favorite.js";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { Payment } from "../models/Payment.js";
import { Review } from "../models/Review.js";
import { Student } from "../models/Student.js";
import { Subject } from "../models/Subject.js";
import { Teacher } from "../models/Teacher.js";
import { Transaction } from "../models/Transaction.js";
import { Topic } from "../models/Topic.js";
import { User } from "../models/User.js";
import { Wallet } from "../models/Wallet.js";
import { Withdrawal } from "../models/Withdrawal.js";

const subjects = [
  { name: "Mathematics", category: "STEM", topics: ["Algebra", "Calculus", "Statistics"] },
  { name: "Physics", category: "Science", topics: ["Mechanics", "Electricity", "Optics"] },
  { name: "English", category: "Languages", topics: ["Essay Writing", "Grammar", "Speaking"] },
  { name: "Computer Science", category: "Technology", topics: ["React", "Node.js", "Algorithms"] }
];

const teachers = [
  {
    name: "Ariana Miller",
    email: "ariana@teachme.local",
    subject: "Mathematics",
    category: "STEM",
    topics: ["Algebra", "Calculus", "Statistics"],
    headline: "Advanced mathematics tutor for exams and foundations",
    city: "New York",
    rate: 28,
    ratingAverage: 4.9,
    ratingCount: 126
  },
  {
    name: "Daniel Chen",
    email: "daniel@teachme.local",
    subject: "Physics",
    category: "Science",
    topics: ["Mechanics", "Electricity", "Optics"],
    headline: "Physics lessons with simulation-based practice",
    city: "Austin",
    rate: 35,
    ratingAverage: 4.8,
    ratingCount: 98
  },
  {
    name: "Maya Fernando",
    email: "maya@teachme.local",
    subject: "English",
    category: "Languages",
    topics: ["Essay Writing", "Grammar", "Speaking"],
    headline: "English, essay writing, and presentation coaching",
    city: "Colombo",
    rate: 22,
    ratingAverage: 4.7,
    ratingCount: 74
  }
];

const seed = async () => {
  await connectDb();

  await Promise.all([
    Booking.deleteMany(),
    Dispute.deleteMany(),
    Favorite.deleteMany(),
    Message.deleteMany(),
    Notification.deleteMany(),
    Payment.deleteMany(),
    Review.deleteMany(),
    Student.deleteMany(),
    Teacher.deleteMany(),
    Transaction.deleteMany(),
    Subject.deleteMany(),
    Topic.deleteMany(),
    User.deleteMany(),
    Wallet.deleteMany(),
    Withdrawal.deleteMany()
  ]);

  await User.create({
    name: "Admin User",
    email: "admin@teachme.local",
    password: "Password123",
    role: "admin"
  });

  const student = await User.create({
    name: "Jordan Lee",
    email: "student@teachme.local",
    password: "Password123",
    role: "student"
  });
  await Student.create({
    user: student._id,
    level: "Undergraduate",
    institution: "TeachMe Demo University",
    interests: ["Calculus", "React", "Essay Writing"]
  });

  for (const item of subjects) {
    const subject = await Subject.create({ name: item.name, category: item.category });
    for (const topic of item.topics) {
      await Topic.create({
        subject: subject._id,
        name: topic,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      });
    }
  }

  for (const item of teachers) {
    const user = await User.create({
      name: item.name,
      email: item.email,
      password: "Password123",
      role: "teacher"
    });

    await Teacher.create({
      user: user._id,
      headline: item.headline,
      bio: "Demo tutor profile with structured lessons, clear practice tasks, and flexible scheduling.",
      qualifications: ["Bachelor degree", "Teaching certification"],
      experienceYears: 5,
      subjects: [{ subject: item.subject, category: item.category, topics: item.topics }],
      pricing: { hourlyRate: item.rate, currency: "USD" },
      availability: [
        { day: "Monday", start: "17:00", end: "20:00" },
        { day: "Saturday", start: "09:00", end: "12:00" }
      ],
      classModes: { online: true, physical: item.city !== "Austin" },
      location: { city: item.city, country: item.city === "Colombo" ? "Sri Lanka" : "United States" },
      contact: { email: item.email },
      ratingAverage: item.ratingAverage,
      ratingCount: item.ratingCount,
      profileStatus: "published",
      isVerified: true
    });
  }

  console.log("Seed complete");
  console.log("Admin: admin@teachme.local / Password123");
  console.log("Student: student@teachme.local / Password123");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
