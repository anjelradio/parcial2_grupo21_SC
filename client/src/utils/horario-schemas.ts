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

// ========== ESQUEMAS PARA FORMULARIOS DE DÍA ==========
export const CreateDiaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del día es obligatorio")
    .max(10, "El nombre no puede exceder 10 caracteres")
    .transform((val) => val.trim()),
});

export const UpdateDiaSchema = CreateDiaSchema;

// ========== ESQUEMAS PARA FORMULARIOS DE BLOQUE HORARIO ==========
export const CreateBloqueHorarioSchema = z
  .object({
    hora_inicio: z
      .string()
      .min(1, "La hora de inicio es obligatoria")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato debe ser HH:mm"),
    hora_fin: z
      .string()
      .min(1, "La hora de fin es obligatoria")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato debe ser HH:mm"),
  })
  .refine(
    (data) => {
      const [hInicio, mInicio] = data.hora_inicio.split(":").map(Number);
      const [hFin, mFin] = data.hora_fin.split(":").map(Number);
      const inicio = hInicio * 60 + mInicio;
      const fin = hFin * 60 + mFin;
      return fin > inicio;
    },
    {
      message: "La hora de fin debe ser posterior a la hora de inicio",
      path: ["hora_fin"],
    }
  );

export const UpdateBloqueHorarioSchema = CreateBloqueHorarioSchema;