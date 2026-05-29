const mongoose = require("mongoose");

let _mongoMemoryServer = null;

async function connectToDb() {
  let connectionString = process.env.MONGODB_URI || process.env.DB_CONNECT;

  const isLikelyValid =
    typeof connectionString === "string" &&
    (connectionString.startsWith("mongodb://") ||
      connectionString.startsWith("mongodb+srv://"));

  // If no valid connection string and not in production, start an in-memory MongoDB
  if (!connectionString || !isLikelyValid) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "MongoDB connection string is missing or invalid. Skipping DB connection.\n  Set `MONGODB_URI` or `DB_CONNECT` to a valid MongoDB connection string to enable DB features.",
      );
      return;
    }

    console.warn(
      "No valid MongoDB URI found — starting in-memory MongoDB for local development...",
    );
    try {
      // Lazy-require to avoid adding runtime dependency in production
      const { MongoMemoryServer } = require("mongodb-memory-server");
      _mongoMemoryServer = await MongoMemoryServer.create();
      connectionString = _mongoMemoryServer.getUri();
      console.log("Started in-memory MongoDB for development.");
    } catch (err) {
      console.error("Failed to start in-memory MongoDB", err.message || err);
      return;
    }
  }

  mongoose
    .connect(connectionString)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to DB", err.message || err);
    });
}

// Ensure the in-memory server is stopped on process exit in dev
process.on("exit", async () => {
  if (_mongoMemoryServer) {
    try {
      await _mongoMemoryServer.stop();
      console.log("Stopped in-memory MongoDB");
    } catch (e) {
      // ignore
    }
  }
});

module.exports = connectToDb;
