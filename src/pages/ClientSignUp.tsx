
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const ClientSignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/client/complete-profile');
  };

  const handleGoogleSignUp = () => {
    navigate('/client/complete-profile');
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

          <h2 className="text-2xl font-bold text-center mb-2">Sign up as Client</h2>
          <p className="mb-4 text-center text-gray-600">
            Get access to qualified handymen for all your needs.
          </p>
          <form onSubmit={handleSignUp}>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="repassword" className="block text-sm font-medium text-gray-700 mb-1">
                Re-enter Password
              </label>
              <input
                id="repassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Re-enter password"
                required
              />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">Sign up</Button>
          </form>
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-200" />
            <span className="mx-4 text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignUp}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            Sign up with Google
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login/client" className="text-green-600 hover:underline">
                Log in as client
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSignUp;
