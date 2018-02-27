var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../models/user');
var Blog = require('../models/blog');
var mid = require('../middleware');
//Routes
router.get('/', function(req, res, next) {
  res.render('home', {
    title: 'Hello World',
    headerSub: 'My name is Nathan. I like to code. I am passionate about learning the lastest and greatest web technologies in order to deliver novel and beautiful digital products to the masses.'
  })
})
router.get('/about', (req, res, next) => {
  res.render('about', {
    title: 'About Me',
    headerSub: 'My name is Nathan. I like to code. I am passionate about learning the lastest and greatest web technologies in order to deliver novel and beautiful digital products to the masses.'
  });
});

router.get('/contact', (req, res, next) => {
  res.render('contact', {
    title: 'Contact Me',
    headerSub: 'Hit me up. I would be glad to hear from you concerning anything. Be like Jodie Foster. Get meta and nodemailer me.'
  });
});

router.post('/contact', function(req, res, next) {

  //Simple form validation
  if (req.body.name && req.body.email && req.body.message && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        });

        // setup email data with unicode symbols
        let mailOptions = {
          from: req.body.email,
          to: process.env.MAIL_EMAIL,
          subject: 'Website Contact Form',
          text: 'From: ' + req.body.name + '. Here is there message: ' + req.body.message
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            res.render('contact', {
              title: "Contact Error",
              msg: "There was an error sending your message. Please try again later or contact Nathan through one of his social media links."
            });
          } else {
            res.render('contact', {
              title: "Contact Me",
              msg: "Message successful. Happy continued browsing."
            });
          }
        });
  } else {
    var err = new Error('Name, email(actual) and message are required');
    res.render('contact', {
      title: 'Contact Error',
      msg: err
    });
  }
});

router.get('/portfolio', (req, res, next) => {
  res.render('portfolio', {title: 'My Work'});
});

router.get('/blog', (req, res, next) => {

  Blog.find({}).sort({date: -1}).exec(function(err, posts) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      res.render('blog', {
        title: 'Blog',
        headerSub: 'This blog is rendered via a tiny CMS I built. I plan to add more functionality a bit later. Nebuals of ideas from yours truly. These musings will probably be about coding. And some of them may not.',
        posts
      });
    }
  });
});

router.get('/blog-post', mid.requiresLogin, (req, res, next) => {
  res.render('blog-post', {
    title: 'Post That Blog',
    headerSub: 'What are you going to tell them, today?'
  });
});

router.post('/blog-post', mid.requiresLogin, (req, res, next) => {
  if (req.body.title && req.body.post && req.session.userId) {

    var blogData = {
      title: req.body.title,
      text: req.body.post
    }

    Blog.create(blogData, function(err, blog) {
      if (err) {
        console.log(err)
        return next(err);
      } else {
        res.redirect('/blog');
      }
    });

  } else {
    var err = new Error('Fill out the form, man.');
    res.render('blog-post', {
      title: 'Blog Post Error',
      msg: 'It didn\'t post for some reason.'
    });
  }
});

router.get('/register', mid.loggedOut, (req, res, next) => {
  res.render('register', {
    title: 'Sign Up',
    headerSub: 'Sign up for what you say? We will see.'
  })
});

router.post('/register', (req, res, next) => {
  if (req.body.email && req.body.name && req.body.password && req.body.confirmPassword) {
    //confirm passords
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match, friend.');
      res.render('register', {
        title: 'Registration Error',
        msg: err
      });
    }

    //create object with form input
    var userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    // use mongoose schema 'create' to insert object in mongodb
    User.create(userData, function(err, user) {
      if (err) {
        return next(err);
      } else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });

  } else {
    var err = new Error('All fields required, friend.');
    res.render('register', {
      title: 'Registration Error',
      msg: err
    });
  }
});

router.get('/login', mid.loggedOut, (req, res, next) => {
  res.render('login', {title: 'Log In'});
});

router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password');
        res.render('login', {
          title: 'Login Error',
          msg: err
        });
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Something didn\'t match up.');
    res.render('login', {
      title: 'Login Error',
      msg: err
    });
  }
});

router.get('/profile', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      return res.render('profile', {
        title: 'Profile',
        name: user.name
      });
    }
  });
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    console.log(req.session);
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
