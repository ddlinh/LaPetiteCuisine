const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  save_recipes: Array,
  fullname: String,
  "ava-img": String
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
