const cloudinary = require('../middleware/cloudinary');
// const Post = require('../models/Post'); // 8/2/24: Change to Car?
const Car = require('../models/Car'); // Added 8/5/24

// 8/2/24: Grabbing from car model?
// copied from posts controller

module.exports = {
  // 8/5/24: Trying out retrieving profile after submitting intro
  submitIntro: async (req, res) => {
    try {
      await Car.create({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        odometer: req.body.odometer,
        user: req.body.user,
      });
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
    }
  },

  // 8/1/24: Loads profile page
  // 8/2/24: Still load profile page, only need this page for user to enter car info
  getProfile: async (req, res) => {
    try {
      // 9:10:00: Since we have a session each request (req) contains the logged-in users' info: req.user
      // 9:13:30: console.log(req.user) to see everything
      // Grabbing just the posts of the logged-in user
      const cars = await Car.find({ user: req.user.id }); // 8/2/24: Change to Car.find?
      // 9:12:20: Sending post data from MongoDb and user data to ejs template
      res.render('profile.ejs', { cars: cars, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // 8/1/24: Loads individual post
  // 9:16:00: Deleted getFeed promise
  getCar: async (req, res) => {
    try {
      /* 8/5/24: Code from template - left for reference but disregard since I changed "post" to "car":
      9:16:30: id parameter comes from the post routes
      router.get("/:id", ensureAuth, postsController.getPost);
      Example URL: http://localhost:2121/post/65ea45ab462fec3e04252f30
      id === 65ea45ab462fec3e04252f30
      */
      const car = await Car.findById(req.params.id);
      res.render('car.ejs', { car: car, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // 8/1/24: Creates post - match fields to models and profile ejs
  // 8/2/24: This is more for refuels - createCar method?
  createCar: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // 9:19:10: Media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Car.create({
        date: req.body.date,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        odometer: req.body.odometer,
        gallons: req.body.gallons,
        costPerGallon: req.body.costPerGallon,
        user: req.user.id,
      });
      console.log('New refuel added!');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
    }
  },
  likeCar: async (req, res) => {
    try {
      await Car.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log('Likes +1');
      res.redirect(`/car/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteCar: async (req, res) => {
    try {
      // Find post by id
      let post = await Car.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Car.remove({ _id: req.params.id });
      console.log('Deleted Car');
      res.redirect('/profile');
    } catch (err) {
      res.redirect('/profile');
    }
  },
};
