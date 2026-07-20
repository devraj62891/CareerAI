const express=require('express');
const router=express.Router();
const {signup,login}=require('../controllers/authController');
const { protect } = require("../middlewares/authMiddlewares");

router.post('/signup',signup);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authorized!",
    user: req.user,
  });
});

module.exports=router;