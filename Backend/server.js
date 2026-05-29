const http = require("http");
// Load env early for tools that might read PORT before app loads
require("dotenv").config();
const app = require("./app");
const { initializeSocket } = require("./socket");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// initialize socket after server created
initializeSocket(server);

// Warn if MAPTILER_API_KEY is not configured - helps debugging API errors early
if (!process.env.MAPTILER_API_KEY) {
  console.warn(
    "WARNING: MAPTILER_API_KEY is not set. Server-side map services will fail.",
  );
}

server.listen(port);

server.on("listening", () => {
  console.log(`Server is running on port ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Try setting PORT to a different value and restart.`,
    );
    process.exit(1);
  }
  console.error("Server error:", err);
  // don't crash silently; exit to let process managers restart if configured
  process.exit(1);
});

// Global handlers to assist debugging in development and avoid silent exits
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
