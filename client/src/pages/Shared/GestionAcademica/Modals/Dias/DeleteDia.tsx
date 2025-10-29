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
import { AlertCircle, Calendar, Trash2 } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";

function DeleteDia() {
  const {
    modals,
    setModal,
    selectedDia,
    deleteDia,
    isDeletingDia,
    deleteDiaResponse,
    clearDeleteDiaResponse,
  } = useAppStore();

  // Limpiar respuesta al cerrar modal
  useEffect(() => {
    if (!modals.deleteDia) {
      clearDeleteDiaResponse();
    }
  }, [modals.deleteDia, clearDeleteDiaResponse]);

  // Mostrar toast cuando termine la eliminación
  useEffect(() => {
    if (deleteDiaResponse.ok && deleteDiaResponse.message) {
      toast.success(deleteDiaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("deleteDia", false);
      clearDeleteDiaResponse();
    } else if (!deleteDiaResponse.ok && deleteDiaResponse.message) {
      toast.error(deleteDiaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearDeleteDiaResponse();
    }
  }, [deleteDiaResponse, setModal, clearDeleteDiaResponse]);

  const handleCancel = () => {
    setModal("deleteDia", false);
  };

  const handleDelete = async () => {
    if (!selectedDia) return;
    await deleteDia(selectedDia.id_dia);
  };

  return (
    <Dialog
      open={modals.deleteDia}
      onOpenChange={(open) => setModal("deleteDia", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-4">
            ¿Estás seguro de que deseas eliminar este día académico?
          </DialogDescription>
        </DialogHeader>

        {selectedDia && (
          <div className="py-4">
            <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#226c8f]" />
                <p className="text-gray-900">{selectedDia.nombre}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeletingDia}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeletingDia}
            className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingDia ? "Eliminando..." : "Eliminar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDia;