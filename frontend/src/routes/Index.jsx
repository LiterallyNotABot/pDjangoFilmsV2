import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import FilmsRoutes from "./FilmsRoutes";
import ShopPage from "@/pages/ShopPage";
import UserRoutes from "./UserRoutes";
import PersonRoutes from "./PersonRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/films/*" element={<FilmsRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/person/*" element={<PersonRoutes />} />
      </Route>
    </Routes>
  );
}