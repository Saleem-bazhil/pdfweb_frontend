const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Course", courseSchema);
