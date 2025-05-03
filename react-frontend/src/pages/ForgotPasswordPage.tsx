
import { useState, FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
// import { useAuthContext } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { requestPasswordReset } = useAuthContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email to reset your password
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {isSubmitted ? (
              <div className="text-center">
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
                  <p className="font-medium">Email Sent</p>
                  <p className="mt-2">
                    We've sent a password reset link to {email}. Please check your inbox.
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
