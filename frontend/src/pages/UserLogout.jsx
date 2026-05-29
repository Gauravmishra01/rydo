import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "../components/ui/Skeleton";

export const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          navigate("/login");
          toast.success("Logged out successfully");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, token]);

  return (
    <div className="auth-shell">
      <div className="panel w-full max-w-md p-6 text-center">
        <Skeleton
          height="48px"
          width="48px"
          rounded="999px"
          style={{ margin: "0 auto 1rem" }}
        />
        <h1 className="section-title mb-2">Signing you out</h1>
        <p className="section-subtitle">
          Please wait while we securely end your session.
        </p>
      </div>
    </div>
  );
};

export default UserLogout;
