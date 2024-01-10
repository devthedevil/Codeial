const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentsController = require('../controllers/comments_controller');
// console.log("Jr");
router.post('/create',passport.checkAuthentication,commentsController.create);


module.exports = router; 