import express from "express";
import { protect, AuthRequest } from "../middlewares/auth.middleware";
import Signature from "../models/signature.model";

const router = express.Router();

router.post("/", protect, async (req: AuthRequest, res) => {
  // Extract all the new layout fields
  const { documentId, xPercent, yPercent, widthPercent, heightPercent, page, signatureImage } = req.body;

  try {
    const sig = await Signature.create({
      documentId,
      xPercent,
      yPercent,
      widthPercent,
      heightPercent,
      page,
      signatureImage,
      signer: req.user.id,
    });
    res.json(sig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save signature" });
  }
});

router.get("/:docId", protect, async (req, res) => {
  const sigs = await Signature.find({ documentId: req.params.docId });
  res.json(sigs);
});

export default router;