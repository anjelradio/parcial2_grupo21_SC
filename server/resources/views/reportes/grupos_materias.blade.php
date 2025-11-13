<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Grupos y Materias Activas</title>
    <style>
        @page { margin: 60px 40px; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            min-height: 100vh;
        }

        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0a3c6e;
            padding-bottom: 8px;
            margin-bottom: 20px;
        }

        .logo {
            flex: 0 0 80px;
        }

        .logo img {
            width: 80px;
            height: auto;
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

        th, td {
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
            position: relative;
            bottom: 4px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #666;
            border-top: 1px solid #ccc;
            padding: 4px 0;
        }
    </style>
</head>
<body>

    <header>
        <div class="logo">
            <img src="{{ public_path('images/ficctlogo.png') }}" alt="Logo FICCT">
        </div>
        <div class="header-text">
            <h1>Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones</h1>
            <h2>Universidad Autónoma Gabriel René Moreno</h2>
        </div>
    </header>

    <div class="report-info">
        <strong>Gestión:</strong> {{ $gestion }}<br>
        <strong>Fecha de generación:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
    </div>

    <div class="report-title">Reporte de Grupos y Materias Activas</div>

    <table>
        <thead>
            <tr>
                <th>ID Grupo</th>
                <th>Nombre Grupo</th>
                <th>Sigla Materia</th>
                <th>Nombre Materia</th>
            </tr>
        </thead>
        <tbody>
            @foreach($grupos as $g)
                <tr>
                    <td>{{ $g['id_grupo'] }}</td>
                    <td>{{ $g['nombre_grupo'] }}</td>
                    <td>{{ $g['sigla_materia'] }}</td>
                    <td>{{ $g['nombre_materia'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <footer>
        Sistema de Gestión de Asistencia Docente — FICCT · UAGRM · Generado automáticamente
    </footer>
</body>
</html>
