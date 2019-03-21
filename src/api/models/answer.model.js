const mongoose = require('mongoose');
const AnswerRating = require('./answerRating.model');

const { Schema } = mongoose;

const answerSchema = new Schema(
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
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      username: {
        type: String
      }
    },
    question: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      }
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
    dislikes: Array
  },
  {
    timestamps: true
  }
);

answerSchema.pre('remove', function remove(next) {
  AnswerRating.remove({ answerId: this._id }).exec();
  next();
});

answerSchema.method({
  transform() {
    return {
      id: this.id,
      text: this.text,
      isEdited: this.isEdited,
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount,
      likes: this.likes,
      dislikes: this.dislikes,
      userId: this.user._id,
      username: this.user.username,
      createdAt: this.createdAt
    };
  }
});

answerSchema.statics = {
  list({ page, take }, userId) {
    const skip = take * (page - 1);

    return this.find({ 'question._id': userId })
      .sort({ likesCount: -1 })
      .skip(skip)
      .limit(take)
      .exec();
  }
};

module.exports = mongoose.model('Answer', answerSchema);
