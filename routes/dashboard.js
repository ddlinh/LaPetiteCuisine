const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const moment = require("moment");
moment.locale("vn");

const { upload, UploadImageToStorage } = require("../middlewares/upload.mdw");

const recipesController = require("../controllers/recipes.controller");
const userController = require("../controllers/users.controller");
const RecipeModel = require("../models/recipes.model");
const { NotExtended } = require("http-errors");
const createHttpError = require("http-errors");

// /dashboard
router.get("/", async (req, res) => { 
  const { token } = req.cookies;
  const decode = jwt.decode(token);
  const { username } = decode;

  const data = await recipesController.getByAuthor(username);

  const info_author = await userController.getUser(username);

  // console.log("author", info_author);
  // console.log("data", data);
  res.render("pages/my_recipes", {
    layout: "layouts/dashboard",
    data: data,
    info: info_author,
  });
});

router.post(
  "/add-recipe",
  upload.single("input-b1"),
  async (req, res, next) => {
    // moi du lieu trong form (txt+img)
    // luu img vao storage => url
    // text + url ==> database
    const { token } = req.cookies;
    const decoded = jwt.decode(token);
    const { username } = decoded;

    const { file } = req;

    var data = JSON.parse(JSON.stringify(req.body));
    console.log("data", data);
    console.log("file", file);

    const { name } = data;
    const uri = toURI(name);
    if (!file) res.status(400).send("File not found");

    var { ingredients } = data;
    var { direction } = data;
    console.log("ingredients", ingredients);
    const removeItem = "";
    filter_ingredients = ingredients.filter((item) => item != removeItem);
    filter_direction = direction.filter((item) => item != removeItem);

    UploadImageToStorage(file)
      .then((success) => {
        console.log("success", success);

        data = {
          ...data,
          ingredients: filter_ingredients,
          direction: filter_direction,
          uri,
          img: success,
          author: username,
          deleteDate: "",
        };
        console.log("data", data);

        try {
          (async () => {
            await recipesController.add(data);

            // const load = await recipesController.getByAuthor(username);
            // console.log("load", load);
            // res.status(200).send(load);

            res.redirect("/dashboard");
          })();
        } catch (error) {
          next(createHttpError(error));
        }
      })
      .catch((err) => {
        next(createHttpError(err));
      });
  }
);

router.post("/del-recipe", async (req, res, next) => {
  const { uri } = req.body;
  const now = moment().format();
  console.log("uri", uri);
  console.log("now", now);

  try {
    await recipesController.update({ uri: uri }, { deleteDate: now });
    res.redirect("/dashboard");
  } catch (error) {
    next(createHttpError(error));
  }
});

router.post("/undo-del", async (req, res) => {
  // get latest deleteDate

  const { token } = req.cookies;
  const decode = jwt.decode(token);
  const { username } = decode;

  const result = await recipesController.getLatestDel(username);

  console.log("result", result);
  const { uri } = result[0];
  await recipesController.update({ uri: uri }, { deleteDate: "" });
  if (result.length == 1) {
    res.status(200).json({ ...result[0], last: true });
  } else {
    //  result[0]["last"] = false;
    res.status(200).json({ ...result[0], last: false });
  }
});

// edit dựa trên uri
router.post(
  "/edit-recipe",
  upload.single("input-b1"),
  async (req, res, next) => {
    // moi du lieu trong form (txt+img)
    // luu img vao storage => url
    // text + url ==> database
        const { token } = req.cookies;
        const decoded = jwt.decode(token);
        const { username } = decoded;

    var data = JSON.parse(JSON.stringify(req.body));
    console.log("data", data);

    const { name } = data;
    const uri = toURI(name);


    var { ingredients } = data;
    var { direction } = data;
    console.log("ingredients", ingredients);
    const removeItem = "";
    filter_ingredients = ingredients.filter((item) => item != removeItem);
    console.log("filter_ingredients", filter_ingredients);
    filter_direction = direction.filter((item) => item != removeItem);
    
    const { file } = req;
    if (file) {
      UploadImageToStorage(file)
        .then((success) => {
          console.log("success", success);

          data = {
            ...data,
            ingredients: filter_ingredients,
            direction: filter_direction,
            uri,
            img: success,
            author: username,
            deleteDate: ""
          };
          console.log("data for update", data);

          try {
            (async () => {
              await recipesController.update({ uri: uri }, { ...data });

              res.redirect("/dashboard");
            })();
          } catch (error) {
            next(createHttpError(err));
          }
        })
        .catch((err) => {
          next(createHttpError(err));
        });
    } else {
      try {
        await recipesController.update({ uri: uri }, { ...data, ingredients: filter_ingredients, direction: filter_direction, author: username, deleteDate: ""});
        res.redirect("/dashboard");
      } catch (error) {
        next(createHttpError(error));
      }
    }
  }
);

router.post("/detail", async (req, res) => {
  const { uri } = req.body;
  console.log("uri", uri);
  const result = await recipesController.get(uri);
  res.status(200).json(result[0]);
});

// empty trash
router.get("/rm-undo", async (req, res, next) => {
  const { token } = req.cookies;
  const decode = jwt.decode(token);
  const { username } = decode;

  try {
    const result = await recipesController.removeUndo(username);
    res.status(200).json(result);
  } catch (error) {
    next(createHttpError(error));
  }
});

// spicy grilled => spicy-grilled
const toURI = (name) => {
  var string = name.toString();
  string = string.toLowerCase();
  string = string.split(" ").join("-");
  return string;
};

const removeElement = (array, elem) => {
  var i = array.indexOf(elem);
  if (i > -1) {
    array.splice(i, 1);
  }
};

module.exports = router;
