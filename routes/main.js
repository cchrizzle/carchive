const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const carsController = require("../controllers/cars");
const { ensureAuth } = require("../middleware/auth");

// Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, carsController.getProfile);

// Routes for user login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.carLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.carSignup);

// Setup
router.get('/intro', carsController.getIntro)       // 7/26/24: Added intro route

module.exports = router;
