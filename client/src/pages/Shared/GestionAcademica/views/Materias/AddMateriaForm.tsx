import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import { Save } from "lucide-react";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import Button from "../../../../../components/ui/Button";
import { useAppStore } from "../../../../../stores/useAppStore";
import { CreateMateriaSchema } from "../../../../../utils/materia-schemas";
import type { CreateMateriaData } from "../../../../../types";

function AddMateriaForm() {
  const {
    createMateria,
    isCreatingMateria,
    createMateriaResponse,
    clearCreateMateriaResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMateriaData>({
    resolver: zodResolver(CreateMateriaSchema),
    defaultValues: {
      sigla: "",
      nombre: "",
    },
  });

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createMateriaResponse.ok && createMateriaResponse.message) {
      toast.success(createMateriaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset();
      clearCreateMateriaResponse();
    } else if (!createMateriaResponse.ok && createMateriaResponse.message) {
      toast.error(createMateriaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearCreateMateriaResponse();
    }
  }, [createMateriaResponse, reset, clearCreateMateriaResponse]);

  const onSubmit = async (data: CreateMateriaData) => {
    await createMateria(data);
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
        <h3 className="text-gray-900">Registrar Nueva Materia</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="text-sm text-gray-600 mb-2">Sigla</Label>
            <Input
              placeholder="Ej: ALG-101"
              {...register("sigla")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.sigla && (
              <p className="text-red-500 text-sm mt-1">{errors.sigla.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">
              Nombre de la Materia
            </Label>
            <Input
              placeholder="Ej: Algoritmos y Estructuras de Datos"
              {...register("nombre")}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button icon={Save} type="submit" disabled={isCreatingMateria}>
            {isCreatingMateria ? "Guardando..." : "Guardar Materia"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddMateriaForm;