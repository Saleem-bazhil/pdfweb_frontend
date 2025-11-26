const mongoose = require('mongoose');
const lessonSchema = new mongoose.Schema({
title: String,
description: String,
title: { type: String, required: true },
s3Key: String, // key in S3 for video
notesS3Key: String, // key for notes/pdf
isPremium: { type: Boolean, default: false },
duration: Number,
}, { timestamps: true });
module.exports = mongoose.model('Lesson', lessonSchema);