import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Edit, Save, X, Plus } from "lucide-react";
import { useAppStore } from "../../../stores/useAppStore";
import { UpdateAsignacionSchema } from "../../../utils/asignacion-schemas";
import type { UpdateAsignacionData } from "../../../types";

function EditAsignacion() {
  const {
    modals,
    setModal,
    selectedAsignacion,
    updateAsignacion,
    isUpdatingAsignacion,
    updateAsignacionResponse,
    updateAsignacionConflictos,
    clearUpdateAsignacionResponse,
    users,
    grupos,
    dias,
    bloquesHorarios,
    aulas,
  } = useAppStore();

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<UpdateAsignacionData>({
    resolver: zodResolver(UpdateAsignacionSchema),
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

  // Sincronizar formulario con asignación seleccionada
  useEffect(() => {
    if (modals.editAsignacion && selectedAsignacion) {
      reset({
        codigo_docente: selectedAsignacion.codigo_docente || "",
        id_grupo: selectedAsignacion.id_grupo || 0,
        id_gestion: selectedAsignacion.id_gestion || 1,
        estado: selectedAsignacion.estado || "Vigente",
        observaciones: selectedAsignacion.observaciones || "",
        detalles_horario: selectedAsignacion.detalles_horario.map((d) => ({
          id_dia: d.dia?.id_dia || 0,
          id_bloque: d.bloque?.id_bloque || 0,
          nro_aula: d.aula?.nro_aula || "",
        })),
      });
    }
  }, [modals.editAsignacion, selectedAsignacion, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editAsignacion) {
      setEditMode(false);
      clearUpdateAsignacionResponse();
    }
  }, [modals.editAsignacion, clearUpdateAsignacionResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (
      editMode &&
      updateAsignacionResponse.ok &&
      updateAsignacionResponse.message
    ) {
      toast.success(updateAsignacionResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editAsignacion", false);
      setEditMode(false);
      clearUpdateAsignacionResponse();
    } else if (
      !updateAsignacionResponse.ok &&
      updateAsignacionResponse.message
    ) {
      // Verificar si hay conflictos
      if (updateAsignacionConflictos && updateAsignacionConflictos.length > 0) {
        toast.error(
          `${updateAsignacionResponse.message}. Se detectaron ${updateAsignacionConflictos.length} conflicto(s)`,
          {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          }
        );
        // Mostrar detalles de conflictos
        updateAsignacionConflictos.forEach((conflicto) => {
          const mensajes = conflicto.conflictos.map((c) => c.mensaje).join(", ");
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
        toast.error(updateAsignacionResponse.message, {
          position: "top-center",
          autoClose: 4000,
          theme: "colored",
          transition: Bounce,
        });
      }
      clearUpdateAsignacionResponse();
    }
  }, [
    updateAsignacionResponse,
    updateAsignacionConflictos,
    editMode,
    setModal,
    clearUpdateAsignacionResponse,
  ]);

  const handleCancel = () => {
    setEditMode(false);
    if (selectedAsignacion) {
      reset({
        codigo_docente: selectedAsignacion.codigo_docente || "",
        id_grupo: selectedAsignacion.id_grupo || 0,
        id_gestion: selectedAsignacion.id_gestion || 1,
        estado: selectedAsignacion.estado || "Vigente",
        observaciones: selectedAsignacion.observaciones || "",
        detalles_horario: selectedAsignacion.detalles_horario.map((d) => ({
          id_dia: d.dia?.id_dia || 0,
          id_bloque: d.bloque?.id_bloque || 0,
          nro_aula: d.aula?.nro_aula || "",
        })),
      });
    }
  };

  const onSubmit = async (data: UpdateAsignacionData) => {
    if (!selectedAsignacion) return;

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

    await updateAsignacion(selectedAsignacion.id_asignacion, data);
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
    <Dialog
      open={modals.editAsignacion}
      onOpenChange={(open) => setModal("editAsignacion", open)}
    >
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: "12px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Detalles de Asignación
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Modifica los datos de la asignación"
              : "Información de la asignación seleccionada"}
          </DialogDescription>
        </DialogHeader>

        {selectedAsignacion && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Docente */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">Docente</Label>
                <Select
                  value={codigoDocenteSeleccionado}
                  onValueChange={(value) => setValue("codigo_docente", value)}
                  disabled={!editMode}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ borderRadius: "8px" }}
                  >
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
                  onValueChange={(value) => setValue("id_grupo", parseInt(value))}
                  disabled={!editMode}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ borderRadius: "8px" }}
                  >
                    <SelectValue placeholder="Seleccionar grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {grupos.map((grupo) => (
                      <SelectItem
                        key={grupo.id_grupo}
                        value={grupo.id_grupo.toString()}
                      >
                        {grupo.nombre} - {grupo?.sigla_materia}
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
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-600 mb-2">
                  Materia (Auto-generada)
                </Label>
                <Input
                  value={materiaNombre}
                  readOnly
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  style={{ borderRadius: "8px" }}
                />
              </div>

              {/* Semestre */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">Semestre</Label>
                <Input
                  value={selectedAsignacion.gestion?.nombre_gestion || "2025-1"}
                  readOnly
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  style={{ borderRadius: "8px" }}
                />
              </div>

              {/* Observaciones */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Observaciones
                </Label>
                <Input
                  {...register("observaciones")}
                  disabled={!editMode}
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Horarios */}
            {editMode && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-gray-700">
                    Horarios Asignados
                  </Label>
                  <button
                    type="button"
                    onClick={agregarHorario}
                    disabled={fields.length >= 4}
                    className="px-3 py-1.5 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center gap-1 text-xs disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Plus className="w-3 h-3" />
                    Agregar
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="bg-gray-50 p-3 border border-gray-200"
                      style={{ borderRadius: "8px" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-700">
                          Horario {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {/* Día */}
                        <div>
                          <Select
                            value={
                              watch(`detalles_horario.${idx}.id_dia`)?.toString() ||
                              ""
                            }
                            onValueChange={(value) =>
                              setValue(
                                `detalles_horario.${idx}.id_dia`,
                                parseInt(value)
                              )
                            }
                          >
                            <SelectTrigger style={{ borderRadius: "8px" }}>
                              <SelectValue placeholder="Día" />
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
                        </div>

                        {/* Bloque */}
                        <div>
                          <Select
                            value={
                              watch(`detalles_horario.${idx}.id_bloque`)?.toString() ||
                              ""
                            }
                            onValueChange={(value) =>
                              setValue(
                                `detalles_horario.${idx}.id_bloque`,
                                parseInt(value)
                              )
                            }
                          >
                            <SelectTrigger style={{ borderRadius: "8px" }}>
                              <SelectValue placeholder="Hora" />
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
                        </div>

                        {/* Aula */}
                        <div>
                          <Select
                            value={watch(`detalles_horario.${idx}.nro_aula`) || ""}
                            onValueChange={(value) =>
                              setValue(`detalles_horario.${idx}.nro_aula`, value)
                            }
                          >
                            <SelectTrigger style={{ borderRadius: "8px" }}>
                              <SelectValue placeholder="Aula" />
                            </SelectTrigger>
                            <SelectContent>
                              {aulas
                                .filter((a) => a.estado === "Disponible")
                                .map((aula) => (
                                  <SelectItem
                                    key={aula.nro_aula}
                                    value={aula.nro_aula}
                                  >
                                    {aula.nro_aula}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horarios en modo lectura */}
            {!editMode && (
              <div className="border-t pt-4">
                <Label className="text-sm text-gray-700 mb-3 block">
                  Horarios Asignados
                </Label>
                <div className="space-y-3">
                  {selectedAsignacion.detalles_horario.map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-3 border border-gray-200"
                      style={{ borderRadius: "8px" }}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Día</p>
                          <p className="text-gray-900">{h.dia?.nombre}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Hora</p>
                          <p className="text-gray-900">{h.bloque?.rango}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Aula</p>
                          <p className="text-gray-900">Aula {h.aula?.nro_aula}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              {!editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setModal("editAsignacion", false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    style={{ borderRadius: "8px" }}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {e.preventDefault();setEditMode(true)}}
                    className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center gap-2"
                    style={{ borderRadius: "8px" }}
                  >
                    <Edit className="w-4 h-4" />
                    Modificar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdatingAsignacion}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingAsignacion}
                    className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingAsignacion ? "Guardando..." : "Guardar cambios"}
                  </button>
                </>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditAsignacion;