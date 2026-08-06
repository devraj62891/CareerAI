const { body, validationResult } = require("express-validator");

// ── Reusable error handler ─────────────────────────────────────
// Call this at the START of any controller to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ── Signup validation rules ────────────────────────────────────
const validateSignup = [
  // Name: required, 2-50 chars
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  // Email: required, valid format
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(), // converts to lowercase, removes dots in gmail etc

  // Password: required, min 8 chars, must have uppercase, lowercase, number, special char
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&#]/).withMessage("Password must contain at least one special character (@$!%*?&#)"),

  // Run the error handler after all rules
  handleValidationErrors
];

// ── Login validation rules ─────────────────────────────────────
const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidationErrors
];

module.exports = { validateSignup, validateLogin };