import express from "express";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware";
import { uploadDoc } from "../controllers/document.controller";
import { generateSignedPdf } from "../services/pdf.service";
import Document from "../models/document.model";   // ✅ ADD THIS

const router = express.Router();

/* ========================
   MULTER CONFIG
======================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ========================
   ROUTES
======================== */

// Upload PDF
router.post("/upload", protect, upload.single("file"), uploadDoc);

// Finalize + Generate Signed PDF
router.post("/finalize/:id", protect, async (req, res) => {
  try {
    const path = await generateSignedPdf(req.params.id as string);

    res.json({
      message: "PDF Signed",
      file: path,
    });
  } catch (err) {
    console.error(err);  // ✅ Helpful debug log
    res.status(500).json({ message: "Signing failed" });
  }
});

// Public Access via Token
router.get("/public/:token", async (req, res) => {
  try {
    const doc = await Document.findOne({
      publicToken: req.params.token,
    });

    if (!doc) {
      return res.status(404).json({ message: "Invalid link" });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get all documents for logged-in user
// Get all documents for logged-in user
router.get("/", protect, async (req: any, res) => {
  try {
    
    const docs = await Document.find({ owner: req.user.id }); 
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});
// Add to document.routes.ts
// Add to document.routes.ts
// 🔥 FIX 1: Add ': any' to req so TypeScript knows about req.user
router.delete("/:id", protect, async (req: any, res: any) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // 🔥 FIX 2: Change document.user to document.owner to match your database schema
    if (document.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this document" });
    }

    await document.deleteOne();
    res.json({ message: "Document removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error during deletion" });
  }
});

export default router;