// const express = require("express");
// const router = express.Router();
// const testController = require("../controllers/test");
// const { ensureAuth } = require("../middleware/auth");

// Post Routes 
// Since linked from server.js, treat each path as:
// post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
// router.get("/test", ensureAuth, testController.getTest);

// // Enables user to create post w/ cloudinary for media uploads
// router.post("/createPost", upload.single("file"), testController.createPost);

// // Enables user to like post. In controller, uses POST model to update likes by 1
// router.put("/likePost/:id", testController.likePost);

// // Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
// router.delete("/deletePost/:id", testController.deletePost);

// module.exports = router;
