import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "../../../components/ui/select";
import Button from "../../../components/ui/Button";
import { useAppStore } from "../../../stores/useAppStore";
import { CreateUserSchema } from "../../../utils/user-schemas";
import type { CreateUserData } from "../../../types";

function CreateUserForm() {
  const {
    createUser,
    isCreatingUser,
    createUserResponse,
    clearCreateUserResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateUserData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      email: "",
      password: "",
      rol: "DOCENTE",
      profesion: "",
    },
  });

  const rolSeleccionado = watch("rol");

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createUserResponse.ok && createUserResponse.message) {
      toast.success(createUserResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset(); // Limpiar formulario después de crear exitosamente
      clearCreateUserResponse();
    } else if (!createUserResponse.ok && createUserResponse.message) {
      toast.error(createUserResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearCreateUserResponse();
    }
  }, [createUserResponse, reset, clearCreateUserResponse]);

  const onSubmit = async (data: CreateUserData) => {
    // Si el rol no es DOCENTE, quitar profesion del payload
    const payload = {
      ...data,
      profesion: data.rol === "DOCENTE" ? data.profesion : undefined,
    };

    await createUser(payload);
  };

  return (
    <div
      className="bg-white p-6 shadow-lg border border-gray-100"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1 h-6 bg-[#226c8f]"
          style={{ borderRadius: "2px" }}
        />
        <h3 className="text-gray-900">Crear Nueva Cuenta</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Nombre */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Nombre</Label>
            <Input
              placeholder="Ingrese el nombre"
              {...register("nombre")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Apellido Paterno */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">
              Apellido Paterno
            </Label>
            <Input
              placeholder="Ingrese el apellido paterno"
              {...register("apellido_paterno")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.apellido_paterno && (
              <p className="text-red-500 text-sm mt-1">
                {errors.apellido_paterno.message}
              </p>
            )}
          </div>

          {/* Apellido Materno */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">
              Apellido Materno
            </Label>
            <Input
              placeholder="Ingrese el apellido materno"
              {...register("apellido_materno")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.apellido_materno && (
              <p className="text-red-500 text-sm mt-1">
                {errors.apellido_materno.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <Label className="text-sm text-gray-600 mb-2">
              Correo Electrónico
            </Label>
            <Input
              type="email"
              placeholder="usuario@universidad.edu"
              {...register("email")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <Label className="text-sm text-gray-600 mb-2">Contraseña</Label>
            <Input
              type="password"
              placeholder="Mínimo 4 caracteres"
              {...register("password")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="md:col-span-2 lg:col-span-3">
            <Label className="text-sm text-gray-600 mb-2">Rol</Label>
            <Select
              value={rolSeleccionado}
              onValueChange={(value) =>
                setValue("rol", value as "ADMIN" | "DOCENTE" | "AUTORIDAD")
              }
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DOCENTE">Docente</SelectItem>
                <SelectItem value="AUTORIDAD">Autoridad</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {errors.rol && (
              <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>
            )}
          </div>

          {/* Profesión (solo si es DOCENTE) */}
          {rolSeleccionado === "DOCENTE" && (
            <div className="md:col-span-2 lg:col-span-3">
              <Label className="text-sm text-gray-600 mb-2">Profesión</Label>
              <Input
                placeholder="Ej: Ingeniero en Sistemas, Licenciado en Computación"
                {...register("profesion")}
                className="w-full"
                style={{ borderRadius: "8px" }}
              />
              {errors.profesion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profesion.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            icon={UserPlus}
            type="submit"
            disabled={isCreatingUser}
          >
            {isCreatingUser ? "Creando..." : "Crear Cuenta"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;