const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const questionRoutes = require('./question.route');
const ratingRoutes = require('./rating.route');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/status', authorize, (req, res) => res.send(req.user));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/rating', ratingRoutes);

module.exports = router;
