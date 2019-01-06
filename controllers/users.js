const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports = {
  add: (req, res) => {
    let result = {};
    let status = 201;

    const { name, password } = req.body;
    const user = new User({ name, password });
    user.save((err, user) => {
      if (!err) {
        result.status = status;
        result.result = user;
      } else {
        status = 500;
        result.status = status;
        result.error = err;
      }
      res.status(status).send(result);
    });
  },
  login: (req, res) => {
    const { name, password } = req.body;

    let result = {};
    let status = 200;

    User.findOne({ name }, (err, user) => {
      if (!err && user) {
        // We could compare passwords in our model instead of below
        bcrypt
          .compare(password, user.password)
          .then(match => {
            if (match) {
              //Create a token
              const payload = { user: user.name };
              const options = {
                expiresIn: "24h",
                issuer: "www.mike.com"
              };
              const secret = process.env.JWT_SECRET;
              const token = jwt.sign(payload, secret, options);
              // console.log(token);

              result.token = token;
              result.status = status;
              result.result = user;
            } else {
              status = 401;
              result.status = status;
              result.error = "Authentication error";
            }
            res.status(status).send(result);
          })
          .catch(err => {
            status = 500;
            result.status = 500;
            result.error = err;
            res.status(status).send(result);
          });
      } else {
        status = 404;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  },
  getAll: (req, res) => {
    let status = 200;
    let result = {};

    const payload = req.decoded;

    // allow only username: admin to see list of all users
    if (payload && payload.user === "admin") {
      User.find({}, (err, users) => {
        if (!err) {
          result.status = status;
          // result.error = err;
          result.result = users;
        } else {
          status = 500;
          result.status = status;
          result.error = err;
        }
        res.status(status).send(users);
      });
    } else {
      status = 401;
      result.status = status;
      result.error = `Authentication error`;
      res.status(status).send(result);
    }
  }
};
