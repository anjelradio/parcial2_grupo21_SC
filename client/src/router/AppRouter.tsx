import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "../components/ui/Loading";
import Layout from "../layouts/Layout";

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
const ControlDocente = lazy(
  () => import("../pages/Shared/ControlDocente/ControlDocente")
);

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
        
        <Route element={<Layout />}>
          {/* Rutas docente */}
          <Route path="docente"></Route>

          {/* Rutas autoridad */}
          <Route path="autoridad"></Route>

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
