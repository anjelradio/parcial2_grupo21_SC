import { useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import {
  AlertCircle,
  UserCircle2,
  UserCheck,
  FileText,
  Calendar,
  Trash2,
} from "lucide-react";
import { useAppStore } from "../../../../../../stores/useAppStore";

function DeleteSuplenciaModal() {
  const {
    setModal,
    modals,
    selectedSuplencia,
    deleteExistingSuplencia,
    isDeletingSuplencia,
    deleteSuplenciaResponse,
    clearDeleteSuplenciaResponse,
  } = useAppStore();

  // Limpiar respuesta al cerrar modal
  useEffect(() => {
    if (!modals.deleteSuplencia) {
      clearDeleteSuplenciaResponse();
    }
  }, [modals.deleteSuplencia, clearDeleteSuplenciaResponse]);

  // Mostrar toast cuando termine la eliminación
  useEffect(() => {
    if (deleteSuplenciaResponse.ok && deleteSuplenciaResponse.message) {
      toast.success(deleteSuplenciaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      setModal("deleteSuplencia", false);
      clearDeleteSuplenciaResponse();
    } else if (
      !deleteSuplenciaResponse.ok &&
      deleteSuplenciaResponse.message
    ) {
      toast.error(deleteSuplenciaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearDeleteSuplenciaResponse();
    }
  }, [deleteSuplenciaResponse, setModal, clearDeleteSuplenciaResponse]);

  const handleCancel = () => {
    setModal("deleteSuplencia", false);
    setModal("editSuplencia", true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSuplencia) return;

    console.log("🗑️ Eliminando suplencia:", selectedSuplencia.id_suplencia);

    const success = await deleteExistingSuplencia(
      selectedSuplencia.id_suplencia
    );

    if (success) {
      setModal("deleteSuplencia", false);
    }
  };

  return (
    <Dialog
      open={modals.deleteSuplencia}
      onOpenChange={(open) => setModal("deleteSuplencia", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "12px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-4">
            ¿Estás seguro de que deseas eliminar esta suplencia? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {selectedSuplencia && (
          <div className="py-4">
            <div
              className="bg-gradient-to-br from-red-50 to-orange-50 p-4 border-l-4 border-red-500"
              style={{ borderRadius: "8px" }}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <UserCircle2 className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Docente Titular</p>
                    <p className="text-gray-900 text-sm">
                      {selectedSuplencia.nombre_docente_titular}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Docente Suplente</p>
                    <p className="text-gray-900 text-sm">
                      {selectedSuplencia.nombre_docente_suplente}
                    </p>
                  </div>
                </div>

                {selectedSuplencia.materia && selectedSuplencia.grupo && (
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Materia y Grupo</p>
                      <p className="text-gray-900 text-sm">
                        {selectedSuplencia.materia.sigla} -{" "}
                        {selectedSuplencia.materia.nombre}
                      </p>
                      <p className="text-gray-700 text-xs">
                        Grupo: {selectedSuplencia.grupo.nombre}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Período</p>
                    <p className="text-gray-900 text-sm">
                      {selectedSuplencia.fecha_inicio} al{" "}
                      {selectedSuplencia.fecha_fin}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-3 pt-3 border-t border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Estado</p>
                    <span
                      className={`px-2 py-1 text-xs font-medium ${
                        selectedSuplencia.estado === "Activa"
                          ? "bg-green-100 text-green-700"
                          : selectedSuplencia.estado === "Finalizada"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      style={{ borderRadius: "4px" }}
                    >
                      {selectedSuplencia.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeletingSuplencia}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeletingSuplencia}
            className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingSuplencia ? "Eliminando..." : "Confirmar eliminación"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteSuplenciaModal;