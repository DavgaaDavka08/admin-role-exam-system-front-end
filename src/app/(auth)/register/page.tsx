"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/auth/register";
import { ApiErrorResponse } from "@/lib/types/FormDataType";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

type FormDataType = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrorType = {
  email: string;
  password: string;
  confirmPassword: string;
};
const Register = () => {
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrorType>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Partial<FormErrorType> = {};

    if (!formData.email.includes("@")) {
      errors.email = "Invalid email. @ заавал байх ёстой";
    }

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors as FormErrorType);

    if (Object.keys(errors).length > 0) return;

    try {
      const data = await registerUser(formData.email, formData.password);
      console.log("data :>> ", data);
      toast.success("Амжилттай бүртгэгдлээ!");
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const message = err.response?.data?.message || "Серверт алдаа гарлаа";
      toast.error(message);
    }
  };

  return (
    <div className="flex h-screen w-full items-center flex-col justify-center">
      <form className="w-[500px] h-[500px]" onSubmit={submitHandler}>
        <div>
          <Input
            placeholder="Email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <p className="text-red-600">{formErrors.email}</p>,
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="text-red-600">{formErrors.password}</p>
        </div>
        <div>
          <Input
            type="password"
            placeholder="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <p className="text-red-600">{formErrors.confirmPassword}</p>
        </div>
        <Button type="submit">burtguuleh</Button>
      </form>
    </div>
  );
};

export default Register;
