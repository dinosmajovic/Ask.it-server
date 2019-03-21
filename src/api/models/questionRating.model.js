const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionRatingSchema = new Schema(
  {
    like: {
      type: Boolean,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QuestionRating', questionRatingSchema);
