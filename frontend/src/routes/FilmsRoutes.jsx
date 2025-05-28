import { Route } from "react-router-dom";
import FilmDetails from "../pages/FilmDetails";

export default function FilmsRoutes() {
  return (
    <>
      <Route path="/films/:id" element={<FilmDetails />} />
    </>
  );
}
