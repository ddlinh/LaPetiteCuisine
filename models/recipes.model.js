const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    name: { type: String},
    uri: { type: String, unique: true},
    author: String,
    img: String,
    date: Date,
    type: String,
    duration: Number,
    complex: String,
    serve: Number,
    saves: Number,
    description: String,
    ingredients: Array,
    direction: Array,
    deleteDate: String,
  }
);

// RecipeSchema.index({ ingredients: "text" });

// RecipeSchema.index({ name: { $regex: } });

const RecipeModel = mongoose.model("recipes", RecipeSchema);

module.exports = RecipeModel;
