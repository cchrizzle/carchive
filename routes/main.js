const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const refuelsController = require('../controllers/refuels');
const { ensureAuth } = require('../middleware/auth');

// Main Routes - simplified for now
router.get('/', homeController.getIndex);
router.get('/profile', ensureAuth, refuelsController.getProfile);

// Routes for user login/signup
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// Route for intro - 8/5/24: don't think I need this since I just added boolean for checking if user completed setup to bring intro - nvm think I do need since I have the intro post in my "intro" view
// router.post('/intro', ensureAuth, authController.postLogin);
// router.get('/intro', ensureAuth, authController.getLogin);
router.get('/intro', ensureAuth, authController.getIntro);
// router.get('/intro', ensureAuth, authController.getLogin);

// 8/7/24: post request for intro should set isSetupComplete to true and load profile
// router.post('/introSubmit', ensureAuth, authController.introSubmit)      // 8/8/24: commented out for now since it's messing with test.ejs

// 8/5/24: Might not need below since I replaced with intro above - nvm need since clicking signup leads to /signup, but I think I can add the checks for if user entered car details in the "getSignup" and "postSignup" methods
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// 8/8/24: Trying test - 8/13/24 re-enabled & disabled test route
router.get('/test', ensureAuth, authController.getTest)

module.exports = router;
