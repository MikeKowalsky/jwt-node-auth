require("dotenv").config(); // Sets up dotenv as soon as our application starts

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;
const stage = require("./config")[environment];

const routes = require("./routes/index.js");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

if (environment !== "production") {
  app.use(logger("dev"));
}

app.use("/api/v1", routes(router));

const connUri = process.env.MONGO_LOCAL_CONN_URL;
mongoose
  .connect(
    connUri,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(`${stage.port}`, () =>
      console.log(`Server at localhost:${stage.port} && MongoDB connected`)
    );
  })
  .catch(err => console.log(err));
