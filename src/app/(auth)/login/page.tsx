"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/auth/login";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formDataError, setFormDataError] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormDataError((prev) => ({ ...prev, [name]: "" }));
  };

  const nexthandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = { email: "", password: "" };

    if (!formData.email) errors.email = "И-мэйлээ оруулна уу";
    if (!formData.password) errors.password = "Нууц үгээ оруулна уу";

    if (errors.email || errors.password) {
      setFormDataError(errors);
      return;
    }

    try {
      const res = await loginUser(formData.email, formData.password);

      localStorage.setItem("token", res.token);

      toast.success("Амжилттай нэвтэрлээ!");

      const decoded: any = jwtDecode(res.token);

      if (decoded.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);

      if (error.response?.status === 401) {
        const msg = error.response.data.message;

        if (msg === "Invalid credentials") {
          toast.error("И-мэйл буруу байна");
        }

        if (msg === "password is correct") {
          toast.error("Нууц үг буруу байна");
        }
      } else {
        toast.error("Сүлжээний алдаа!");
      }
    }
  };

  return (
    <form onSubmit={nexthandler} className="space-y-3">
      <div>
        <Input
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <p className="text-red-600">{formDataError.email}</p>
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <p className="text-red-600">{formDataError.password}</p>
      </div>

      <Button type="submit" className="w-full">
        Нэвтрэх
      </Button>
    </form>
  );
}
