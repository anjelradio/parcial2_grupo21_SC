import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // 

export default function CameraScanner() {
  const navigate = useNavigate(); // 👈 inicializa navegación
  const { registrarPresencial, user } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes.length || loading) return;
    setLoading(true);

    const qrUrl = detectedCodes[0].rawValue;
    const urlObj = new URL(qrUrl);
    const token_qr = urlObj.searchParams.get("token");

    if (!token_qr) {
      toast.error("QR inválido o incompleto");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          token_qr,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        console.log("📤 Payload a enviar:", payload);

        const success = await registrarPresencial(user?.codigo_docente!, payload);

        if (success) toast.success("Asistencia registrada correctamente");
        else toast.error("No se pudo registrar la asistencia");

        setLoading(false);
        navigate(-1); // 👈 vuelve atrás después de escanear
      },
      (error) => {
        console.error("❌ Error GPS:", error);
        toast.error("No se pudo obtener ubicación. Verifica permisos GPS.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <div className="relative w-80 h-80">
        <Scanner
          onScan={handleScan}
          onError={(err) => console.error("Error QR:", err)}
          constraints={{ facingMode: "environment" }}
          allowMultiple={false}
          formats={["qr_code"]}
        />

        {/* Marco visual del escáner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-4 border-white rounded-lg opacity-70"></div>
        </div>

        {/* Cargando */}
        {loading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(-1)} // 👈 vuelve a la vista anterior (dashboard, etc.)
        className="mt-4 px-6 py-2 bg-white text-black rounded-full font-semibold"
      >
        Cerrar
      </button>
    </div>
  );
}
