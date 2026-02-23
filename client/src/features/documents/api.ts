import api from "../../api";

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/docs/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getDocuments = async () => {
  const res = await api.get("/api/docs");
  return res.data;
};

export const finalizeDocument = async (id: string) => {
  const res = await api.post(`/api/docs/finalize/${id}`);
  return res.data;
};