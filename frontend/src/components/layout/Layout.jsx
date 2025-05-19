import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Modal from "../ui/Modal";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import ScrollToTop from "./ScrollToTop";
import { useState, useEffect } from "react";
import "./css/Layout.css";

export default function Layout() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (showLogin || showRegister) ? 'hidden' : 'auto';
  }, [showLogin, showRegister]);

  return (
    <>
      <ScrollToTop />
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
      />
      
      <main className="app-layout">
        <Outlet />
      </main>

      <Footer />

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm onSuccess={() => setShowLogin(false)} />
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm onSuccess={() => setShowRegister(false)} />
      </Modal>
    </>
  );
}