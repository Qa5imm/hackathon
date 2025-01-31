import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

// moved to separate file ideally
const authApi = {
  checkUser: () => axios.get("http://localhost:3000/auth"),
  googleCallback: (params: { code: string; state: string }) =>
    axios.get("/auth/google/callback", { params, withCredentials: true }),
  googleLogin: () => axios.get("/auth/google/login"),
};

export default function AuthPage() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => authApi.checkUser().then((res) => res.data?.data),
    retry: false,
  });

  const googleCallback = useMutation({
    mutationFn: authApi.googleCallback,
    onSuccess: (res) => {
      if (res.data.user) navigate("/");
    },
  });

  useEffect(() => {
    if (user?.id) navigate("/");

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state) googleCallback.mutate({ code, state });
  }, [user]);

  const handleGoogleAuth = async () => {
    try {
      const { data } = await authApi.googleLogin();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("google auth failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border-4 border-black p-8 [box-shadow:8px_8px_0_0_#000]">
        <h1 className="text-4xl font-black mb-12 tracking-tight">
          enter the void
        </h1>

        <button
          onClick={handleGoogleAuth}
          className="w-full p-4 flex items-center justify-center gap-3
                   bg-black text-white font-bold
                   hover:translate-y-[-2px] transition-transform"
        >
          <GoogleIcon />
          continue w/ google
        </button>

        <p className="mt-8 font-mono text-sm text-center">
          passwords are for boomers
        </p>
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
