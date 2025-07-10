import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login.css"; // Your external stylesheet

interface LoginForm {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.table(form);
    onLogin();
    navigate("/problem/two-sum");
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1>Log in to VibeCode</h1>

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
          <span>New here?</span>{" "}
          <Link to="/register" className="link-button">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
