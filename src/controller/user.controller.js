const { CREATED } = require("../core/success.response");
const UserService = require("../service/User.service");

class UserController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered Success!",
      metadata: await UserService.createUser(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new UserController();
