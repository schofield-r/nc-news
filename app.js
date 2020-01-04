const express = require("express");
const app = express();
const apiRouter = require("./routes/api.js");
const {
  customErrors,
  psqlErrors,
  send405,
  send500,
  send404
} = require("./errors/index");

app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", send404);
app.use(customErrors);
app.use(psqlErrors);
app.use(send405);
app.use(send500);

module.exports = app;
