// @ts-check
const cloudinary = require('../middleware/cloudinary');
// const Post = require('../models/Post'); // 8/2/24: Change to Car?
const Car = require('../models/Car'); // Added 8/5/24
const User = require('../models/User');

// 8/2/24: Grabbing from car model?
// copied from posts controller

module.exports = {
  // 8/22/24: Moved getIntro here from auth controller
  getIntro: (req, res) => {
    if(req.user) {
      if (!User.isSetupComplete) {
        return res.render('intro');
      }
      res.redirect('/profile')
    }
  },

  // 8/5/24: Trying out retrieving profile after submitting intro
  // 8/22/24: submitIntro is also in auth controller
  // 8/26/24: Commented out, using createCar instead
  // submitIntro: async (req, res) => {
  //   try {
  //     await Car.create({
  //       make: req.body.carMake,
  //       model: req.body.carModel,
  //       year: req.body.carYear,
  //       odometer: req.body.odometer,
  //       user: req.body.user,
  //     });
  //     console.log('New car added!');
  //     res.redirect('/profile');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
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
    console.log(req)
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      // 9:19:10: Media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Car.create({
        // date: req.body.date,
        // image: result.secure_url,
        // cloudinaryId: result.public_id,
        // odometer: req.body.odometer,
        // gallons: req.body.gallons,
        // costPerGallon: req.body.costPerGallon,
        // user: req.user.id,
        carMake: req.body.carMake,
        carModel: req.body.carModel,
        carYear: req.body.carYear,
        odometer: req.body.odometer,
        user: req.user._id,
      });
      console.log('New car added!');
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
