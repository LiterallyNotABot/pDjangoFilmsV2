// components/layout/Navbar.jsx
import { Button } from "../ui/Button";
import { useState } from "react";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <div className="text-xl font-bold">DjangoFilms</div>
      <div className="flex gap-4">
        <Button onClick={onLoginClick}>Login</Button>
        <Button onClick={onRegisterClick}>Crear cuenta</Button>
      </div>
    </nav>
  );
}
