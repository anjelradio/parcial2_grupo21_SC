import { z } from "zod";

// ============================================
// SUPLENCIAS DOCENTES - SCHEMAS
// ============================================

export const SuplenciaSchema = z.object({
  id_suplencia: z.number(),
  id_asignacion: z.number(),
  cod_titular: z.string(),
  nombre_docente_titular: z.string(),
  cod_suplente: z.string(),
  nombre_docente_suplente: z.string(),
  materia: z
    .object({
      id_materia: z.number(),
      sigla: z.string(),
      nombre: z.string(),
    })
    .nullable(),
  grupo: z
    .object({
      id_grupo: z.number(),
      nombre: z.string(),
    })
    .nullable(),
  gestion: z
    .object({
      id_gestion: z.number(),
      anio: z.number(),
      semestre: z.number(),
      nombre_gestion: z.string(),
    })
    .nullable(),
  motivo: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  estado: z.enum(["Activa", "Finalizada", "Cancelada"]),
  fecha_registro: z.string(),
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

export const FiltrosAplicadosSuplenciasSchema = z.object({
  nombre_titular: z.string().nullable(),
  id_gestion: z.union([z.number(), z.string()]).nullable(),
});

// ============================================
// REQUEST SCHEMAS (para crear/actualizar)
// ============================================

export const CreateSuplenciaDataSchema = z.object({
  cod_titular: z.string().min(1, "El código del titular es obligatorio"),
  cod_suplente: z.string().min(1, "El código del suplente es obligatorio"),
  id_asignacion: z.number().min(1, "La asignación es obligatoria"),
  motivo: z.string().min(1, "El motivo es obligatorio").max(500),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
});

export const UpdateSuplenciaDataSchema = z.object({
  cod_titular: z.string().min(1, "El código del titular es obligatorio"),
  cod_suplente: z.string().min(1, "El código del suplente es obligatorio"),
  id_asignacion: z.number().min(1, "La asignación es obligatoria"),
  motivo: z.string().min(1, "El motivo es obligatorio").max(500),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
  estado: z.enum(["Activa", "Finalizada", "Cancelada"]),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

export const SuplenciasListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z
    .object({
      suplencias: z.array(SuplenciaSchema),
      paginacion: PaginacionSchema,
      filtros_aplicados: FiltrosAplicadosSuplenciasSchema,
    })
    .nullable(),
});

export const SuplenciaResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: SuplenciaSchema.nullable(),
});

export const DeleteSuplenciaResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: SuplenciaSchema.nullable(),
});