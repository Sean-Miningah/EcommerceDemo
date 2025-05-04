import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/api/useAuth";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Use the new Redux hook
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError(); // Clear any previous Redux errors

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const success = await register({
      username,
      email,
      password,
      password2: confirmPassword,
      // first_name: username.split(' ')[0],
      // last_name: username.split(' ').slice(1).join(' ')
    });

    if (success) {
      navigate("/login");
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Sign up to start shopping with us
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit}>
              {(localError || error) && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  {localError || error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Full Name</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SignupPage;