import { z } from "zod";

//
// ============================================
// ESTADÍSTICAS - CONTROL DOCENTE
// ============================================
//

// --- Bloque de Permisos Docente ---
export const PermisosStatsSchema = z.object({
  pendientes: z.number().nonnegative(),
  aprobados: z.number().nonnegative(),
  rechazados: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// --- Bloque de Solicitudes de Aula ---
export const SolicitudesAulaStatsSchema = z.object({
  pendientes: z.number().nonnegative(),
  aprobadas: z.number().nonnegative(),
  rechazadas: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// --- Bloque de Suplencias ---
export const SuplenciasStatsSchema = z.object({
  activas: z.number().nonnegative(),
  finalizadas: z.number().nonnegative(),
  canceladas: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// --- Bloque General de Estadísticas de Control Docente ---
export const ControlDocenteStatsSchema = z.object({
  gestion_actual: z.string(), // ejemplo: "2025-1"
  permisos: PermisosStatsSchema,
  solicitudes_aula: SolicitudesAulaStatsSchema,
  suplencias: SuplenciasStatsSchema,
});

// --- Respuesta del Endpoint ---
export const ControlDocenteStatsResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: ControlDocenteStatsSchema.nullable(),
});


