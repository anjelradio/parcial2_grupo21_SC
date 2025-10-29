import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "../../../../components/ui/select";
import { FileText, Save } from "lucide-react";
import { useAppStore } from "../../../../stores/useAppStore";
import type { UpdatePermisoDocenteData } from "../../../../types";
import { UpdatePermisoDocenteSchema } from "../../../../utils/controldocente-schemas";
import { Textarea } from "../../../../components/ui/text-area";

function PermisoDetail() {
  const {
    setModal,
    modals,
    selectedPermiso,
    updatePermiso,
    isUpdatingPermiso,
    updatePermisoResponse,
    clearUpdatePermisoResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdatePermisoDocenteData>({
    resolver: zodResolver(UpdatePermisoDocenteSchema),
  });

  const estadoSeleccionado = watch("estado");

  // Sincronizar formulario con permiso seleccionado
  useEffect(() => {
    if (modals.permisoDetail && selectedPermiso) {
      reset({
        estado: selectedPermiso.estado,
        observaciones: selectedPermiso.observaciones || "",
      });
    }
  }, [modals.permisoDetail, selectedPermiso, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.permisoDetail) {
      reset();
      clearUpdatePermisoResponse();
    }
  }, [modals.permisoDetail, reset, clearUpdatePermisoResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (updatePermisoResponse.ok && updatePermisoResponse.message) {
      toast.success(updatePermisoResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("permisoDetail", false);
      clearUpdatePermisoResponse();
    } else if (!updatePermisoResponse.ok && updatePermisoResponse.message) {
      toast.error(updatePermisoResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdatePermisoResponse();
    }
  }, [updatePermisoResponse, setModal, clearUpdatePermisoResponse]);

  const onSubmit = async (data: UpdatePermisoDocenteData) => {
    if (!selectedPermiso) return;
    await updatePermiso(selectedPermiso.id_permiso, data);
  };

  const handleCancel = () => {
    setModal("permisoDetail", false);
  };

  if (!selectedPermiso) return null;

  return (
    <Dialog
      open={modals.permisoDetail}
      onOpenChange={(open) => setModal("permisoDetail", open)}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: "12px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Detalle de Permiso Docente
          </DialogTitle>
          <DialogDescription>
            Información completa del permiso solicitado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Código del Docente
              </Label>
              <Input
                value={selectedPermiso.codigo_docente || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Nombre Completo
              </Label>
              <Input
                value={selectedPermiso.nombre_docente || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Fecha de Inicio
              </Label>
              <Input
                value={selectedPermiso.fecha_inicio || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Fecha de Fin
              </Label>
              <Input
                value={selectedPermiso.fecha_fin || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Fecha de Solicitud
              </Label>
              <Input
                value={selectedPermiso.fecha_solicitud || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Fecha de Revisión
              </Label>
              <Input
                value={selectedPermiso.fecha_revision || "No revisado"}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-sm text-gray-600 mb-2">
                Motivo del Permiso
              </Label>
              <Textarea
                value={selectedPermiso.motivo || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
                rows={3}
              />
            </div>

            {/* Campo editable: Estado */}
            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Estado del Permiso *
              </Label>
              <Select
                value={estadoSeleccionado}
                onValueChange={(value) =>
                  setValue(
                    "estado",
                    value as "Pendiente" | "Aprobado" | "Rechazado"
                  )
                }
                disabled={isUpdatingPermiso}
              >
                <SelectTrigger
                  className="w-full"
                  style={{ borderRadius: "8px" }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.estado.message}
                </p>
              )}
            </div>

            {/* Campo editable: Observaciones */}
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-600 mb-2">
                Observaciones (Opcional)
              </Label>
              <Textarea
                {...register("observaciones")}
                placeholder="Agregar observaciones sobre la decisión..."
                disabled={isUpdatingPermiso}
                style={{ borderRadius: "8px" }}
                rows={3}
              />
              {errors.observaciones && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.observaciones.message}
                </p>
              )}
            </div>
          </div>

          {/* Documento de evidencia */}
          {selectedPermiso.documento_evidencia && (
            <div className="border-t pt-4">
              <Label className="text-sm text-gray-700 mb-3 block">
                Documento de Evidencia
              </Label>
              <div className="flex items-center gap-4">
                <div
                  className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"
                  style={{ borderRadius: "8px" }}
                >
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-1">
                    {selectedPermiso.documento_evidencia}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Documento adjunto por el docente
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                    style={{ borderRadius: "8px" }}
                  >
                    Ver documento
                  </button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingPermiso}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isUpdatingPermiso}
              className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center gap-2 disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              <Save className="w-4 h-4" />
              {isUpdatingPermiso ? "Guardando..." : "Guardar cambios"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PermisoDetail;