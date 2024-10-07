const cloudinary = require('../middleware/cloudinary');
const Refuel = require('../models/Refuel');
const Car = require('../models/Car');


module.exports = {
  // 8/1/24: Loads profile page
  getProfile: async (req, res) => {
    // console.log('getProfile req.body????', Object.keys(res))
    // console.log(req)
    try {
      // 9:10:00: Since we have a session each request (req) contains the logged-in users' info: req.user
      // 9:13:30: console.log(req.user) to see everything
      // Grabbing just the refuels of the logged-in user
      const refuels = await Refuel.find({ user: req.user.id });
      // 9:12:20: Sending refuel data from MongoDb and user data to ejs template
      const cars = await Car.find({user: req.user.id });

      // 10/2/24 angelplusultra: keep logic here in controller and pass to view
      const receipts = await Refuel.find().populate('carId')
      const carReceipts = await Car.find().populate('refuels')    // 10/3/24: "refuels" is array of refuel IDs; populate takes IDs and joins them to table - pass carReceipts into view
      console.log('###', carReceipts)
      console.log('!!!', receipts)





      // Saturday Meetup Caleb
      const findCarBasedOnRefuelId = (refuelId, {cars}) => {
        const foo =  cars.find(car => {
          return car._id.toString() === refuelId.toString();
        })
        console.log('$$$', findCarBasedOnRefuelId)

          // for (const key in cars) {
          //   const car = cars
          //   if(car[key]._id === refuelId) {
          //     return 
          //   }
          // }
          // console.log('!!!', foo, typeof cars, Array.isArray(cars), cars[0]._id, refuelId)
        return foo
      }
      //
      
      // 9/28/24: going off of what Caleb helped me with above to tie refuel to cars
      // const findRefuelBasedOnCarId = (carId, {refuels}) => {
      //   const test = refuels.find(refuel => {
      //     return refuelId.toString() === carId.toString();
      //   })
      // }
      
      // console.log("+++", findRefuelBasedOnCarId());
      
      // console.log({cars, refuels})
      res.render('profile.ejs', { findCarBasedOnRefuelId
        ,cars: cars, refuels: refuels, user: req.user });  // 8/31/24: Tyler - can calculate mpg and pass in here
    } catch (err) {
      console.log('xxx', err);
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
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // 9:19:10: Media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      const newRefuel = await Refuel.create({
        date: req.body.date,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        odometer: req.body.odometer,
        gallons: req.body.gallons,
        costPerGallon: req.body.costPerGallon,
        totalCost: req.body.totalCost,
        user: req.user.id,
        carId: req.body.carId,
        createdAt: req.body.createdAt,
      });
    
      await Car.updateOne({_id: req.body.carId}, {$push:{refuels: newRefuel.id}})
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
      let refuel = await Refuel.findById({ _id: req.params.id });
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
