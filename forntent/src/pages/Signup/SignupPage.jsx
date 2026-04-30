import React, { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { apiFetch } from "../../utils/api";
import "./AuthPage.css";

const SignupPage = ({ setPage, showToast }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";

    if (form.password && form.password.length < 6) {
      e.password = "Minimum 6 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await apiFetch("/users/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const text = await res.text();

      if (!res.ok) {
        showToast(text);
        setLoading(false);
        return;
      }

      showToast("Account created successfully!", "success");
      setPage("login");
    } catch (error) {
      showToast("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner anim-slide">
        <div className="auth-page__heading">
          <div className="auth-page__title">JOIN</div>
          <div className="auth-page__title auth-page__title--red">UP.</div>
          <p className="auth-page__subtitle">
            CREATE YOUR STUDENT ACCOUNT
          </p>
        </div>

        <div className="auth-page__form">
          <Input
            label="Full Name"
            placeholder="Your name"
            value={form.name}
            error={errors.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            error={errors.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            error={errors.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            onKeyDown={(e) =>
              e.key === "Enter" && handleSignup()
            }
          />

          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={handleSignup}
          >
            Create Account
          </Button>

          <p className="auth-page__switch">
            Already have one?{" "}
            <span onClick={() => setPage("login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;