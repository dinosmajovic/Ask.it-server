const mongoose = require('mongoose');

const { Schema } = mongoose;

const answerRatingSchema = new Schema(
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
    answerId: {
      type: Schema.Types.ObjectId,
      ref: 'Answer',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AnswerRating', answerRatingSchema);
