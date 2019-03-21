const Joi = require('joi');

module.exports = {
  updateUser: {
    body: {
      email: Joi.string().email(),
      name: Joi.string().max(128)
    }
  },
  updatePassword: {
    body: {
      password: Joi.string()
        .required()
        .min(8)
        .max(128),
      confirmPassword: Joi.string()
        .required()
        .min(8)
        .max(128)
        .valid(Joi.ref('password'))
    }
  },
  getUser: {
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  getUserQuestions: {
    body: {
      page: Joi.number().required(),
      take: Joi.number().required()
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
