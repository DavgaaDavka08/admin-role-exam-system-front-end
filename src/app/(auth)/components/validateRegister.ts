import { FormDataType, FormErrorType } from "@/lib/types/FormDataType";

export const validateRegister = (data: FormDataType) => {
  const errors: FormErrorType = {};

  if (!data.email.includes("@")) {
    errors.email = "Invalid email. @ заавал байх ёстой";
  }
  if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
