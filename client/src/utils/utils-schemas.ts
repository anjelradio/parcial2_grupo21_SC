import { z } from "zod";

// ============================================
// SEMESTRES - SCHEMA
// ============================================

// Cada semestre individual
export const SemestreSchema = z.object({
  id_gestion: z.number(),
  nombre: z.string(), // Ej: "2025-2"
  fecha_inicio: z.string().date("Formato de fecha inválido").or(z.string()),
  fecha_fin: z.string().date("Formato de fecha inválido").or(z.string()),
});

// Respuesta completa del backend
export const SemestresListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.object({
    semestres: z.array(SemestreSchema),
  }),
});


// ============================================
// DOCENTES - SCHEMA
// ============================================

// Cada docente individual
export const DocenteSchema = z.object({
  id_docente: z.string(), 
  codigo_docente: z.string(),
  user_id: z.number(),
  nombre_completo: z.string(),
  profesion: z.string().nullable(),
  email: z.string().nullable(),
});

// Respuesta completa del backend
export const DocentesListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.object({
    docentes: z.array(DocenteSchema),
  }),
});

// ============================================
// ASIGNACIONES POR DOCENTE - SCHEMA
// ============================================

// Cada asignación individual
export const AsignacionDocenteSchema = z.object({
  id_asignacion: z.number(),
  descripcion: z.string(),
});

// Respuesta completa del backend
export const AsignacionesPorDocenteResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z
    .object({
      gestion_actual: z.string(),
      asignaciones: z.array(AsignacionDocenteSchema),
    })
    .nullable(),
});

