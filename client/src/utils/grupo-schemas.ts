import { z } from "zod";

// Schema base para Grupo
export const GrupoSchema = z.object({
  id_grupo: z.number(),
  nombre: z.string(),
  id_materia: z.number(),
  sigla_materia: z.string().nullable(),
  nombre_materia: z.string().nullable(),
});

// Schema para respuesta de lista
export const GruposListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(GrupoSchema).nullable(),
});

// Schema para respuesta de mutaciones
export const GrupoMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: GrupoSchema.nullable(),
});

// Schema para crear grupo
export const CreateGrupoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  id_materia: z.number().min(1, "Debe seleccionar una materia"),
});

// Schema para actualizar grupo
export const UpdateGrupoSchema = CreateGrupoSchema;