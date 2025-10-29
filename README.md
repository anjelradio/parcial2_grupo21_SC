 Sistema Web de Gestión de Carga Horaria y Control de Asistencia Docente – FICCT (PWA Universitaria)
 Descripción general

Aplicación web progresiva (PWA) desarrollada para la Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones (FICCT – UAGRM), que permite gestionar la carga horaria docente, controlar asistencias mediante QR/GPS, aprobar permisos y suplencias, y administrar la gestión académica (materias, grupos, aulas y horarios).

 Características principales

✅ Autenticación segura por roles (ADMINISTRADOR, DOCENTE, AUTORIDAD).
✅ Registro y validación de asistencia docente (QR y GPS).
✅ Gestión de permisos, suplencias y solicitudes de aula.
✅ Administración académica: materias, grupos, aulas, horarios y bloques.
✅ Asignación de carga horaria sin conflictos de horario.
✅ Paneles dinámicos y estadísticas de asistencia.
✅ Generación de reportes (PDF / Excel).
✅ Compatible con móviles (PWA instalable).

 Arquitectura del Sistema

El sistema sigue una arquitectura en capas, organizada por paquetes funcionales:

Capa / Paquete	Funcionalidad principal
AUTENTICACIÓN Y SEGURIDAD	Control de inicio de sesión, JWT, bitácora de acceso
GESTIÓN DE USUARIOS Y ROLES	Administración de cuentas, roles y permisos
GESTIÓN ACADÉMICA	Materias, grupos, aulas, horarios, bloques
ASIGNACIONES ACADÉMICAS	Carga horaria docente
CONTROL DOCENTE	Asistencia, permisos, suplencias y solicitudes de aula

 Frontend: React + TypeScript + TailwindCSS
 Backend: Laravel 11 (PHP 8.3) + REST API
 Base de Datos: PostgreSQL (Cloud SQL)
 Despliegue: Google Cloud Run + Firebase Hosting
 Autenticación: JWT y roles por middleware

 Herramientas de desarrollo
Tipo	Herramienta
IDE / Entorno	VSCode, Postman, Draw.io
Modelado UML	StarUML / Lucidchart
Control de versiones	Git + GitHub
Despliegue Cloud	Google Cloud Platform (Cloud Run + Cloud SQL)
Base de datos local	pgAdmin / DBeaver
Frontend	React + Vite + Zustand + Zod
Backend	Laravel 11 + PHP
Testing	PHPUnit / ThunderClient
