import { v4 as uuidv4 } from "uuid";
import Document from "../models/document.model";

export const generatePublicLink = async (docId: string) => {
  const token = uuidv4();

  await Document.findByIdAndUpdate(docId, {
    publicToken: token,
  });

  return token;
};