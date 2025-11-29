"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/auth/login";
import { toast } from "sonner";
import { validateLogin } from "../components/validateLogin";
import { useFormData } from "../components/formData";

export default function LoginForm() {
  const { formData, formErrors, setFormErrors, handleChange } = useFormData();

  const nexthandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateLogin(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const data = await loginUser(formData.email, formData.password);
      console.log("data :>> ", data);
      toast.success("Амжилттай нэвтэрлээ");
    } catch (error: any) {
      const message = error.response?.data?.message || "Серверт алдаа гарлаа";
      toast.error(message);
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
        <p className="text-red-600">{formErrors.email}</p>
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

      <Button type="submit" className="w-full">
        Нэвтрэх
      </Button>
    </form>
  );
}
