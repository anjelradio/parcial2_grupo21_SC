import { useRef, useState } from "react";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/text-area";
import { useAppStore } from "../../../../stores/useAppStore";
import { toast } from "react-toastify";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY as string
);

function AsistenciaVirtualModal() {
  const { modals, setModal, registrarVirtual, user } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setAiResult(null);
    setError(null);
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
    setMotivo("");
    setAiResult(null);
    setError(null);
    setModal("asistenciaVirtualModal", false);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const analizarConGemini = async (file: File) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const base64 = await toBase64(file);

    const prompt = `
Eres un asistente que evalúa si una imagen corresponde a una clase virtual 
(Zoom, Meet, Teams u otra plataforma de videollamada educativa).

Analiza cuidadosamente el contenido visual y responde SOLO con un número entero 
entre 0 y 100 que represente tu nivel de confianza de que efectivamente es una clase virtual.

No incluyas texto, explicación ni formato JSON.
Solo responde con el número.
`.trim();

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: file.type, data: base64.split(",")[1] } },
    ]);

    // Extraer y limpiar texto devuelto
    const text = result.response.text().trim();

    // Convertir a número (asegurando formato)
    const confianza = Math.max(0, Math.min(100, Number(text)));

    if (isNaN(confianza))
      throw new Error("La IA no devolvió un número válido.");

    return { confianza };
  };

  const handleConfirmVirtual = async () => {
    if (!file) {
      setError("Debe subir una imagen de evidencia.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Analizar con IA
      const { confianza } = await analizarConGemini(file);
      console.log("Confianza IA:", confianza);
      setAiResult({ confianza });

      if (confianza < 60) {
        setError(`Confianza baja (${confianza}%). Sube una captura más clara.`);
        setLoading(false);
        return;
      }

      // 2️⃣ Preparar FormData para backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("motivo", motivo);
      formData.append("confianza", String(confianza));

      // 3️⃣ Enviar al backend
      const success = await registrarVirtual(user?.id!, formData);

      if (success) {
        toast.success("✅ Asistencia virtual registrada correctamente");
        handleCancel();
      } else {
        toast.error("❌ Error al registrar asistencia virtual");
      }
    } catch (err) {
      console.error(err);
      setError("Error al procesar la evidencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={modals.asistenciaVirtualModal}
      onOpenChange={(open) => setModal("asistenciaVirtualModal", open)}
    >
      <DialogContent className="max-w-2xl rounded-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#226c8f]">
              Registrar Asistencia Virtual
            </DialogTitle>
            <button
              onClick={handleCancel}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subida de imagen */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            <Label>Evidencia de Clase Virtual</Label>
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 hover:border-[#226c8f] bg-gray-50 hover:bg-gray-100 transition-all duration-300 rounded-md flex flex-col items-center justify-center gap-3"
              >
                <Plus className="w-10 h-10 text-[#226c8f]" />
                <p className="text-gray-600">Subir captura de clase virtual</p>
              </button>
            )}
          </div>

          {/* Motivo */}
          <div>
            <Label>Motivo de la Clase Virtual</Label>
            <Textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md"
              placeholder="Describe brevemente el motivo..."
            />
          </div>

          {/* Resultado IA */}
          {aiResult && (
            <div className="text-xs bg-gray-50 border p-2 rounded">
              <strong>IA:</strong> {JSON.stringify(aiResult, null, 2)}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleConfirmVirtual}
              disabled={loading}
              className="flex-1 bg-[#226c8f] text-white py-3 px-6 hover:bg-[#1a5469] rounded-md disabled:opacity-60"
            >
              {loading ? "Procesando..." : "Confirmar y Enviar"}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 hover:bg-gray-300 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AsistenciaVirtualModal;
