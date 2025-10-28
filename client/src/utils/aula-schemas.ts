import { z } from "zod";

// Schema base para Aula
export const AulaSchema = z.object({
  nro_aula: z.string(),
  tipo: z.enum(["Aula", "Laboratorio", "Auditorio"]),
  capacidad: z.number(),
  estado: z.enum(["Disponible", "En uso", "Mantenimiento", "Inactiva"]),
});

// Schema para respuesta de lista
export const AulasListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(AulaSchema).nullable(),
});

// Schema para respuesta de mutaciones
export const AulaMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: AulaSchema.nullable(),
});

// Schema para crear aula
export const CreateAulaSchema = z.object({
  nro_aula: z.string().max(10, "El número de aula no puede exceder 10 caracteres"),
  tipo: z.enum(["Aula", "Laboratorio", "Auditorio"]),
  capacidad: z.number().min(1).max(500),
  estado: z.enum(["Disponible", "En uso", "Mantenimiento", "Inactiva"]),
});

// Schema para actualizar aula
export const UpdateAulaSchema = CreateAulaSchema;