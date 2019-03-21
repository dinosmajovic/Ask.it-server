const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const APIError = require('../utils/APIError');
const { jwtSecret } = require('../../config/vars');
const Question = require('./question.model');
const Answer = require('./answer.model');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128
    },
    name: {
      type: String,
      required: true,
      maxlength: 128,
      trim: true
    },
    answers: {
      type: Number,
      default: 0
    },
    questions: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Before a user is saved run this method
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

// Before user is saved check if the name is modified
userSchema.pre('save', function save(next) {
  try {
    if (!this.isModified('name')) return next();

    this.needsToUpdateQuestionsWithNewUsername = this.isModified('name');

    return next();
  } catch (error) {
    return next(error);
  }
});

// After the user is saved, if the name is modified, change users question names
userSchema.post('save', function save(doc, next) {
  const user = this;
  if (this.needsToUpdateQuestionsWithNewUsername) {
    Question.update(
      { 'user._id': user._id }, // Find questions related to this user
      { $set: { 'user.username': user.name } }, // Update the username
      { multi: true }, // Options object (update multiple documents)
      (err) => {
        if (err) return next(err);
        return next();
      }
    );

    Answer.update(
      { 'user._id': user._id }, // Find answers related to this user
      { $set: { 'user.username': user.name } }, // Update the username
      { multi: true }, // Options object (update multiple documents)
      (err) => {
        if (err) return next(err);
        return next();
      }
    );
  }
  return next();
});

// Methods
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'createdAt', 'answers', 'questions'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      sub: this._id
    };
    return jwt.sign(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
});

// Statics
userSchema.statics = {
  // Return error message on mongoose duplicate key error
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        status: httpStatus.CONFLICT,
        message: 'Email already exists',
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  },

  getTopUsers() {
    return this.find()
      .sort({ answers: -1 })
      .limit(10)
      .exec();
  },

  async findAndGenerateToken(options) {
    const { email, password } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.NOT_FOUND,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, token: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else {
      err.message = 'Incorrect email';
    }
    throw new APIError(err);
  }
};

module.exports = mongoose.model('User', userSchema);
