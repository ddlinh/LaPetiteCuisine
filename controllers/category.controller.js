const createHttpError = require("http-errors");
const { create } = require("../models/category.model");
const CategoryModel = require("../models/category.model");


module.exports = {
    get: async(type) => {
        const result = await CategoryModel.find({type_name: type})
    return result[0]
    }
}