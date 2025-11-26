// seed.js  (put this in your backend root folder)

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");

(async () => {
  try {
    // 1️⃣ Connect to DB
    await connectDB();
    console.log("DB connected for seeding");

    // 2️⃣ Create ADMIN user if not exists
    const adminEmail = "admin@example.com";
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash("adminpassword", salt);

      admin = await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
        isPremium: true,
      });

      console.log(
        " Admin created:",
        admin.email,
        "| password: adminpassword"
      );
    } else {
      console.log(" Admin already exists:", admin.email);
    }

    // 3️⃣ Create sample lesson if not exists
    let lesson = await Lesson.findOne({ title: "Lesson 1 - Premium Video" });

    if (!lesson) {
      lesson = await Lesson.create({
        title: "Lesson 1 - Premium Video",
        description: "Premium content only",
        s3Key: "videos/sample-video.mp4",
        notesS3Key: "notes/sample-notes.pdf",
        isPremium: true,
        duration: 300, // seconds
      });

      console.log("Sample lesson created:", lesson.title);
    } else {
      console.log("Sample lesson already exists:", lesson.title);
    }

    // 4️ Create sample course if not exists
    let course = await Course.findOne({
      title: "Sample Course: Intro to Web",
    });

    if (!course) {
      course = await Course.create({
        title: "Sample Course: Intro to Web",
        description: "A demo course",
        author: admin._id,
        isPaid: true,
        price: 499,
        lessons: [lesson._id],
      });

      console.log(" Sample course created:", course.title);
    } else {
      // ensure lesson is in course.lessons
      if (!course.lessons.includes(lesson._id)) {
        course.lessons.push(lesson._id);
        await course.save();
      }
      console.log(" Sample course already exists:", course.title);
    }

    console.log(" Seed finished.");
    process.exit(0);
  } catch (err) {
    console.error(" Seed error:", err);
    process.exit(1);
  }
})();
