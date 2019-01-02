const controller = require("../controllers/users");
const validateToken = require("../utils").validateToken;

// our controllers are esentially middleware functions passed to our other routing middleware

module.exports = router => {
  router
    .route("/users")
    .post(controller.add)
    .get(validateToken, controller.getAll);
  //If validateToken throws an error, controller.getAll won't be called. Also, if it sends a response with an error, since we haven't called next in our else block, getAll won't be called either.

  router.route("/login").post(controller.login);
};
