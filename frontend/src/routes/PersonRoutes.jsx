import { Routes, Route } from "react-router-dom";
import PersonDetails from "@/pages/PersonDetails";

export default function PersonRoutes() {
  return (
    <Routes>
      <Route path=":personId" element={<PersonDetails />} />
    </Routes>
  );
}
