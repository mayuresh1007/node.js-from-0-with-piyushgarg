const User = require("../models/users");

async function HandleGetAllUsers(req, res) {
  const AllUser = await User.find({});
  return res.status(200).json(AllUser);
}

async function hanldeAddUser(req, res) {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.gender ||
    !body.email ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all fields are required" });
  }

  const user = await User.create({
    firstname: body.first_name,
    lastname: body.last_name,
    jobtitle: body.job_title,
    gender: body.gender,
    email: body.email,
  });

  res.status(201).json({ msg: "success", user });
}

async function handleGetById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).json({ err: "user not found" });
  return res.json(user);
}

async function handleUpdateById(req, res) {
  const body = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, {
    lastname: body.last_name,
  });
  return res.json(user);
}
async function handleDeleteById(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  return res.json(user);
}

module.exports = {
  HandleGetAllUsers,
  hanldeAddUser,
  handleGetById,
  handleUpdateById,
  handleDeleteById,
};
