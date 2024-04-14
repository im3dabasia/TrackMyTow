const jwt = require("jsonwebtoken");

const generateToken = (userId, userEmail, userRole, userPhonenumber) => {
  console.log("generateToken");

  const expiresIn = process.env.JWT_EXPIRE || "7d";
  const jwtSecret = process.env.JWT_SECRET || "";

  const token = jwt.sign(
    {
      id: userId,
      email: userEmail,
      role: userRole,
      phonenumber: userPhonenumber,
    },
    jwtSecret,
    {
      expiresIn: expiresIn,
    }
  );

  return token;
};

module.exports = generateToken;
