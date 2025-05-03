
import { useState, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
// import { useAuth } from "@/contexts/AuthContext";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the reset token from query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired reset token");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // await resetPassword(token, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Failed to reset password. The token may be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create New Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your new password below
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {isSuccess ? (
              <div className="text-center">
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
                  <p className="font-medium">Password Reset Successful</p>
                  <p className="mt-2">
                    Your password has been successfully reset. You will be redirected to the login page.
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  <div className="text-center mt-4">
                    <Link to="/login" className="text-sm text-primary hover:underline">
                      Back to Login
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResetPasswordPage;
