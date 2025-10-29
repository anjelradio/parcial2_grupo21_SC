import { useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useAppStore } from "../../../stores/useAppStore";

function DeleteAsignacion() {
  const {
    setModal,
    modals,
    selectedAsignacion,
    deleteAsignacion,
    isDeletingAsignacion,
    deleteAsignacionResponse,
    clearDeleteAsignacionResponse,
  } = useAppStore();

  // Limpiar respuesta al cerrar modal
  useEffect(() => {
    if (!modals.deleteAsignacion) {
      clearDeleteAsignacionResponse();
    }
  }, [modals.deleteAsignacion, clearDeleteAsignacionResponse]);

  // Mostrar toast cuando termine la eliminación
  useEffect(() => {
    if (deleteAsignacionResponse.ok && deleteAsignacionResponse.message) {
      toast.success(deleteAsignacionResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("deleteAsignacion", false);
      clearDeleteAsignacionResponse();
    } else if (
      !deleteAsignacionResponse.ok &&
      deleteAsignacionResponse.message
    ) {
      toast.error(deleteAsignacionResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearDeleteAsignacionResponse();
    }
  }, [
    deleteAsignacionResponse,
    setModal,
    clearDeleteAsignacionResponse,
  ]);

  const handleCancel = () => {
    setModal("deleteAsignacion", false);
  };

  const handleDelete = async () => {
    if (!selectedAsignacion) return;
    await deleteAsignacion(selectedAsignacion.id_asignacion);
  };

  return (
    <Dialog
      open={modals.deleteAsignacion}
      onOpenChange={(open) => setModal("deleteAsignacion", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "12px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Eliminar Asignación
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta asignación?
          </DialogDescription>
        </DialogHeader>

        {selectedAsignacion && (
          <div className="bg-gray-50 p-4 my-4" style={{ borderRadius: "8px" }}>
            <p className="text-sm text-gray-600 mb-1">
              Docente:{" "}
              <span className="text-gray-900">
                {selectedAsignacion.docente?.nombre_completo ||
                  selectedAsignacion.codigo_docente}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Grupo:{" "}
              <span className="text-gray-900">
                {selectedAsignacion.grupo?.nombre}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Materia:{" "}
              <span className="text-gray-900">
                {selectedAsignacion.grupo?.materia?.nombre}
              </span>
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeletingAsignacion}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeletingAsignacion}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingAsignacion ? "Eliminando..." : "Confirmar eliminación"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAsignacion;