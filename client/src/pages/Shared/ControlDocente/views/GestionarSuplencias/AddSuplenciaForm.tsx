import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../components/ui/select";
import Button from "../../../../../components/ui/Button";
import { Textarea } from "../../../../../components/ui/text-area";
import { AlertCircle, X, Plus } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import { CreateSuplenciaDataSchema } from "../../../../../utils/suplencias-schemas";
import type { CreateSuplenciaData } from "../../../../../types";

function AddSuplenciaForm() {
  const {
    // Docentes y asignaciones
    docentes,
    asignacionesDocente,
    fetchDocentes,
    fetchAsignacionesPorDocente,
    clearAsignacionesPorDocente,
    isLoadingAsignacionesDocente,
    // Suplencias
    createNewSuplencia,
    isCreatingSuplencia,
    createSuplenciaResponse,
    clearCreateSuplenciaResponse,
  } = useAppStore();

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
  const [errorMessage, setErrorMessage] = useState("");

  // Estado para mostrar carta de error
  const [showError, setShowError] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateSuplenciaData>({
    resolver: zodResolver(CreateSuplenciaDataSchema),
    defaultValues: {
      cod_titular: "",
      cod_suplente: "",
      id_asignacion: 0,
      motivo: "",
      fecha_inicio: "",
      fecha_fin: "",
    },
  });

  const idAsignacionSeleccionada = watch("id_asignacion");

  // Cargar docentes al montar el componente
  useEffect(() => {
    if (docentes.length === 0) {
      fetchDocentes();
    }
  }, [docentes.length, fetchDocentes]);

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

  // Mostrar toast cuando termine la operación
  useEffect(() => {
    if (createSuplenciaResponse.ok && createSuplenciaResponse.message) {
      toast.success(createSuplenciaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      // Resetear formulario
      reset();
      setSelectedTitular(null);
      setSelectedSuplente(null);
      setDocenteTitularInput("");
      setDocenteSuplenteInput("");
      clearAsignacionesPorDocente();
      setShowError(false);
      clearCreateSuplenciaResponse();
    } else if (!createSuplenciaResponse.ok && createSuplenciaResponse.message) {
      

      // Guardar el mensaje localmente antes de limpiar
      setErrorMessage(createSuplenciaResponse.message);
      setShowError(true);

      clearCreateSuplenciaResponse(); // limpiar slice, pero ya guardaste el texto
    }
  }, [
    createSuplenciaResponse,
    reset,
    clearCreateSuplenciaResponse,
    clearAsignacionesPorDocente,
  ]);

  // Enviar formulario
  const onSubmit = async (data: CreateSuplenciaData) => {
    console.log("📤 Enviando suplencia:", data);

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

    const success = await createNewSuplencia(data);

    if (!success) {
      setShowError(true);
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
        <h3 className="text-gray-900">Registrar Nueva Suplencia</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Docente Titular - Buscador con autocompletado */}
          <div className="relative md:col-span-2 lg:col-span-1">
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
                setTimeout(() => setShowDocenteTitularSuggestions(false), 200)
              }
              disabled={isCreatingSuplencia}
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

          {/* Docente Suplente - Buscador con autocompletado */}
          <div className="relative md:col-span-2 lg:col-span-1">
            <Label className="text-sm text-gray-600 mb-2">
              Docente Suplente
            </Label>
            <Input
              placeholder="Buscar docente suplente..."
              value={docenteSuplenteInput}
              onChange={(e) => handleDocenteSuplenteChange(e.target.value)}
              onFocus={() =>
                docenteSuplenteInput.length > 0 &&
                setShowDocenteSuplenteSuggestions(true)
              }
              onBlur={() =>
                setTimeout(() => setShowDocenteSuplenteSuggestions(false), 200)
              }
              disabled={isCreatingSuplencia}
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

          {/* Materia y Grupo (Asignación) */}
          <div className="md:col-span-2 lg:col-span-1">
            <Label className="text-sm text-gray-600 mb-2">
              Materia y Grupo
            </Label>
            <Select
              value={idAsignacionSeleccionada?.toString() || ""}
              onValueChange={(value) =>
                setValue("id_asignacion", parseInt(value))
              }
              disabled={
                !selectedTitular ||
                isLoadingAsignacionesDocente ||
                asignacionesDocente.length === 0 ||
                isCreatingSuplencia
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

          {/* Fecha Inicio */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Fecha Inicio</Label>
            <Input
              type="date"
              {...register("fecha_inicio")}
              disabled={isCreatingSuplencia}
              style={{ borderRadius: "8px" }}
            />
            {errors.fecha_inicio && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fecha_inicio.message}
              </p>
            )}
          </div>

          {/* Fecha Fin */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Fecha Fin</Label>
            <Input
              type="date"
              {...register("fecha_fin")}
              disabled={isCreatingSuplencia}
              style={{ borderRadius: "8px" }}
            />
            {errors.fecha_fin && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fecha_fin.message}
              </p>
            )}
          </div>
        </div>

        {/* Motivo de Suplencia */}
        <div className="mb-4">
          <Label className="text-sm text-gray-600 mb-2">
            Motivo de Suplencia
          </Label>
          <Textarea
            placeholder="Describe el motivo de la suplencia..."
            {...register("motivo")}
            rows={3}
            disabled={isCreatingSuplencia}
            style={{ borderRadius: "8px" }}
          />
          {errors.motivo && (
            <p className="text-red-500 text-sm mt-1">{errors.motivo.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button icon={Plus} type="submit" disabled={isCreatingSuplencia}>
            {isCreatingSuplencia ? "Registrando..." : "Registrar Suplencia"}
          </Button>
        </div>
      </form>

      {/* Carta de Error */}
      {showError && errorMessage && (
        <div
          className="mt-4 bg-red-50 border border-red-200 p-4 flex items-start gap-3"
          style={{ borderRadius: "8px", minHeight: "120px" }}
        >
          <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-red-800 font-medium mb-1">
              Error al crear suplencia
            </h4>
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
          <button
            onClick={() => setShowError(false)}
            className="p-1 text-red-600 hover:bg-red-100 transition-colors flex-shrink-0"
            style={{ borderRadius: "4px" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AddSuplenciaForm;
