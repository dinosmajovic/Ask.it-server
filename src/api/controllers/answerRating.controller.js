const httpStatus = require('http-status');
const mongoose = require('mongoose');
const AnswerRating = require('../models/answerRating.model');
const Answer = require('../models/answer.model');
const APIError = require('../utils/APIError');

exports.addAnswerLike = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Answer does not exist'
        })
      );
    }

    const ratingExists = await AnswerRating.findOne({
      userId: req.user.id,
      answerId: req.params.id
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

      await answer.update({
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
      answerId: req.params.id
    };

    await AnswerRating.create(rating);

    await answer.update({
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

exports.removeAnswerLike = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Answer does not exist'
        })
      );
    }

    const ratingExists = await AnswerRating.findOne({
      userId: req.user.id,
      answerId: req.params.id
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

    await answer.update({
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

exports.addAnswerDislike = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Answer does not exist'
        })
      );
    }

    const ratingExists = await AnswerRating.findOne({
      userId: req.user.id,
      answerId: req.params.id
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

      await answer.update({
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
      answerId: req.params.id
    };

    await AnswerRating.create(rating);

    await answer.update({
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

exports.removeAnswerDislike = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'Answer does not exist'
        })
      );
    }

    const ratingExists = await AnswerRating.findOne({
      userId: req.user.id,
      answerId: req.params.id
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

    await answer.update({
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
