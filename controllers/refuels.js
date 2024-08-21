const cloudinary = require('../middleware/cloudinary');
const Refuel = require('../models/Refuel');

module.exports = {
  // 8/1/24: Loads profile page
  getProfile: async (req, res) => {
    try {
      // 9:10:00: Since we have a session each request (req) contains the logged-in users' info: req.user
      // 9:13:30: console.log(req.user) to see everything
      // Grabbing just the posts of the logged-in user
      const refuels = await Refuel.find({ user: req.user.id });
      // 9:12:20: Sending post data from MongoDb and user data to ejs template
      res.render('profile.ejs', { refuels: refuels, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // 8/1/24: Loads individual post
  // 9:16:00: Deleted getFeed promise
  getRefuel: async (req, res) => {
    try {
      // 9:16:30: id parameter comes from the poste routes
      // router.get("/:id", ensureAuth, postsController.getPost);
      // Example URL: http://localhost:2121/post/65ea45ab462fec3e04252f30
      // id === 65ea45ab462fec3e04252f30
      const refuel = await Refuel.findById(req.params.id);
      res.render('refuel.ejs', { refuel: refuel, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // 8/1/24: Creates post - match fields to models and profile ejs
  createRefuel: async (req, res) => {
    console.log(req)
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // 9:19:10: Media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Refuel.create({
        date: req.body.date,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        odometer: req.body.odometer,
        gallons: req.body.gallons,
        costPerGallon: req.body.costPerGallon,
        user: req.user.id,
        createdAt: req.body.createdAt,
      });
      console.log('New refuel added!');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
    }
  },
  likeRefuel: async (req, res) => {
    try {
      await Refuel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log('Likes +1');
      res.redirect(`/refuel/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRefuel: async (req, res) => {
    try {
      // Find post by id
      let refuel = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(refuel.cloudinaryId);
      // Delete post from db
      await Refuel.remove({ _id: req.params.id });
      console.log('Deleted Refuel');
      res.redirect('/profile');
    } catch (err) {
      res.redirect('/profile');
    }
  },
};
