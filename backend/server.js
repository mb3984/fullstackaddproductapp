import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test route to check if the server is running correctly
app.get("/test", (req, res) => {
  res.send("Server is running correctly.");
});

// Log the paths used for static files
console.log(
  "Serving static files from:",
  path.resolve(__dirname, "../frontend/dist")
);
console.log(
  "Full path to index.html:",
  path.resolve(__dirname, "../frontend/dist", "index.html")
);

// Product routes
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Development Mode: Server is running.");
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server running at http://localhost:" + PORT);
});
