// File: src/components/Register.tsx
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.table(form);              // kept from stub for quick debug
    setError(null);

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Registration failed");
      }

      navigate("/login");           // redirect to login on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1 className="text-2xl font-semibold text-center text-indigo-600">
          Create your account
        </h1>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-500 transition"
        >
          Register
        </button>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="link-button">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
