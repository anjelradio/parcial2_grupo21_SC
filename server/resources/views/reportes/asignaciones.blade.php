<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Maestro de Oferta Académica</title>
<style>
    body {
        font-family: "DejaVu Sans", sans-serif;
        font-size: 11px;
        color: #333;
        margin: 25px;
    }
    header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        border-bottom: 2px solid #0a3c6e;
        padding-bottom: 4px;
        margin-bottom: 15px;
    }
    .logo img {
        width: 75px;
        height: auto;
        display: block;
    }
    .header-text {
        text-align: right;
        line-height: 1.3;
    }
    .titulo {
        font-size: 16px;
        color: #0a3c6e;
        font-weight: bold;
    }
    .subtitulo {
        font-size: 13px;
        margin-top: 3px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
    }
    th, td {
        border: 1px solid #999;
        padding: 6px;
        text-align: left;
        vertical-align: top;
    }
    th {
        background-color: #0a3c6e;
        color: white;
        text-transform: uppercase;
        font-size: 11px;
    }
    tr:nth-child(even) {
        background-color: #f5f5f5;
    }
    .grupo {
        font-weight: bold;
        color: #0a3c6e;
    }
</style>
</head>
<body>

<header>
    <div class="logo">
        <img src="{{ public_path('images/ficctlogo.png') }}" alt="Logo UAGRM">
    </div>
    <div class="header-text">
        <div class="titulo">Maestro de Oferta Académica</div>
        <div class="subtitulo">Gestión {{ $gestion }}</div>
        <div class="subtitulo">Generado: {{ $fecha }}</div>
    </div>
</header>

<table>
    <thead>
        <tr>
            <th>Grupo</th>
            <th>Sigla</th>
            <th>Materia</th>
            <th>Docente</th>
            <th>Día / Hora</th>
            <th>Aula</th>
        </tr>
    </thead>
    <tbody>
        @foreach($asignaciones as $asig)
            @php $rowspan = count($asig['horarios']); @endphp
            @if($rowspan > 0)
                <tr>
                    <td class="grupo" rowspan="{{ $rowspan }}">{{ $asig['grupo'] }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $asig['sigla'] }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $asig['materia'] }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $asig['docente'] }}</td>

                    <td>{{ $asig['horarios'][0]['horario'] }}</td>
                    <td>{{ $asig['horarios'][0]['aula'] }}</td>
                </tr>

                @for($i = 1; $i < $rowspan; $i++)
                    <tr>
                        <td>{{ $asig['horarios'][$i]['horario'] }}</td>
                        <td>{{ $asig['horarios'][$i]['aula'] }}</td>
                    </tr>
                @endfor
            @endif
        @endforeach
    </tbody>
</table>

</body>
</html>
