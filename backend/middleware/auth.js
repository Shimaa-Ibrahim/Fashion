const jwt = require("jsonwebtoken");

function decodeJwt(req) {
  const authHeader = req.get("Authorization");
  //token not found
  if (!authHeader) {
    const err = new Error("Not authenticated!");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECERT_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  //invalid token
  if (!decodedToken) {
    const error = new Error("Not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  return decodedToken;
}

exports.isAuth = (req, res, next) => {
  let token;
  try {
    token = decodeJwt(req);
  } catch (err) {
    throw err;
  }

  req.userID = token.userID;
  next();
};

exports.isAdmin = (req, res, next) => {
  let token;
  try {
    token = decodeJwt(req);
  } catch (err) {
    throw err;
  }

  if (!token.isAdmin) {
    const err = new Error("Not authorized!");
    err.statusCode = 403;
    throw err;
  }
  req.userID = token.userID;
  req.isAdmin = true;
  next();
};
