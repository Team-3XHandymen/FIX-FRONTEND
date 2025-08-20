
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSignUp } from '@clerk/clerk-react';
import { useToast } from "@/hooks/use-toast";

const ClientSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      
      // Start the signup process
      await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Change the UI to verify the email address
      setPendingVerification(true);
      
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: "Signup failed",
        description: err.errors?.[0]?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      
      // Verify the email address
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        // Set the user as active
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Show success message
        toast({
          title: "Email verified successfully!",
          description: "Welcome to our platform. Redirecting to homepage...",
        });

        // Redirect to homepage - client creation will happen there
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
      
    } catch (err: any) {
      console.error('Verification error:', err);
      toast({
        title: "Verification failed",
        description: err.errors?.[0]?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-orange-50 to-green-50">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="absolute top-4 left-4 p-1 rounded hover:bg-gray-200 transition"
            >
              <ArrowLeft size={24} />
            </button>

            <h2 className="text-2xl font-bold text-center mb-2">Verify Your Email</h2>
            <p className="mb-4 text-center text-gray-600">
              We sent a verification code to {email}
            </p>
            
            <form onSubmit={handleVerify}>
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-orange-50 to-green-50">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute top-4 left-4 p-1 rounded hover:bg-gray-200 transition"
          >
            <ArrowLeft size={24} />
          </button>

          <h2 className="text-2xl font-bold text-center mb-2">Sign up as Client</h2>
          <p className="mb-4 text-center text-gray-600">
            Get access to qualified handymen for all your needs.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
              disabled={isLoading || !isLoaded}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <span className="text-gray-500">
                Please use the sign-in options on the homepage
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSignUp;
