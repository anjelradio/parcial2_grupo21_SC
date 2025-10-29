import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../../../components/ui/dialog";
import { Calendar } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import DiaCard from "./DiaCard";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import AddDiaForm from "./AddDiaForm";


function DiaList() {
    const {dias, setModal, modals} = useAppStore()
  return (
    <Dialog open={modals.diasList} onOpenChange={open=>setModal("diasList", open)}>
      <DialogContent
        className="p-6 max-h-[90vh] overflow-hidden"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#226c8f]" />
            Administración de Días Académicos
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Gestiona los días académicos del sistema
          </DialogDescription>
        </DialogHeader>

        {/* Formulario de Creación */}
        <AddDiaForm/>

        {/* Lista de Días */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <h4 className="text-sm text-gray-700 mb-3">Días Registrados</h4>

          <ScrollArea className="h-full max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              {dias.map((dia) => (
                <DiaCard key={dia.id_dia} dia={dia}/>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DiaList;
