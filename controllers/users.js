const { fetchUserByUsername, createNewUser,fetchUsers } = require("../models/users");

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const  user  = req.body;
  createNewUser(user)
    .then(user => {
      res.status(201).send({ user:user[0] });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};
