<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperación de contraseña - Sistema Docente FICCT</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      background-color: #f5f6fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: 40px auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #003366;
      color: white;
      text-align: center;
      padding: 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .body {
      padding: 24px;
      color: #333;
      line-height: 1.6;
    }
    .body h2 {
      color: #003366;
      margin-bottom: 8px;
    }
    .password-box {
      background: #f0f4ff;
      border: 1px solid #d2ddff;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      font-size: 20px;
      color: #003366;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 16px 0;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #777;
      padding: 16px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sistema de Gestión Docente - FICCT</h1>
    </div>
    <div class="body">
      <h2>Hola {{ $nombre }},</h2>
      <p>Has solicitado recuperar tu contraseña.</p>
      <p>Tu nueva contraseña temporal es:</p>

      <div class="password-box">{{ $password }}</div>

      <p>
        Por seguridad, te recomendamos iniciar sesión y cambiar esta
        contraseña desde tu perfil lo antes posible.
      </p>
      <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    </div>
    <div class="footer">
      © {{ date('Y') }} FICCT - Universidad Autónoma Gabriel René Moreno.  
      <br />Enviado automáticamente por el Sistema de Gestión Docente.
    </div>
  </div>
</body>
</html>
