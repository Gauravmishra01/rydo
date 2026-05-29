import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/design-system.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CapatainContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

// Ensure axios uses a sane default base URL across the app when Vite env is not provided
axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3001";
axios.defaults.withCredentials = true;

// Global axios error handling to display friendly toasts for network or server errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Network error";
    // Avoid showing toast for 401 here — individual components handle auth redirection
    if (error?.response?.status !== 401) {
      try {
        toast.error(message);
      } catch (e) {
        // noop in case toast not mounted yet
        console.warn("toast error:", e);
      }
    }
    return Promise.reject(error);
  },
);

createRoot(document.getElementById("root")).render(
  <CaptainContext>
    <UserContext>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </UserContext>
  </CaptainContext>,
);
