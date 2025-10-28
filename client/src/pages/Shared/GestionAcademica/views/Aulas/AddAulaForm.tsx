import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "../../../../../components/ui/select";
import Button from "../../../../../components/ui/Button";
import { Save } from "lucide-react";

function AddAulaForm() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Label className="text-sm text-gray-600 mb-2">Número de Aula</Label>
          <Input
            placeholder="Ej: 101"
            // value={aulaForm.numero}
            // onChange={(e) =>
            //   setAulaForm({ ...aulaForm, numero: e.target.value })
            // }
            className="w-full"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Tipo</Label>
          <Input
            placeholder="Ej: Aula Teórica, Laboratorio"
            // value={aulaForm.tipo}
            // onChange={(e) => setAulaForm({ ...aulaForm, tipo: e.target.value })}
            className="w-full"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Capacidad</Label>
          <Input
            type="number"
            placeholder="Ej: 40"
            // value={aulaForm.capacidad}
            // onChange={(e) =>
            //   setAulaForm({ ...aulaForm, capacidad: e.target.value })
            // }
            className="w-full"
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600 mb-2">Estado</Label>
          <Select
            // value={aulaForm.estado}
            // onValueChange={(value) =>
            //   setAulaForm({ ...aulaForm, estado: value })
            // }
          >
            <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="En mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          icon={Save}
        //   onClick={() => {
        //     console.log("Crear aula:", aulaForm);
        //     setAulaForm({
        //       numero: "",
        //       tipo: "",
        //       capacidad: "",
        //       estado: "Disponible",
        //     });
        //   }}
        >
          Guardar Aula
        </Button>
      </div>
    </div>
  );
}

export default AddAulaForm;
