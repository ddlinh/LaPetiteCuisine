var express = require("express");
const createHttpError = require("http-errors");
var router = express.Router();
var moment = require("moment");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const RecipeController = require("../controllers/recipes.controller");
const CategoryController = require("../controllers/category.controller");

const { localUpload } = require("../middlewares/upload.mdw");
const recipesController = require("../controllers/recipes.controller");
const { isAuth } = require("../functions/isAuth");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);
  // _isAuth {username, pws}

  const latest = (await RecipeController.getLatestRecipes()).slice(0, 4);
  const simple = (await RecipeController.getSimpleRecipes()).slice(0, 6);
  const family = (await RecipeController.getFamilyRecipes()).slice(0, 5);

  const food = await CategoryController.get("food");
  const drink = await CategoryController.get("drink");
  const dessert = await CategoryController.get("dessert");
  const salad = await CategoryController.get("salad");

  res.render("index", {
    title: "La Petite Cuisine",
    js_file: "./../js/index.js",
    css_file: "./../css/index.css",
    latest: latest,
    simple: simple,
    family: family,
    food: food,
    drink: drink,
    salad: salad,
    dessert: dessert,
    user: _isAuth,
  });
});

/* GET all - recipe page */
router.get("/recipes", async (req, res) => {
  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);

  const _datas = await RecipeController.load();
  console.log("_datas", _datas);
  res.render("recipes", {
    title: "All Recipes - La Petite Cuisine",
    js_file: "./../js/recipes.js",
    css_file: "./../css/recipes.css",
    datas: _datas,
    user: _isAuth,
  });

  //res.status(200).json(_datas);
});

/*GET category page */
router.get("/recipes-:cat", async (req, res, next) => {
  const category = req.params.cat;
  const _datas = await RecipeController.type(category);
  const _type = category.charAt(0).toUpperCase() + category.slice(1);

  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);

  const cat = await CategoryController.get(category);
  res.render("recipes_cat", {
    title: category + " - La Petite Cuisine",
    page_name: category,
    _type: _type,
    js_file: "./../js/recipes.js",
    css_file: "./../css/recipes.css",
    datas: _datas,
    cat: cat,
    user: _isAuth,
  });
});

/* GET recipe detail page */
router.get("/recipes/:uri", async (req, res, next) => {
  const name_dish = req.params.uri;
  const data = await RecipeController.detail(name_dish);
  const result = data[0];
  const category = result.type.charAt(0).toUpperCase() + result.type.slice(1);
  const up_date = moment(data[0].date).format("llll"); // Mon, Sep 21, 2020 9:43 PM
  console.log("data detail", data[0]);
  const similar = (
    await RecipeController.similar(name_dish, result.type)
  ).slice(0, 3);

  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);

  res.render("detail", {
    title: name_dish + " - La Petite Cuisine",
    js_file: "./../js/detail.js",
    css_file: "./../css/detail.css",
    data: result,
    category: category,
    up_date: up_date,
    similar: similar,
    user: _isAuth,
  });
});

// router.get("/recipes/search/:keyword", async (req, res, next) => {
//   const { keyword } = req.params;
//   console.log("keyword", keyword);

//   const searchResult = await RecipeController.search(keyword);

//   res.status(200).json(searchResult);
// });

router.get("/search-by-name-:keyword", async (req, res, next) => {
  //   const { search } = req.body;
  // console.log("keyword", keyword);
  let { keyword } = req.params;
  console.log("keyword:", keyword);

  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);

  try {
    const searchResult = await RecipeController.searchByName(keyword);
    res.render("recipes_cat", {
      title: "Search Results - La Petite Cuisine",
      page_name: `Results of ${keyword.split("&").join(" ")}`,
      _type: "Search Result",
      js_file: "./../js/recipes.js",
      css_file: "./../css/recipes.css",
      datas: searchResult,
      user: _isAuth,
    });
  } catch (error) {
    next(createHttpError(error));
  }

  //res.status(200).json(searchResult);
});

router.get("/search-by-ingre-:keyword", async (req, res, next) => {
  const { keyword } = req.params;
  console.log("keyword", keyword);

  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);

  try {
    const searchResult = await RecipeController.searchByIngredients(keyword);

    res.render("recipes_cat", {
      title: "Search Results - La Petite Cuisine",
      page_name: `Results of Ingredients: ${keyword.split("&").join(", ")}`,
      _type: 'Search Result',
      js_file: "./../js/recipes.js",
      css_file: "./../css/recipes.css",
      datas: searchResult,
      user: _isAuth,
    });
  } catch (error) {
    next(createHttpError(error));
  }
});

router.get("/contact", async function (req, res) {
  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);
  res.render("contact", {
    title: "Contact - La Petite Cuisine",
    js_file: "./../js/contact.js",
    css_file: "./../css/contact.css",
    user: _isAuth,
  });
});

router.get("/about", async function (req, res) {
  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);
  res.render("about", {
    title: "About Us - La Petite Cuisine",
    js_file: "./../js/about.js",
    css_file: "./../css/about.css",
    user: _isAuth,
  });
});

router.get("/search-by-img-:keyword", async (req, res, next) => {
  const { keyword } = req.params;
  console.log("keyword", keyword);

  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);

  try {
    const searchResult = await RecipeController.searchByImg(keyword);
    const similarResult = await (await RecipeController.load()).slice(0,3);

    res.render("recipes_img", {
      title: "Search Results - La Petite Cuisine",
      page_name: `${keyword.split("&").join(", ")}`,
      _type: 'Search Result',
      js_file: "./../js/recipes.js",
      css_file: "./../css/recipes.css",
      datas: searchResult.slice(0,3),
      similars: similarResult,
      user: _isAuth,
    });
  } catch (error) {
    next(createHttpError(error));
  }
});

router.post("/search", localUpload.single("input-b1"), async (req, res) => {
  const { file } = req;

  var data = new FormData();
  data.append("img_bytes", fs.createReadStream(file.path));

  var config = {
    method: "post",
    url: "https://api.zalo.ai/v1/general/classify",
    headers: {
      apikey: "v54g6AAfDg6XOjvpFXNidOR6SWOmEKBx",
      ...data.getHeaders(),
    },
    data: data,
  };

  // labels = ''

  const labels = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      const data = response.data.data;
      console.log("data", data);
      console.log("typeof(data)", typeof data);
      var labels = "";
      data.map((element) => {
        labels += element.concept + "&";
      });
      
      return labels;
      // res.status(200).send(JSON.stringify(response.data))
    })
    .catch(function (error) {
      console.log(error);
    });

  res.redirect(`/search-by-img-${labels}`);

  // console.log('result', labels)
  // const result = await recipesController.searchByIngredients(labels)
  // console.log('result', result)
  // res.status(200).json(result)

  fs.unlink(file.path, (err) => {
    if (err) throw err;
    console.log(`${file.path} was deleted`);
  });
});

router.get("/the-recipes-by-:author", async (req, res, next) => {
  const _isAuth = await isAuth(req);
  console.log("_isAuth", _isAuth);
  const { author } = req.params;
  const datas = await RecipeController.getByAuthor(author);
  console.log(datas);
  res.render("recipes_cat", {
    title: "Search Results - La Petite Cuisine",
    page_name: `Recipes by: ${author}`,
    _type: `${author}`,
    js_file: "./../js/recipes.js",
    css_file: "./../css/recipes.css",
    datas: datas,
    user: _isAuth
  });

});

// mongo db
// recipe tag
// => concept -> tag

module.exports = router;
