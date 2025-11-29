import { api } from "../axios";

export const registerUser = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  console.log("res :>> ", res);
  return res.data;
};
