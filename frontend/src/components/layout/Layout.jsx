import { Outlet } from "react-router-dom";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Modal from "../ui/Modal";
import "./css/Layout.css";

const ChatLauncher = lazy(() => import("@/features/comms/chat/ChatLauncher"));
const LoginForm = lazy(() => import("../forms/LoginForm"));
const RegisterForm = lazy(() => import("../forms/RegisterForm"));

export default function Layout() {
  const [modalType, setModalType] = useState(null); // "login" | "register" | null

  useEffect(() => {
    document.body.style.overflow = modalType ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
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

      <Suspense fallback={null}>
        {modalType === "login" && (
          <Modal isOpen onClose={closeModal}>
            <LoginForm onSuccess={closeModal} />
          </Modal>
        )}

        {modalType === "register" && (
          <Modal isOpen onClose={closeModal}>
            <RegisterForm onSuccess={closeModal} />
          </Modal>
        )}

        <ChatLauncher />
      </Suspense>
    </>
  );
}
