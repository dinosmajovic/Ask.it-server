const httpStatus = require('http-status');
const mongoose = require('mongoose');
const QuestionRating = require('../models/questionRating.model');
const Question = require('../models/question.model');
const APIError = require('../utils/APIError');

exports.addQuestionLike = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Question does not exist'
        })
      );
    }

    const ratingExists = await QuestionRating.findOne({
      userId: req.user.id,
      questionId: req.params.id
    });

    if (ratingExists && ratingExists.like) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Rating already exists'
        })
      );
    }

    if (ratingExists && !ratingExists.like) {
      await ratingExists.remove();

      await question.update({
        $inc: {
          dislikeCount: -1
        },
        $pull: {
          dislikes: new mongoose.Types.ObjectId(req.user.id)
        }
      });
    }

    const rating = {
      like: true,
      userId: req.user.id,
      questionId: req.params.id
    };

    await QuestionRating.create(rating);

    await question.update({
      $inc: {
        likeCount: 1
      },
      $push: {
        likes: new mongoose.Types.ObjectId(req.user.id)
      }
    });

    return res.send({ message: 'Rating successfully created.' });
  } catch (error) {
    return next(error);
  }
};

exports.removeQuestionLike = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Question does not exist'
        })
      );
    }

    const ratingExists = await QuestionRating.findOne({
      userId: req.user.id,
      questionId: req.params.id
    });

    if (!ratingExists || !ratingExists.like) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Rating does not exist.'
        })
      );
    }

    await ratingExists.remove();

    await question.update({
      $inc: {
        likeCount: -1
      },
      $pull: {
        likes: new mongoose.Types.ObjectId(req.user.id)
      }
    });

    return res.send({ message: 'Rating successfully removed.' });
  } catch (error) {
    return next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Error while deleting rating.'
      })
    );
  }
};

exports.addQuestionDislike = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Question does not exist'
        })
      );
    }

    const ratingExists = await QuestionRating.findOne({
      userId: req.user.id,
      questionId: req.params.id
    });

    if (ratingExists && !ratingExists.like) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Rating already exists'
        })
      );
    }

    if (ratingExists && ratingExists.like) {
      await ratingExists.remove();

      await question.update({
        $inc: {
          likeCount: -1
        },
        $pull: {
          likes: new mongoose.Types.ObjectId(req.user.id)
        }
      });
    }

    const rating = {
      like: false,
      userId: req.user.id,
      questionId: req.params.id
    };

    await QuestionRating.create(rating);

    await question.update({
      $inc: {
        dislikeCount: 1
      },
      $push: {
        dislikes: new mongoose.Types.ObjectId(req.user.id)
      }
    });

    return res.send({ message: 'Rating successfully created.' });
  } catch (error) {
    return next(error);
  }
};

exports.removeQuestionDislike = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Question does not exist'
        })
      );
    }

    const ratingExists = await QuestionRating.findOne({
      userId: req.user.id,
      questionId: req.params.id
    });

    if (!ratingExists || ratingExists.like) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Rating does not exist.'
        })
      );
    }

    await ratingExists.remove();

    await question.update({
      $inc: {
        dislikeCount: -1
      },
      $pull: {
        dislikes: new mongoose.Types.ObjectId(req.user.id)
      }
    });

    return res.send({ message: 'Rating successfully removed.' });
  } catch (error) {
    return next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Error while deleting rating.'
      })
    );
  }
};
