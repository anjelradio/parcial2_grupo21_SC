import { z } from "zod";
// ============================================
// PERMISOS DOCENTE - SCHEMAS
// ============================================

export const PermisoDocenteSchema = z.object({
  id_permiso: z.number(),
  codigo_docente: z.string(),
  nombre_docente: z.string(),
  documento_evidencia: z.string().nullable(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  motivo: z.string(),
  estado: z.enum(["Pendiente", "Aprobado", "Rechazado"]),
  fecha_solicitud: z.string(),
  fecha_revision: z.string().nullable(),
  observaciones: z.string().nullable(),
});

// ============================================
// ESTRUCTURAS AUXILIARES
// ============================================

export const PaginacionSchema = z.object({
  total_registros: z.number(),
  total_paginas: z.number(),
  pagina_actual: z.number(),
  registros_por_pagina: z.number(),
  tiene_siguiente: z.boolean(),
  tiene_anterior: z.boolean(),
});

export const FiltrosAplicadosSchema = z.object({
  nombre_docente: z.string().nullable(),
  fecha: z.string().nullable(),
  id_gestion: z.union([z.number(), z.string()]).nullable(),
});

// ============================================
// LISTA PAGINADA DE PERMISOS DOCENTE
// ============================================

export const PermisosDocenteListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z
    .object({
      permisos: z.array(PermisoDocenteSchema),
      paginacion: PaginacionSchema,
      filtros_aplicados: FiltrosAplicadosSchema,
    })
    .nullable(),
});

// ============================================
// MUTACIÓN Y UPDATE
// ============================================

export const PermisoDocenteMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: PermisoDocenteSchema.nullable(),
});

export const UpdatePermisoDocenteSchema = z.object({
  estado: z.enum(["Pendiente", "Aprobado", "Rechazado"]),
  observaciones: z.string().max(500).optional().or(z.literal("")),
});

// ============================================
// SOLICITUDES AULA - SCHEMAS
// ============================================

export const SolicitudAulaSchema = z.object({
  id_solicitud: z.number(),
  nombre_docente: z.string().nullable(),
  codigo_docente: z.string().nullable(),
  nro_aula: z.string(),
  aula: z.string().nullable(),
  fecha_solicitada: z.string(),
  motivo: z.string(),
  estado: z.enum(["Pendiente", "Aprobada", "Rechazada"], {
    message: "Estado inválido",
  }),
  fecha_solicitud: z.string(),
  observaciones: z.string().nullable(),
});

// ============================================
// LISTA PAGINADA DE SOLICITUDES AULA
// ============================================

export const SolicitudesAulaListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z
    .object({
      solicitudes: z.array(SolicitudAulaSchema),
      paginacion: PaginacionSchema,
      filtros_aplicados: FiltrosAplicadosSchema,
    })
    .nullable(),
});

// ============================================
// MUTACIÓN Y UPDATE
// ============================================

export const SolicitudAulaMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: SolicitudAulaSchema.nullable(),
});

export const UpdateSolicitudAulaSchema = z.object({
  estado: z
    .enum(["Pendiente", "Aprobada", "Rechazada"], {
      message: "Estado inválido",
    })
    .refine((v) => !!v, { message: "El estado es obligatorio" }),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});
