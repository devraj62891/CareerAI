const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check it exists and is in the right format ("Bearer <token>")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 3. Extract just the token part (remove the word "Bearer ")
    const token = authHeader.split(" ")[1];

    // 4. Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the user info to the request so later code knows who this is
    req.user = decoded;

    // 6. Let the request continue to the actual route
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };