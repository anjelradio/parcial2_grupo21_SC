import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../../../components/ui/dialog";
import { Edit, Calendar, CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "../../../../../../components/ui/scroll-area";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";
import { Textarea } from "../../../../../../components/ui/text-area";
import { useAppStore } from "../../../../../../stores/useAppStore";
import { UpdateSuplenciaDataSchema } from "../../../../../../utils/suplencias-schemas";
import type { UpdateSuplenciaData } from "../../../../../../types";

function EditSuplenciaModal() {
  const {
    setModal,
    modals,
    selectedSuplencia,
    updateExistingSuplencia,
    isUpdatingSuplencia,
    updateSuplenciaResponse,
    clearUpdateSuplenciaResponse,
    // Docentes y asignaciones
    docentes,
    asignacionesDocente,
    fetchDocentes,
    fetchAsignacionesPorDocente,
    clearAsignacionesPorDocente,
    isLoadingAsignacionesDocente,
  } = useAppStore();

  const [isEditMode, setIsEditMode] = useState(false);

  // Estados para autocompletado del titular
  const [docenteTitularInput, setDocenteTitularInput] = useState("");
  const [docenteTitularSuggestions, setDocenteTitularSuggestions] = useState<
    typeof docentes
  >([]);
  const [showDocenteTitularSuggestions, setShowDocenteTitularSuggestions] =
    useState(false);
  const [selectedTitular, setSelectedTitular] = useState<
    (typeof docentes)[0] | null
  >(null);

  // Estados para autocompletado del suplente
  const [docenteSuplenteInput, setDocenteSuplenteInput] = useState("");
  const [docenteSuplenteSuggestions, setDocenteSuplenteSuggestions] = useState<
    typeof docentes
  >([]);
  const [showDocenteSuplenteSuggestions, setShowDocenteSuplenteSuggestions] =
    useState(false);
  const [selectedSuplente, setSelectedSuplente] = useState<
    (typeof docentes)[0] | null
  >(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateSuplenciaData>({
    resolver: zodResolver(UpdateSuplenciaDataSchema),
    defaultValues: {
      cod_titular: "",
      cod_suplente: "",
      id_asignacion: 0,
      motivo: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "Activa",
    },
  });

  const idAsignacionSeleccionada = watch("id_asignacion");
  const estadoSeleccionado = watch("estado");

  // Cargar docentes al montar el componente
  useEffect(() => {
    if (docentes.length === 0) {
      fetchDocentes();
    }
  }, [docentes.length, fetchDocentes]);

  // Sincronizar formulario con suplencia seleccionada
  useEffect(() => {
    if (modals.editSuplencia && selectedSuplencia) {
      // Buscar docentes
      const titular = docentes.find(
        (d) => d.codigo_docente === selectedSuplencia.cod_titular
      );
      const suplente = docentes.find(
        (d) => d.codigo_docente === selectedSuplencia.cod_suplente
      );

      setSelectedTitular(titular || null);
      setSelectedSuplente(suplente || null);
      setDocenteTitularInput(
        titular?.nombre_completo || selectedSuplencia.nombre_docente_titular
      );
      setDocenteSuplenteInput(
        suplente?.nombre_completo || selectedSuplencia.nombre_docente_suplente
      );

      // Cargar asignaciones del titular
      if (selectedSuplencia.cod_titular) {
        fetchAsignacionesPorDocente(selectedSuplencia.cod_titular, true);
      }

      // Resetear formulario con datos de la suplencia
      reset({
        cod_titular: selectedSuplencia.cod_titular,
        cod_suplente: selectedSuplencia.cod_suplente,
        id_asignacion: selectedSuplencia.id_asignacion,
        motivo: selectedSuplencia.motivo,
        fecha_inicio: selectedSuplencia.fecha_inicio,
        fecha_fin: selectedSuplencia.fecha_fin,
        estado: selectedSuplencia.estado,
      });
    }
  }, [
    modals.editSuplencia,
    selectedSuplencia,
    docentes,
    reset,
    fetchAsignacionesPorDocente,
  ]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editSuplencia) {
      setIsEditMode(false);
      clearUpdateSuplenciaResponse();
      clearAsignacionesPorDocente();
      setSelectedTitular(null);
      setSelectedSuplente(null);
      setDocenteTitularInput("");
      setDocenteSuplenteInput("");
    }
  }, [
    modals.editSuplencia,
    clearUpdateSuplenciaResponse,
    clearAsignacionesPorDocente,
  ]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (
      isEditMode &&
      updateSuplenciaResponse.ok &&
      updateSuplenciaResponse.message
    ) {
      toast.success(updateSuplenciaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editSuplencia", false);
      setIsEditMode(false);
    } else if (
      isEditMode &&
      !updateSuplenciaResponse.ok &&
      updateSuplenciaResponse.message
    ) {
      toast.error(updateSuplenciaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [updateSuplenciaResponse, isEditMode, setModal]);

  // Manejar cambio en el input del docente titular
  const handleDocenteTitularChange = (value: string) => {
    setDocenteTitularInput(value);

    if (value.trim().length > 0) {
      const filtered = docentes.filter((d) =>
        d.nombre_completo.toLowerCase().includes(value.toLowerCase())
      );
      setDocenteTitularSuggestions(filtered);
      setShowDocenteTitularSuggestions(true);
    } else {
      setDocenteTitularSuggestions([]);
      setShowDocenteTitularSuggestions(false);
    }
  };

  // Seleccionar docente titular
  const handleSelectTitular = (docente: (typeof docentes)[0]) => {
    setSelectedTitular(docente);
    setDocenteTitularInput(docente.nombre_completo);
    setShowDocenteTitularSuggestions(false);
    setValue("cod_titular", docente.codigo_docente);

    // Limpiar asignaciones previas y cargar las nuevas
    clearAsignacionesPorDocente();
    setValue("id_asignacion", 0);
    fetchAsignacionesPorDocente(docente.codigo_docente, true);
  };

  // Manejar cambio en el input del docente suplente
  const handleDocenteSuplenteChange = (value: string) => {
    setDocenteSuplenteInput(value);

    if (value.trim().length > 0) {
      const filtered = docentes.filter((d) =>
        d.nombre_completo.toLowerCase().includes(value.toLowerCase())
      );
      setDocenteSuplenteSuggestions(filtered);
      setShowDocenteSuplenteSuggestions(true);
    } else {
      setDocenteSuplenteSuggestions([]);
      setShowDocenteSuplenteSuggestions(false);
    }
  };

  // Seleccionar docente suplente
  const handleSelectSuplente = (docente: (typeof docentes)[0]) => {
    setSelectedSuplente(docente);
    setDocenteSuplenteInput(docente.nombre_completo);
    setShowDocenteSuplenteSuggestions(false);
    setValue("cod_suplente", docente.codigo_docente);
  };


  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (selectedSuplencia) {
      // Restaurar valores originales
      const titular = docentes.find(
        (d) => d.codigo_docente === selectedSuplencia.cod_titular
      );
      const suplente = docentes.find(
        (d) => d.codigo_docente === selectedSuplencia.cod_suplente
      );

      setSelectedTitular(titular || null);
      setSelectedSuplente(suplente || null);
      setDocenteTitularInput(
        titular?.nombre_completo || selectedSuplencia.nombre_docente_titular
      );
      setDocenteSuplenteInput(
        suplente?.nombre_completo || selectedSuplencia.nombre_docente_suplente
      );

      reset({
        cod_titular: selectedSuplencia.cod_titular,
        cod_suplente: selectedSuplencia.cod_suplente,
        id_asignacion: selectedSuplencia.id_asignacion,
        motivo: selectedSuplencia.motivo,
        fecha_inicio: selectedSuplencia.fecha_inicio,
        fecha_fin: selectedSuplencia.fecha_fin,
        estado: selectedSuplencia.estado,
      });
    }
  };

  const onSubmit = async (data: UpdateSuplenciaData) => {
    if (!selectedSuplencia) return;

    console.log("📤 Actualizando suplencia:", data);

    // Validaciones adicionales
    if (!selectedTitular) {
      toast.error("Debe seleccionar un docente titular", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if (!selectedSuplente) {
      toast.error("Debe seleccionar un docente suplente", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    if (data.id_asignacion === 0) {
      toast.error("Debe seleccionar una asignación", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    await updateExistingSuplencia(selectedSuplencia.id_suplencia, data);
  };

  const onClose = () => {
    setModal("editSuplencia", false);
  };

  return (
    <Dialog open={modals.editSuplencia} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ borderRadius: "12px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#226c8f]" />
            Editar Suplencia Docente
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifica los datos de la suplencia seleccionada"
              : "Detalles completos de la suplencia"}
          </DialogDescription>
        </DialogHeader>

        {selectedSuplencia && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="flex-1 pr-4 max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {/* Fecha de Registro - Solo lectura */}
                <div
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-l-4 border-[#226c8f]"
                  style={{ borderRadius: "8px" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 bg-white/60"
                      style={{ borderRadius: "6px" }}
                    >
                      <Calendar className="w-5 h-5 text-[#226c8f]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Fecha de Registro</p>
                      <p className="text-gray-900">
                        {selectedSuplencia.fecha_registro}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Docente Titular */}
                <div className="relative">
                  <Label className="text-sm text-gray-600 mb-2">
                    Docente Titular
                  </Label>
                  <Input
                    placeholder="Buscar docente titular..."
                    value={docenteTitularInput}
                    onChange={(e) => handleDocenteTitularChange(e.target.value)}
                    onFocus={() =>
                      docenteTitularInput.length > 0 &&
                      setShowDocenteTitularSuggestions(true)
                    }
                    onBlur={() =>
                      setTimeout(
                        () => setShowDocenteTitularSuggestions(false),
                        200
                      )
                    }
                    disabled={!isEditMode || isUpdatingSuplencia}
                    style={{ borderRadius: "8px" }}
                  />
                  {showDocenteTitularSuggestions &&
                    docenteTitularSuggestions.length > 0 && (
                      <div
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto"
                        style={{ borderRadius: "8px" }}
                      >
                        {docenteTitularSuggestions.map((docente) => (
                          <div
                            key={docente.codigo_docente}
                            onClick={() => handleSelectTitular(docente)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="text-sm font-medium">
                              {docente.nombre_completo}
                            </div>
                            <div className="text-xs text-gray-500">
                              Código: {docente.codigo_docente}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  {errors.cod_titular && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cod_titular.message}
                    </p>
                  )}
                </div>

                {/* Docente Suplente */}
                <div className="relative">
                  <Label className="text-sm text-gray-600 mb-2">
                    Docente Suplente
                  </Label>
                  <Input
                    placeholder="Buscar docente suplente..."
                    value={docenteSuplenteInput}
                    onChange={(e) =>
                      handleDocenteSuplenteChange(e.target.value)
                    }
                    onFocus={() =>
                      docenteSuplenteInput.length > 0 &&
                      setShowDocenteSuplenteSuggestions(true)
                    }
                    onBlur={() =>
                      setTimeout(
                        () => setShowDocenteSuplenteSuggestions(false),
                        200
                      )
                    }
                    disabled={!isEditMode || isUpdatingSuplencia}
                    style={{ borderRadius: "8px" }}
                  />
                  {showDocenteSuplenteSuggestions &&
                    docenteSuplenteSuggestions.length > 0 && (
                      <div
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto"
                        style={{ borderRadius: "8px" }}
                      >
                        {docenteSuplenteSuggestions.map((docente) => (
                          <div
                            key={docente.codigo_docente}
                            onClick={() => handleSelectSuplente(docente)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="text-sm font-medium">
                              {docente.nombre_completo}
                            </div>
                            <div className="text-xs text-gray-500">
                              Código: {docente.codigo_docente}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  {errors.cod_suplente && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cod_suplente.message}
                    </p>
                  )}
                </div>

                {/* Materia y Grupo */}
                <div>
                  <Label className="text-sm text-gray-600 mb-2">
                    Materia y Grupo
                  </Label>
                  <Select
                    value={idAsignacionSeleccionada?.toString() || ""}
                    onValueChange={(value) =>
                      setValue("id_asignacion", parseInt(value))
                    }
                    disabled={
                      !isEditMode ||
                      !selectedTitular ||
                      isLoadingAsignacionesDocente ||
                      asignacionesDocente.length === 0 ||
                      isUpdatingSuplencia
                    }
                  >
                    <SelectTrigger style={{ borderRadius: "8px" }}>
                      <SelectValue
                        placeholder={
                          !selectedTitular
                            ? "Seleccione un titular primero"
                            : isLoadingAsignacionesDocente
                            ? "Cargando asignaciones..."
                            : asignacionesDocente.length === 0
                            ? "Sin asignaciones disponibles"
                            : "Seleccionar materia y grupo"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {asignacionesDocente.map((asignacion) => (
                        <SelectItem
                          key={asignacion.id_asignacion}
                          value={asignacion.id_asignacion.toString()}
                        >
                          {asignacion.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_asignacion && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.id_asignacion.message}
                    </p>
                  )}
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2">
                      Fecha de Inicio
                    </Label>
                    <Input
                      type="date"
                      {...register("fecha_inicio")}
                      disabled={!isEditMode || isUpdatingSuplencia}
                      style={{ borderRadius: "8px" }}
                    />
                    {errors.fecha_inicio && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fecha_inicio.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2">
                      Fecha de Fin
                    </Label>
                    <Input
                      type="date"
                      {...register("fecha_fin")}
                      disabled={!isEditMode || isUpdatingSuplencia}
                      style={{ borderRadius: "8px" }}
                    />
                    {errors.fecha_fin && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fecha_fin.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Motivo */}
                <div>
                  <Label className="text-sm text-gray-600 mb-2">
                    Motivo de Suplencia
                  </Label>
                  <Textarea
                    placeholder="Describe el motivo de la suplencia..."
                    {...register("motivo")}
                    rows={3}
                    disabled={!isEditMode || isUpdatingSuplencia}
                    style={{ borderRadius: "8px" }}
                  />
                  {errors.motivo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motivo.message}
                    </p>
                  )}
                </div>

                {/* Estado de la Suplencia */}
                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 border-t-2 border-[#226c8f]"
                  style={{ borderRadius: "8px" }}
                >
                  <h4 className="text-sm text-gray-700 mb-3">
                    Estado de la Suplencia
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("estado", "Activa")}
                      disabled={!isEditMode || isUpdatingSuplencia}
                      className={`px-4 py-3 border-2 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 ${
                        estadoSeleccionado === "Activa"
                          ? "bg-green-600 text-white border-green-600 shadow-lg"
                          : "bg-white text-green-600 border-green-300 hover:border-green-500 hover:shadow-md"
                      }`}
                      style={{ borderRadius: "6px" }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Activa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("estado", "Finalizada")}
                      disabled={!isEditMode || isUpdatingSuplencia}
                      className={`px-4 py-3 border-2 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 ${
                        estadoSeleccionado === "Finalizada"
                          ? "bg-gray-600 text-white border-gray-600 shadow-lg"
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:shadow-md"
                      }`}
                      style={{ borderRadius: "6px" }}
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Finalizada</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("estado", "Cancelada")}
                      disabled={!isEditMode || isUpdatingSuplencia}
                      className={`px-4 py-3 border-2 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 ${
                        estadoSeleccionado === "Cancelada"
                          ? "bg-red-600 text-white border-red-600 shadow-lg"
                          : "bg-white text-red-600 border-red-300 hover:border-red-500 hover:shadow-md"
                      }`}
                      style={{ borderRadius: "6px" }}
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Cancelada</span>
                    </button>
                  </div>
                  {errors.estado && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.estado.message}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-4">
              <div className="flex gap-2 flex-1">
                {!isEditMode ? (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2"
                    style={{ borderRadius: "8px" }}
                  >
                    <Edit className="w-4 h-4" />
                    Editar información
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isUpdatingSuplencia}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                      style={{ borderRadius: "8px" }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingSuplencia}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ borderRadius: "8px" }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isUpdatingSuplencia ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </>
                )}
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditSuplenciaModal;
