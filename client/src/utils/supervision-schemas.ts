import { z } from "zod";

// ===============================
// 1️⃣ GESTIÓN
// ===============================
export const GestionDescripcionSchema = z.object({
  id_gestion: z.number(),
  descripcion: z.string(),
});

// ===============================
// 2️⃣ DISTRIBUCIÓN DE ASISTENCIAS
// ===============================
export const DistribucionTipoSchema = z.object({
  cantidad: z.number(),
  porcentaje: z.number(),
});

// ===============================
// 3️⃣ ESTADÍSTICAS GLOBALES
// ===============================
export const EstadisticasGlobalesSchema = z.object({
  tasa_cumplimiento_global: z.number(),
  total_asistencias_marcadas: z.number(),
  total_ausentes: z.number(),
  total_retrasos: z.number(),
  resumen_general: z.object({
    total_asignaciones: z.number(),
    total_docentes: z.number(),
    distribucion_asistencias: z.object({
      presencial: DistribucionTipoSchema,
      virtual: DistribucionTipoSchema,
    }),
  }),
});

export const EstadisticasGlobalesResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.object({
    estadisticas: EstadisticasGlobalesSchema,
    gestion: GestionDescripcionSchema,
  }),
});

// ===============================
// 4️⃣ INFO ASIGNACIÓN
// ===============================
export const InfoAsignacionSchema = z.object({
  id_asignacion: z.number(),
  docente: z.string(),
  profesion: z.string().nullable(),
  materia: z.string(),
  sigla: z.string(),
  grupo: z.string(),
  gestion: z.string(), // ejemplo: "2025-2"
});

// ===============================
// 5️⃣ ESTADÍSTICAS POR ASIGNACIÓN
// ===============================
export const EstadisticasAsignacionSchema = z.object({
  total_asistencias: z.number(),
  total_presentes: z.number(),
  total_ausentes: z.number(),
  total_retrasos: z.number(),
  tasa_cumplimiento: z.number(),
  distribucion_tipos: z.object({
    presencial: DistribucionTipoSchema,
    virtual: DistribucionTipoSchema,
  }),
});

// ===============================
// 6️⃣ LISTADO DE ASISTENCIAS
// ===============================
export const AsistenciaItemSchema = z.object({
  fecha: z.string(), // "2025-11-10"
  hora_registro: z.string(), // "09:12:00"
  estado: z.string(), // Presente, Ausente, Retraso
  tipo_asistencia: z.string(), // Presencial, Virtual
});

// ===============================
// 7️⃣ RESPUESTA COMPLETA ASIGNACIÓN
// ===============================
export const EstadisticasPorAsignacionResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.object({
    info_asignacion: InfoAsignacionSchema,
    estadisticas: EstadisticasAsignacionSchema,
    asistencias: z.array(AsistenciaItemSchema),
  }),
});
