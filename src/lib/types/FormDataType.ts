export type FormDataType = {
  email: string;
  password: string;
  confirmPassword: string;

};

export type FormErrorType = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type ApiErrorResponse = {
  message?: string;
};
