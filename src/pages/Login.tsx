import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();

  const handleSignup = async () => {
    setLoading(true);
    const result = await login(username, password);

    if (result.success) {
      toast("Login successful!", {
        description: `Welcome, ${username}!`,
        duration: 3000,
      });
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="email"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            type="email"
            required
          />
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={8}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleSignup} disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm text-center mt-2">
            Doesn't have an account?{" "}
            <Link to="/register" className="text-red-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
