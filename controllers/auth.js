const passport = require('passport');
const validator = require('validator');
const User = require('../models/User');

exports.getTest = (req, res) => {
  if (req.user) {
    res.render('test')
    // return res.redirect('/test');    // 8/13/24: Not redirecting properly, commented out to test res.render.     - OMG IT WORKED!!!!!!
    // Own notes after rendering test.ejs: why didn't this method work when I had it in test controller? The only diff here is I have the check for if user is logged in, but I don't see how that would make a difference
  }
  // res.render('test', {   // 8/13/24: Commenting these out bc it's redundant of above
  //   title: 'Test',
  // });
}

exports.getIntro = (req, res) => {
  console.log(req)
  if(req.user) {
    if (!User.isSetupComplete) {
      return res.render('intro');
    }
    res.redirect('/profile')
  }
}


// 8/14/24 night left off - finish rest of method (submit, redirect)
exports.submitIntro = (req, res) => {
  const car = new Car({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    odometer: req.body.odometer,
    owner: req.user.id
  });
}

exports.getLogin = (req, res) => {
  // console.log(req);
  if (req.user) {
    // 8/5/24: Checking if this is first login; if so direct to intro page
    // if (!User.isSetupComplete) {
    //   return res.redirect('/intro');
    // }
    // ^ End of added
    return res.redirect('/profile');   // 8/8/24: changed from /profile to /test - 8/13/24: changed back to profile
  }
  res.render('login', {
    title: 'Login',
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      // 8/5/24: Checking if this is first login; if so direct to intro page
      // if (!user.isSetupComplete) {
      //   return res.redirect('/intro');
      // }
      // ^ End of added code
      res.redirect(req.session.returnTo || '/profile');    // 8/8/24: changed from "/profile" to "/test"  - 8/13/24: changed back to profile
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.');
  });
  req.session.destroy((err) => {
    if (err)
      console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    // 8/5/24: Checking if this is first login; if so direct to intro page
    // if (!user.isSetupComplete) {
    //   return res.redirect('/intro');
    // }
    // ^ End of added code
    return res.redirect('/profile');    // 8/8/24: changed from "/profile" to "/test" - 8/13/24: changed back to "profile"
  }
  res.render('signup', {
    title: 'Create Account',
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: 'Password must be at least 8 characters long',
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('../signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    isSetupComplete: req.body.isSetupComplete,
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash('errors', {
          msg: 'Account with that email address or username already exists.',
        });
        return res.redirect('../signup');
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // 8/5/24: Checking if this is first login; if so direct to intro page
          // if (!user.isSetupComplete) {
            // res.render("intro.ejs")
            // return res.redirect('/intro');
            // res.render('intro', {
            //   title: 'Enter car details',
            // })
          // }
          // res.render('intro', {
          //   title: 'Enter car details',
          // });
          // ^ End of added code
          res.redirect('/profile');    // 8/8/24: changed from "/profile" to "/test" - 8/13/24: changed back to "profile"
        });
      });
    }
  );
};
