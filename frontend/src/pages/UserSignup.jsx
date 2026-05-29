import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`/users/register`, newUser);
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
        toast.success("Account created successfully");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const resp = err?.response?.data;
      const message =
        resp?.message ||
        (resp?.errors && resp.errors.map((e) => e.msg).join(", ")) ||
        err.message ||
        "Signup failed";
      toast.error(message);
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };
  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <section className="auth-hero flex flex-col justify-between">
          <div>
            <span className="floating-chip mb-5">
              <i className="ri-route-line" aria-hidden></i>
              Rider signup
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Create your rider account in less than a minute.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
              Join Rydo to save favorite addresses, get instant fare estimates,
              and book clean, reliable trips anytime.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Profile
              </p>
              <h3 className="mt-2 text-lg font-semibold">Simple setup</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Payments
              </p>
              <h3 className="mt-2 text-lg font-semibold">Cash friendly</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Routes
              </p>
              <h3 className="mt-2 text-lg font-semibold">Live ETA</h3>
            </div>
          </div>
        </section>

        <section className="auth-panel panel">
          <img
            className="mb-6 h-16 w-16 rounded-2xl bg-slate-100 p-2 shadow-sm"
            src="/src/assets/rydo-logo.svg"
            alt="Rydo"
          />
          <h2 className="section-title">Create your account</h2>
          <p className="section-subtitle mt-3">
            Add your details once and start booking rides with a faster checkout
            flow.
          </p>

          <form
            onSubmit={submitHandler}
            aria-label="User signup form"
            className="mt-8 space-y-4"
          >
            <div>
              <label className="label">Full name</label>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  id="firstName"
                  className="input"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <input
                  required
                  id="lastName"
                  className="input"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="signup-email">
                Email address
              </label>
              <input
                id="signup-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" variant="primary">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#ff3d81] hover:underline"
            >
              Login here
            </Link>
          </p>

          <p className="mt-6 text-xs leading-6 text-slate-500">
            By continuing, you agree to Rydo&apos;s terms and privacy practices.
          </p>
        </section>
      </div>
    </div>
  );
};

export default UserSignup;
