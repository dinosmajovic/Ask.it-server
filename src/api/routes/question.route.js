const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/question.controller');
const { authorize } = require('../middlewares/auth');
const {
  createQuestion,
  editQuestion,
  deleteQuestion,
  getQuestion,
  createAnswer,
  editAnswer,
  deleteAnswer,
  getRecentQuestions,
  getAnswers
} = require('../validations/question.validation');

const router = express.Router();

router.route('/recent').post(validate(getRecentQuestions), controller.getRecentQuestions);
router.route('/hot').get(controller.getHotQuestions);

router.route('/').post(validate(createQuestion), authorize, controller.createQuestion);
router
  .route('/:id')
  .get(validate(getQuestion), controller.getQuestion)
  .put(validate(editQuestion), authorize, controller.editQuestion)
  .delete(validate(deleteQuestion), authorize, controller.deleteQuestion);

router.route('/:id/answer').post(validate(createAnswer), authorize, controller.createAnswer);
router.route('/:id/answers').post(validate(getAnswers), controller.getAnswers);
router
  .route('/answer/:id')
  .put(validate(editAnswer), authorize, controller.editAnswer)
  .delete(validate(deleteAnswer), authorize, controller.deleteAnswer);

module.exports = router;
