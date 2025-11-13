<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte de Docentes Activos</title>
    <style>
        @page {
            margin: 60px 40px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1a1a1a;
        }

        /* === ENCABEZADO === */
        header {
            display: flex;
            align-items: flex-end;
            /* antes: center */
            justify-content: space-between;
            border-bottom: 2px solid #0a3c6e;
            padding-bottom: 2px;
            /* antes: 8px */
            margin-bottom: 18px;
            /* opcional, reduce espacio entre header y contenido */
        }

        .logo {
            flex: 0 0 80px;
        }

        .logo img {
            width: 80px;
            height: auto;
            margin-bottom: 0;
            /* asegura que no haya espacio extra debajo */
            display: block;
            /* elimina espacio inline */
        }

        .header-text {
            flex: 1;
            text-align: right;
            line-height: 1.3;
        }

        .header-text h1 {
            font-size: 16px;
            margin: 0;
            color: #0a3c6e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .header-text h2 {
            font-size: 13px;
            margin: 2px 0 0 0;
            color: #444;
            font-weight: normal;
        }

        .report-info {
            text-align: right;
            font-size: 10px;
            color: #555;
            margin-bottom: 10px;
        }

        .report-title {
            text-align: center;
            color: #0a3c6e;
            font-size: 15px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }

        th,
        td {
            border: 1px solid #bbb;
            padding: 7px 6px;
            text-align: left;
        }

        th {
            background-color: #e8eef6;
            color: #0a3c6e;
            font-weight: bold;
            font-size: 11px;
        }

        tr:nth-child(even) td {
            background-color: #f8f9fb;
        }

        footer {
            position: fixed;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 4px;
        }
    </style>
</head>

<body>

    <header>
        <div class="logo">
            <img src="{{ public_path('images/ficctlogo.png') }}" alt="Logo UAGRM">
        </div>
        <div class="header-text">
            <h1>Universidad Autónoma Gabriel René Moreno</h1>
            <h2>Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones</h2>
        </div>
    </header>

    <div class="report-info">
        <strong>Gestión:</strong> {{ $gestion }}<br>
        <strong>Fecha de generación:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
    </div>

    <div class="report-title">Reporte de Docentes Activos</div>

    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>Profesión</th>
            </tr>
        </thead>
        <tbody>
            @foreach($docentes as $d)
            <tr>
                <td>{{ $d['codigo_docente'] }}</td>
                <td>{{ $d['nombre_completo'] }}</td>
                <td>{{ $d['email'] }}</td>
                <td>{{ $d['profesion'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    >
</body>

</html>