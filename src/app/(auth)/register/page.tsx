"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/logo";
import { registerUser } from "@/lib/auth/register";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/lib/types/FormDataType";

type FormDataType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: string;
  
};

type FormErrorType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: string;
};

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrorType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FormErrorType = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      grade: "",
    };


    if (!formData.name.trim()) errors.name = "Овог нэр заавал шаардлагатай";

    if (!formData.email.includes("@"))
      errors.email = "И-мэйл буруу байна (@ орох ёстой)";

    if (formData.password.length < 6)
      errors.password = "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой";

    if (formData.confirmPassword !== formData.password)
      errors.confirmPassword = "Нууц үгүүд хоорондоо таарахгүй байна";

    if (
      errors.name ||
      errors.email ||
      errors.password ||
      errors.confirmPassword
    ) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(
        formData.name,
        formData.email,
        formData.password, 
        formData.grade
      );

      if (data.success) {
        toast.success("Амжилттай бүртгэгдлээ!");
        router.push("/login");
      }
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const message = err.response?.data?.message || "Серверийн алдаа гарлаа";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Бүртгүүлэх</CardTitle>
            <CardDescription>
              Шалгалт өгөхийн тулд бүртгэл үүсгэнэ үү
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submitHandler} className="space-y-4">
   
              <div className="space-y-2">
                <Label htmlFor="name">Овог нэр</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Овог нэр"
                  className="h-11"
                />
                <p className="text-red-600 text-sm">{formErrors.name}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Анги</Label>
                <Input
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="Анги"
                  className="h-11"
                />
                <p className="text-red-600 text-sm">{formErrors.grade}</p>
              </div>


              <div className="space-y-2">
                <Label htmlFor="email">И-мэйл</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="h-11"
                />
                <p className="text-red-600 text-sm">{formErrors.email}</p>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 pr-10"
                  />

            
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <p className="text-red-600 text-sm">{formErrors.password}</p>
              </div>


              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-11"
                />
                <p className="text-red-600 text-sm">
                  {formErrors.confirmPassword}
                </p>
              </div>


              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Бүртгэлтэй юу?{" "}
                <Link
                  href="/student/login"
                  className="text-primary font-medium"
                >
                  Нэвтрэх
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
