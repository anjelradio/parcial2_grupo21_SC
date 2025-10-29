import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../../../components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "../../../../../components/ui/select";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Clock} from "lucide-react";
import AddHorarioForm from "./AddHorarioForm";
import { useAppStore } from "../../../../../stores/useAppStore";
import HorarioCard from "./HorarioCard";
function HorarioList() {
  const { modals, setModal, bloquesHorarios } = useAppStore();
  const [bloqueFilter, setBloqueFilter] = useState("todos");
  function obtenerTurno(horaInicio: string): "Mañana" | "Tarde" | "Noche" {
    const [h, m] = horaInicio.split(":").map(Number);
    const horaDecimal = h + m / 60;

    if (horaDecimal >= 6 && horaDecimal < 12) return "Mañana";
    if (horaDecimal >= 12 && horaDecimal < 18) return "Tarde";
    return "Noche";
  }
  return (
    <Dialog
      open={modals.horarioList}
      onOpenChange={(open) => setModal("horarioList", open)}
    >
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#226c8f]" />
            Administración de Bloques Horarios
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Gestiona los bloques horarios del sistema académico
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de Creación */}
        <AddHorarioForm />

        {/* Lista de Bloques */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-700">Bloques Registrados</h4>
            <Select value={bloqueFilter} onValueChange={setBloqueFilter}>
              <SelectTrigger
                className="w-[150px]"
                style={{ borderRadius: "8px" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Mañana">Mañana</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noche">Noche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-full max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              {bloquesHorarios
                .filter(
                  (b) => bloqueFilter === "todos" || obtenerTurno(b.hora_inicio) === bloqueFilter
                )
                .map((horario) => (
                  <HorarioCard key={horario.id_bloque} horario={horario} />
                ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HorarioList;
