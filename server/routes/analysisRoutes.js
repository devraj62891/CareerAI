const express = require("express");
const router = express.Router();
const { analyzeUserResume } = require("../controllers/analysisController");
const { protect } = require("../middlewares/authMiddlewares");

router.post("/analyze", protect, analyzeUserResume);

module.exports = router;