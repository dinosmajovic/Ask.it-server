const Joi = require('joi');

module.exports = {
  createQuestion: {
    body: {
      text: Joi.string().required()
    }
  },
  editQuestion: {
    body: {
      text: Joi.string().required()
    },
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  deleteQuestion: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  getQuestion: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  getAnswers: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    },
    body: {
      page: Joi.number().required(),
      take: Joi.number().required()
    }
  },
  createAnswer: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    },
    body: {
      text: Joi.string().required()
    }
  },
  editAnswer: {
    body: {
      text: Joi.string().required()
    },
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  deleteAnswer: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  getRecentQuestions: {
    body: {
      page: Joi.number().required(),
      take: Joi.number().required()
    }
  }
};
