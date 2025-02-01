import axios from "axios";
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@remix-run/react";

// moved to separate file ideally
export const authApi = {
  checkUser: () => axios.get("http://localhost:3000/auth"),
  googleCallback: (params: { code: string; state: string }) =>
    axios.get("/auth/google/callback", { params }),
  googleLogin: () => axios.get("/auth/google/login"),
};

export const useUser = (navigate: ReturnType<typeof useNavigate>) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => authApi.checkUser().then((res) => res.data?.data),
    retry: false,
  });
};

export const useGoogleCallback = (navigate: ReturnType<typeof useNavigate>) => {
  const googleCallback = useMutation({
    mutationFn: authApi.googleCallback,
    onSuccess: (res) => {
      if (res.data.user) navigate("/");
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state) googleCallback.mutate({ code, state });
  }, []);

  return googleCallback;
};

export const useGoogleAuth = () => {
  const handleGoogleAuth = async () => {
    try {
      const { data } = await authApi.googleLogin();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("google auth failed:", err);
    }
  };

  return { handleGoogleAuth };
};

export const useAuth = (navigate: ReturnType<typeof useNavigate>) => {
  useGoogleCallback(navigate);
  const { handleGoogleAuth } = useGoogleAuth();

  return { handleGoogleAuth };
};
