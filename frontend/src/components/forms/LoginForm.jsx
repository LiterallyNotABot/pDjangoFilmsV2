import { useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { loginUser } from "../../services/users";
import useUserStore from "../../store/userStore";

export default function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useUserStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser(username, password);
      setUser(data.user, data.token);
      console.log("Login successful:", data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Unknown login error"
      );
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        Login
      </Button>

      {error && <p className="text-red-600 text-center">{error}</p>}
    </form>
  );
}
