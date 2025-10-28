import { z } from "zod";
import {
  UsuarioSchema,
  TokensSchema,
  LoginAPIResponseSchema,
  MeAPIResponseSchema,
  LogoutAPIResponseSchema,
} from "../utils/auth-schemas";

// ------ TIPOS INFERIDOS ------
export type Usuario = z.infer<typeof UsuarioSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type LoginAPIResponse = z.infer<typeof LoginAPIResponseSchema>;
export type MeAPIResponse = z.infer<typeof MeAPIResponseSchema>;
export type LogoutAPIResponse = z.infer<typeof LogoutAPIResponseSchema>;

// ------ TIPOS PARA FORMULARIOS (Draft) ------
export type LoginWithCodeForm = {
  codigo_docente: string;
  password: string;
};

export type LoginWithEmailForm = {
  email: string;
  password: string;
};

// Para ambos tipos de login
export type LoginForm = LoginWithCodeForm | LoginWithEmailForm;

// ------ TYPE GUARDS ------
export function esLoginConCodigo(
  data: LoginForm
): data is LoginWithCodeForm {
  return "codigo_docente" in data;
}

export function esLoginConEmail(data: LoginForm): data is LoginWithEmailForm {
  return "email" in data;
}