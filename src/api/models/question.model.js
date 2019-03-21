const mongoose = require('mongoose');
const Answer = require('./answer.model');
const QuestionRating = require('./questionRating.model');

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    answers: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    dislikeCount: {
      type: Number,
      default: 0
    },
    likes: Array,
    dislikes: Array,
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      username: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

questionSchema.pre('remove', function remove(next) {
  Answer.remove({ 'question._id': this._id }).exec();
  QuestionRating.remove({ questionId: this._id }).exec();
  next();
});

questionSchema.method({
  transform() {
    return {
      id: this.id,
      text: this.text,
      createdAt: this.createdAt,
      username: this.user.username,
      isEdited: this.isEdited,
      answers: this.answers,
      userId: this.user._id,
      likes: this.likes,
      dislikes: this.dislikes,
      ratings: this.ratings,
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount
    };
  }
});

questionSchema.statics = {
  list({ page, take }) {
    const limit = take * page;

    return this.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  getUserQuestions({ page, take }, userId) {
    const limit = take * page;

    return this.find({ 'user._id': userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
};

module.exports = mongoose.model('Question', questionSchema);
