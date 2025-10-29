import { useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../../components/ui/dialog";
import { AlertCircle, Trash2, Clock } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";

function DeleteHorario() {
  const {
    modals,
    setModal,
    selectedBloqueHorario,
    deleteBloqueHorario,
    isDeletingBloqueHorario,
    deleteBloqueHorarioResponse,
    clearDeleteBloqueHorarioResponse,
  } = useAppStore();

  function obtenerTurno(horaInicio: string): "Mañana" | "Tarde" | "Noche" {
    const [h, m] = horaInicio.split(":").map(Number);
    const horaDecimal = h + m / 60;

    if (horaDecimal >= 6 && horaDecimal < 12) return "Mañana";
    if (horaDecimal >= 12 && horaDecimal < 18) return "Tarde";
    return "Noche";
  }

  // Limpiar respuesta al cerrar modal
  useEffect(() => {
    if (!modals.deleteHorario) {
      clearDeleteBloqueHorarioResponse();
    }
  }, [modals.deleteHorario, clearDeleteBloqueHorarioResponse]);

  // Mostrar toast cuando termine la eliminación
  useEffect(() => {
    if (
      deleteBloqueHorarioResponse.ok &&
      deleteBloqueHorarioResponse.message
    ) {
      toast.success(deleteBloqueHorarioResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("deleteHorario", false);
      clearDeleteBloqueHorarioResponse();
    } else if (
      !deleteBloqueHorarioResponse.ok &&
      deleteBloqueHorarioResponse.message
    ) {
      toast.error(deleteBloqueHorarioResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearDeleteBloqueHorarioResponse();
    }
  }, [
    deleteBloqueHorarioResponse,
    setModal,
    clearDeleteBloqueHorarioResponse,
  ]);

  const handleCancel = () => {
    setModal("deleteHorario", false);
  };

  const handleDelete = async () => {
    if (!selectedBloqueHorario) return;
    await deleteBloqueHorario(selectedBloqueHorario.id_bloque);
  };

  return (
    <Dialog
      open={modals.deleteHorario}
      onOpenChange={(open) => setModal("deleteHorario", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-4">
            ¿Estás seguro de que deseas eliminar este bloque horario?
          </DialogDescription>
        </DialogHeader>

        {selectedBloqueHorario && (
          <div className="py-4">
            <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#226c8f]" />
                <div>
                  <p className="text-gray-900">{selectedBloqueHorario.rango}</p>
                  <p className="text-sm text-gray-600">
                    {obtenerTurno(selectedBloqueHorario.hora_inicio)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeletingBloqueHorario}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeletingBloqueHorario}
            className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingBloqueHorario ? "Eliminando..." : "Eliminar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteHorario;
