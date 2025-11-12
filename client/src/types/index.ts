import { z } from "zod";
import {
  UsuarioSchema,
  TokensSchema,
  LoginAPIResponseSchema,
  MeAPIResponseSchema,
  LogoutAPIResponseSchema,
  UpdatePersonalInfoSchema,
  UpdatePasswordSchema,
  UpdateProfileResponseSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordResponseSchema,
} from "../utils/auth-schemas";
import type {
  UserMutationResponseSchema,
  UsersListResponseSchema,
} from "../utils/user-schemas";
import {
  MateriaSchema,
  MateriasListResponseSchema,
  MateriaMutationResponseSchema,
} from "../utils/materia-schemas";
import {
  AulaSchema,
  AulasListResponseSchema,
  AulaMutationResponseSchema,
} from "../utils/aula-schemas";
import {
  GrupoSchema,
  GruposListResponseSchema,
  GrupoMutationResponseSchema,
} from "../utils/grupo-schemas";

import {
  DiaSchema,
  DiasListResponseSchema,
  DiaMutationResponseSchema,
  BloqueHorarioSchema,
  BloquesHorariosListResponseSchema,
  BloqueHorarioMutationResponseSchema,
} from "../utils/horario-schemas";

import {
  AsignacionSchema,
  AsignacionesListResponseSchema,
  AsignacionMutationResponseSchema,
  ConflictosResponseSchema,
} from "../utils/asignacion-schemas";
import type {
  FiltrosAplicadosSchema,
  PaginacionSchema,
  PermisoDocenteMutationResponseSchema,
  PermisoDocenteSchema,
  PermisosDocenteListResponseSchema,
  SolicitudAulaMutationResponseSchema,
  SolicitudAulaSchema,
  SolicitudesAulaListResponseSchema,
  UpdatePermisoDocenteSchema,
  UpdateSolicitudAulaSchema,
} from "../utils/controldocente-schemas";
import type {
  AsignacionDocenteSchema,
  AsignacionesPorDocenteResponseSchema,
  DocenteSchema,
  DocentesListResponseSchema,
  SemestreSchema,
  SemestresListResponseSchema,
} from "../utils/utils-schemas";
import type {
  ControlDocenteStatsResponseSchema,
  ControlDocenteStatsSchema,
  PermisosStatsSchema,
  SolicitudesAulaStatsSchema,
  SuplenciasStatsSchema,
} from "../utils/stats-schema";
import type { CreateSuplenciaDataSchema, DeleteSuplenciaResponseSchema, FiltrosAplicadosSuplenciasSchema, SuplenciaResponseSchema, SuplenciaSchema, SuplenciasListResponseSchema, UpdateSuplenciaDataSchema } from "../utils/suplencias-schemas";
import type { AsistenciaDocenteSchema, AsistenciaResponseSchema, EvidenciaAsistenciaSchema, RegistrarAsistenciaPresencialSchema, RegistrarAsistenciaVirtualSchema } from "../utils/asistencia-schemas";

// ------ TIPOS INFERIDOS ------
export type Usuario = z.infer<typeof UsuarioSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type LoginAPIResponse = z.infer<typeof LoginAPIResponseSchema>;
export type MeAPIResponse = z.infer<typeof MeAPIResponseSchema>;
export type LogoutAPIResponse = z.infer<typeof LogoutAPIResponseSchema>;

// ------ TIPOS PARA FORMULARIOS (Draft) ------
export type LoginWithCodeForm = {
  codigo_docente: string;
  password: string;
};

export type LoginWithEmailForm = {
  email: string;
  password: string;
};

// Para ambos tipos de login
export type LoginForm = LoginWithCodeForm | LoginWithEmailForm;

// ------ TYPE GUARDS ------
export function esLoginConCodigo(data: LoginForm): data is LoginWithCodeForm {
  return "codigo_docente" in data;
}

export function esLoginConEmail(data: LoginForm): data is LoginWithEmailForm {
  return "email" in data;
}

// ------ TYPE PERFIL ------
export type UpdatePersonalInfo = z.infer<typeof UpdatePersonalInfoSchema>;
export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

// ------ TIPOS PARA GESTIÓN DE USUARIOS ------
export type CreateUserData = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
  rol: "ADMIN" | "DOCENTE" | "AUTORIDAD";
  profesion?: string; // Solo para docentes
};

