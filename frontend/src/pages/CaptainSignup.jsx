import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    try {
      const response = await axios.post(`/captains/register`, captainData);
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
        toast.success("Captain account created");
      }
    } catch (err) {
      console.error("Captain signup error:", err);
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
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };
  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <section className="auth-hero flex flex-col justify-between">
          <div>
            <span className="floating-chip mb-5">
              <i className="ri-truck-line" aria-hidden></i>
              Captain onboarding
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Join the fleet and start accepting rides.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
              Create your captain profile, add your vehicle, and go online with
              a polished, easy-to-manage dashboard.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Fleet
              </p>
              <h3 className="mt-2 text-lg font-semibold">Fast setup</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Dispatch
              </p>
              <h3 className="mt-2 text-lg font-semibold">Live alerts</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Earnings
              </p>
              <h3 className="mt-2 text-lg font-semibold">Track trips</h3>
            </div>
          </div>
        </section>

        <section className="auth-panel panel">
          <img
            className="mb-6 h-16 w-16 rounded-2xl bg-slate-100 p-2 shadow-sm"
            src="/src/assets/rydo-logo.svg"
            alt="Rydo"
          />
          <h2 className="section-title">Create your captain account</h2>
          <p className="section-subtitle mt-3">
            Share your contact and vehicle details to get verified and start
            receiving nearby ride requests.
          </p>

          <form
            onSubmit={submitHandler}
            aria-label="Captain signup form"
            className="mt-8 space-y-4"
          >
            <div>
              <label className="label">Full name</label>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  id="cap-first"
                  className="input"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <input
                  required
                  id="cap-last"
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
              <label className="label">Email address</label>
              <input
                required
                id="cap-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                id="cap-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="label">Vehicle information</label>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  className="input"
                  type="text"
                  placeholder="Vehicle color"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />
                <input
                  required
                  className="input"
                  type="text"
                  placeholder="Vehicle plate"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                className="input"
                type="number"
                placeholder="Vehicle capacity"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
              />
              <select
                required
                className="input"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="" disabled>
                  Select vehicle type
                </option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="motorcycle">Moto</option>
              </select>
            </div>

            <Button type="submit" variant="primary">
              Create captain account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/captain-login"
              className="font-semibold text-[#ff3d81] hover:underline"
            >
              Login here
            </Link>
          </p>

          <p className="mt-6 text-xs leading-6 text-slate-500">
            Captain profiles are reviewed before they start receiving requests.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CaptainSignup;
