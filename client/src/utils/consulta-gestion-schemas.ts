import { z } from "zod";
import { PaginacionSchema } from "./controldocente-schemas";

// ============================================
// CONSULTA GESTIÓN - SCHEMAS
// ============================================

export const GestionAcademicaSchema = z.object({
  id_gestion: z.number(),
  anio: z.number(),
  semestre: z.number(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  descripcion: z.string(),
  vigente: z.boolean(),
});

export const ListaSemestresResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(GestionAcademicaSchema),
});

// ============================================
// ESTADÍSTICAS DE GESTIÓN
// ============================================

export const EstadisticasGestionSchema = z.object({
  total_docentes_activos: z.number(),
  total_grupos_activos: z.number(),
  total_materias_activas: z.number(),
});

export const EstadisticasGestionResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: EstadisticasGestionSchema.nullable(),
});



// ============================================
// DOCENTES (LISTA PAGINADA)
// ============================================

export const DocenteLiteSchema = z.object({
  codigo_docente: z.string(),
  user_id: z.number().nullable().optional(), // el backend manda número; por seguridad permitimos nullable
  nombre_completo: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  profesion: z.string().nullable().optional(),
});

export const FiltrosAplicadosDocentesSchema = z.object({
  nombre_docente: z.string().nullable(),
});

export const DocentesListDataSchema = z.object({
  docentes: z.array(DocenteLiteSchema),
  paginacion: PaginacionSchema,
  filtros_aplicados: FiltrosAplicadosDocentesSchema,
});

export const DocentesListPagResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: DocentesListDataSchema.nullable(),
});

// ============================================
// GRUPOS / MATERIAS (LISTA PAGINADA)
// ============================================

export const GrupoMateriaLiteSchema = z.object({
  id_grupo: z.number().nullable().optional(),
  nombre_grupo: z.string().nullable().optional(),
  sigla_materia: z.string().nullable().optional(),
  nombre_materia: z.string().nullable().optional(),
});

export const FiltrosAplicadosGruposSchema = z.object({
  search: z.string().nullable(),
});

export const GruposListDataSchema = z.object({
  grupos_materias: z.array(GrupoMateriaLiteSchema),
  paginacion: PaginacionSchema,
  filtros_aplicados: FiltrosAplicadosGruposSchema,
});

export const GruposListPagResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: GruposListDataSchema.nullable(),
});