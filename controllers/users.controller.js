const createHttpError = require("http-errors");
const UserModel = require("../models/users.model");

module.exports = {
  load: async () => await UserModel.find({}),
  getUser: async (username) => {
    try {
      const result = await UserModel.find({ username: username });
      if (result.length === 0) throw createHttpError("User not found");
      return result[0];
    } catch (error) {
      throw createHttpError(error);
    }
  },
};
