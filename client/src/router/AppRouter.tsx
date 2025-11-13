import { lazy, Suspense } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "../components/ui/Loading";
import Layout from "../layouts/Layout";
import InicioAutoridad from "../pages/Autoridad/Inicio/InicioAutoridad";
import Reportes from "../pages/Autoridad/Reportes/Reportes";
import GestionarSuplencias from "../pages/Shared/ControlDocente/views/GestionarSuplencias/GestionarSuplencias";
import GestionarPermisos from "../pages/Shared/ControlDocente/views/GestionarPermisos/GestionarPermisos";
import GestionarSolicitudes from "../pages/Shared/ControlDocente/views/GestionarSolicitudes/GestionarSolicitudes";
import InicioDocente from "../pages/Docente/Inicio/InicioDocente";
import CameraScanner from "../pages/Docente/Camera/CameraScanner";
import AsistenciasDocente from "../pages/Docente/Asistencias/AsistenciasDocente";
import ConsultaGestion from "../pages/Shared/GestionAcademica/views/ConsultaGestion/ConsultaGestion";
import SupervisionAsistencia from "../pages/Shared/ControlDocente/views/SupervisionAsistencia/SupervisionAsistencia";

// Page Login
const Login = lazy(() => import("../pages/Autenticacion/Login"));

// Admin Pages
const InicioAdmin = lazy(() => import("../pages/Admin/Inicio/InicioAdmin"));
const Asignaciones = lazy(
  () => import("../pages/Admin/Asignaciones/Asignaciones")
);
const Usuarios = lazy(() => import("../pages/Admin/Usuarios/Usuarios"));

// Autoridad Pages

// Shared Pages
const GestionAcademica = lazy(
  () => import("../pages/Shared/GestionAcademica/GestionAcademica")
);
const Materias = lazy(
  () => import("../pages/Shared/GestionAcademica/views/Materias/Materias")
);
const Grupos = lazy(
  () => import("../pages/Shared/GestionAcademica/views/Grupos/Grupos")
);
const Aulas = lazy(
  () => import("../pages/Shared/GestionAcademica/views/Aulas/Aulas")
);
const ControlDocente = lazy(
  () => import("../pages/Shared/ControlDocente/ControlDocente")
);
const Perfil = lazy(() => import("../pages/Shared/Perfil/Perfil"));

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/perfil"
          element={
            <Suspense fallback={<Loading />}>
              <Perfil />
            </Suspense>
          }
        />

        <Route element={<Layout />}>
          {/* Rutas docente */}
          <Route path="docente">
            <Route
              path="inicio"
              element={
                <Suspense fallback={<Loading />}>
                  <InicioDocente />
                </Suspense>
              }
            />

            <Route
              path="reg-asistencia"
              element={
                <Suspense fallback={<Loading />}>
                  <CameraScanner  />
                </Suspense>
              }
            />

            <Route
              path="asistencias"
              element={
                <Suspense fallback={<Loading />}>
                  <AsistenciasDocente  />
                </Suspense>
              }
            />

          </Route>

          {/* Rutas autoridad */}
          <Route path="autoridad">
            <Route
              path="inicio"
              element={
                <Suspense fallback={<Loading />}>
                  <InicioAutoridad />
                </Suspense>
              }
            />

            <Route
              path="reportes"
              element={
                <Suspense fallback={<Loading />}>
                  <Reportes />
                </Suspense>
              }
            />

            <Route
              path="control-docente"
              element={
                <Suspense fallback={<Loading />}>
                  <ControlDocente />
                </Suspense>
              }
            />

            <Route
              path="gestion-academica"
              element={
                <Suspense fallback={<Loading />}>
                  <GestionAcademica />
                </Suspense>
              }
            />
          </Route>

          {/* Rutas admin */}
          <Route path="admin">
            <Route
              path="inicio"
              element={
                <Suspense fallback={<Loading />}>
                  <InicioAdmin />
                </Suspense>
              }
            />
            <Route
              path="gestion-academica"
              element={
                <Suspense fallback={<Loading />}>
                  <GestionAcademica />
                </Suspense>
              }
            />
            <Route
              path="asignaciones"
              element={
                <Suspense fallback={<Loading />}>
                  <Asignaciones />
                </Suspense>
              }
            />

            <Route
              path="control-docente"
              element={
                <Suspense fallback={<Loading />}>
                  <ControlDocente />
                </Suspense>
              }
            />

            <Route
              path="usuarios"
              element={
                <Suspense fallback={<Loading />}>
                  <Usuarios />
                </Suspense>
              }
            />
          </Route>

          {/* Rutas compartidas */}
          <Route path="gestion-academica">
            <Route
              path="gestionar-materias"
              element={
                <Suspense fallback={<Loading />}>
                  <Materias />
                </Suspense>
              }
            />
            <Route
              path="gestionar-grupos"
              element={
                <Suspense fallback={<Loading />}>
                  <Grupos />
                </Suspense>
              }
            />
            <Route
              path="gestionar-aulas"
              element={
                <Suspense fallback={<Loading />}>
                  <Aulas />
                </Suspense>
              }
            />

            <Route
              path="consulta-gestion"
              element={
                <Suspense fallback={<Loading />}>
                  <ConsultaGestion />
                </Suspense>
              }
            />
          </Route>

          <Route path="control-docente">
            <Route
              path="gestionar-suplencias"
              element={
                <Suspense fallback={<Loading />}>
                  <GestionarSuplencias />
                </Suspense>
              }
            />

            <Route
              path="gestionar-solicitudes"
              element={
                <Suspense fallback={<Loading />}>
                  <GestionarSolicitudes />
                </Suspense>
              }
            />

            <Route
              path="gestionar-permisos"
              element={
                <Suspense fallback={<Loading />}>
                  <GestionarPermisos />
                </Suspense>
              }
            />
            <Route
              path="supervision-asistencia"
              element={
                <Suspense fallback={<Loading />}>
                  <SupervisionAsistencia />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
