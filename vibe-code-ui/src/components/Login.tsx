import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.table(form);           // debug, like your stub
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Login failed");
      }
      const { token } = await res.json();
      login(form.email, token);    // store JWT & email
      navigate("/problem/two-sum"); // ← redirect to problem view
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1>Log in to VibeCode</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
        <div className="text-sm">
          <span>New here? </span>
          <Link to="/register" className="link-button">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
