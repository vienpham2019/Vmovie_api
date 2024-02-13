const { CREATED, OK } = require("../core/success.response");
const UserService = require("../service/User.service");

class UserController {
  // Get
  // Create
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered Success!",
      metadata: await UserService.createUser(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  // Update
  updateUserById = async (req, res, next) => {
    new OK({
      message: "Registered Success!",
      metadata: await UserService.updateUserById({
        _id: req.user._id,
        ...req.body,
      }),
    }).send(res);
  };
  // Delete
  deleteUserById = async (req, res, next) => {
    new OK({
      message: "Registered Success!",
      metadata: await UserService.updateUserById(req.body.user_id),
    }).send(res);
  };
}

module.exports = new UserController();
