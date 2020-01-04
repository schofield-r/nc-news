// const knex = require("knex");
// const dbConfig = require("../knexfile.js");

// const connection = knex(dbConfig);

// module.exports = connection;
const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

module.exports = knex(dbConfig);
