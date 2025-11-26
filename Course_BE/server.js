// Course_BE/server.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/Courses");
const lessonRoutes = require("./routes/lessons");
const paymentRoutes = require("./routes/payment");
const pdfRoutes = require("./routes/pdf");
const guideRoutes = require("./routes/guides"); // ✅ file is guides.js
const purchaseRoutes = require("./routes/purchase");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
  })
);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ❌ DO NOT expose /uploads publicly (this would leak PDFs)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/purchase", purchaseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
