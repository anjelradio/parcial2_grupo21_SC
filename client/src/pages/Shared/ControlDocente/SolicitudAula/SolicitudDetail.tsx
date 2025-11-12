import { useEffect } from "react";
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
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import { Save } from "lucide-react";
import { useAppStore } from "../../../../stores/useAppStore";
import type { UpdateSolicitudAulaData } from "../../../../types";
import { UpdateSolicitudAulaSchema } from "../../../../utils/controldocente-schemas";
import { Textarea } from "../../../../components/ui/text-area";

function SolicitudDetail() {
  const {
    modals,
    setModal,
    selectedSolicitud,
    updateSolicitud,
    isUpdatingSolicitud,
    updateSolicitudResponse,
    clearUpdateSolicitudResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateSolicitudAulaData>({
    resolver: zodResolver(UpdateSolicitudAulaSchema),
  });

  const estadoSeleccionado = watch("estado");

  // Sincronizar formulario con solicitud seleccionada
  useEffect(() => {
    if (modals.solicitudDetail && selectedSolicitud) {
      reset({
        estado: selectedSolicitud.estado,
        observaciones: selectedSolicitud.observaciones || "",
      });
    }
  }, [modals.solicitudDetail, selectedSolicitud, reset]);

  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!modals.solicitudDetail) {
      reset();
      clearUpdateSolicitudResponse();
    }
  }, [modals.solicitudDetail, reset, clearUpdateSolicitudResponse]);

  // Mostrar toast cuando termine la actualización
  useEffect(() => {
    if (updateSolicitudResponse.ok && updateSolicitudResponse.message) {
      toast.success(updateSolicitudResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("solicitudDetail", false);
      clearUpdateSolicitudResponse();
    } else if (
      !updateSolicitudResponse.ok &&
      updateSolicitudResponse.message
    ) {
      toast.error(updateSolicitudResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearUpdateSolicitudResponse();
    }
  }, [updateSolicitudResponse, setModal, clearUpdateSolicitudResponse]);

  const onSubmit = async (data: UpdateSolicitudAulaData) => {
    if (!selectedSolicitud) return;
    await updateSolicitud(selectedSolicitud.id_solicitud, data);
  };

  const handleCancel = () => {
    setModal("solicitudDetail", false);
  };

  if (!selectedSolicitud) return null;

  return (
    <Dialog
      open={modals.solicitudDetail}
      onOpenChange={(open) => setModal("solicitudDetail", open)}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: "12px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Detalle de Solicitud de Aula
          </DialogTitle>
          <DialogDescription>
            Información completa de la solicitud
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Número de Aula
              </Label>
              <Input
                value={selectedSolicitud.nro_aula || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Tipo de Aula
              </Label>
              <Input
                value={selectedSolicitud.aula || "N/A"}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Código Docente
              </Label>
              <Input
                value={selectedSolicitud.codigo_docente || "N/A"}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Estado Asignación
              </Label>
              <Input
                value={selectedSolicitud?.estado || "N/A"}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Fecha Solicitada
              </Label>
              <Input
                value={selectedSolicitud.fecha_solicitada || ""}
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
                value={selectedSolicitud.fecha_solicitud || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-sm text-gray-600 mb-2">
                Motivo de la Solicitud
              </Label>
              <Textarea
                value={selectedSolicitud.motivo || ""}
                readOnly
                className="bg-gray-50"
                style={{ borderRadius: "8px" }}
                rows={3}
              />
            </div>

            {/* Campo editable: Estado */}
            <div>
              <Label className="text-sm text-gray-600 mb-2">
                Estado de la Solicitud *
              </Label>
              <Select
                value={estadoSeleccionado}
                onValueChange={(value) =>
                  setValue(
                    "estado",
                    value as "Pendiente" | "Aprobada" | "Rechazada"
                  )
                }
                disabled={isUpdatingSolicitud}
              >
                <SelectTrigger
                  className="w-full"
                  style={{ borderRadius: "8px" }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
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
                disabled={isUpdatingSolicitud}
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

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingSolicitud}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={isUpdatingSolicitud}
              className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center gap-2 disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              <Save className="w-4 h-4" />
              {isUpdatingSolicitud ? "Guardando..." : "Guardar cambios"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SolicitudDetail;