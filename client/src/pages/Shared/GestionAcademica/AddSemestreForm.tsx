import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

function AddSemestreForm() {
  return (
    <div
      className="bg-white p-6 shadow-lg border border-gray-100 h-full"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1 h-6 bg-[#226c8f]"
          style={{ borderRadius: "2px" }}
        ></div>
        <h3 className="text-gray-900">Crear Nuevo Semestre</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 mb-2">Año</Label>
          <Input
            type="number"
            placeholder="2025"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Semestre</Label>
          <Input
            type="number"
            placeholder="1 o 2"
            min="1"
            max="2"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Fecha de Inicio</Label>
          <Input type="date" style={{ borderRadius: "8px" }} />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Fecha de Fin</Label>
          <Input type="date" style={{ borderRadius: "8px" }} />
        </div>

        <button
          className="w-full bg-[#226c8f] text-white py-3 hover:bg-[#1a5469] transition-all duration-300 shadow-md hover:shadow-lg mt-4 cursor-pointer"
          style={{ borderRadius: "8px" }}
        >
          Crear Semestre
        </button>
      </div>
    </div>
  );
}

export default AddSemestreForm;
