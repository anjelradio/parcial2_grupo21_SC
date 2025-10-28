import { z } from "zod";
import {
  UsuarioSchema,
  TokensSchema,
  LoginAPIResponseSchema,
  MeAPIResponseSchema,
  LogoutAPIResponseSchema,
  UpdatePersonalInfoSchema,
  UpdatePasswordSchema,
  UpdateProfileResponseSchema,
} from "../utils/auth-schemas";
import type { UserMutationResponseSchema, UsersListResponseSchema } from "../utils/user-schemas";

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


// ------ TYPE PERFIL ------
export type UpdatePersonalInfo = z.infer<typeof UpdatePersonalInfoSchema>;
export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

// ------ TIPOS PARA GESTIÓN DE USUARIOS ------
export type CreateUserData = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
  rol: "ADMIN" | "DOCENTE" | "AUTORIDAD";
  profesion?: string; // Solo para docentes
};

export type UpdateUserData = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  rol: "ADMIN" | "DOCENTE" | "AUTORIDAD";
  profesion?: string; // Solo para docentes
};

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type UserMutationResponse = z.infer<typeof UserMutationResponseSchema>;