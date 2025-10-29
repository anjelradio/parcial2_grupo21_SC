import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Plus } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import { CreateDiaSchema } from "../../../../../utils/horario-schemas";
import type { CreateDiaData } from "../../../../../types";

function AddDiaForm() {
  const {
    createDia,
    isCreatingDia,
    createDiaResponse,
    clearCreateDiaResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDiaData>({
    resolver: zodResolver(CreateDiaSchema),
    defaultValues: {
      nombre: "",
    },
  });

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createDiaResponse.ok && createDiaResponse.message) {
      toast.success(createDiaResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset();
      clearCreateDiaResponse();
    } else if (!createDiaResponse.ok && createDiaResponse.message) {
      toast.error(createDiaResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearCreateDiaResponse();
    }
  }, [createDiaResponse, reset, clearCreateDiaResponse]);

  const onSubmit = async (data: CreateDiaData) => {
    await createDia(data);
  };

  return (
    <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
      <h4 className="text-sm text-gray-700 mb-3">Agregar Nuevo Día</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2">Nombre del Día</Label>
            <Input
              placeholder="Ej: Lunes, Martes, etc."
              {...register("nombre")}
              disabled={isCreatingDia}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isCreatingDia}
              className="w-full px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              <Plus className="w-4 h-4" />
              {isCreatingDia ? "Agregando..." : "Agregar día académico"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDiaForm;