import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "signed", "rejected"],
      default: "pending",
    },
    // 🔥 FIX: Added publicToken so the public route works
    publicToken: { 
      type: String, 
      unique: true, 
      sparse: true // sparse allows multiple documents to not have a token without triggering a unique constraint error
    }
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;