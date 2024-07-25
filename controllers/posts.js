const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
  getProfile: async (req, res) => {
    try {
      // 9:10:00: Since we have a session each request (req) contains the logged-in users' info: req.user
      // 9:13:30: console.log(req.user) to see everything
      // Grabbing just the posts of the logged-in user
      const posts = await Post.find({ user: req.user.id });
      // 9:12:20: Sending post data from MongoDb and user data to ejs template
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
// 9:16:00: Deleted getFeed promise
  getPost: async (req, res) => {
    try {
      // 9:16:30: id parameter comes from the poste routes
      // router.get("/:id", ensureAuth, postsController.getPost);
      // Example URL: http://localhost:2121/post/65ea45ab462fec3e04252f30
      // id === 65ea45ab462fec3e04252f30
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // 9:19:10: Media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
