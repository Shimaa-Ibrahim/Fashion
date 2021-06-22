const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");


exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed!");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }
    const { username, email, password } = req.body;
    const isAdmin = req.isAdmin ? req.body.isAdmin : false;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hash,
      isAdmin
    });

    const createdUser = await user.save();
    res.status(201).json({ message: "User created!", user: createdUser });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user || !user.isActive) {
      const err = new Error("User not found!");
      err.statusCode = 401;
      err.data="email"
      throw err;
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      const err = new Error("Invalid Credentials!");
      err.statusCode = 401;
      err.data="password"
      throw err;
    }

    const token = jwt.sign(
      {
        userID: user._id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECERT_KEY
    );

    res.status(200).json({
      token,
      userID: user._id,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    next(err);
  }
};


exports.disableUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: `user active: ${user.isActive}`, user: user })
  } catch (err) {
    next(err);
  }
}

exports.getAll = async (req, res, next) => {
  try {
    users = await User.find({});
    res.status(200).json({ users: users });
  }
  catch (err) {
    next(err);
  }
}