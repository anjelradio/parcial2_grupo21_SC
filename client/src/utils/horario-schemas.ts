import { z } from "zod";

// ========== ESQUEMAS PARA DÍA ==========
export const DiaSchema = z.object({
  id_dia: z.number(),
  nombre: z.string(),
});

export const DiasListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(DiaSchema).nullable(),
});

export const DiaMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: DiaSchema.nullable(),
});

// ========== ESQUEMAS PARA BLOQUE HORARIO ==========
export const BloqueHorarioSchema = z.object({
  id_bloque: z.number(),
  hora_inicio: z.string(), // Formato "HH:mm"
  hora_fin: z.string(), // Formato "HH:mm"
  rango: z.string(), // Formato "HH:mm - HH:mm"
});

export const BloquesHorariosListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(BloqueHorarioSchema).nullable(),
});

export const BloqueHorarioMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: BloqueHorarioSchema.nullable(),
});