require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const saltRounds = 10;

const User = require("../../models/User");
const Form = require("../../models/Form");

// User.aggregate([
//   {
//     $lookup: {
//       from: "Form",
//       localField: "_id",
//       foreignField: "profileId",
//       as: "images",
//     },
//   },
// ]);

// router.get("/user", auth, (req, res) => {
//   User.findById(req.user.id, (err, foundUser) => {
//     if (err) res.json({ message: "Error" });
//     else {
//       res.status(200).json({ foundUser });
//     }
//   });
// });

router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .populate("images")
    .then((foundUser) => res.status(200).json(foundUser))
    .catch((err) => {
      res.json({ err });
    });
});

router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password)
    res.status(400).json({ message: "Please Enter all feilds" });

  User.findOne({ email: email }, (err, foundUser) => {
    if (err) res.json({ message: "Error" });
    else if (foundUser)
      res.status(400).json({ message: "User Already Exists" });
    else if (!foundUser) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) res.json({ message: "Error" });
        else {
          const newUser = new User({
            name: name,
            email: email,
            password: hash,
          });

          newUser.save().then((user) => {
            jwt.sign({ id: user.id }, process.env.SECRET, (err, token) => {
              if (err) throw err;
              res.status(200).json({ token: token });
            });
          });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, function (err, foundUser) {
    if (err) console.log(err);
    else {
      if (!foundUser) res.status(404).json({ message: "User not found" });
      else {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result == true) {
            jwt.sign({ id: foundUser.id }, process.env.SECRET, (err, token) => {
              if (err) throw err;
              else {
                res.status(200).json({ token: token });
              }
            });
          } else {
            res
              .status(404)
              .json({ message: "Please Enter correct credentials" });
          }
        });
      }
    }
  });
});

module.exports = router;
