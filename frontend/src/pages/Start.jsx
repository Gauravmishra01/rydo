import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="page-shell">
      <div className="container relative flex min-h-screen items-center py-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="auth-hero flex flex-col justify-between">
            <div>
              <span className="floating-chip mb-5">
                <i className="ri-shield-star-line" aria-hidden></i>
                Trusted city rides
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Premium rides, faster bookings, and a smoother city commute.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Rydo keeps the booking experience simple for riders and
                captains: live tracking, clear pricing, and a modern interface
                built for speed.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="stat-card">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Ride match
                </p>
                <h3 className="mt-2 text-lg font-semibold">Under a minute</h3>
              </div>
              <div className="stat-card">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Live map
                </p>
                <h3 className="mt-2 text-lg font-semibold">MapTiler powered</h3>
              </div>
              <div className="stat-card">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Safety
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Verified captains
                </h3>
              </div>
            </div>
          </section>

          <section className="auth-panel panel flex flex-col justify-between">
            <div>
              <img
                className="mb-6 h-16 w-16 rounded-2xl bg-slate-100 p-2 shadow-sm"
                src="/src/assets/rydo-logo.svg"
                alt="Rydo"
              />
              <h2 className="section-title">Start your next trip</h2>
              <p className="section-subtitle mt-3">
                Log in to see nearby drivers, set your destination, and confirm
                a ride in a few taps.
              </p>

              <div className="mt-8 space-y-3">
                <Link to="/login" className="btn btn-primary w-full">
                  Continue as rider
                </Link>
                <Link to="/captain-login" className="btn btn-ghost w-full">
                  Captain sign in
                </Link>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 text-slate-900">
                <i className="ri-road-map-line" aria-hidden></i>
                Live tracking and fare estimates included
              </div>
              <p className="mt-2 leading-6">
                Book, track, and complete trips with a streamlined experience
                that feels polished on every device.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Start;
