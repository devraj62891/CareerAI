const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // Link to the user who uploaded this resume
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // points to the User model
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    // The plain text extracted from the PDF (this is what the AI will read)
    extractedText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);