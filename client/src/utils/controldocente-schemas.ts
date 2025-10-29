import { z } from "zod";

// ============================================
// PERMISOS DOCENTE - SCHEMAS
// ============================================

const PermisoDocenteSchema = z.object({
  id_permiso: z.number(),
  codigo_docente: z.string(),
  nombre_docente: z.string(),
  documento_evidencia: z.string().nullable(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  motivo: z.string(),
  estado: z.enum(["Pendiente", "Aprobado", "Rechazado"], {
    message: "Estado inválido",
  }),
  fecha_solicitud: z.string(),
  fecha_revision: z.string().nullable(),
  observaciones: z.string().nullable(),
});

export const PermisosDocenteListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(PermisoDocenteSchema).nullable(),
});

export const PermisoDocenteMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: PermisoDocenteSchema.nullable(),
});

export const UpdatePermisoDocenteSchema = z.object({
  estado: z
    .enum(["Pendiente", "Aprobado", "Rechazado"], {
      message: "Estado inválido",
    })
    .refine((v) => !!v, { message: "El estado es obligatorio" }),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// ============================================
// SOLICITUDES AULA - SCHEMAS
// ============================================

const SolicitudAulaSchema = z.object({
  id_solicitud: z.number(),
  id_asignacion: z.number(),
  nro_aula: z.string(),
  fecha_solicitada: z.string(),
  motivo: z.string(),
  estado: z.enum(["Pendiente", "Aprobada", "Rechazada"], {
    message: "Estado inválido",
  }),
  fecha_solicitud: z.string(),
  observaciones: z.string().nullable(),
  aula: z.string().nullable(),
  asignacion: z
    .object({
      id: z.number(),
      codigo_docente: z.string(),
      estado: z.string(),
    })
    .nullable(),
});

export const SolicitudesAulaListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(SolicitudAulaSchema).nullable(),
});

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

