import { Routes, Route } from "react-router-dom";
import UserDashboard from "@/pages/UserDashboard";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path=":username" element={<UserDashboard />} />
    </Routes>
  );
}
