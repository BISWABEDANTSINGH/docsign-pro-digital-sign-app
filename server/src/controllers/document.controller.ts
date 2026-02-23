import { Response } from "express";
import Document from "../models/document.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const uploadDoc = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const doc = await Document.create({
    title: req.file.originalname,
    fileUrl: req.file.path,
    owner: req.user.id,
  });

  res.json(doc);
};