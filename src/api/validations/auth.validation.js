const Joi = require('joi');

module.exports = {
  register: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(8)
        .max(128),
      name: Joi.string()
        .required()
        .max(128)
    }
  },
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .max(128)
    }
  }
};
