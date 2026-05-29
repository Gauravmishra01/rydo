import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`/users/login`, userData);

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
        toast.success("Logged in successfully");
      }
    } catch (err) {
      console.error("Login error:", err);
      const resp = err?.response?.data;
      const message =
        resp?.message ||
        (resp?.errors && resp.errors.map((e) => e.msg).join(", ")) ||
        err.message ||
        "Login failed";
      toast.error(message);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <section className="auth-hero flex flex-col justify-between">
          <div>
            <span className="floating-chip mb-5">
              <i className="ri-user-3-line" aria-hidden></i>
              Rider access
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back. Your next ride is a few taps away.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
              Sign in to book rides, track drivers live, and manage every trip
              from a clean, mobile-friendly dashboard.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Booking
              </p>
              <h3 className="mt-2 text-lg font-semibold">Fast checkout</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Tracking
              </p>
              <h3 className="mt-2 text-lg font-semibold">Live location</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Support
              </p>
              <h3 className="mt-2 text-lg font-semibold">Always on</h3>
            </div>
          </div>
        </section>

        <section className="auth-panel panel">
          <img
            className="mb-6 h-16 w-16 rounded-2xl bg-slate-100 p-2 shadow-sm"
            src="/src/assets/rydo-logo.svg"
            alt="Rydo"
          />
          <h2 className="section-title">Sign in to Rydo</h2>
          <p className="section-subtitle mt-3">
            Use the same account to find trips, confirm pickups, and keep ride
            history in one place.
          </p>

          <form
            onSubmit={submitHandler}
            aria-label="User login form"
            className="mt-8 space-y-4"
          >
            <div>
              <label className="label" htmlFor="user-email">
                Email address
              </label>
              <input
                id="user-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                type="email"
                placeholder="email@example.com"
                aria-required="true"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="user-password">
                Password
              </label>
              <input
                id="user-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="••••••••"
                aria-required="true"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" variant="primary" ariaLabel="Login">
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#ff3d81] hover:underline"
            >
              Create a new account
            </Link>
          </p>

          <Link to="/captain-login" className="btn btn-ghost mt-6">
            Sign in as captain
          </Link>
        </section>
      </div>
    </div>
  );
};

export default UserLogin;
