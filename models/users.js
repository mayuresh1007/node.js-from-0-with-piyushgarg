const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobtitle: {
    type: String,
  },
  gender: {
    type: String,
  },
});

export const User = mongoose.model("users", usersSchema);
