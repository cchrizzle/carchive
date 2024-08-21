const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const refuelsController = require("../controllers/refuels");
const { ensureAuth } = require("../middleware/auth");

// Post Routes 
// Since linked from server.js, treat each path as:
// post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, refuelsController.getRefuel);

// Enables user to create post w/ cloudinary for media uploads
router.post("/createRefuel", upload.single("file"), refuelsController.createRefuel);

// Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likeRefuel/:id", refuelsController.likeRefuel);

// Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteRefuel/:id", refuelsController.deleteRefuel);

module.exports = router;
