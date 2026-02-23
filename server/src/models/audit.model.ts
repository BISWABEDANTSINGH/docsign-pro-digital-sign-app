import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model("Audit", auditSchema);