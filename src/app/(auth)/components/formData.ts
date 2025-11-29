"use client";
import { useState } from "react";

type FormDataType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type FormErrorType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export const useFormData = () => {
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

  return {
    formData,
    formErrors,
    setFormData,
    setFormErrors,
    handleChange,
  };
};
