var express = require("express");
const usersController = require("../controllers/users.controller");
const UserModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

var router = express.Router();

/* GET users listing. */

// router.get('/sign-in')
// router.post('/sign-in')

router.get("/", (req, res) => res.send("Hell from user"));

router.get("/sign-in", function (req, res, next) {
  res.render("sign-in", { layout: false });
});

router.post("/sign-in", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("username", username);
  console.log("password", password);

  // kiểm tra xem username + pwd có trong mongoDB
  try {
    const users = await usersController.load();
    console.log("users", users);
    var user
    try {
      user = await usersController.getUser(username);
    } catch (error) {
      res.status(400).json(error)
    }


    // nếu validated user
    // generate chuỗi token (jwt npm) -> cookies

    if (password === user.password) {
      const token = generateToke(username);
      res.cookie("token", token);
      res.status(200).json({ url: "/dashboard" });
    }

    res.status(400).json({ message: "Wrong password." });
  } catch (error) {
    next(createHttpError(error));
  }

  // nếu validated user
  // generate chuỗi token (jwt npm) -> cookies
});

router.get('/signout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/users/sign-in')
})

router.get('/sign-as-guest', async (req, res) => {
  // const { username, password } = req.body; set săn user + pwd
  const username = 'guest';
  const password = 'guest18';
  console.log("username", username);
  console.log("password", password);

  // kiểm tra xem username + pwd có trong mongoDB
  try {
    const users = await usersController.load();
    console.log("users", users);
    var user
    try {
      user = await usersController.getUser(username);
    } catch (error) {
      res.status(400).json(error)
    }


    // nếu validated user
    // generate chuỗi token (jwt npm) -> cookies

    if (password === user.password) {
      const token = generateToke(username);
      res.cookie("token", token);
      res.redirect('/dashboard')
    }

    res.status(400).json({ message: "Invalid user" });
  } catch (error) {
    next(createHttpError(error));
  }

  // nếu validated user
  // generate chuỗi token (jwt npm) -> cookies
})

const generateToke = (username) => {
  const token = jwt.sign(
    {
      username: username,
    },
    "secret",
    { expiresIn: "1h" }
  );
  console.log("token", token);
  return token;
};

module.exports = router;
