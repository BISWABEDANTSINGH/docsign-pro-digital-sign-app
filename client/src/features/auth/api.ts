import axios from "../../lib/axios";

export const registerUser = (data: any) =>
  axios.post("/auth/register", data);

export const loginUser = (data: any) =>
  axios.post("/auth/login", data);