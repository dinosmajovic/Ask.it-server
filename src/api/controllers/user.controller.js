const httpStatus = require('http-status');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const APIError = require('../utils/APIError');

exports.getTopUsers = async (req, res, next) => {
  try {
    const users = await User.getTopUsers();
    const transformedUsers = users.map(user => user.transform());

    res.json(transformedUsers);
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Could not fetch top users.'
      })
    );
  }
};

exports.getUserQuestions = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'User not found.'
    });
  } else {
    const questions = await Question.getUserQuestions(req.body, req.params.userId);
    const transformedQuestions = questions.map(question => question.transform());

    const count = await Question.count({ 'user._id': req.params.userId });

    res.json({
      questions: transformedQuestions,
      count
    });
  }
};

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate('ratings')
      .exec();
    res.json(user);
    // res.json(user.transform());
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'User not found'
      })
    );
  }
};

exports.updateUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user
    .save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)));
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.password = req.body.password;
    user.save().then(res.json({ message: 'Successfully changed password' }));
  } catch (error) {
    next(
      new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'User not found'
      })
    );
  }
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  user.save().then(() => {
    req.user = null;
    res.status(httpStatus.OK).json({ message: 'Account has been deleted.' });
  });
};
