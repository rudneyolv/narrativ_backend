interface ErrorTypes {
  code: string;
  message: string;
  defaultField: string;
  field?: string;
}

export const errorTypes = {
  EMAIL_ALREADY_EXISTS: {
    code: "auth/email-already-exists",
    message: "O e-mail já está cadastrado",
    defaultField: "email",
  },
} as const satisfies Record<string, ErrorTypes>;
