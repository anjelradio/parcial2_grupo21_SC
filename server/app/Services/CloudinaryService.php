<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true
            ]
        ]);
    }

    /**
     * Sube evidencia de asistencia a Cloudinary
     * Estructura: docentes/{codigo_docente}/evidencias_asistencias/{id_asignacion}/{id_asistencia}.jpg
     * 
     * @param UploadedFile $file
     * @param string $codigoDocente
     * @param int $idAsignacion
     * @param int $idAsistencia
     * @return array ['success' => bool, 'url' => string|null, 'error' => string|null]
     */
    public function subirEvidenciaAsistencia(
        UploadedFile $file, 
        string $codigoDocente, 
        int $idAsignacion, 
        int $idAsistencia
    ): array {
        try {
            // Construir la ruta completa
            $folder = "docentes/{$codigoDocente}/evidencias_asistencias/{$idAsignacion}";
            $publicId = "{$folder}/{$idAsistencia}";

            // Subir a Cloudinary
            $upload = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
                'folder' => $folder,
                'public_id' => (string)$idAsistencia,
                'overwrite' => true,
                'resource_type' => 'image'
            ]);

            return [
                'success' => true,
                'url' => $upload['secure_url'],
                'public_id' => $upload['public_id'],
                'error' => null
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'url' => null,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Elimina una imagen de Cloudinary
     * 
     * @param string $publicId
     * @return bool
     */
    public function eliminarImagen(string $publicId): bool
    {
        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId);
            return $result['result'] === 'ok';
        } catch (\Exception $e) {
            return false;
        }
    }
}