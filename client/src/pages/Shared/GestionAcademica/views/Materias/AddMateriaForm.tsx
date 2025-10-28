import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import Button from "../../../../../components/ui/Button";
import { Save } from "lucide-react";

function AddMateriaForm() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label className="text-sm text-gray-600 mb-2">Sigla</Label>
          <Input
            placeholder="Ej: ALG-101"
            // value={materiaForm.sigla}
            // onChange={(e) =>
            //   setMateriaForm({ ...materiaForm, sigla: e.target.value })
            // }
            className="w-full"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">
            Nombre de la Materia
          </Label>
          <Input
            placeholder="Ej: Algoritmos y Estructuras de Datos"
            // value={materiaForm.nombre}
            // onChange={(e) =>
            //   setMateriaForm({ ...materiaForm, nombre: e.target.value })
            // }
            className="w-full"
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          icon={Save}
        //   onClick={() => {
        //     console.log("Crear materia:", materiaForm);
        //     setMateriaForm({ sigla: "", nombre: "" });
        //   }}
        >
          Guardar Materia
        </Button>
      </div>
    </div>
  );
}

export default AddMateriaForm;
