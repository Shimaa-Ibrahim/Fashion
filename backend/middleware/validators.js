const { body } = require("express-validator");

const User = require("../models/user");

exports.userRegister = [
  body("email", "Invalid email!")
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return Promise.reject("This mail elready exists!");
        }
      });
    })
    .normalizeEmail(),

  body("username",'Ivalid username')
    .trim()
    .not()
    .isEmpty(),

  body("password", "password sould be at least 5 characters!")
    .isLength({ min: 5 })
    .trim(),

  body("confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match!");
    }
    return true;
  })
];

