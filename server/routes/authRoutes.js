const express=require('express');
const router=express.Router();
const {signup,login}=require('../controllers/authController');
const { protect } = require("../middlewares/authMiddlewares");
const {validateLogin,validateSignup}=require("../middlewares/validators");

router.post('/signup',validateSignup,signup);
router.post("/login",validateLogin, login);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authorized!",
    user: req.user,
  });
});

module.exports=router;