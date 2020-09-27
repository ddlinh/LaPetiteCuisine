var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("hbs");
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
var app = express();

const uri = `mongodb+srv://ddlinh12:ddlinh12@recipelpc.emydz.gcp.mongodb.net/RecipeDB?retryWrites=true&w=majority`;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper("plus", (value) => value + 1); //helper +1 index
hbs.registerHelper("if_odd", (value) => value % 2);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const verify = require("./middlewares/verify.mdw");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dashboard", verify, require("./routes/dashboard"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// mongoose
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect succeded"))
  .catch((err) => {
    console.log("err", err);
    process.exit(1);
  });

module.exports = app;
