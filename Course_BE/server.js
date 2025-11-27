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
const guideRoutes = require("./routes/guides");
const purchaseRoutes = require("./routes/purchase");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:8133",
  "https://pdfweb-frontend-1.onrender.com",
];

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

// ✅ CORS CONFIG – use this
const corsOptions = {
  origin: (origin, callback) => {
    // allow Postman / curl / server-to-server with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 2) Handle all OPTIONS preflight requests globally (no route pattern needed)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content, but CORS headers already set
  }
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/purchase", purchaseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
