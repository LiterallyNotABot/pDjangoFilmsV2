import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from "../ui/Modal";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import { useState } from "react";
import "./Layout.css";

export default function Layout() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
      />
      <main className="app-layout">
        <Outlet />
      </main>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm onSuccess={() => setShowLogin(false)} />
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm onSuccess={() => setShowRegister(false)} />
      </Modal>
    </>
  );
}
