import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Modal from "../ui/Modal";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import ScrollToTop from "./ScrollToTop";
import { useState, useEffect, useCallback } from "react";
import "./css/Layout.css";

export default function Layout() {
  const [modalType, setModalType] = useState(null); // "login" | "register" | null

  useEffect(() => {
    const body = document.body;
    body.style.overflow = modalType ? "hidden" : "auto";
    return () => {
      body.style.overflow = "auto"; // Cleanup
    };
  }, [modalType]);

  const closeModal = useCallback(() => setModalType(null), []);
  const openLogin = useCallback(() => setModalType("login"), []);
  const openRegister = useCallback(() => setModalType("register"), []);

  return (
    <>
      <ScrollToTop />
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      <main className="app-layout">
        <Outlet />
      </main>

      <Footer />

      <Modal isOpen={modalType === "login"} onClose={closeModal}>
        <LoginForm onSuccess={closeModal} />
      </Modal>

      <Modal isOpen={modalType === "register"} onClose={closeModal}>
        <RegisterForm onSuccess={closeModal} />
      </Modal>
    </>
  );
}
