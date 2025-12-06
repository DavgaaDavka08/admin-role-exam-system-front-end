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


import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/logo";
import { loginUser } from "@/lib/auth/login";
import { toast } from "sonner";
import jwtDecode from "jwt-decode";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setError("");
    setLoading(true);
    const errors = { email: "", password: "" };

    if (!formData.email) errors.email = "И-мэйлээ оруулна уу";
    if (!formData.password) errors.password = "Нууц үгээ оруулна уу";

    if (errors.email || errors.password) {
      setFormDataError(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser(formData.email, formData.password , );

      localStorage.setItem("token", res.token);


      const decoded: any = jwtDecode(res.token);

      localStorage.setItem("name", decoded.name);

      localStorage.setItem("grade", decoded.grade);
      toast.success("Амжилттай нэвтэрлээ!");
      if (decoded.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Сурагчаар нэвтрэх
            </CardTitle>
            <CardDescription>
              И-мэйл хаяг болон нууц үгээ оруулна уу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={nexthandler} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">И-мэйл хаяг</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
                {formDataError.email && (
                  <p className="text-sm text-destructive">{formDataError.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Нууц үг</Label>
                  <Link
                    href="/student/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Нууц үг мартсан?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formDataError.password && (
                  <p className="text-sm text-destructive">{formDataError.password}</p>
                )}
              </div>

              <Button type="submit" className="h-11 w-full" disabled={loading}>
                {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Бүртгэлгүй юу?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Бүртгүүлэх
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
