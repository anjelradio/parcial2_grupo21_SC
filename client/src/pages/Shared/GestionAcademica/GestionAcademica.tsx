import { BookOpen, Users, Building2, CheckCircle, Clock } from "lucide-react";
function GestionAcademica() {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión Académica</h1>
        <p className="text-gray-600">
          Administra materias, grupos, aulas y períodos académicos
        </p>
      </div>

      {/* Grid de secciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Materias */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <BookOpen className="w-8 h-8 text-[#226c8f]" />
            </div>
            <h3 className="text-gray-900">Materias</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">28 materias registradas</p>
          <div className="space-y-2">
            <button
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left"
              style={{ borderRadius: "8px" }}
            >
              Ver Listado General
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left"
              style={{ borderRadius: "8px" }}
            >
              Materias Detalladas
            </button>
          </div>
        </div>

        {/* Grupos */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-8 h-8 text-[#226c8f]" />
            </div>
            <h3 className="text-gray-900">Grupos</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">18 grupos activos</p>
          <div className="space-y-2">
            <button
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left"
              style={{ borderRadius: "8px" }}
            >
              Ver Todos los Grupos
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left"
              style={{ borderRadius: "8px" }}
            >
              Gestionar Grupos
            </button>
          </div>
        </div>

        {/* Aulas */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <Building2 className="w-8 h-8 text-[#226c8f]" />
            </div>
            <h3 className="text-gray-900">Aulas</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">12 aulas disponibles</p>
          <div className="space-y-2">
            <button
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left"
              style={{ borderRadius: "8px" }}
            >
              Ver Detalles
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm text-left"
              style={{ borderRadius: "8px" }}
            >
              Listado General
            </button>
          </div>
        </div>
      </div>

      
      {/* Bloques y Días Académicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Bloques Horarios</h3>
          </div>
          <div className="space-y-3">
            {[
              "08:00 - 10:00",
              "10:00 - 12:00",
              "14:00 - 16:00",
              "16:00 - 18:00",
            ].map((bloque, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50"
                style={{ borderRadius: "8px" }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#226c8f]" />
                  <span className="text-gray-900">{bloque}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Bloque {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Días Académicos</h3>
          </div>
          <div className="space-y-3">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(
              (dia, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50"
                  style={{ borderRadius: "8px" }}
                >
                  <span className="text-gray-900">{dia}</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              )
            )}
          </div>
        </div>
      </div>


    </div>
  );
}

export default GestionAcademica;
