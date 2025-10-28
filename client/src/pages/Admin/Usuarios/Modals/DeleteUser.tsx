import { useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Badge } from "../../../../components/ui/badge";
import { AlertCircle, Trash2 } from "lucide-react";
import { useAppStore } from "../../../../stores/useAppStore";

function DeleteUser() {
  const {
    modals,
    setModal,
    selectedUser,
    deleteUser,
    isDeletingUser,
    deleteUserResponse,
    clearDeleteUserResponse,
  } = useAppStore();

  // Limpiar respuesta al cerrar modal
  useEffect(() => {
    if (!modals.deleteUser) {
      clearDeleteUserResponse();
    }
  }, [modals.deleteUser, clearDeleteUserResponse]);

  // Mostrar toast cuando termine la eliminación
  useEffect(() => {
    if (deleteUserResponse.ok && deleteUserResponse.message) {
      toast.success(deleteUserResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      clearDeleteUserResponse();
    }
  }, [deleteUserResponse, clearDeleteUserResponse]);

  const handleCancel = () => {
    setModal("deleteUser", false);
    setModal("editUser", true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    const success = await deleteUser(selectedUser.id);
    if (success) {
      setModal("deleteUser", false);
    }
  };

  return (
    <Dialog
      open={modals.deleteUser}
      onOpenChange={(open) => setModal("deleteUser", open)}
    >
      <DialogContent className="max-w-md" style={{ borderRadius: "8px" }}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-4">
            ¿Estás seguro de que deseas eliminar este usuario?
          </DialogDescription>
        </DialogHeader>

        {selectedUser && (
          <div className="py-4 px-1">
            <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
              <p className="text-gray-900 mb-1">
                {selectedUser.nombre_completo}
              </p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
              <Badge
                className={`mt-2 ${
                  selectedUser.rol === "ADMIN"
                    ? "bg-red-100 text-red-600"
                    : selectedUser.rol === "AUTORIDAD"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
                style={{ borderRadius: "4px" }}
              >
                {selectedUser.rol}
              </Badge>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeletingUser}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeletingUser}
            className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeletingUser ? "Eliminando..." : "Confirmar eliminación"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUser;