import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password,
    };
    try {
      const response = await axios.post(`/captains/login`, captain);
      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
        toast.success("Logged in successfully");
      }
    } catch (err) {
      console.error("Captain login error:", err);
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
              <i className="ri-steering-2-line" aria-hidden></i>
              Captain access
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Stay online, accept requests, and earn with confidence.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
              Capture nearby rides, keep your status visible, and manage trip
              progress from a clean dashboard designed for quick action.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Requests
              </p>
              <h3 className="mt-2 text-lg font-semibold">Fast alerts</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Routing
              </p>
              <h3 className="mt-2 text-lg font-semibold">MapTiler maps</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Earnings
              </p>
              <h3 className="mt-2 text-lg font-semibold">Daily summary</h3>
            </div>
          </div>
        </section>

        <section className="auth-panel panel">
          <img
            className="mb-6 h-16 w-16 rounded-2xl bg-slate-100 p-2 shadow-sm"
            src="/src/assets/rydo-logo.svg"
            alt="Rydo"
          />
          <h2 className="section-title">Captain sign in</h2>
          <p className="section-subtitle mt-3">
            Log in to go online, receive ride requests, and manage your queue.
          </p>

          <form
            onSubmit={submitHandler}
            aria-label="Captain login form"
            className="mt-8 space-y-4"
          >
            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
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
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
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
            Join a fleet?{" "}
            <Link
              to="/captain-signup"
              className="font-semibold text-[#ff3d81] hover:underline"
            >
              Register as a captain
            </Link>
          </p>

          <Link to="/login" className="btn btn-ghost mt-6">
            Sign in as rider
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Captainlogin;
