import { Link, useNavigate, useLocation } from "@remix-run/react";
import { useLogout, useUser } from "~/lib/hooks/user";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userQuery = useUser(navigate);
  const logoutMutation = useLogout(navigate);

  const logout = () => {
    logoutMutation.mutate();
  };
  return (
    <nav className="border-4 border-black bg-white/90 backdrop-blur-sm sticky top-4 z-50 container mx-auto">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* logo zone */}
        <Link
          to="/"
          className="font-black text-2xl transform -rotate-2 hover:rotate-0 transition-transform"
        >
          SHARE//STUFF
        </Link>

        {/* nav items w that BRUTAL energy */}
        <div className="flex gap-4 items-center font-mono">
          <Link
            to="/goods"
            className={`border-3 border-black px-4 py-2 hover:bg-yellow-200 transform hover:-translate-y-1 transition ${
              location.pathname === "/goods" ? "bg-yellow-200" : ""
            }`}
          >
            browse
          </Link>

          {/* auth button w conditional rendering */}
          {!userQuery.data?.id ? (
            <Link
              to="/auth"
              className={`bg-black text-white px-4 py-2 hover:bg-gray-800 transform hover:-translate-y-1 transition ${
                location.pathname === "/auth" ? "bg-gray-800" : ""
              }`}
            >
              login/signup
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`border-3 border-black px-4 py-2 hover:bg-purple-200 transform hover:-translate-y-1 transition ${
                  location.pathname === "/dashboard" ? "bg-purple-200" : ""
                }`}
              >
                dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-black text-white px-4 py-2 hover:bg-gray-800 transform hover:-translate-y-1 transition"
              >
                logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
