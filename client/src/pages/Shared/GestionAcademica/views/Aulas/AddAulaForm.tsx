import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import { Save } from "lucide-react";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "../../../../../components/ui/select";
import Button from "../../../../../components/ui/Button";
import { useAppStore } from "../../../../../stores/useAppStore";
import { CreateAulaSchema } from "../../../../../utils/aula-schemas";
import type { CreateAulaData } from "../../../../../types";

function AddAulaForm() {
  const {
    createAula,
    isCreatingAula,
    createAulaResponse,
    clearCreateAulaResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateAulaData>({
    resolver: zodResolver(CreateAulaSchema),
    defaultValues: {
      nro_aula: "",
      tipo: "Aula",
      capacidad: 0,
      estado: "Disponible",
    },
  });

  const tipoSeleccionado = watch("tipo");
  const estadoSeleccionado = watch("estado");

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createAulaResponse.ok && createAulaResponse.message) {
      toast.success(createAulaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset();
      clearCreateAulaResponse();
    } else if (!createAulaResponse.ok && createAulaResponse.message) {
      toast.error(createAulaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearCreateAulaResponse();
    }
  }, [createAulaResponse, reset, clearCreateAulaResponse]);

  const onSubmit = async (data: CreateAulaData) => {
    await createAula(data);
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
        <h3 className="text-gray-900">Registrar Nueva Aula</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Label className="text-sm text-gray-600 mb-2">Número de Aula</Label>
            <Input
              placeholder="Ej: 101"
              {...register("nro_aula")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.nro_aula && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nro_aula.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">Tipo</Label>
            <Select
              value={tipoSeleccionado}
              onValueChange={(value) =>
                setValue("tipo", value as "Aula" | "Laboratorio" | "Auditorio")
              }
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aula">Aula</SelectItem>
                <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                <SelectItem value="Auditorio">Auditorio</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">Capacidad</Label>
            <Input
              type="number"
              placeholder="Ej: 40"
              {...register("capacidad", { valueAsNumber: true })}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.capacidad && (
              <p className="text-red-500 text-sm mt-1">
                {errors.capacidad.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">Estado</Label>
            <Select
              value={estadoSeleccionado}
              onValueChange={(value) =>
                setValue(
                  "estado",
                  value as "Disponible" | "En uso" | "Mantenimiento" | "Inactiva"
                )
              }
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="En uso">En uso</SelectItem>
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="Inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estado.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button icon={Save} type="submit" disabled={isCreatingAula}>
            {isCreatingAula ? "Guardando..." : "Guardar Aula"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddAulaForm;