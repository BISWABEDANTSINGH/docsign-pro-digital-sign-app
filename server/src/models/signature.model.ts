import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    signer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    xPercent: { type: Number, required: true },
    yPercent: { type: Number, required: true },
    // 🔥 NEW: Store the resizable dimensions
    widthPercent: { type: Number, required: true },
    heightPercent: { type: Number, required: true },
    page: { type: Number, default: 1 },
    status: { type: String, default: "signed" },
    signatureImage: { type: String, required: true }, // The Base64 image
  },
  { timestamps: true }
);

export default mongoose.model("Signature", signatureSchema);