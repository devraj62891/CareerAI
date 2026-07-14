const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,      // no two users can have the same email
      lowercase: true,   // store emails in lowercase for consistency
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,    // auto-adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);