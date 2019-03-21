const httpStatus = require('http-status');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const APIError = require('../utils/APIError');

exports.getRecentQuestions = async (req, res, next) => {
  try {
    const questions = await Question.list(req.body);
    const transformedQuestions = questions.map(question => question.transform());
    const count = await Question.count();

    res.json({
      questions: transformedQuestions,
      count
    });
  } catch (error) {
    next(error);
  }
};

exports.getHotQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .sort({ likes: -1 })
      .limit(10)
      .exec();

    const transformedQuestions = questions.map(question => question.transform());

    res.json(transformedQuestions);
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Unable to get hot questions.'
      })
    );
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    const transformedQuestion = question.transform();

    res.json(transformedQuestion);
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Question does not exist.'
      })
    );
  }
};

exports.getAnswers = async (req, res, next) => {
  try {
    const answers = await Answer.list(req.body, req.params.id);

    const transformedAnswers = answers.map(answer => answer.transform());

    res.json(transformedAnswers);
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const newQuestion = {
      text: req.body.text,
      user: {
        _id: user._id,
        username: user.name
      }
    };

    const question = await Question.create(newQuestion);
    question
      .save()
      .then(res.status(httpStatus.CREATED).send({ message: 'Question successfuly created.' }));

    await user.update({
      $inc: {
        questions: 1
      }
    });
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Error while creating question'
      })
    );
  }
};

exports.editQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (String(question.user._id) !== String(req.user.id)) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'You are not authorized to perform this request.'
      });
    }

    if (req.body.text !== question.text) {
      question.isEdited = true;
    }

    question.text = req.body.text || question.text;

    question.save().then(res.json({ message: 'Succeessfully updated question' }));
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Question was not found.'
      })
    );
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Question was not found.'
        })
      );
    }

    if (String(question.user._id) !== String(req.user.id)) {
      return next(
        new APIError({
          status: httpStatus.UNAUTHORIZED,
          message: 'You are not authorized to perform this request.'
        })
      );
    }

    const user = await User.findById(req.user.id);

    await question.remove();

    await user.update({
      $inc: {
        questions: -1
      }
    });

    return res.status(httpStatus.OK).json({
      message: 'Question was successfully deleted.'
    });
  } catch (error) {
    return next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Question was not found.'
      })
    );
  }
};

exports.createAnswer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const question = await Question.findById(req.params.id);
    if (!question) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Question not found'
        })
      );
    }

    const newAnswer = {
      text: req.body.text,
      user: {
        _id: user._id,
        username: user.name
      },
      question: {
        _id: req.params.id
      }
    };

    await Answer.create(newAnswer);

    await user.update({
      $inc: {
        answers: 1
      }
    });

    await question.update({
      $inc: {
        answers: 1
      }
    });

    return res.status(httpStatus.CREATED).send({ message: 'Answer successfuly created.' });
  } catch (error) {
    return next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'User not found'
      })
    );
  }
};

exports.editAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (String(answer.user._id) !== String(req.user.id)) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'You are not authorized to perform this request.'
      });
    }

    if (req.body.text !== answer.text) {
      answer.isEdited = true;
    }

    answer.text = req.body.text || answer.text;

    answer.save().then(res.json({ message: 'Succeessfully updated answer' }));
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Answer was not found.'
      })
    );
  }
};

exports.deleteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Answer was not found.'
        })
      );
    }

    if (String(answer.user._id) !== String(req.user.id)) {
      return next(
        new APIError({
          status: httpStatus.UNAUTHORIZED,
          message: 'You are not authorized to perform this request.'
        })
      );
    }

    const question = await Question.findById(answer.question._id);
    const user = await User.findById(req.user.id);

    await answer.remove();

    await user.update({
      $inc: {
        answers: -1
      }
    });

    await question.update({
      $inc: {
        answers: -1
      }
    });

    return res.status(httpStatus.OK).json({
      message: 'Answer was successfully deleted.'
    });
  } catch (error) {
    return next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Answer was not found.'
      })
    );
  }
};
