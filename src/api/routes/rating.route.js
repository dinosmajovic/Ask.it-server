const express = require('express');
const questionController = require('../controllers/questionRating.controller');
const answerController = require('../controllers/answerRating.controller');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/question/:id/like')
  .post(authorize, questionController.addQuestionLike)
  .delete(authorize, questionController.removeQuestionLike);

router
  .route('/question/:id/dislike')
  .post(authorize, questionController.addQuestionDislike)
  .delete(authorize, questionController.removeQuestionDislike);

router
  .route('/answer/:id/like')
  .post(authorize, answerController.addAnswerLike)
  .delete(authorize, answerController.removeAnswerLike);

router
  .route('/answer/:id/dislike')
  .post(authorize, answerController.addAnswerDislike)
  .delete(authorize, answerController.removeAnswerDislike);

module.exports = router;