export type UpdateUserData = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  rol: "ADMIN" | "DOCENTE" | "AUTORIDAD";
  profesion?: string; // Solo para docentes
};

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type UserMutationResponse = z.infer<typeof UserMutationResponseSchema>;

// ------ TIPOS PARA MATERIAS ------
export type Materia = z.infer<typeof MateriaSchema>;
export type MateriasListResponse = z.infer<typeof MateriasListResponseSchema>;
export type MateriaMutationResponse = z.infer<
  typeof MateriaMutationResponseSchema
>;

export type CreateMateriaData = {
  sigla: string;
  nombre: string;
};

export type UpdateMateriaData = CreateMateriaData;

// ------ TIPOS PARA AULAS ------
export type Aula = z.infer<typeof AulaSchema>;
export type AulasListResponse = z.infer<typeof AulasListResponseSchema>;
export type AulaMutationResponse = z.infer<typeof AulaMutationResponseSchema>;

export type CreateAulaData = {
  nro_aula: string;
  tipo: "Aula" | "Laboratorio" | "Auditorio";
  capacidad: number;
  estado: "Disponible" | "En uso" | "Mantenimiento" | "Inactiva";
};

export type UpdateAulaData = CreateAulaData;

// ------ TIPOS PARA GRUPOS ------
export type Grupo = z.infer<typeof GrupoSchema>;
export type GruposListResponse = z.infer<typeof GruposListResponseSchema>;
export type GrupoMutationResponse = z.infer<typeof GrupoMutationResponseSchema>;

export type CreateGrupoData = {
  nombre: string;
  id_materia: number;
};

export type UpdateGrupoData = CreateGrupoData;

// ------ TIPOS PARA DÍAS ------
export type Dia = z.infer<typeof DiaSchema>;
export type DiasListResponse = z.infer<typeof DiasListResponseSchema>;
export type DiaMutationResponse = z.infer<typeof DiaMutationResponseSchema>;

export type CreateDiaData = {
  nombre: string;
};

export type UpdateDiaData = CreateDiaData;

// ------ TIPOS PARA BLOQUES HORARIOS ------
export type BloqueHorario = z.infer<typeof BloqueHorarioSchema>;
export type BloquesHorariosListResponse = z.infer<
  typeof BloquesHorariosListResponseSchema
>;
export type BloqueHorarioMutationResponse = z.infer<
  typeof BloqueHorarioMutationResponseSchema
>;

export type CreateBloqueHorarioData = {
  hora_inicio: string; // Formato "HH:mm"
  hora_fin: string; // Formato "HH:mm"
};

export type UpdateBloqueHorarioData = CreateBloqueHorarioData;

// ------ TIPOS PARA ASIGNACIONES ------
export type Asignacion = z.infer<typeof AsignacionSchema>;
export type AsignacionesListResponse = z.infer<
  typeof AsignacionesListResponseSchema
>;
export type AsignacionMutationResponse = z.infer<
  typeof AsignacionMutationResponseSchema
>;
export type ConflictosResponse = z.infer<typeof ConflictosResponseSchema>;

// Tipos para los datos anidados
export type DetalleHorarioInput = {
  id_dia: number;
  id_bloque: number;
  nro_aula: string;
};

export type CreateAsignacionData = {
  codigo_docente: string;
  id_grupo: number;
  id_gestion: number;
  estado: "Vigente" | "Finalizada" | "Cancelada";
  observaciones?: string;
  detalles_horario: DetalleHorarioInput[];
};

export type UpdateAsignacionData = CreateAsignacionData;

// Tipos para conflictos
export type ConflictoDetalle = {
  tipo: string;
  mensaje: string;
};

export type AsignacionConflictiva = {
  id_asignacion: number;
  docente: {
    codigo_docente: string;
    nombre_completo: string;
  };
  grupo: {
    id_grupo: number;
    nombre: string;
    materia: {
      sigla: string;
      nombre: string;
    };
  };
  gestion: {
    anio: number;
    semestre: number;
  };
  detalle_horario: {
    dia: string;
    bloque: string;
    aula: string;
  };
};

