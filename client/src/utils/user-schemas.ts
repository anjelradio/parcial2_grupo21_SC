import { z } from "zod";
import { UsuarioSchema } from "./auth-schemas";

export const UsersListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(UsuarioSchema).nullable(),
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// Esquema para CREATE/UPDATE/DELETE
export const UserMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: UsuarioSchema.nullable(),
});


// Esquema para CREATE
export const CreateUserSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio"),
  apellido_materno: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
  rol: z.enum(["ADMIN", "DOCENTE", "AUTORIDAD"]).describe("Seleccione un rol válido"),
  profesion: z.string().optional(),
});

// Esquema para UPDATE
export const UpdateUserSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio"),
  apellido_materno: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.string().email("Debe ser un email válido"),
  rol: z.enum(["ADMIN", "DOCENTE", "AUTORIDAD"]),
  profesion: z.string().optional(),
});