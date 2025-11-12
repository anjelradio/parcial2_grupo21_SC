<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Cloudinary\Cloudinary; // SDK oficial de Cloudinary
use App\Models\GestionAcademica;
use App\Models\QrGestion;

class QrController extends Controller
{
    public function generar(Request $request)
    {
        // 1️⃣ Validar que venga una gestión existente
        $request->validate([
            'id_gestion' => 'required|integer|exists:gestion_academica,id_gestion'
        ]);

        $idGestion = $request->id_gestion;
        $gestion = GestionAcademica::findOrFail($idGestion);

        // 2️⃣ Generar token aleatorio
        $token = Str::random(40);

        // 3️⃣ Crear la URL (enlace) que irá dentro del QR
        $payload = [
            'id_gestion' => $gestion->id_gestion,
            'token' => $token,
            'v' => 1
        ];

        // ✅ URL que se codificará en el QR (puedes cambiar el dominio según tu entorno)
        $urlQR = "https://ficct.uagrm.edu.bo/qr?" . http_build_query($payload);

        // 4️⃣ Generar imagen temporal (QR en PNG)
        $tempPath = storage_path("app/temp_qr_{$idGestion}.png");
        file_put_contents($tempPath, QrCode::format('png')
            ->size(600)
            ->margin(2)
            ->errorCorrection('H') // Alta corrección, más robusto
            ->generate($urlQR));

        // 5️⃣ Subir la imagen a Cloudinary usando el SDK directo
        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true
            ]
        ]);

        try {
            $nombreGestion = $gestion->nombre_gestion; // usa el accessor del modelo
            $publicId = "qr_gestion_{$nombreGestion}";
            $upload = $cloudinary->uploadApi()->upload($tempPath, [
                'folder' => 'ficct_qr',
                'public_id' => $publicId,
                'overwrite' => true,
            ]);

            $url = $upload['secure_url'];
        } catch (\Exception $e) {
            if (file_exists($tempPath)) unlink($tempPath);
            return response()->json([
                'ok' => false,
                'message' => 'Error al subir el QR a Cloudinary',
                'error' => $e->getMessage(),
            ], 500);
        }

        // 6️⃣ Eliminar el archivo temporal
        if (file_exists($tempPath)) unlink($tempPath);

        // 7️⃣ Guardar/actualizar en BD
        QrGestion::updateOrCreate(
            ['id_gestion' => $idGestion],
            [
                'token' => $token,
                'imagen_url' => $url,
                'activo' => true,
                'fecha_actualizacion' => now()
            ]
        );

        // 8️⃣ Devolver respuesta al frontend
        return response()->json([
            'ok' => true,
            'message' => 'QR generado correctamente',
            'data' => [
                'imagen_url' => $url,
                'token' => $token,
                'payload' => $payload,
                'contenido_qr' => $urlQR // 👈 para depuración o prueba directa
            ]
        ]);
    }
}
