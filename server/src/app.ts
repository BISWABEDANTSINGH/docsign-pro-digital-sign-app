import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";

import authRoutes from "./routes/auth.routes";
import documentRoutes from "./routes/document.routes";
import signatureRoutes from "./routes/signature.routes";

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration (Fixed for Vercel/Render security)
app.use(cors({
  origin: [
    "http://localhost:5173",          
    "https://docsign-pro-digital-sign-app.vercel.app", 
    /^https:\/\/docsign-pro-digital-s.*\.vercel\.app$/, 
    process.env.FRONTEND_URL          
  ].filter(Boolean) as (string | RegExp)[],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Increase JSON limit if your base64 signature strings are large
app.use(express.json({ limit: '10mb' }));

// Serve both the uploads and signature folders statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/signature", express.static(path.join(__dirname, "../signature")));

// === THE MISSING PING ROUTE ===
// Health check route for UptimeRobot
app.use("/ping", (req, res) => {
  res.status(200).send("Server is awake!");
});
// ==============================

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/signatures", signatureRoutes);

export default app;