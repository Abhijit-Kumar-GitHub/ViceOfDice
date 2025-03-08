require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Allowed Origins 
const allowedOrigins = ["https://viceofdice.netlify.app"];

console.log("Allowed Origins:", allowedOrigins); // Debugging

// Middleware 
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies
  })
);

// Routes
const registerRoutes = require("./routes/register");
const diceRoutes = require("./routes/dice");
const balanceRoutes = require("./routes/balance");

app.use("/api/register", registerRoutes);
app.use("/api/dice", diceRoutes);
app.use("/api/balance", balanceRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the ViceOfDice API!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
