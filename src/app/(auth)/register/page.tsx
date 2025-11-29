"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/auth/register";
import React, { useState } from "react";
import { toast } from "sonner";
import { useFormData } from "../components/formData";
import { validateRegister } from "../components/validateRegister";

const Register = () => {
  const { formData, formErrors, setFormErrors, handleChange } = useFormData();
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRegister(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const data = await registerUser(formData.email, formData.password);
      console.log("data amjiltai: ", data);
      toast.success("Амжилттай бүртгэгдлээ!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Серверт алдаа гарлаа";
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
