import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import { Save } from "lucide-react";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../../../../../components/ui/select";
import Button from "../../../../../components/ui/Button";
import { useAppStore } from "../../../../../stores/useAppStore";
import { CreateGrupoSchema } from "../../../../../utils/grupo-schemas";
import type { CreateGrupoData } from "../../../../../types";

function AddGrupoForm() {
  const {
    materias,
    createGrupo,
    isCreatingGrupo,
    createGrupoResponse,
    clearCreateGrupoResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateGrupoData>({
    resolver: zodResolver(CreateGrupoSchema),
    defaultValues: {
      nombre: "",
      id_materia: 0,
    },
  });

  const materiaSeleccionada = watch("id_materia");

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createGrupoResponse.ok && createGrupoResponse.message) {
      toast.success(createGrupoResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset();
      clearCreateGrupoResponse();
    } else if (!createGrupoResponse.ok && createGrupoResponse.message) {
      toast.error(createGrupoResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearCreateGrupoResponse();
    }
  }, [createGrupoResponse, reset, clearCreateGrupoResponse]);

  const onSubmit = async (data: CreateGrupoData) => {
    await createGrupo(data);
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
        ></div>
        <h3 className="text-gray-900">Crear Nuevo Grupo</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="text-sm text-gray-600 mb-2">
              Nombre del Grupo
            </Label>
            <Input
              placeholder="Ej: Grupo A"
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

          <div>
            <Label className="text-sm text-gray-600 mb-2">Materia</Label>
            <Select
              value={materiaSeleccionada?.toString()}
              onValueChange={(value) => setValue("id_materia", parseInt(value))}
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar materia" />
              </SelectTrigger>
              <SelectContent>
                {materias.map((materia) => (
                  <SelectItem
                    key={materia.id_materia}
                    value={materia.id_materia.toString()}
                  >
                    {materia.sigla} - {materia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_materia && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_materia.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button icon={Save} type="submit" disabled={isCreatingGrupo}>
            {isCreatingGrupo ? "Guardando..." : "Guardar Grupo"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddGrupoForm;