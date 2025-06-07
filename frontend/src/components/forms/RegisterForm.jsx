import { useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { registerUser } from "../../services/users/users";

export default function RegisterForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await registerUser(username, email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response?.data || err.message || "Unknown error");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>

      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit"  variant="primary" className="mx-auto block">
        Register
      </Button>

      {error && <p className="text-red-600">{JSON.stringify(error)}</p>}
    </form>
  );
}
