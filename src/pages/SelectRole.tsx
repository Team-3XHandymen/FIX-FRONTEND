
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Wrench, ArrowLeft } from "lucide-react";

const roleTitles = {
  signup: "Sign up to FixFinder",
  login: "Log in to FixFinder",
};

const roleDescriptions = {
  signup: "Select how you want to use our platform",
  login: "Select your role to log in",
};

const SelectRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const action = queryParams.get("action") || "signup";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-orange-50 to-green-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute top-4 left-4 p-1 rounded hover:bg-gray-200 transition"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">{roleTitles[action]}</h2>
        <p className="mb-6 text-center text-gray-600">{roleDescriptions[action]}</p>
        <div className="flex flex-col gap-4 mb-4">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3"
            size="lg"
            onClick={() =>
              navigate(action === "signup" ? "/signup/client" : "/login/client")
            }
          >
            <User />
            as a Client
          </Button>
          <Button
            className="w-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center gap-3"
            size="lg"
            onClick={() =>
              navigate(action === "signup" ? "/signup/handyman" : "/login/handyman")
            }
          >
            <Wrench />
            as a Handyman
          </Button>
        </div>
      </div>
    </div>
  );
};
export default SelectRole;
