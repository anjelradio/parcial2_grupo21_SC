import { z } from "zod";

// ------ ESQUEMAS DE USUARIO ------
export const UsuarioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido_paterno: z.string(),
  apellido_materno: z.string(),
  nombre_completo: z.string(),
  email: z.string().regex(/^[^@\s]+@[^@\s]+$/, "Formato de correo inválido"),
  rol: z.enum(["DOCENTE", "ADMIN", "AUTORIDAD"]),
  codigo_docente: z.string().nullable().optional(), 
  profesion: z.string().nullable().optional(), 
});

// ------ ESQUEMA DE TOKENS ------
export const TokensSchema = z.object({
  token: z.string(),
});

// ------ ESQUEMA DE RESPUESTA DE LOGIN ------
export const LoginAPIResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z
    .object({
      user: UsuarioSchema,
      token: z.string(),
    })
    .nullable(),
});

// ------ ESQUEMA DE RESPUESTA DEL ENDPOINT /me ------
export const MeAPIResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: UsuarioSchema.nullable(),
});

// ------ ESQUEMA DE RESPUESTA DE LOGOUT ------
export const LogoutAPIResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.null(),
});

// ------ ESQUEMA DE ERROR GENÉRICO ------
export const ErrorAPIResponseSchema = z.object({
  ok: z.literal(false),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

// ------ ESQUEMAS PERFIL ------
// Datos que el usuario puede actualizar
export const UpdatePersonalInfoSchema = z.object({
  nombre: z.string().min(1),
  apellido_paterno: z.string().min(1),
  apellido_materno: z.string().min(1),
});

export const UpdatePasswordSchema = z.object({
  password_actual: z.string().min(4),
  password_nueva: z.string().min(4),
  password_confirmacion: z.string().min(4),
});

export const UpdateProfileResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: UsuarioSchema.nullable(),
});
