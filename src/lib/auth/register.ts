import { api } from "../axios";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register", { name, email, password });
  console.log("res :>> ", res);
  return res.data;
};
