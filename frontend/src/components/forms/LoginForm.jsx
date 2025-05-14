import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { loginUser } from "../../services/users";
import useUserStore from "../../store/userStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useUserStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser(email, password);
      setUser(data.user, data.token);
      console.log("Login exitoso:", data);
      // Aquí puedes redirigir, cerrar modal o limpiar formulario
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Error desconocido al iniciar sesión"
      );
      console.error("Error al iniciar sesión:", err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

      <Input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full">
        Entrar
      </Button>

      {error && <p className="text-red-600 text-center">{error}</p>}
    </form>
  );
}
