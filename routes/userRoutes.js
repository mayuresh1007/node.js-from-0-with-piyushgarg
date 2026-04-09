const express = require("express");
// const User = require("../models/users");
const {
  HandleGetAllUsers,
  handleGetById,
  hanldeAddUser,
  handleUpdateById,
  handleDeleteById,
} = require("../controllers/userControler");
const UserRouter = express.Router();

UserRouter.route("/").get(HandleGetAllUsers).post(hanldeAddUser);

//// mongo db
UserRouter.route("/:id")
  .get(handleGetById)
  .patch(handleUpdateById)
  .delete(handleDeleteById);

module.exports = UserRouter;

// with mongo
// UserRouter.post("/user", async (req, res) => {
//   const body = req.body;
//   if (
//     !body ||
//     !body.first_name ||
//     !body.last_name ||
//     !body.gender ||
//     !body.email ||
//     !body.job_title
//   ) {
//     return res.status(400).json({ msg: "all fields are required" });
//   }

//   const user = await User.create({
//     firstname: body.first_name,
//     lastname: body.last_name,
//     jobtitle: body.job_title,
//     gender: body.gender,
//     email: body.email,
//   });

//   res.status(201).json({ msg: "success", user });
// });
