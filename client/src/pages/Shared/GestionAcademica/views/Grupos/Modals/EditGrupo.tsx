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
import { UpdateGrupoSchema } from "../../../../../../utils/grupo-schemas";
import type { UpdateGrupoData } from "../../../../../../types";

function EditGrupo() {
  const {
    setModal,
    modals,
    materias,
    selectedGrupo,
    updateGrupo,
    isUpdatingGrupo,
    updateGrupoResponse,
    clearUpdateGrupoResponse,
  } = useAppStore();

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateGrupoData>({
    resolver: zodResolver(UpdateGrupoSchema),
  });

  const materiaSeleccionada = watch("id_materia");

  // Sincronizar formulario con grupo seleccionado
  useEffect(() => {
    if (modals.editGrupo && selectedGrupo) {
      reset({
        nombre: selectedGrupo.nombre || "",
        id_materia: selectedGrupo.id_materia || 0,
      });
    }
  }, [modals.editGrupo, selectedGrupo, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editGrupo) {
      setEditMode(false);
      clearUpdateGrupoResponse();
    }
  }, [modals.editGrupo, clearUpdateGrupoResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (editMode && updateGrupoResponse.ok && updateGrupoResponse.message) {
      toast.success(updateGrupoResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editGrupo", false);
      setEditMode(false);
      clearUpdateGrupoResponse();
    } else if (!updateGrupoResponse.ok && updateGrupoResponse.message) {
      toast.error(updateGrupoResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdateGrupoResponse();
    }
  }, [updateGrupoResponse, editMode, setModal, clearUpdateGrupoResponse]);

  const handleCancel = () => {
    setEditMode(false);
    if (selectedGrupo) {
      reset({
        nombre: selectedGrupo.nombre || "",
        id_materia: selectedGrupo.id_materia || 0,
      });
    }
  };

  const onSubmit = async (data: UpdateGrupoData) => {
    if (!selectedGrupo) return;
    await updateGrupo(selectedGrupo.id_grupo, data);
  };

  return (
    <Dialog
      open={modals.editGrupo}
      onOpenChange={(open) => setModal("editGrupo", open)}
    >
      <DialogContent className="max-w-2xl" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#226c8f]" />
            Editar Grupo
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {editMode
              ? "Modifique los campos necesarios"
              : "Información actual del registro"}
          </DialogDescription>
        </DialogHeader>

        {selectedGrupo && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Nombre del Grupo
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

              <div>
                <Label className="text-sm text-gray-600 mb-2">Materia</Label>
                <Select
                  value={materiaSeleccionada?.toString()}
                  onValueChange={(value) =>
                    setValue("id_materia", parseInt(value))
                  }
                  disabled={!editMode}
                >
                  <SelectTrigger style={{ borderRadius: "8px" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((materia) => (
                      <SelectItem
                        key={materia.id_materia}
                        value={materia.id_materia.toString()}
                      >
                        {materia.sigla} - {materia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_materia && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.id_materia.message}
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
                    disabled={isUpdatingGrupo}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingGrupo}
                    className="flex-1 px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: "8px" }}
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingGrupo ? "Guardando..." : "Guardar cambios"}
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

export default EditGrupo;