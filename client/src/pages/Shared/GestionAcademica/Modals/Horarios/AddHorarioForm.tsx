import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Bounce } from "react-toastify";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Plus } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import { CreateBloqueHorarioSchema } from "../../../../../utils/horario-schemas";
import type { CreateBloqueHorarioData } from "../../../../../types";

function AddHorarioForm() {
  const {
    createBloqueHorario,
    isCreatingBloqueHorario,
    createBloqueHorarioResponse,
    clearCreateBloqueHorarioResponse,
  } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBloqueHorarioData>({
    resolver: zodResolver(CreateBloqueHorarioSchema),
    defaultValues: {
      hora_inicio: "",
      hora_fin: "",
    },
  });

  // Mostrar toast cuando termine la creación
  useEffect(() => {
    if (createBloqueHorarioResponse.ok && createBloqueHorarioResponse.message) {
      toast.success(createBloqueHorarioResponse.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      reset();
      clearCreateBloqueHorarioResponse();
    } else if (
      !createBloqueHorarioResponse.ok &&
      createBloqueHorarioResponse.message
    ) {
      toast.error(createBloqueHorarioResponse.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
      clearCreateBloqueHorarioResponse();
    }
  }, [createBloqueHorarioResponse, reset, clearCreateBloqueHorarioResponse]);

  const onSubmit = async (data: CreateBloqueHorarioData) => {
    await createBloqueHorario(data);
  };

  return (
    <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
      <h4 className="text-sm text-gray-700 mb-3">Agregar Nuevo Bloque</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2">Hora de Inicio</Label>
            <Input
              type="time"
              {...register("hora_inicio")}
              disabled={isCreatingBloqueHorario}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.hora_inicio && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hora_inicio.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600 mb-2">Hora de Fin</Label>
            <Input
              type="time"
              {...register("hora_fin")}
              disabled={isCreatingBloqueHorario}
              className="w-full"
              style={{ borderRadius: "8px" }}
            />
            {errors.hora_fin && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hora_fin.message}
              </p>
            )}
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isCreatingBloqueHorario}
              className="w-full px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ borderRadius: "8px" }}
            >
              <Plus className="w-4 h-4" />
              {isCreatingBloqueHorario ? "Agregando..." : "Agregar bloque"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddHorarioForm;