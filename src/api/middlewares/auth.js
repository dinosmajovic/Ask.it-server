const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { jwtSecret } = require('../../config/vars');
const APIError = require('../utils/APIError');
const User = require('../models/user.model');

exports.authorize = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers.authorization;
    const decode = await jwt.verify(token, jwtSecret);
    const user = await User.findById(decode.sub);

    req.user = user.transform();

    return next();
  } catch (error) {
    const apiError = new APIError({
      message: error.message,
      status: httpStatus.UNAUTHORIZED
    });

    return next(apiError);
  }
};
