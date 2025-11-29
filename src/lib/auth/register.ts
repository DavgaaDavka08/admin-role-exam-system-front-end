import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const UserRegister = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      { email, password }
    );

    const data = response.data;

    if (data.success) {
      toast.success("Амжилттай бүртгэгдлээ!");
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  } catch (error) {
    console.log("error :>> ", error);
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const data = axiosError.response.data as { error?: string };
      toast.error(data.error || "Email эсвэл нууц үг буруу байна");
    } else {
      toast.error("Сервертэй холбогдож чадсангүй.");
    }
  }
};
