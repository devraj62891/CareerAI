const express = require("express");
const cors = require("cors");
const authRoutes=require('./routes/authRoutes');
const resumeRoutes = require("./routes/resumeRoutes");
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

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});