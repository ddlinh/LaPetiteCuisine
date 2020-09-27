const createHttpError = require("http-errors");
const { create } = require("../models/recipes.model");
const RecipesModel = require("../models/recipes.model");

module.exports = {
  load: async () => await RecipesModel.find({ deleteDate: "" }),
  detail: async (uri) => {
    try {
      const result = await RecipesModel.find({ uri: uri });
      if (result.length === 0) throw createHttpError("Recipes not found"); //không có uri trong db
      return result;
    } catch (error) {
      throw createHttpError(error);
    }
  },
  add: async (data) => {
    try {
      await RecipesModel.create(data);
    } catch (error) {
      throw createHttpError(error);
    }
  },
  get: async (uri) => await RecipesModel.find({ uri: uri }),
  type: async (type) => {
    try {
      const result = await RecipesModel.find({ type: type });
      if (result.length === 0)
        throw createHttpError("This category has not been created yet."); //không có type trong db
      return result;
    } catch (error) {
      throw createHttpError(error);
    }
  },
  similar: async (uri, type) => {
    const result = await RecipesModel.find({ type: type, uri: { $ne: uri } });
    return result;
  },
  getByAuthor: async (author) => {
    try {
      const result = await RecipesModel.find({
        author: author,
        deleteDate: "",
      });
      return result;
    } catch (error) {
      throw createHttpError(error);
    }
  },
  getLatestDel: async (author) => {
    try {
      const result = await RecipesModel.find({
        author: author,
        deleteDate: { $ne: "" },
      }).sort({ deleteDate: -1 });
      console.log("result", result);
      return result.slice(0, 2);
    } catch (error) {
      throw createHttpError(error);
    }
  },
  update: async (filter, update) => {
    try {
      await RecipesModel.findOneAndUpdate(filter, update, { new: true });
    } catch (error) {
      console.log("error", error);
      throw createHttpError(error);
    }
  },
  searchByName: async (keyword) => {
    console.log("keyword in search:", keyword);
    const list_keyword = keyword.split("&");
    var list_keys = [];
    list_keyword.map((element) => {
      list_keys.push(new RegExp(element));
    });
    console.log("list_keys", list_keys);
    try {
      // const result = await RecipesModel.find({ $text: { $regex: keyword } });
      const result = await RecipesModel.find({ uri: { $all: list_keys } });
      if (result.length === 0)
        throw createHttpError(
          `There's no recipes which called ${keyword
            .split("&")
            .join(" ")} in website.`
        ); //không có uri trong db
      return result;
    } catch (error) {
      console.log("error", error);
      throw createHttpError(error);
    }
  },
  searchByIngredients: async (keyword) => {
    const array = keyword.split("&");
    var newArray = [];
    array.map((element) => {
      newArray.push(new RegExp(element));
    });
    console.log("newArray", newArray);

    try {
      const result = await RecipesModel.find({
        ingredients: {
          $all: newArray,
        },
      });
      if (result.length === 0)
        throw createHttpError(
          `There\'s no recipe which has ${keyword
            .split("&")
            .join(", ")} in website.`
        ); //không có uri trong db
      return result;
    } catch (error) {
      console.log("error", error);
      throw createHttpError(error);
    }
  },
  searchByImg: async (keyword) => {
    const array = keyword.split("&");
    var newArray = [];
    array.map((element) => {
      newArray.push(new RegExp(element));
    });
    console.log("newArray", newArray);

    try {
      const result = await RecipesModel.find({
        ingredients: {
          $in: newArray,
        },
      }).sort({ date: -1 });
      if (result.length === 0)
        throw createHttpError(
          `There\'s no recipe which has ${keyword
            .split("&")
            .join(", ")} in website.`
        ); //không có uri trong db
      return result;
    } catch (error) {
      console.log("error", error);
      throw createHttpError(error);
    }
  }
  ,
  getLatestRecipes: async () => {
    try {
      const result = await RecipesModel.find({}).sort({ date: -1 });
      return result;
    } catch (error) {
      throw createHttpError(error);
    }
  },
  getSimpleRecipes: async () => {
    try {
      const result = await RecipesModel.find({
        complex: { $regex: /[Ee]asy/ },
      }).sort({ date: -1 });
      return result;
    } catch (error) {
      throw createHttpError(error);
    }
  },
  getFamilyRecipes: async () => {
    try {
      const result = await RecipesModel.find({ serve: { $gt: 3 } }).sort({
        date: -1,
      });
      return result;
    } catch (error) {
      throw createHttpError(error);
    }
  },
  removeUndo: async (username) => {
    try {
      const result = await RecipesModel.deleteMany({ author: username, deleteDate: { $ne: "" } })
      return result
    } catch (error) {
      throw createHttpError(error);

    }
  }
};
