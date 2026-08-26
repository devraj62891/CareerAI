process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const cors = require("cors");
const authRoutes=require('./routes/authRoutes');
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/analysis", analysisRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});