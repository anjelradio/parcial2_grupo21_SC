#  Sistema Web de Gestión de Carga Horaria y Control de Asistencia Docente – FICCT (PWA Universitaria)

##  Descripción General
Aplicación web progresiva (**PWA**) desarrollada para la **Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones (FICCT - UAGRM)**, que permite gestionar la **carga horaria docente**, controlar **asistencias mediante QR y GPS**, **aprobar permisos y suplencias**, y administrar toda la **gestión académica** (materias, grupos, aulas y horarios).

---

##  Características Principales
✅ Autenticación segura por roles (ADMINISTRADOR, DOCENTE, AUTORIDAD).  
✅ Registro y validación de asistencia docente (QR y GPS).  
✅ Gestión de permisos, suplencias y solicitudes de aula.  
✅ Administración de materias, grupos, aulas y bloques horarios.  
✅ Asignación de carga horaria sin conflictos.  
✅ Paneles y reportes estadísticos en tiempo real.  
✅ Generación de reportes en PDF / Excel.  
✅ Instalación como PWA (modo offline y acceso desde dispositivos móviles).  

---

##  Arquitectura del Sistema
El sistema sigue una arquitectura **por capas** y organizada en **paquetes funcionales**:

| Paquete / Capa | Funcionalidad |
|----------------|----------------|
| **AUTENTICACIÓN Y SEGURIDAD** | Control de inicio de sesión, roles y bitácora de acceso. |
| **GESTIÓN DE USUARIOS Y ROLES** | Creación, edición y asignación de roles. |
| **GESTIÓN ACADÉMICA** | Administración de materias, grupos, aulas, bloques y días. |
| **ASIGNACIONES ACADÉMICAS** | Carga horaria docente y control de disponibilidad. |
| **CONTROL DOCENTE** | Registro de asistencias, permisos, suplencias y solicitudes de aula. |

 **Frontend:** React + TypeScript + TailwindCSS  
 **Backend:** Laravel 11 (PHP 8.3) + API REST  
 **Base de Datos:** PostgreSQL (Cloud SQL)  
 **Infraestructura Cloud:** Google Cloud Run + Firebase Hosting  
 **Autenticación:** JWT + Middleware de roles  

---

##  Herramientas de Desarrollo

| Tipo | Herramienta |
|------|--------------|
| **IDE / Entorno** | Visual Studio Code |
| **Modelado UML** | StarUML / Lucidchart / Draw.io |
| **Control de versiones** | Git + GitHub |
| **Base de datos local** | pgAdmin / DBeaver |
| **Testing / API** | Postman / ThunderClient |
| **Despliegue Cloud** | Google Cloud Platform (Cloud Run + Cloud SQL) |
| **Frontend** | React + Vite + Zustand + Zod |
| **Backend** | Laravel 11 + PHP 8.3 |

---

##  Instalación y Ejecución

### 🔹 Backend (Laravel)
```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
