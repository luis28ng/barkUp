import { Router } from 'express';
const router = Router();

import {validFN, validLN, validEmail, validPass, validUser, validRole} from '../helpers.js';
import {users} from '../config/mongoCollections.js';

import userMethods  from '../data/users.js';
import * as parks from '../data/parks.js';
import * as reviews from '../data/reviews.js';
import * as stores from '../data/petStores.js';

// Probably will need some sort of helpers.js for error checking in routes
// unless it's all taken care of in data functions
// import {} from ../helpers.js

router.route('/').get(async (req, res) => {
    // Renders home page
    return res.render('home', {});
});

router
  .route('/searchParks')
  .get(async (req, res) => {
    //code here for GET
      return res.render('search', {});
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });

// Location
router
  .route('/location/:name')
  .get(async (req, res) => {
    //code here for GET
      return res.render();
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });

// Review
router
  .route('/addReview/:id')
  .get(async (req, res) => {
    //code here for GET
      return res.render();
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });

// Profile
router
  .route('/profile')
  .get(async (req, res) => {
    //code here for GET
      return res.render();
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });


// Edit Review
router
  .route('/editReview/:id')
  .get(async (req, res) => {
    //code here for GET
      return res.render();
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });

// Admin Edit Park
router
  .route('/admin/editPark/:id')
  .get(async (req, res) => {
    //code here for GET
      return res.render();
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });

// Admin edit store
router
  .route('/admin/editStore/:id')
  .get(async (req, res) => {
    //code here for GET
      return res.render();
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
  });

// Error route; not sure if we will need it
router.route('/error').get(async (req, res) => {
  //code here for GET
    return res.render("error", { title: 'Error', statusCode: req.query.statusCode, error: req.query.error });

});

// Register Route
router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    try{
      return res.status(200).render('register', {title: "Register Page", header: "Register Page"})
    }
    catch(e){
      return res.status(400).render('error', {
        title: 'Error',
        header: 'Error',
        error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const firstName = req.body.firstNameInput.trim();
    const lastName = req.body.lastNameInput.trim();
    const emailAddress = req.body.emailAddressInput.toLowerCase();
    const username = req.body.userNameInput.trim();
    const password = req.body.passwordInput.trim();
    const confirm = req.body.confirmPasswordInput.trim();

    console.log(username)

    if(!validFN(firstName)){
      return res.status(400).render('register', {header: "Register", error: "Invalid First Name"})
    }
    if(!validLN(lastName)){
      return res.status(400).render('register', {header: "Register", error: "Invalid Last Name"})
    }
    if(!validEmail(emailAddress)){
      return res.status(400).render('register', {header: "Register", error: "Invalid Email"})
    }
    if(!validPass(password)){
      return res.status(400).render('register', {header: "Register", error: "Password must be at least 8 characters long, have at least 1 uppercase letter, a number, and special character"})
    }
    if(!validUser(username)){
      return res.status(400).render('register', {header: "Register", error: "Invalid Username"})
    }

    if(password !== confirm){
      return res.status(400).render('register', {header: "Register", error: "Passwords do not match"})
    }

    try{
    const newmail = emailAddress.toLowerCase();
    const newuser = username.toLowerCase();
    const getuser = await users();
    const dupe = await getuser.findOne({emailAddress: newmail});
    const dupeuser = await getuser.findOne({username: newuser});

  if (dupe) {
    return res.status(400).render('register', {header: "Register", error: "Email address already in use"})
  }

  if (dupeuser) {
    return res.status(400).render('register', {header: "Register", error: "Username already in use"})
  }
}
catch(e){
  return res.status(400).render('error', {
    header: 'Error',
    error: e});
}
try{
  const user = await userMethods.registerUser(req.body.firstNameInput, req.body.lastNameInput, req.body.emailAddressInput, req.body.userNameInput, req.body.passwordInput, req.body.roleInput);
        if(!user.insertedUser){
           return res.status(400).render('register', { error: user.error})
}
  return res.status(200).redirect('/login')
}
catch(e){
  return res.status(500).render('error', {
    header: 'Error',
    error: 'Internal server error'});
}
  });




// Login route
router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
      return res.render("login", { title: 'User Login' });
  })
  .post(async (req, res) => {
    //code here for POST
    const username = req.body.userNameInput.toLowerCase().trim();
    const password = req.body.passwordInput.trim();
    if(username === null || username === "" || password === null || password === ""){
      return res.status(200).render('login', {header: "Login Page", error: "All fields are required"})
    }
    if(!validUser(username) || !validPass(password)){
      return res.status(200).render('login', {header: "Login Page", error: "Invalid Username or Password"})
    }

    try{
      const user = await userMethods.loginUser(username, password);
      if (!user) {
        return res.status(400).render('login', {header: "Login Page", error: "Invalid Username or Password"})
      }
      req.session.user = {firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, username: user.username, role: user.role}
      if (user.role === 'admin') {
        return res.redirect('/admin_panel');
    } else {
        return res.redirect('/welcome');
    }
    }
    catch(e){
      return res.status(400).render('error', {
        title: 'Error',
        header: 'Error',
        error: e});
    }
  });

// Logout route for users to log out
router.route('/logout').get(async (req, res) => {
  //code here for GET
    req.session.destroy();
    return res.render("logout", { title: 'Logged Out.' });

});

export default router;