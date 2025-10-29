import { useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../../../components/ui/dialog";
import { AlertCircle, Trash2 } from "lucide-react";
import { useAppStore } from "../../../../../../stores/useAppStore";

function DeleteAula() {
  const {
    modals,
    setModal,
    selectedAula,
    deleteAula,
    isDeletingAula,
    deleteAulaResponse,
    clearDeleteAulaResponse,
  } = useAppStore();

  // Limpiar respuesta al cerrar modal
  useEffect(() => {
    if (!modals.deleteAula) {
      clearDeleteAulaResponse();
    }
  }, [modals.deleteAula, clearDeleteAulaResponse]);

  // Mostrar toast cuando termine la eliminación
  useEffect(() => {
    if (deleteAulaResponse.ok && deleteAulaResponse.message) {
      toast.success(deleteAulaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("deleteAula", false);
      clearDeleteAulaResponse();
    } else if (!deleteAulaResponse.ok && deleteAulaResponse.message) {
      toast.error(deleteAulaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearDeleteAulaResponse();
    }
  }, [deleteAulaResponse, setModal, clearDeleteAulaResponse]);

  const handleCancel = () => {
    setModal("deleteAula", false);
  };

  const handleDelete = async () => {
    if (!selectedAula) return;
    await deleteAula(selectedAula.nro_aula);
  };

  return (
    <Dialog
      open={modals.deleteAula}
      onOpenChange={(open) => setModal("deleteAula", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-4">
            ¿Estás seguro de que deseas eliminar este registro?
          </DialogDescription>
        </DialogHeader>

        {selectedAula && (
          <div className="py-4">
            <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
              <p className="text-[#226c8f] mb-1">Aula {selectedAula.nro_aula}</p>
              <p className="text-gray-900">{selectedAula.tipo}</p>
              <p className="text-sm text-gray-600">
                Capacidad: {selectedAula.capacidad} personas
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeletingAula}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeletingAula}
            className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingAula ? "Eliminando..." : "Eliminar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAula;