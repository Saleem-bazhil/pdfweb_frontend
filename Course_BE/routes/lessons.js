const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const auth = require('../Middleware/auth');
const premium = require('../Middleware/premium');
const { getPresignedUrlForDownload } = require('../services/s3');


// Public: get lesson metadata (no S3 keys)
router.get('/:id', async (req, res) => {
const lesson = await Lesson.findById(req.params.id).select('-s3Key -notesS3Key').lean();
if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
res.json(lesson);
});


// Protected: get a temporary signed URL for video or notes
router.get('/:id/content', auth, async (req, res) => {
const lesson = await Lesson.findById(req.params.id);
if (!lesson) return res.status(404).json({ message: 'Lesson not found' });


if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Access denied" });
}



try {
// generate signed url
const videoUrl = lesson.s3Key ? await getPresignedUrlForDownload(lesson.s3Key, 120) : null;
const notesUrl = lesson.notesS3Key ? await getPresignedUrlForDownload(lesson.notesS3Key, 120) : null;
res.json({ videoUrl, notesUrl });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Could not generate access URL' });
}
});

// Admin: create lesson and attach to course
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin required' });
    }

    const { title, description, s3Key, notesS3Key, isPremium, courseId, duration } = req.body;

    const lesson = await Lesson.create({ title, description, s3Key, notesS3Key, isPremium, duration });
    await Course.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } });

    res.status(201).json(lesson);
  } catch (err) {
    console.error('❌ Lesson creation failed:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});



module.exports = router;