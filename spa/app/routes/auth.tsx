import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

const checkUserQueryOptions = queryOptions({
  queryKey: ["getUser"],
  queryFn: async () => await axios.get("http://localhost:3000/auth"),
  retry: false,
  select(data) {
    return data.data?.data;
  },
});

export default function AuthPage() {
  const navigate = useNavigate();
  const { data, error } = useQuery(checkUserQueryOptions);

  const redirectIfUserLoggedIn = () => {
    if (data?.id) {
      navigate("/");
    }
  };

  useEffect(() => {
    redirectIfUserLoggedIn();
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      callbackMutation.mutate({ code, state });
    }
  }, []);

  const callbackMutation = useMutation({
    mutationFn: async ({ code, state }: { code: string; state: string }) => {
      const response = await axios.get("/auth/google/callback", {
        params: { code, state },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("Google callback failed:", error);
    },
  });

  const handleGoogleAuth = async () => {
    try {
      const response = await axios.get("/auth/google/login");
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center">welcome to the sauce</h1>

        <button
          onClick={handleGoogleAuth}
          className="w-full p-3 flex items-center justify-center gap-3 bg-white text-gray-800 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          continue with google
        </button>

        <p className="text-sm text-center text-muted-foreground">
          no password maidens allowed
        </p>
      </div>
    </div>
  );
}
