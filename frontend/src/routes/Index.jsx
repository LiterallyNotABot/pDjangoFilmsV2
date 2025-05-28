import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import FilmsRoutes from "./filmsRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {FilmsRoutes()}
      </Route>
    </Routes>
  );
}
