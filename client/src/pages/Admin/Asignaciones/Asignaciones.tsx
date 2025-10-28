import { useState } from "react";
import { BookOpen, Edit, Trash2} from "lucide-react";
import Button from "../../../components/ui/Button";
import { Label } from "../../../components/ui/label";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../../../components/ui/select";

  const asignaciones = [
    { id: 1, docente: 'Juan Pérez', materia: 'Algoritmos', grupo: 'A', aula: 'Aula 201', horario: 'Lun-Mié 8:00', semestre: '2025-1' },
    { id: 2, docente: 'María García', materia: 'Redes', grupo: 'B', aula: 'Lab 102', horario: 'Mar-Jue 10:00', semestre: '2025-1' },
    { id: 3, docente: 'Luis Rodríguez', materia: 'IA', grupo: 'C', aula: 'Aula 305', horario: 'Vie 14:00', semestre: '2025-1' },
    { id: 4, docente: 'Ana López', materia: 'Desarrollo Web', grupo: 'A', aula: 'Lab 203', horario: 'Lun-Vie 16:00', semestre: '2025-1' },
  ];

function Asignaciones() {
  const [selectedSemestre, setSelectedSemestre] = useState("2025-1");
  const [selectedDocente, setSelectedDocente] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedGrupo, setSelectedGrupo] = useState("");
  const [selectedAula, setSelectedAula] = useState("");
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión de Asignaciones</h1>
        <p className="text-gray-600">
          Asigna docentes, materias, grupos y aulas
        </p>
      </div>

      {/* Formulario de nueva asignación */}
      <div
        className="bg-white p-6 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-1 h-6 bg-[#226c8f]"
            style={{ borderRadius: "2px" }}
          ></div>
          <h3 className="text-gray-900">Nueva Asignación</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-sm text-gray-600 mb-2">Docente</Label>
            <Select value={selectedDocente} onValueChange={setSelectedDocente}>
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar docente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Juan Pérez</SelectItem>
                <SelectItem value="2">María García</SelectItem>
                <SelectItem value="3">Luis Rodríguez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">Materia</Label>
            <Select value={selectedMateria} onValueChange={setSelectedMateria}>
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar materia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Algoritmos y Estructuras</SelectItem>
                <SelectItem value="2">Base de Datos</SelectItem>
                <SelectItem value="3">Redes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">Grupo</Label>
            <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Grupo A</SelectItem>
                <SelectItem value="B">Grupo B</SelectItem>
                <SelectItem value="C">Grupo C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">
              Aula / Laboratorio
            </Label>
            <Select value={selectedAula} onValueChange={setSelectedAula}>
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar aula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Aula 201</SelectItem>
                <SelectItem value="2">Lab 102</SelectItem>
                <SelectItem value="3">Aula 305</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2">Semestre</Label>
            <Select
              value={selectedSemestre}
              onValueChange={setSelectedSemestre}
            >
              <SelectTrigger className="w-full" style={{ borderRadius: "8px" }}>
                <SelectValue placeholder="Seleccionar semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-1">2025-1</SelectItem>
                <SelectItem value="2024-2">2024-2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button icon={BookOpen}>Registrar Asignación</Button>
      </div>

      {/* Lista de asignaciones */}
      <div
        className="bg-white p-6 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Asignaciones Registradas</h3>
          </div>
          <Select value={selectedSemestre} onValueChange={setSelectedSemestre}>
            <SelectTrigger
              className="w-[180px]"
              style={{ borderRadius: "8px" }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-1">Semestre 2025-1</SelectItem>
              <SelectItem value="2024-2">Semestre 2024-2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {asignaciones.map((asignacion) => (
              <div
                key={asignacion.id}
                className="border-l-4 border-[#226c8f] bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-xs text-gray-500">Docente</p>
                    <p className="text-gray-900">{asignacion.docente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Materia</p>
                    <p className="text-gray-900">{asignacion.materia}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Grupo</p>
                    <p className="text-[#226c8f]">{asignacion.grupo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Aula</p>
                    <p className="text-gray-900">{asignacion.aula}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Horario</p>
                    <p className="text-gray-900">{asignacion.horario}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                      style={{ borderRadius: "8px" }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                      style={{ borderRadius: "8px" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default Asignaciones;
