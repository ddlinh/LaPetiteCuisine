const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    type_name: String,
    img: String,
    description: String
    
  }
);

// RecipeSchema.index({ ingredients: "text" });

// RecipeSchema.index({ name: { $regex: } });

const CategoryModel = mongoose.model("categories", CategorySchema);

module.exports = CategoryModel;
