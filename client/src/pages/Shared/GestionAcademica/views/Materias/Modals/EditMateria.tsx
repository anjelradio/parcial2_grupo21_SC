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
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { Edit, Save } from "lucide-react";
import { useAppStore } from "../../../../../../stores/useAppStore";
import { UpdateMateriaSchema } from "../../../../../../utils/materia-schemas";
import type { UpdateMateriaData } from "../../../../../../types";

function EditMateria() {
  const {
    setModal,
    modals,
    selectedMateria,
    updateMateria,
    isUpdatingMateria,
    updateMateriaResponse,
    clearUpdateMateriaResponse,
  } = useAppStore();

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateMateriaData>({
    resolver: zodResolver(UpdateMateriaSchema),
  });

  // Sincronizar formulario con materia seleccionada
  useEffect(() => {
    if (modals.editMateria && selectedMateria) {
      reset({
        sigla: selectedMateria.sigla || "",
        nombre: selectedMateria.nombre || "",
      });
    }
  }, [modals.editMateria, selectedMateria, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editMateria) {
      setEditMode(false);
      clearUpdateMateriaResponse();
    }
  }, [modals.editMateria, clearUpdateMateriaResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (editMode && updateMateriaResponse.ok && updateMateriaResponse.message) {
      toast.success(updateMateriaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editMateria", false);
      setEditMode(false);
      clearUpdateMateriaResponse();
    } else if (!updateMateriaResponse.ok && updateMateriaResponse.message) {
      toast.error(updateMateriaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdateMateriaResponse();
    }
  }, [updateMateriaResponse, editMode, setModal, clearUpdateMateriaResponse]);

  const handleCancel = () => {
    setEditMode(false);
    if (selectedMateria) {
      reset({
        sigla: selectedMateria.sigla || "",
        nombre: selectedMateria.nombre || "",
      });
    }
  };

  const onSubmit = async (data: UpdateMateriaData) => {
    if (!selectedMateria) return;
    await updateMateria(selectedMateria.id_materia, data);
  };

  return (
    <Dialog
      open={modals.editMateria}
      onOpenChange={(open) => setModal("editMateria", open)}
    >
      <DialogContent className="max-w-2xl" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#226c8f]" />
            Editar Materia
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editMode
              ? "Modifique los campos necesarios"
              : "Información actual del registro"}
          </DialogDescription>
        </DialogHeader>

        {selectedMateria && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2">Sigla</Label>
                <Input
                  {...register("sigla")}
                  disabled={!editMode}
                  style={{ borderRadius: "8px" }}
                />
                {errors.sigla && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sigla.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2">Nombre</Label>
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
                    disabled={isUpdatingMateria}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingMateria}
                    className="flex-1 px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingMateria ? "Guardando..." : "Guardar cambios"}
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

export default EditMateria;