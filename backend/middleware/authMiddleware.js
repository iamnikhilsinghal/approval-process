const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

function authorizeRoles(permittedRoles) {
  return (req, res, next) => {
    // permittedRoles=['admin']
    if (!req.user.role) return res.status(401).json({ error: "Role missing" });
    // we will compare that role coming in req should be equal to permittedRoles- next()
    if (!permittedRoles.includes(req.user.role)) {
      //   const expectedRoles = permittedRoles.map((item) => ROLES[item]);
      return res.status(403).json({
        error: `Access denied- Role should be ${permittedRoles.toString()}`,
      });
    }
    next();
  };
}
module.exports = { authenticateToken, authorizeRoles };
