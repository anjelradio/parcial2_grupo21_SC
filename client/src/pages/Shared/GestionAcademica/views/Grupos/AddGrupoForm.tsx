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
import { Save } from "lucide-react";

function AddGrupoForm() {
  const { materias } = useAppStore();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label className="text-sm text-gray-600 mb-2">Nombre del Grupo</Label>
          <Input
            placeholder="Ej: Grupo A"
            // value={grupoForm.nombre}
            // onChange={(e) =>
            //   setGrupoForm({ ...grupoForm, nombre: e.target.value })
            // }
            className="w-full"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Materia</Label>
          <Select
          // value={grupoForm.materiaId}
          // onValueChange={(value) =>
          //   setGrupoForm({ ...grupoForm, materiaId: value })
          // }
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
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          icon={Save}
          //   onClick={() => {
          //     console.log("Crear grupo:", grupoForm);
          //     setGrupoForm({ nombre: "", materiaId: "" });
          //   }}
        >
          Guardar Grupo
        </Button>
      </div>
    </div>
  );
}

export default AddGrupoForm;
