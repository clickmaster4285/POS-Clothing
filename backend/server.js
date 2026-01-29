require("dotenv").config();
const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");
const initializeAdmin = require("./utils/initializeAdmin");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
      await initializeAdmin();
      
      
    server.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
      console.log("✅ MongoDB connected (pos-clothing)");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Server-level errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use`);
    process.exit(1);
  }
  console.error("❌ Server error:", error);
});
