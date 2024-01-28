const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
const friendship_controller=require('../controllers/friendship_controller');

router.get('/profile/:id',passport.checkAuthentication ,usersController.profile);
router.get('/profile/profile_picture/:id',passport.checkAuthentication ,usersController.profile_picture);
router.post('/update/:id',passport.checkAuthentication ,usersController.update);
// router.get('/',usersController.users);
router.get('/post',usersController.post);

router.get('/sign-up',usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create',usersController.create);
//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
) ,usersController.createSession);

router.get('/sign-out',usersController.destroySession );
router.get('/provide_email',usersController.provideEmail);
router.post('/provide_email/email_sent',usersController.emailSent);
router.get('/reset_password',usersController.resetPassword);
router.post('/reset_password/:accessToken',usersController.passwordResetDone);

router.get('/profile/:id/toggle_friend', friendship_controller.toggle_friendship);
// router.get('/reset_password',usersController.destroySession );

router.get('/auth/google',passport.authenticate("google",{scope:["profile","email"]}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

module.exports = router;