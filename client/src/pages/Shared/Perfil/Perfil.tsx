import { useState, useEffect } from "react";
import logoImage from "/LogoFicct.png";
import { useNavigate } from "react-router-dom";
import { User, Lock, Edit3, Save, X, LogOut } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import Button from "../../../components/ui/Button";
import { useAppStore } from "../../../stores/useAppStore";
import { useForm } from "react-hook-form";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePersonalInfoSchema,
  UpdatePasswordSchema,
} from "../../../utils/auth-schemas";
import type { UpdatePersonalInfo, UpdatePassword } from "../../../types";

function Perfil() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updatePersonalInfo,
    isUpdatingInfo,
    clearUpdateInfoResponse,
    updatePassword,
    isUpdatingPassword,
    clearUpdatePasswordResponse,
  } = useAppStore();

  const getBasePath = () => {
    switch (user?.rol) {
      case "DOCENTE":
        return "docente";
      case "AUTORIDAD":
        return "autoridad";
      case "ADMIN":
        return "admin";
      default:
        return "";
    }
  };
  const basePath = getBasePath();

  // Estados
  const [isEditing, setIsEditing] = useState(false);

  // FORMULARIO 1: Datos personales
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    reset: resetInfo,
    formState: { errors: infoErrors },
  } = useForm<UpdatePersonalInfo>({
    resolver: zodResolver(UpdatePersonalInfoSchema),
    defaultValues: {
      nombre: user?.nombre || "",
      apellido_paterno: user?.apellido_paterno || "",
      apellido_materno: user?.apellido_materno || "",
    },
  });

  // 🔹 CORRECCIÓN: Sincronizar formulario cuando cambie el user
  useEffect(() => {
    if (user) {
      resetInfo({
        nombre: user.nombre,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
      });
    }
  }, [user?.nombre, user?.apellido_paterno, user?.apellido_materno, resetInfo]);

  // FORMULARIO 2: Cambio de contraseña
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<UpdatePassword>({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  const onSubmitInfo = async (data: UpdatePersonalInfo) => {
    if (!user) return;

    const res = await updatePersonalInfo(user.id, data);

    setTimeout(() => {
      const { updateInfoResponse: response } = useAppStore.getState();

      if (res && response.ok) {
        toast.success(
          response.message || "Información actualizada correctamente",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
          }
        );
        setIsEditing(false); 
      } else {
        toast.error(response.message || "Error al actualizar", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
          transition: Bounce,
        });
      }
    }, 50);
  };

  const onSubmitPassword = async (data: UpdatePassword) => {
  if (!user) return;

  const success = await updatePassword(user.id, data);

  setTimeout(() => {
    const { updatePasswordResponse: response } = useAppStore.getState();
    
    if (success && response.ok) {
      toast.success(
        response.message || "Contraseña actualizada correctamente",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        }
      );
      resetPass(); // 🔹 Resetear formulario de contraseña
    } else {
      toast.error(
        response.message || "Error al actualizar contraseña",
        {
          position: "top-center",
          autoClose: 4000,
          theme: "colored",
          transition: Bounce,
        }
      );
    }
  }, 50);
};

  // Resetear mensajes cuando cambia el modo
  useEffect(() => {
    clearUpdateInfoResponse();
    clearUpdatePasswordResponse();
  }, [isEditing, clearUpdateInfoResponse, clearUpdatePasswordResponse]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* HEADER */}
      <header className="bg-[#2c415a] border-b border-[#226c8f]/20 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-8 lg:px-16 py-2 flex items-center justify-between">
          <button
            onClick={() => navigate(`/${basePath}/inicio`)}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={logoImage}
              alt="Universidad Logo"
              className="object-contain"
              style={{ width: "85px", height: "85px" }}
            />
          </button>

          <h1 className="text-white text-xl tracking-wide hidden md:block">
            Perfil del Docente
          </h1>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-white text-sm tracking-wide">
                Hola, {user?.nombre_completo}
              </span>
              <span className="text-gray-400 text-xs tracking-wider">
                {user?.rol}
              </span>
            </div>
            <div className="w-11 h-11 bg-[#226c8f] rounded-full flex items-center justify-center ring-2 ring-[#226c8f]/30">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-6 md:px-8 lg:px-16 xl:px-20 py-6 md:py-8 max-w-5xl">
        <div className="space-y-6">
          {/* ----------- INFORMACIÓN PERSONAL ----------- */}
          <div className="bg-white p-8 shadow-sm border-2 border-[#226c8f]/15 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-[#226c8f]" />
              <h2 className="text-gray-900">Información Personal</h2>
            </div>

            <form
              onSubmit={handleSubmitInfo(onSubmitInfo)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    {...registerInfo("nombre")}
                    disabled={!isEditing}
                    className={`h-12 ${
                      isEditing
                        ? "bg-white border-gray-300"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  />
                  {infoErrors.nombre && (
                    <p className="text-red-500 text-sm">
                      {infoErrors.nombre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                  <Input
                    id="apellido_paterno"
                    {...registerInfo("apellido_paterno")}
                    disabled={!isEditing}
                    className={`h-12 ${
                      isEditing
                        ? "bg-white border-gray-300"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  />
                  {infoErrors.apellido_paterno && (
                    <p className="text-red-500 text-sm">
                      {infoErrors.apellido_paterno.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido_materno">Apellido Materno</Label>
                  <Input
                    id="apellido_materno"
                    {...registerInfo("apellido_materno")}
                    disabled={!isEditing}
                    className={`h-12 ${
                      isEditing
                        ? "bg-white border-gray-300"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  />
                  {infoErrors.apellido_materno && (
                    <p className="text-red-500 text-sm">
                      {infoErrors.apellido_materno.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {!isEditing ? (
                  <Button
                    type="button"
                    icon={Edit3}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    Editar Información
                  </Button>
                ) : (
                  <>
                    <Button icon={Save} type="submit" disabled={isUpdatingInfo}>
                      {isUpdatingInfo ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button
                      type="button"
                      icon={X}
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        resetInfo({
                          nombre: user?.nombre || "",
                          apellido_paterno: user?.apellido_paterno || "",
                          apellido_materno: user?.apellido_materno || "",
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* ----------- CAMBIO DE CONTRASEÑA ----------- */}
          <div className="bg-white p-8 shadow-sm border-2 border-[#226c8f]/15 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-[#226c8f]" />
              <h2 className="text-gray-900">Privacidad y Seguridad</h2>
            </div>

            <form
              onSubmit={handleSubmitPass(onSubmitPassword)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password_actual">Contraseña Actual</Label>
                  <Input
                    id="password_actual"
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    {...registerPass("password_actual")}
                    className="h-12 bg-white border-gray-300"
                  />
                  {passErrors.password_actual && (
                    <p className="text-red-500 text-sm">
                      {passErrors.password_actual.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_nueva">Nueva Contraseña</Label>
                  <Input
                    id="password_nueva"
                    type="password"
                    placeholder="Ingresa tu nueva contraseña"
                    {...registerPass("password_nueva")}
                    className="h-12 bg-white border-gray-300"
                  />
                  {passErrors.password_nueva && (
                    <p className="text-red-500 text-sm">
                      {passErrors.password_nueva.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmacion">
                    Confirmar Nueva Contraseña
                  </Label>
                  <Input
                    id="password_confirmacion"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    {...registerPass("password_confirmacion")}
                    className="h-12 bg-white border-gray-300"
                  />
                  {passErrors.password_confirmacion && (
                    <p className="text-red-500 text-sm">
                      {passErrors.password_confirmacion.message}
                    </p>
                  )}
                </div>
              </div>

              <Button icon={Lock} type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Guardando..." : "Cambiar Contraseña"}
              </Button>
            </form>
          </div>

          {/* ----------- LOGOUT ----------- */}
          <div className="flex justify-center pt-4">
            <Button
              icon={LogOut}
              size="large"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default Perfil;
