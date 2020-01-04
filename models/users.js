const connection = require("../db/connection");

exports.fetchUserByUsername = username => {
  return connection("users")
    .where("username", username)
    .returning("*")
    .then(user => {
      if (!user.length) {
        return Promise.reject({
          status: 404,
          msg: "username " + username + " does not exists"
        });
      } else return user[0];
    });
};
exports.createNewUser = user => {
  return connection("users")
    .insert({
      username: user.username,
      name: user.name,
      avatar_url: user.avatar_url
    })
    .returning("*");
};
exports.fetchUsers = () => {
  return connection
    .select("*")
    .from("users")
    .returning("*");
};
