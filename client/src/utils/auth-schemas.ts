import { z } from "zod";

// ------ ESQUEMAS DE USUARIO ------
export const UsuarioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido_paterno: z.string(),
  apellido_materno: z.string(),
  nombre_completo: z.string(),
  email: z.string().email(),
  rol: z.enum(["DOCENTE", "ADMIN", "AUTORIDAD"]),
  codigo_docente: z.string().optional(),
  profesion: z.string().optional().nullable(),
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