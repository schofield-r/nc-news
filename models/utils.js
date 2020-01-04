const connection = require("../db/connection");

exports.checkRowExists = (table, col, value) => {
  return connection
    .select("*")
    .from(table)
    .where(col, "=", value)
    .then(res => {
      if (!res.length) {
        return Promise.reject({ status: 404, msg: col + " not found" });
      } else {
        return [];
      }
    });
};
