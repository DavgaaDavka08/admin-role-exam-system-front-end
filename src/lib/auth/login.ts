// lib/auth/login.ts (эсвэл login page дээр)
import { api } from "../axios";
import jwtDecode from "jwt-decode";

type JwtPayload = {
  id: string;
  role: string;
  name: string;
  grade: string;
  exp: number;
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  const token = res.data.token;
  const decoded = jwtDecode<JwtPayload>(token);

  // 🔥 localStorage-д хадгална
  localStorage.setItem("token", token);
  localStorage.setItem("id", decoded.id);
  localStorage.setItem("name", decoded.name);
  localStorage.setItem("grade", decoded.grade);
  localStorage.setItem("role", decoded.role);

  return res.data;
};
