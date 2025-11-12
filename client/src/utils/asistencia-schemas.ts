import { z } from "zod";

// ============================================
// ASISTENCIA DOCENTE - ESTRUCTURA PRINCIPAL
// ============================================

export const AsistenciaDocenteSchema = z.object({
  id_asistencia: z.number(),
  fecha: z.string(),
  hora_registro: z.string(),
  estado: z.enum(["Presente", "Retraso", "Ausente"]),
  marcado_por: z.enum(["Titular", "Suplente"]),
  tipo: z.enum(["Presencial", "Virtual"]),
  materia: z.string().nullable(),
  grupo: z.string().nullable(),
});

// ============================================
// EVIDENCIA ASISTENCIA (solo aplica a virtual)
// ============================================

export const EvidenciaAsistenciaSchema = z.object({
  id_evidencia: z.number(),
  imagen_url: z.string().url(),
  confianza: z.number(),
  motivo: z.string().nullable(),
  fecha_subida: z.string(),
});

// ============================================
// RESPUESTAS BASE DEL BACKEND
// ============================================

export const AsistenciaResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.object({
    asistencia: AsistenciaDocenteSchema,
    evidencia: EvidenciaAsistenciaSchema.nullable(),
  }),
});

// ============================================
// REQUESTS - PRESENCIAL / VIRTUAL
// ============================================

// Asistencia Presencial → JSON
export const RegistrarAsistenciaPresencialSchema = z.object({
  token_qr: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Asistencia Virtual → FormData (multipart)
export const RegistrarAsistenciaVirtualSchema = z.object({
  file: z.instanceof(File),
  confianza: z.number().min(0).max(100),
  motivo: z.string().max(500),
});

