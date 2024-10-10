"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const validateForm = () => {

    if (name.length < 1) {
      toast.error('Fill Name')
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Email must be in email format");
      return false;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters");
      return false;
    }

    if (username.includes(" ")) {
      toast.error("Username must not contain spaces");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Tampilkan toast jika username/email sudah digunakan
        if (errorData.message === "Username already used") {
          toast.error("Username already used");
        } else if (errorData.message === "Email already used") {
          toast.error("Email already used");
        } else {
          throw new Error(errorData.message || "Registration failed");
        }
        return; // Hentikan eksekusi jika ada error
      }

      toast.success("Registration successful!");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] mt-36">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-black">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Name
            </label>
            <input
              name="name"
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black"
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-black text-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-black">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-bold"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
      <Toaster position="top-right" richColors style={{ marginTop: "40px" }} />
    </div>
  );
}
