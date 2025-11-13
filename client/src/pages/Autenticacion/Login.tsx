import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { HelpCircle } from "lucide-react";
import backgroundImage from "/FICCT.jpg";
import logoImage from "/LogoFicct.png";
import Button from "../../components/ui/Button";
import Error from "../../components/ui/error";
import { useAppStore } from "../../stores/useAppStore";
import type { LoginForm } from "../../types";
import ForgotPassword from "./ForgotPassword";

type LoginFormInputs = {
  identifier: string; // código_docente o email
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const { 
    login, 
    isLoggingIn, 
    loginResponse, 
    clearLoginResponse, 
    user,
    setModal // Agregar setModal para abrir el modal
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>();

  const [errorMessage, setErrorMessage] = useState("");

  // Detectar si el input es email o código
  const identifierValue = watch("identifier");
  const isEmail = identifierValue?.includes("@");

  // Función para navegar según el rol
  const navigateByRole = (rol: string) => {
    const routes: Record<string, string> = {
      ADMIN: "/admin/inicio",
      DOCENTE: "/docente/inicio",
      AUTORIDAD: "/autoridad/inicio",
    };

    const route = routes[rol];
    console.log(rol);
    if (route) {
      navigate(route);
    } else {
      console.error("Rol desconocido:", rol);
      setErrorMessage("Rol de usuario no reconocido");
    }
  };

  // Submit del formulario
  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMessage("");
    clearLoginResponse();
    console.log(data);

    // Construir objeto según tipo de login
    const credentials: LoginForm = isEmail
      ? { email: data.identifier, password: data.password }
      : { codigo_docente: data.identifier, password: data.password };

    const success = await login(credentials);

    if (success && user) {
      // Navegar según el rol
      navigateByRole(user.rol);
    }
  };

  // Función para abrir el modal de forgot password
  const handleForgotPassword = () => {
    setModal("forgotPassword", true);
  };

  // Manejar respuestas del backend
  useEffect(() => {
    if (loginResponse.message && !loginResponse.ok) {
      setErrorMessage(loginResponse.message);
    }
  }, [loginResponse]);

  // Limpiar mensajes al desmontar
  useEffect(() => {
    return () => {
      clearLoginResponse();
    };
  }, [clearLoginResponse]);

  return (
    <div className="min-h-screen relative">
      {/* Background con Imagen */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
          <div className="container mx-auto px-6 py-8 flex items-center justify-between relative">
            {/* Medio: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-[74px] h-[74px]">
                <img
                  src={logoImage}
                  alt="Universidad Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Derecha: Help Icon */}
            <div className="ml-auto flex items-center gap-2 text-white/70 hover:text-white/90 transition-colors cursor-pointer">
              <HelpCircle className="w-6 h-6" strokeWidth={1.5} />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12 pt-32">
          <div className="max-w-4xl w-full text-center">
            {/* Hero Text */}
            <div className="mb-12">
              <p
                className="text-white text-xs md:text-base tracking-[0.25em] mb-3 opacity-90"
                 style={{ fontFamily: "Georgia, serif", fontWeight: 300  }}
                // style={{ fontFamily: "Merriweather, serif", fontStyle:"normal" }}
              >
                Facultad de Ingeniería
              </p>
              <h1
                className="text-white text-2xl md:text-5xl tracking-[0.05em] md:tracking-[0.08em] leading-7 md:leading-11 "
                style={{ fontFamily: "Rufina, serif",  fontWeight: "700", fontStyle:"normal" }}
              >
                <span className="whitespace-nowrap">
                  Ciencias de la Computación
                </span>
                <br className="hidden md:block" />
                <span className="md:hidden"> </span>
                <span className="block">& </span>
                <span className="block md:inline">Telecomunicaciones</span>
              </h1>
            </div>

            {/* Login Form */}
            <div
              className="max-w-md mx-auto p-8 shadow-2xl"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.55)",
              }}
            >
              <h2 className="text-white text-xl mb-6" style={{ fontFamily: "Georgia, serif", fontWeight: 300  }}>Iniciar Sesión</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Input unificado: Código o Email */}
                <div className="space-y-2 text-left">
                  <Label htmlFor="identifier" className="text-white/90">
                    Número de Registro o Correo
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Ingresa tu número de registro o correo"
                    {...register("identifier", {
                      required: "Este campo es obligatorio",
                      validate: (value) => {
                        if (!value.trim()) {
                          return "Este campo no puede estar vacío";
                        }
                        // Si contiene @, validar formato email
                        if (value.includes("@")) {
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          return (
                            emailRegex.test(value) ||
                            "Formato de correo inválido"
                          );
                        }
                        return true;
                      },
                    })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-white/30 h-12 rounded-none"
                    disabled={isLoggingIn}
                  />
                  {errors.identifier && (
                    <Error>{errors.identifier.message}</Error>
                  )}
                </div>

                {/* Contraseña */}
                <div className="space-y-2 text-left">
                  <Label htmlFor="password" className="text-white/90">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 4,
                        message: "La contraseña debe tener al menos 4 caracteres",
                      },
                    })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-white/30 h-12 rounded-none"
                    disabled={isLoggingIn}
                  />
                  {errors.password && <Error>{errors.password.message}</Error>}
                </div>

                {/* ¿Olvidaste tu contraseña? */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Error del servidor */}
                {errorMessage && (
                  <div className="text-center">
                    <Error>{errorMessage}</Error>
                  </div>
                )}

                {/* Botón de Iniciar Sesión */}
                <div className="mt-4">
                  <Button
                    type="submit"
                    size="large"
                    className="w-full"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-auto relative" style={{ fontFamily: "Rufina, serif", fontStyle:"normal" }}>
          {/* Degradado sutil desde transparente hasta negro */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7) 50%, #000000)",
            }}
          ></div>

          {/* Línea divisora */}
          <div className="relative z-10 flex justify-center pt-8">
            <div className="w-[80%] border-t-2 border-white/40" ></div>
          </div>

          <div className="relative z-10 container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Atención y Soporte */}
            <div className="text-center text-white space-y-3">
              <h3 className="tracking-widest mb-4 opacity-90" >
                ATENCIÓN Y SOPORTE
              </h3>
              <p className="text-sm opacity-80" style={{ fontFamily: "Merriweather, serif", fontStyle:"normal" }}>Tel: +591 6444731</p>
              <p className="text-sm opacity-80" >
                Email: soporte@facultad.edu.bo
              </p>
            </div>

            {/* Desarrollado Por */}
            <div className="text-center text-white space-y-3">
              <h3 className="tracking-widest mb-4 opacity-90" >
                DESARROLLADO POR
              </h3>
              <div className="space-y-2">
                <p className="text-sm opacity-90" >
                  Ing. R. Anjel Santos Castro - anjel.santos@dev.com
                </p>
                <p className="text-sm opacity-90" >
                  Ing. Luciana P. Aradivi Mamani - luciana.aradivi@dev.com
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <ForgotPassword/>
    </div>
  );
}

export default Login;