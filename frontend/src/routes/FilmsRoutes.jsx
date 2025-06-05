import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const FilmDetails = lazy(() => import("../pages/FilmDetails"));
const FilmGridPage = lazy(() => import("../pages/FilmGridPage"));
const PersonDetails = lazy(() => import("../pages/PersonDetails"));

export default function FilmsRoutes() {
  return (
    <Routes>
      <Route
        path="/films/:id"
        element={
          <Suspense fallback={<div className="text-gray-400 p-4">Loading film details...</div>}>
            <FilmDetails />
          </Suspense>
        }
      />
      <Route
        path="/films"
        element={
          <Suspense fallback={<div className="text-gray-400 p-4">Loading films...</div>}>
            <FilmGridPage />
          </Suspense>
        }
      />
      <Route
        path="/person/:id"
        element={
          <Suspense fallback={<div className="text-gray-400 p-4">Loading person...</div>}>
            <PersonDetails />
          </Suspense>
        }
      />
    </Routes>
  );
}
