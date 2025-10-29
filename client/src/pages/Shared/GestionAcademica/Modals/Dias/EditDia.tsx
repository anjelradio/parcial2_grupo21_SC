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
} from "../../../../../components/ui/dialog";
import { Edit, Save } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { UpdateDiaSchema } from "../../../../../utils/horario-schemas";
import type { UpdateDiaData } from "../../../../../types";

function EditDia() {
  const {
    modals,
    setModal,
    selectedDia,
    updateDia,
    isUpdatingDia,
    updateDiaResponse,
    clearUpdateDiaResponse,
  } = useAppStore();

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateDiaData>({
    resolver: zodResolver(UpdateDiaSchema),
  });

  // Sincronizar formulario con día seleccionado
  useEffect(() => {
    if (modals.editDia && selectedDia) {
      reset({
        nombre: selectedDia.nombre || "",
      });
    }
  }, [modals.editDia, selectedDia, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editDia) {
      setEditMode(false);
      clearUpdateDiaResponse();
    }
  }, [modals.editDia, clearUpdateDiaResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (editMode && updateDiaResponse.ok && updateDiaResponse.message) {
      toast.success(updateDiaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editDia", false);
      setEditMode(false);
      clearUpdateDiaResponse();
    } else if (!updateDiaResponse.ok && updateDiaResponse.message) {
      toast.error(updateDiaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdateDiaResponse();
    }
  }, [updateDiaResponse, editMode, setModal, clearUpdateDiaResponse]);

  const handleCancel = () => {
    setEditMode(false);
    if (selectedDia) {
      reset({
        nombre: selectedDia.nombre || "",
      });
    }
  };

  const onSubmit = async (data: UpdateDiaData) => {
    if (!selectedDia) return;
    await updateDia(selectedDia.id_dia, data);
  };

  return (
    <Dialog
      open={modals.editDia}
      onOpenChange={(open) => setModal("editDia", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#226c8f]" />
            Editar Día Académico
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editMode
              ? "Modifique el nombre del día académico"
              : "Información actual del registro"}
          </DialogDescription>
        </DialogHeader>

        {selectedDia && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Nombre del Día
              </Label>
              <Input
                {...register("nombre")}
                disabled={!editMode}
                style={{ borderRadius: "8px" }}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
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
                    disabled={isUpdatingDia}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingDia}
                    className="flex-1 px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingDia ? "Guardando..." : "Guardar cambios"}
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

export default EditDia;