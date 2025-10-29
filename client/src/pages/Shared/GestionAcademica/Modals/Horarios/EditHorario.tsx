import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../../components/ui/dialog";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Save, Edit } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import { UpdateBloqueHorarioSchema } from "../../../../../utils/horario-schemas";
import type { UpdateBloqueHorarioData } from "../../../../../types";

function EditHorario() {
  const {
    setModal,
    modals,
    selectedBloqueHorario,
    updateBloqueHorario,
    isUpdatingBloqueHorario,
    updateBloqueHorarioResponse,
    clearUpdateBloqueHorarioResponse,
  } = useAppStore();

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateBloqueHorarioData>({
    resolver: zodResolver(UpdateBloqueHorarioSchema),
  });

  // Sincronizar formulario con bloque seleccionado
  useEffect(() => {
    if (modals.editHorario && selectedBloqueHorario) {
      reset({
        hora_inicio: selectedBloqueHorario.hora_inicio || "",
        hora_fin: selectedBloqueHorario.hora_fin || "",
      });
    }
  }, [modals.editHorario, selectedBloqueHorario, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editHorario) {
      setEditMode(false);
      clearUpdateBloqueHorarioResponse();
    }
  }, [modals.editHorario, clearUpdateBloqueHorarioResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (
      editMode &&
      updateBloqueHorarioResponse.ok &&
      updateBloqueHorarioResponse.message
    ) {
      toast.success(updateBloqueHorarioResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editHorario", false);
      setEditMode(false);
      clearUpdateBloqueHorarioResponse();
    } else if (
      !updateBloqueHorarioResponse.ok &&
      updateBloqueHorarioResponse.message
    ) {
      toast.error(updateBloqueHorarioResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdateBloqueHorarioResponse();
    }
  }, [
    updateBloqueHorarioResponse,
    editMode,
    setModal,
    clearUpdateBloqueHorarioResponse,
  ]);

  const handleCancel = () => {
    setEditMode(false);
    if (selectedBloqueHorario) {
      reset({
        hora_inicio: selectedBloqueHorario.hora_inicio || "",
        hora_fin: selectedBloqueHorario.hora_fin || "",
      });
    }
  };

  const onSubmit = async (data: UpdateBloqueHorarioData) => {
    if (!selectedBloqueHorario) return;
    await updateBloqueHorario(selectedBloqueHorario.id_bloque, data);
  };

  return (
    <Dialog
      open={modals.editHorario}
      onOpenChange={(open) => setModal("editHorario", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#226c8f]" />
            Editar Bloque Horario
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editMode
              ? "Modifique los horarios del bloque"
              : "Información actual del registro"}
          </DialogDescription>
        </DialogHeader>

        {selectedBloqueHorario && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Hora de Inicio
                </Label>
                <Input
                  type="time"
                  {...register("hora_inicio")}
                  disabled={!editMode}
                  style={{ borderRadius: "8px" }}
                />
                {errors.hora_inicio && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hora_inicio.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Hora de Fin
                </Label>
                <Input
                  type="time"
                  {...register("hora_fin")}
                  disabled={!editMode}
                  style={{ borderRadius: "8px" }}
                />
                {errors.hora_fin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hora_fin.message}
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
                    disabled={isUpdatingBloqueHorario}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingBloqueHorario}
                    className="flex-1 px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingBloqueHorario
                      ? "Guardando..."
                      : "Guardar cambios"}
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

export default EditHorario;
