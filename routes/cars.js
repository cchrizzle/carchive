const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const carsController = require("../controllers/cars");
const { ensureAuth } = require("../middleware/auth");

// Post Routes 
// Since linked from server.js, treat each path as:
// post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, carsController.getCar);

// Enables user to create post w/ cloudinary for media uploads
router.post("/createCar", upload.single("file"), carsController.createCar);

// Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likeCar/:id", carsController.likeCar);

// Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteCar/:id", carsController.deleteCar);

module.exports = router;
