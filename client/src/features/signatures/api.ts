import api from "../../api"; // Import your main Axios instance

export interface SignaturePayload {
  documentId: string;
  xPercent: number;
  yPercent: number;
  page: number;
  // Note: To save an actual drawn image, you would add a field like `signatureDataUrl: string` here and in your backend model.
}

export const signatureApi = {
  // Save a new signature coordinate to a document
  addSignature: async (data: SignaturePayload) => {
    const response = await api.post("/api/signatures", data);
    return response.data;
  },

  // Get all signatures for a specific document
  getSignaturesByDocument: async (documentId: string) => {
    const response = await api.get(`/api/signatures/${documentId}`);
    return response.data;
  },
};