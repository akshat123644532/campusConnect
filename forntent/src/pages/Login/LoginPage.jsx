import React, { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { apiFetch, setSession } from "../../utils/api";
import "./AuthPage.css";

const LoginPage = ({ onSuccess, setPage, showToast }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const text = await res.text();

      if (!res.ok) {
        showToast(text);
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      // ✅ token aur user dono pass karo setSession mein
      setSession(data.token, data.user);

      showToast("Login successful!", "success");
      onSuccess();
    } catch (error) {
      showToast("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner anim-slide">
        <div className="auth-page__heading">
          <div className="auth-page__title">SIGN</div>
          <div className="auth-page__title auth-page__title--red">IN.</div>
          <p className="auth-page__subtitle">ACCESS YOUR CAMPUS HUB</p>
        </div>

        <div className="auth-page__form">
          <Input
            label="Email"
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={handleLogin}
          >
            Enter
          </Button>

          <p className="auth-page__switch">
            No account?{" "}
            <span onClick={() => setPage("signup")}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
