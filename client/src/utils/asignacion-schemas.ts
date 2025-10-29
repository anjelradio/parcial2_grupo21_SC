import { z } from "zod";

// ========== ESQUEMAS AUXILIARES ==========
const DocenteSchema = z.object({
  codigo_docente: z.string(),
  nombre_completo: z.string(),
  profesion: z.string().nullable(),
});

const MateriaSchema = z.object({
  id_materia: z.number(),
  sigla: z.string(),
  nombre: z.string(),
});

const GrupoSchema = z.object({
  id_grupo: z.number(),
  nombre: z.string(),
  materia: MateriaSchema.nullable(),
});

const GestionSchema = z.object({
  id_gestion: z.number(),
  anio: z.number(),
  semestre: z.number(),
  nombre_gestion: z.string(),
});

const DiaSchema = z.object({
  id_dia: z.number(),
  nombre: z.string(),
});

const BloqueSchema = z.object({
  id_bloque: z.number(),
  hora_inicio: z.string(),
  hora_fin: z.string(),
  rango: z.string(),
});

const AulaSchema = z.object({
  nro_aula: z.string(),
  tipo: z.string(),
  capacidad: z.number(),
});

const DetalleHorarioSchema = z.object({
  id_detallehorario: z.number(),
  dia: DiaSchema.nullable(),
  bloque: BloqueSchema.nullable(),
  aula: AulaSchema.nullable(),
  descripcion: z.string().nullable(),
});

// ========== ESQUEMA PRINCIPAL DE ASIGNACIÓN ==========
export const AsignacionSchema = z.object({
  id_asignacion: z.number(),
  codigo_docente: z.string(),
  docente: DocenteSchema.nullable(),
  id_grupo: z.number(),
  grupo: GrupoSchema.nullable(),
  id_gestion: z.number(),
  gestion: GestionSchema.nullable(),
  estado: z.enum(["Vigente", "Finalizada", "Cancelada"]),
  observaciones: z.string().nullable(),
  detalles_horario: z.array(DetalleHorarioSchema),
});

// ========== ESQUEMAS DE RESPUESTAS ==========
export const AsignacionesListResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.array(AsignacionSchema).nullable(),
});

export const AsignacionMutationResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: AsignacionSchema.nullable(),
});

// ========== ESQUEMAS DE CONFLICTOS ==========
const ConflictoDetalleSchema = z.object({
  tipo: z.string(),
  mensaje: z.string(),
});

const AsignacionConflictivaDocenteSchema = z.object({
  codigo_docente: z.string(),
  nombre_completo: z.string(),
});

const AsignacionConflictivaMateriaSchema = z.object({
  sigla: z.string(),
  nombre: z.string(),
});

const AsignacionConflictivaGrupoSchema = z.object({
  id_grupo: z.number(),
  nombre: z.string(),
  materia: AsignacionConflictivaMateriaSchema,
});

const AsignacionConflictivaGestionSchema = z.object({
  anio: z.number(),
  semestre: z.number(),
});

const DetalleHorarioConflictoSchema = z.object({
  dia: z.string(),
  bloque: z.string(),
  aula: z.string(),
});

const AsignacionConflictivaSchema = z.object({
  id_asignacion: z.number(),
  docente: AsignacionConflictivaDocenteSchema,
  grupo: AsignacionConflictivaGrupoSchema,
  gestion: AsignacionConflictivaGestionSchema,
  detalle_horario: DetalleHorarioConflictoSchema,
});

const ConflictoAgrupadoSchema = z.object({
  asignacion: AsignacionConflictivaSchema,
  conflictos: z.array(ConflictoDetalleSchema),
});

export const ConflictosResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  data: z.object({
    conflictos: z.array(ConflictoAgrupadoSchema),
  }).nullable(),
});