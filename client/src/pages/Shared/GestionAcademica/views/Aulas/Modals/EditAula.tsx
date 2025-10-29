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
import { Edit, Save } from "lucide-react";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../../components/ui/select";
import { useAppStore } from "../../../../../../stores/useAppStore";
import { UpdateAulaSchema } from "../../../../../../utils/aula-schemas";
import type { UpdateAulaData } from "../../../../../../types";

function EditAula() {
  const {
    setModal,
    modals,
    selectedAula,
    updateAula,
    isUpdatingAula,
    updateAulaResponse,
    clearUpdateAulaResponse,
  } = useAppStore();

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateAulaData>({
    resolver: zodResolver(UpdateAulaSchema),
  });

  const tipoSeleccionado = watch("tipo");
  const estadoSeleccionado = watch("estado");

  // Sincronizar formulario con aula seleccionada
  useEffect(() => {
    if (modals.editAula && selectedAula) {
      reset({
        nro_aula: selectedAula.nro_aula || "",
        tipo: selectedAula.tipo || "Aula",
        capacidad: selectedAula.capacidad || 0,
        estado: selectedAula.estado || "Disponible",
      });
    }
  }, [modals.editAula, selectedAula, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editAula) {
      setEditMode(false);
      clearUpdateAulaResponse();
    }
  }, [modals.editAula, clearUpdateAulaResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (editMode && updateAulaResponse.ok && updateAulaResponse.message) {
      toast.success(updateAulaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editAula", false);
      setEditMode(false);
      clearUpdateAulaResponse();
    } else if (!updateAulaResponse.ok && updateAulaResponse.message) {
      toast.error(updateAulaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdateAulaResponse();
    }
  }, [updateAulaResponse, editMode, setModal, clearUpdateAulaResponse]);

  const handleCancel = () => {
    setEditMode(false);
    if (selectedAula) {
      reset({
        nro_aula: selectedAula.nro_aula || "",
        tipo: selectedAula.tipo || "Aula",
        capacidad: selectedAula.capacidad || 0,
        estado: selectedAula.estado || "Disponible",
      });
    }
  };

  const onSubmit = async (data: UpdateAulaData) => {
    if (!selectedAula) return;
    await updateAula(selectedAula.nro_aula, data);
  };

  return (
    <Dialog
      open={modals.editAula}
      onOpenChange={(open) => setModal("editAula", open)}
    >
      <DialogContent className="max-w-2xl" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#226c8f]" />
            Editar Aula
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editMode
              ? "Modifique los campos necesarios"
              : "Información actual del registro"}
          </DialogDescription>
        </DialogHeader>

        {selectedAula && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Número de Aula
                </Label>
                <Input
                  {...register("nro_aula")}
                  disabled={!editMode}
                  style={{ borderRadius: "8px" }}
                />
                {errors.nro_aula && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nro_aula.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2">Tipo</Label>
                <Select
                  value={tipoSeleccionado}
                  onValueChange={(value) =>
                    setValue(
                      "tipo",
                      value as "Aula" | "Laboratorio" | "Auditorio"
                    )
                  }
                  disabled={!editMode}
                >
                  <SelectTrigger style={{ borderRadius: "8px" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aula">Aula</SelectItem>
                    <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                    <SelectItem value="Auditorio">Auditorio</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tipo.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2">Capacidad</Label>
                <Input
                  type="number"
                  {...register("capacidad", { valueAsNumber: true })}
                  disabled={!editMode}
                  style={{ borderRadius: "8px" }}
                />
                {errors.capacidad && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.capacidad.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2">Estado</Label>
                <Select
                  value={estadoSeleccionado}
                  onValueChange={(value) =>
                    setValue(
                      "estado",
                      value as
                        | "Disponible"
                        | "En uso"
                        | "Mantenimiento"
                        | "Inactiva"
                    )
                  }
                  disabled={!editMode}
                >
                  <SelectTrigger style={{ borderRadius: "8px" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En uso">En uso</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Inactiva">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.estado.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="flex-1 px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2"
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
                    disabled={isUpdatingAula}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingAula}
                    className="flex-1 px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingAula ? "Guardando..." : "Guardar cambios"}
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

export default EditAula;
