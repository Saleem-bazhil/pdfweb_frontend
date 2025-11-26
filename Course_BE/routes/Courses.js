const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const auth = require('../Middleware/auth');

// ----------------------
// PUBLIC: Get all courses
// ----------------------
router.get('/', async (req, res) => {
  const courses = await Course.find().select('-lessons').lean();
  res.json(courses);
});

// -------------------------------
// PUBLIC: Get single course + lessons
// -------------------------------
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate({
      path: 'lessons',
      select: '-s3Key -notesS3Key'
    })
    .lean();

  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// -------------------------------
// ADMIN: Create a new course
// -------------------------------
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin required' });
    }

    const { title, description, thumbnail, isPremium, price } = req.body;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      isPremium,
      price
    });

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Course creation failed', error: err.message });
  }
});

// ---------------------------------------
// ADMIN: Update course
// ---------------------------------------
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin required' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// ---------------------------------------
// ADMIN: Delete course
// ---------------------------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin required' });
    }

    const deleted = await Course.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deletion failed' });
  }
});

// ---------------------------------------
// Make a user admin (utility)
// ---------------------------------------
router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `${user.email} is now admin` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error promoting user" });
  }
});

module.exports = router;
