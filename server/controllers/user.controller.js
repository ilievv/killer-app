'use strict';

const jsonWebToken = require('jsonwebtoken');

module.exports = function ({userData, config}) {

  const webTokenSecret = config.webTokenSecret;

  function login(req, res) {
    const webTokenObject = {
      _id: req.user.id,
      username: req.user.username
    };

    res.status(200).json({
      username: req.user.username,
      auth_token: jsonWebToken.sign(webTokenObject, webTokenSecret)
    });
  }

  function profile(req, res) {
    const userJson = JSON.parse(JSON.stringify(req.user));
    delete userJson.password;
    res.status(200).json(userJson);
  }

  function register(req, res) {
    if (req.user) {
      return res.status(400).json({ message: 'User already logged in.' });
    }

    const userObject = req.body;
    return userData.getUserByUsername(userObject.username)
      .then(user => {
        if (user) {
          throw new Error('Username already exists.');
        }
      })
      .then(() => {
        return userData.createUser(userObject);
      })
      .then(() => {
        res.status(200).json({ message: 'PUT /api/users' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err.message });
      });
  }

  return {
    login,
    profile,
    register
  };
};