
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const HandymanLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/handyman/dashboard");
    }, 600);
  };

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
          <h2 className="text-2xl font-bold text-center mb-2">Log in as Handyman</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
              Continue with Google
            </Button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup/handyman" className="text-orange-600 hover:underline">
                Sign up as handyman
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandymanLogin;
