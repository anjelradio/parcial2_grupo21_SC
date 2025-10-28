import { z } from "zod";

// Schema base para Materia
export const MateriaSchema = z.object({
  id_materia: z.number(),
  sigla: z.string(),
  nombre: z.string(),
});

// Schema para respuesta de lista
export const MateriasListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(MateriaSchema).nullable(),
});

// Schema para respuesta de mutaciones (create, update, delete)
export const MateriaMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: MateriaSchema.nullable(),
});

// Schema para crear materia
export const CreateMateriaSchema = z.object({
  sigla: z.string().max(20, "La sigla no puede exceder 20 caracteres"),
  nombre: z.string().max(150, "El nombre no puede exceder 150 caracteres"),
});

// Schema para actualizar materia
export const UpdateMateriaSchema = CreateMateriaSchema;