import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";

const Register = () => {
  const [username, setusername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuthStore();

  const handleSignup = async () => {
    setLoading(true);
    const result = await signup(username, password, fullName, phoneNumber);

    if (result.success) {
      toast("Register successful!", {
        duration: 3000,
      });
      navigate("/login");
    } else {
      setError(result.error || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <Input
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
            pattern="^\+?[1-9]\d{9,14}$"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleSignup} disabled={loading} className="w-full">
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
