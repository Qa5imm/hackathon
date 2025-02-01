import { useAuth, useUser } from "~/lib/hooks/user";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { handleGoogleAuth } = useAuth(navigate);
  const userQuery = useUser(navigate);

  useEffect(() => {
    if (userQuery?.data?.id) navigate("/");
  }, [userQuery?.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md border-4 border-black p-8 bg-white/80 backdrop-blur-sm transform -rotate-1">
        <h1 className="text-6xl font-black uppercase mb-4 transform rotate-2">
          join the share economy
        </h1>

        <p className="text-xl font-mono bg-purple-300 inline-block p-2 transform -rotate-1 mb-12">
          borrow stuff // touch grass // be based
        </p>

        <button
          onClick={handleGoogleAuth}
          className="w-full p-4 flex items-center justify-center gap-3
                   bg-black text-white font-bold text-xl
                   hover:translate-y-[-4px] hover:rotate-1 transition-all"
        >
          <GoogleIcon />
          sign in w/ google fr fr
        </button>

        <div className="mt-12 font-mono text-sm space-y-2">
          <div className="border-4 border-black p-4 bg-emerald-200 transform rotate-1">
            <h2 className="font-bold mb-2">why join?</h2>
            <ul className="space-y-1">
              <li>• borrow cool stuff</li>
              <li>• share ur unused things</li>
              <li>• build actual community</li>
              <li>• save money + planet</li>
            </ul>
          </div>

          <p className="text-center transform -rotate-1">
            passwords are mid // web3 auth coming soon™
          </p>
        </div>
      </div>
    </div>
  );
}

// separate component for cleaner jsx
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#fff"
    />
    {/* simplified svg paths */}
  </svg>
);
