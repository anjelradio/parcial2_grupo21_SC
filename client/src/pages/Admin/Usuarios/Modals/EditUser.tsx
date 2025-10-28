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
} from "../../../../components/ui/dialog";
import { UserCircle2, Trash2, Edit, CheckCircle } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../../components/ui/select";
import { useAppStore } from "../../../../stores/useAppStore";
import { UpdateUserSchema } from "../../../../utils/user-schemas";
import type { UpdateUserData } from "../../../../types";

function EditUser() {
  const {
    modals,
    setModal,
    selectedUser,
    updateUser,
    isUpdatingUser,
    updateUserResponse,
    clearUpdateUserResponse,
  } = useAppStore();

  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
  });

  const rolSeleccionado = watch("rol");

  // Sincronizar formulario con usuario seleccionado
  useEffect(() => {
    if (modals.editUser && selectedUser) {
      reset({
        nombre: selectedUser.nombre || "",
        apellido_paterno: selectedUser.apellido_paterno || "",
        apellido_materno: selectedUser.apellido_materno || "",
        email: selectedUser.email || "",
        rol: selectedUser.rol || "DOCENTE",
        profesion: selectedUser.profesion || "",
      });
    }
  }, [modals.editUser, selectedUser, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.editUser) {
      setIsEditMode(false);
      clearUpdateUserResponse();
    }
  }, [modals.editUser, clearUpdateUserResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (
      isEditMode &&
      updateUserResponse.ok &&
      updateUserResponse.message
    ) {
      toast.success(updateUserResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("editUser", false);
      setIsEditMode(false);
    }
  }, [updateUserResponse, isEditMode, setModal]);

  const handleDeleteClick = () => {
    setModal("editUser", false);
    setModal("deleteUser", true);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (selectedUser) {
      reset({
        nombre: selectedUser.nombre || "",
        apellido_paterno: selectedUser.apellido_paterno || "",
        apellido_materno: selectedUser.apellido_materno || "",
        email: selectedUser.email || "",
        rol: selectedUser.rol || "DOCENTE",
        profesion: selectedUser.profesion || "",
      });
    }
  };

  const onSubmit = async (data: UpdateUserData) => {
    if (!selectedUser) return;

    const payload = {
      ...data,
      profesion: data.rol === "DOCENTE" ? data.profesion : undefined,
    };

    await updateUser(selectedUser.id, payload);
  };

  const onClose = () => {
    setModal("editUser", false);
  };

  return (
    <Dialog open={modals.editUser} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-[#226c8f]" />
            Información del Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditMode
              ? "Edite la información del usuario"
              : "Detalles completos del usuario"}
          </DialogDescription>
        </DialogHeader>

        {selectedUser && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">Nombre</Label>
                <Input
                  {...register("nombre")}
                  disabled={!isEditMode}
                  className="w-full"
                  style={{ borderRadius: "8px" }}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Apellido Paterno */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Apellido Paterno
                </Label>
                <Input
                  {...register("apellido_paterno")}
                  disabled={!isEditMode}
                  className="w-full"
                  style={{ borderRadius: "8px" }}
                />
                {errors.apellido_paterno && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apellido_paterno.message}
                  </p>
                )}
              </div>

              {/* Apellido Materno */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Apellido Materno
                </Label>
                <Input
                  {...register("apellido_materno")}
                  disabled={!isEditMode}
                  className="w-full"
                  style={{ borderRadius: "8px" }}
                />
                {errors.apellido_materno && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apellido_materno.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">
                  Correo Electrónico
                </Label>
                <Input
                  type="email"
                  {...register("email")}
                  disabled={!isEditMode}
                  className="w-full"
                  style={{ borderRadius: "8px" }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Rol */}
              <div>
                <Label className="text-sm text-gray-600 mb-2">Rol</Label>
                <Select
                  value={rolSeleccionado}
                  onValueChange={(value) =>
                    setValue("rol", value as "ADMIN" | "DOCENTE" | "AUTORIDAD")
                  }
                  disabled={!isEditMode}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{ borderRadius: "8px" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCENTE">Docente</SelectItem>
                    <SelectItem value="AUTORIDAD">Autoridad</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rol && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rol.message}
                  </p>
                )}
              </div>

              {/* Profesión (solo si es DOCENTE) */}
              {rolSeleccionado === "DOCENTE" && (
                <div className="md:col-span-2">
                  <Label className="text-sm text-gray-600 mb-2">
                    Profesión
                  </Label>
                  <Input
                    {...register("profesion")}
                    disabled={!isEditMode}
                    className="w-full"
                    style={{ borderRadius: "8px" }}
                  />
                  {errors.profesion && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.profesion.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
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
                      disabled={isUpdatingUser}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                      style={{ borderRadius: "8px" }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingUser}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ borderRadius: "8px" }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isUpdatingUser ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                style={{ borderRadius: "8px" }}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar usuario
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditUser;