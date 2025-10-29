import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Clock, X, Plus, BookOpen } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useAppStore } from "../../../stores/useAppStore";
import { CreateAsignacionSchema } from "../../../utils/asignacion-schemas";
import type { CreateAsignacionData } from "../../../types";

function AddAsignacion() {
  const {
    createAsignacion,
    isCreatingAsignacion,
    createAsignacionResponse,
    createAsignacionConflictos,
    clearCreateAsignacionResponse,
    users,
    grupos,
    dias,
    bloquesHorarios,
    aulas,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<CreateAsignacionData>({
    resolver: zodResolver(CreateAsignacionSchema),
    defaultValues: {
      codigo_docente: "",
      id_grupo: 0,
      id_gestion: 1, // Gestión 2025-1
      estado: "Vigente",
      observaciones: "",
      detalles_horario: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles_horario",
  });

  const codigoDocenteSeleccionado = watch("codigo_docente");
  const idGrupoSeleccionado = watch("id_grupo");

  // Filtrar docentes
  const docentes = users.filter((u) => u.rol === "DOCENTE");

  // Obtener materia del grupo seleccionado
  const grupoActual = grupos.find((g) => g.id_grupo === idGrupoSeleccionado);
  const materiaNombre = grupoActual?.nombre_materia
    ? `${grupoActual.sigla_materia} - ${grupoActual.nombre_materia}`
    : "";

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createAsignacionResponse.ok && createAsignacionResponse.message) {
      toast.success(createAsignacionResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset();
      clearCreateAsignacionResponse();
    } else if (
      !createAsignacionResponse.ok &&
      createAsignacionResponse.message
    ) {
      // Verificar si hay conflictos
      if (createAsignacionConflictos && createAsignacionConflictos.length > 0) {
        toast.error(
          `${createAsignacionResponse.message}. Se detectaron ${createAsignacionConflictos.length} conflicto(s)`,
          {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          }
        );
        // Mostrar detalles de conflictos
        createAsignacionConflictos.forEach((conflicto) => {
          const mensajes = conflicto.conflictos
            .map((c) => c.mensaje)
            .join(", ");
          toast.warning(
            `Conflicto con ${conflicto.asignacion.docente.nombre_completo}: ${mensajes}`,
            {
              position: "top-center",
              autoClose: 7000,
              theme: "colored",
              transition: Bounce,
            }
          );
        });
      } else {
        toast.error(createAsignacionResponse.message, {
          position: "top-center",
          autoClose: 4000,
          theme: "colored",
          transition: Bounce,
        });
      }
      clearCreateAsignacionResponse();
    }
  }, [
    createAsignacionResponse,
    createAsignacionConflictos,
    reset,
    clearCreateAsignacionResponse,
  ]);

  const onSubmit = async (data: CreateAsignacionData) => {
    // Validar que haya al menos un detalle de horario
    if (data.detalles_horario.length === 0) {
      toast.error("Debe agregar al menos un horario", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    await createAsignacion(data);
  };

  const agregarHorario = () => {
    if (fields.length < 4) {
      append({
        id_dia: 0,
        id_bloque: 0,
        nro_aula: "",
      });
    }
  };

  return (
    <div
      className="bg-white p-6 shadow-lg border border-gray-100"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1 h-6 bg-[#226c8f]"
          style={{ borderRadius: "2px" }}
        ></div>
        <h3 className="text-gray-900">Nueva Asignación</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Docente */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Docente</Label>
            <Select
              value={codigoDocenteSeleccionado}
              onValueChange={(value) => setValue("codigo_docente", value)}
              disabled={isCreatingAsignacion}
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar docente" />
              </SelectTrigger>
              <SelectContent>
                {docentes.map((docente) => (
                  <SelectItem
                    key={docente.codigo_docente}
                    value={docente.codigo_docente || ""}
                  >
                    {docente.nombre} {docente.apellido_paterno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.codigo_docente && (
              <p className="text-red-500 text-sm mt-1">
                {errors.codigo_docente.message}
              </p>
            )}
          </div>

          {/* Grupo */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Grupo</Label>
            <Select
              value={idGrupoSeleccionado?.toString() || ""}
              onValueChange={(value) => {
                setValue("id_grupo", parseInt(value));
              }}
              disabled={isCreatingAsignacion}
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar grupo" />
              </SelectTrigger>
              <SelectContent>
                {grupos.map((grupo) => (
                  <SelectItem
                    key={grupo.id_grupo}
                    value={grupo.id_grupo.toString()}
                  >
                    {grupo.nombre} - {grupo.sigla_materia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_grupo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_grupo.message}
              </p>
            )}
          </div>

          {/* Materia (Auto-generada) */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">
              Materia (Auto-generada)
            </Label>
            <Input
              value={materiaNombre}
              readOnly
              disabled
              placeholder="Seleccione un grupo primero"
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
              style={{ borderRadius: "8px" }}
            />
          </div>

          {/* Semestre */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Semestre</Label>
            <Input
              value="2025-1"
              readOnly
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* Observaciones */}
        <div className="mb-6">
          <Label className="text-sm text-gray-600 mb-2">
            Observaciones (Opcional)
          </Label>
          <Input
            {...register("observaciones")}
            placeholder="Agregar observaciones..."
            disabled={isCreatingAsignacion}
            style={{ borderRadius: "8px" }}
          />
        </div>

        {/* Sección de horarios dinámicos */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-700">
              Horarios de la Asignación
            </Label>
            <button
              type="button"
              onClick={agregarHorario}
              disabled={fields.length >= 4 || isCreatingAsignacion}
              className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              <Plus className="w-4 h-4" />
              Agregar horario
            </button>
          </div>

          {fields.length === 0 && (
            <div
              className="border-2 border-dashed border-gray-300 p-6 text-center"
              style={{ borderRadius: "8px" }}
            >
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                No hay horarios agregados. Haz clic en "Agregar horario" para
                comenzar.
              </p>
            </div>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-gray-50 p-4 shadow-sm border border-gray-200"
              style={{ borderRadius: "8px" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">
                  Horario {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={isCreatingAsignacion}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Bloque Horario */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1">
                    Bloque Horario
                  </Label>
                  <Select
                    value={
                      watch(
                        `detalles_horario.${index}.id_bloque`
                      )?.toString() || ""
                    }
                    onValueChange={(value) =>
                      setValue(
                        `detalles_horario.${index}.id_bloque`,
                        parseInt(value)
                      )
                    }
                    disabled={isCreatingAsignacion}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{ borderRadius: "8px" }}
                    >
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloquesHorarios.map((bloque) => (
                        <SelectItem
                          key={bloque.id_bloque}
                          value={bloque.id_bloque.toString()}
                        >
                          {bloque.rango}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.detalles_horario?.[index]?.id_bloque && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.detalles_horario[index]?.id_bloque?.message}
                    </p>
                  )}
                </div>

                {/* Día Académico */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1">
                    Día Académico
                  </Label>
                  <Select
                    value={
                      watch(`detalles_horario.${index}.id_dia`)?.toString() ||
                      ""
                    }
                    onValueChange={(value) =>
                      setValue(
                        `detalles_horario.${index}.id_dia`,
                        parseInt(value)
                      )
                    }
                    disabled={isCreatingAsignacion}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{ borderRadius: "8px" }}
                    >
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {dias.map((dia) => (
                        <SelectItem
                          key={dia.id_dia}
                          value={dia.id_dia.toString()}
                        >
                          {dia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.detalles_horario?.[index]?.id_dia && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.detalles_horario[index]?.id_dia?.message}
                    </p>
                  )}
                </div>

                {/* Aula */}
                <div>
                  <Label className="text-xs text-gray-600 mb-1">Aula</Label>
                  <Select
                    value={watch(`detalles_horario.${index}.nro_aula`) || ""}
                    onValueChange={(value) =>
                      setValue(`detalles_horario.${index}.nro_aula`, value)
                    }
                    disabled={isCreatingAsignacion}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{ borderRadius: "8px" }}
                    >
                      <SelectValue placeholder="Seleccionar aula" />
                    </SelectTrigger>
                    <SelectContent>
                      {aulas
                        .filter((a) => a.estado === "Disponible")
                        .map((aula) => (
                          <SelectItem key={aula.nro_aula} value={aula.nro_aula}>
                            Aula {aula.nro_aula} - {aula.tipo} (Cap:{" "}
                            {aula.capacidad})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.detalles_horario?.[index]?.nro_aula && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.detalles_horario[index]?.nro_aula?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {errors.detalles_horario &&
            !Array.isArray(errors.detalles_horario) && (
              <p className="text-red-500 text-sm">
                {errors.detalles_horario.message}
              </p>
            )}
        </div>

        <div className="flex justify-end">
          <Button icon={BookOpen} type="submit" disabled={isCreatingAsignacion}>
            {isCreatingAsignacion ? "Registrando..." : "Registrar Asignación"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddAsignacion;