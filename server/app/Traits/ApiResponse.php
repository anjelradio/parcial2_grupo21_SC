<?php

namespace App\Traits;

trait ApiResponse
{
    protected function success($data = null, $message = 'Operación exitosa', $code = 200)
    {
        return response()->json([
            'ok' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    protected function error($message = 'Error en la operación', $code = 400, $errors = null)
    {
        $response = [
            'ok' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    protected function paginate($data, $message = 'Datos obtenidos correctamente')
    {
        return response()->json([
            'ok' => true,
            'message' => $message,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ]
        ]);
    }
}