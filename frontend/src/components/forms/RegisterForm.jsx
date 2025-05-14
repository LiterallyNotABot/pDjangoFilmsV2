import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { registerUser } from "../../services/users";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = await registerUser(username, email, password);
      console.log("Registro exitoso:", data);
      setSuccess("Usuario creado correctamente.");
      // Aquí puedes limpiar formulario o cerrar modal
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.response?.data || err.message || "Error desconocido");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Crear Cuenta</h2>

      <Input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

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
        Registrarse
      </Button>

      {error && <p className="text-red-600">{JSON.stringify(error)}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
}
