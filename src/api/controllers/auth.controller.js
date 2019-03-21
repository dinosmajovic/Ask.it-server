const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/vars');
const APIError = require('../utils/APIError');
const User = require('../models/user.model');

exports.register = async (req, res, next) => {
  try {
    const user = await new User(req.body).save();
    const userTransformed = user.transform();
    const token = user.token();
    userTransformed.token = token;
    res.status(httpStatus.CREATED);
    return res.json(userTransformed);
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, token } = await User.findAndGenerateToken(req.body);
    const userTransformed = user.transform();
    userTransformed.token = token;
    return res.json(userTransformed);
  } catch (error) {
    return next(error);
  }
};

exports.loginWithToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers.authorization;
    const decode = await jwt.verify(token, jwtSecret);
    const user = await User.findById(decode.sub);
    const userTransformed = user.transform();

    return res.json(userTransformed);
  } catch (error) {
    const apiError = new APIError({
      message: error.message,
      status: httpStatus.NOT_FOUND
    });

    return next(apiError);
  }
};
