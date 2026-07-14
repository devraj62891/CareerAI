const User = require("../models/User");
const bcrypt = require("bcryptjs");

// SIGNUP - register a new user
const signup = async (req, res) => {
  try {
    // 1. Get the data the user sent
    const { name, email, password } = req.body;

    // 2. Basic validation - make sure nothing is missing
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4. Hash the password (scramble it before saving)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create and save the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 6. Send back a success response (never send the password back!)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup };