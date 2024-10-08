"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const emailOrUsername = formData.get("emailOrUsername");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "Login failed");
        toast.error(data.error || "Login failed");
      } else {
        const data = await response.json();

        document.cookie = `Authorization=Bearer ${data.access_token}; path=/`;
        document.cookie = `User=${JSON.stringify(data.user)}; path=/`;

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          router.push("/");
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Menggunakan next-auth untuk sign in dengan Google
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
      setErrorMessage("Google login failed");
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] mt-36">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-black">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium text-black"
            >
              Email or Username
            </label>
            <input
              name="emailOrUsername"
              type="text"
              id="emailOrUsername"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
              placeholder="Enter your email or username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
        )}

        <div className="flex items-center justify-center mt-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">Or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col items-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {loading ? "Logging in with Google..." : "Login with Google"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            Do not have an account yet?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-bold"
            >
              Register
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
