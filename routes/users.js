const controller = require("../controllers/users");
const validateToken = require("../utils").validateToken;

// our controllers are esentially middleware functions passed to our other routing middleware

module.exports = router => {
  router
    .route("/users")
    .post(controller.add)
    //If validateToken throws an error, controller.getAll won't be called. Also, if it sends a response with an error, since we haven't called next in our else block, getAll won't be called either.
    .get(validateToken, controller.getAll);

  router.route("/login").post(controller.login);
};
