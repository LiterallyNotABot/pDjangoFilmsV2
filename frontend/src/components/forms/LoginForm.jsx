import { useState } from "react";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { loginUser } from "../../services/users/users";
import useUserStore from "../../store/user/userStore";

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
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.custom === "session_expired") {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err?.error || err?.detail || err?.message || "Invalid credentials"
        );
      }
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>

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

      <Button type="submit" variant="primary" className="mx-auto block">
        Sign In
      </Button>

      {error && <p className="text-red-600 text-center">{error}</p>}
    </form>
  );
}
