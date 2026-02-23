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

connectDB();

// In server/src/app.ts, change your CORS setup to this:
app.use(cors({
  origin: ["http://localhost:5173", process.env.FRONTEND_URL || "*"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Increase JSON limit if your base64 signature strings are large
app.use(express.json({ limit: '10mb' }));

// Serve both the uploads and signature folders statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/signature", express.static(path.join(__dirname, "../signature")));

app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/signatures", signatureRoutes);

export default app;