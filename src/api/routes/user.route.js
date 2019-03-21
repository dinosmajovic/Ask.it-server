const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/user.controller');
const { authorize } = require('../middlewares/auth');
const {
  updateUser,
  getUser,
  updatePassword,
  getUserQuestions
} = require('../validations/user.validation');

const router = express.Router();

router.get('/top', controller.getTopUsers);

router.get('/profile/:userId', validate(getUser), controller.getUser);

router
  .route('/profile')
  .put(validate(updateUser), authorize, controller.updateUser)
  .delete(authorize, controller.deleteUser);

router
  .route('/profile/password')
  .put(validate(updatePassword), authorize, controller.updatePassword);

router
  .route('/profile/:userId/questions')
  .post(validate(getUserQuestions), controller.getUserQuestions);

module.exports = router;