export type ConflictoAgrupado = {
  asignacion: AsignacionConflictiva;
  conflictos: ConflictoDetalle[];
};

export type UpdatePermisoDocenteFormData = z.infer<
  typeof UpdatePermisoDocenteSchema
>;
export type UpdateSolicitudAulaFormData = z.infer<
  typeof UpdateSolicitudAulaSchema
>;

// ============================================
// PERMISOS DOCENTE
// ============================================
export type PermisoDocente = z.infer<typeof PermisoDocenteSchema>;
export type Paginacion = z.infer<typeof PaginacionSchema>;
export type FiltrosAplicados = z.infer<typeof FiltrosAplicadosSchema>;
export type PermisosDocenteListResponse = z.infer<
  typeof PermisosDocenteListResponseSchema
>;
export type PermisoDocenteMutationResponse = z.infer<
  typeof PermisoDocenteMutationResponseSchema
>;
export type UpdatePermisoDocenteData = z.infer<
  typeof UpdatePermisoDocenteSchema
>;

// ============================================
// SOLICITUDES AULA
// ============================================

export type SolicitudAula = z.infer<typeof SolicitudAulaSchema>;
export type SolicitudesAulaListResponse = z.infer<
  typeof SolicitudesAulaListResponseSchema
>;
export type SolicitudAulaMutationResponse = z.infer<
  typeof SolicitudAulaMutationResponseSchema
>;
export type UpdateSolicitudAulaData = z.infer<typeof UpdateSolicitudAulaSchema>;



// ============================================
// SUPLENCIAS DOCENTES
// ============================================

export type Suplencia = z.infer<typeof SuplenciaSchema>;
export type SuplenciasListResponse = z.infer<typeof SuplenciasListResponseSchema>;
export type SuplenciaResponse = z.infer<typeof SuplenciaResponseSchema>;
export type DeleteSuplenciaResponse = z.infer<typeof DeleteSuplenciaResponseSchema>;
export type FiltrosAplicadosSuplencias = z.infer<typeof FiltrosAplicadosSuplenciasSchema>;
export type CreateSuplenciaData = z.infer<typeof CreateSuplenciaDataSchema>;
export type UpdateSuplenciaData = z.infer<typeof UpdateSuplenciaDataSchema>;



// ============================================
// RESPUESTAS API
// ============================================

export type ApiResponse<T = any> = {
  ok: boolean;
  message: string;
  data?: T;
  errors?: any;
};

export type ApiErrorResponse = {
  ok: false;
  message: string;
  errors?: any;
};

// ForgotPss
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<
  typeof ForgotPasswordResponseSchema
>;

// ============================================
// UTILIDADES
// ============================================

// --- Semestre ---
export type Semestre = z.infer<typeof SemestreSchema>;
export type SemestresListResponse = z.infer<typeof SemestresListResponseSchema>;

// --- Docentes ---
export type Docente = z.infer<typeof DocenteSchema>;
export type DocentesListResponse = z.infer<typeof DocentesListResponseSchema>;

// --- Asignaciones ---
export type AsignacionDocente = z.infer<typeof AsignacionDocenteSchema>;
export type AsignacionesPorDocenteResponse = z.infer<typeof AsignacionesPorDocenteResponseSchema>;


// ============================================
//  STATS
// ============================================

// --- Control docente ---
export type PermisosStats = z.infer<typeof PermisosStatsSchema>;
export type SolicitudesAulaStats = z.infer<typeof SolicitudesAulaStatsSchema>;
export type SuplenciasStats = z.infer<typeof SuplenciasStatsSchema>;
export type ControlDocenteStats = z.infer<typeof ControlDocenteStatsSchema>;
export type ControlDocenteStatsResponse = z.infer<
  typeof ControlDocenteStatsResponseSchema
>;



export type AsistenciaDocente = z.infer<typeof AsistenciaDocenteSchema>;
export type EvidenciaAsistencia = z.infer<typeof EvidenciaAsistenciaSchema>;
export type AsistenciaResponse = z.infer<typeof AsistenciaResponseSchema>;
export type RegistrarAsistenciaPresencial = z.infer<typeof RegistrarAsistenciaPresencialSchema>;
export type RegistrarAsistenciaVirtual = z.infer<typeof RegistrarAsistenciaVirtualSchema>;
