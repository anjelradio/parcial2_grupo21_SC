import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "../../components/ui/dialog";
import Button from "../../components/ui/Button";
import { CheckCircle2, Mail, X } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useAppStore } from "../../stores/useAppStore";
import { toast, Bounce } from "react-toastify";

function ForgotPassword() {
  const { 
    modals, 
    setModal, 
    forgotPassword,
    isForgotPasswordLoading,
    forgotPasswordResponse,
    clearForgotPasswordResponse,
  } = useAppStore();

  const [recoveryInput, setRecoveryInput] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Manejar respuestas del servidor
  useEffect(() => {
    if (forgotPasswordResponse.ok && forgotPasswordResponse.message) {
      setShowSuccessMessage(true);
      setRecoveryInput("");
      
      toast.success(forgotPasswordResponse.message, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });

      // Cerrar el modal después de 3 segundos
      setTimeout(() => {
        setModal("forgotPassword", false);
        setShowSuccessMessage(false);
        clearForgotPasswordResponse();
      }, 3000);
    } else if (!forgotPasswordResponse.ok && forgotPasswordResponse.message) {
      toast.error(forgotPasswordResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearForgotPasswordResponse();
    }
  }, [forgotPasswordResponse, setModal, clearForgotPasswordResponse]);

  const handleRecoverySubmit = async () => {
    if (!recoveryInput.trim()) {
      toast.error("Debes ingresar tu código o correo electrónico", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    // Determinar si es email o código
    const isEmail = recoveryInput.includes("@");
    
    const data = isEmail
      ? { email: recoveryInput.trim() }
      : { codigo_docente: recoveryInput.trim() };

    await forgotPassword(data);
  };

  const handleClose = () => {
    setModal("forgotPassword", false);
    setRecoveryInput("");
    setShowSuccessMessage(false);
    clearForgotPasswordResponse();
  };

  return (
    <Dialog
      open={modals.forgotPassword}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="sm:max-w-md bg-white border-gray-200 shadow-2xl"
        style={{ borderRadius: "8px" }}
      >
        {/* Botón de cerrar en la esquina superior derecha */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-[#226c8f] transition-colors"
          disabled={isForgotPasswordLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader className="text-center">
          <DialogTitle
            className="text-2xl text-[#226c8f] mb-2"
            style={{ fontFamily: "Poppins, Inter, sans-serif" }}
          >
            Recuperar contraseña
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm px-4">
            Ingresa tu código, número de registro o correo electrónico para
            restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div
            className="bg-green-50 border border-green-200 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
            style={{ borderRadius: "8px" }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">
              Se ha enviado un correo con tu nueva contraseña.
            </p>
          </div>
        )}

        {/* Formulario */}
        <div className="space-y-5 px-1">
          <div className="space-y-2">
            <Label htmlFor="recovery-input" className="text-gray-700">
              Código o correo electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="recovery-input"
                type="text"
                placeholder="Código o correo electrónico"
                value={recoveryInput}
                onChange={(e) => setRecoveryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isForgotPasswordLoading) {
                    handleRecoverySubmit();
                  }
                }}
                disabled={isForgotPasswordLoading || showSuccessMessage}
                className="pl-10 h-12 border-gray-300 focus:border-[#226c8f] focus:ring-[#226c8f] shadow-sm"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Botón de enviar */}
          <div className="pt-2">
            <Button
              onClick={handleRecoverySubmit}
              size="large"
              className="w-full"
              disabled={!recoveryInput.trim() || isForgotPasswordLoading || showSuccessMessage}
            >
              {isForgotPasswordLoading ? "Enviando..." : "Enviar"}
            </Button>
          </div>

          {/* Mensaje aclaratorio */}
          <p className="text-sm text-gray-500 text-center pt-2">
            Te enviaremos un correo con una contraseña temporal para acceder al
            sistema.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPassword;