// App.jsx
import { useState } from "react";
import Navbar from "./components/layout/navbar";
import Modal from "./components/ui/Modal";
import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import Landing from "./pages/Landing";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
      />
      <Landing />
      
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm />
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm />
      </Modal>
    </>
  );
}

export default App;

