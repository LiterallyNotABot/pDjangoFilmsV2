import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import useUserStore from "./store/user/userStore";
import useFilmActivityStore from "./store/film/useFilmActivityStore";

// --- Load user on refresh --- //
useUserStore.getState().loadUserFromStorage();
useFilmActivityStore.getState().loadActivityFromStorage();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
