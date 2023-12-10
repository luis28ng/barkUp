import { Router } from 'express';
const router = Router();

import * as users from '../data/users.js';
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
      return res.render("register", { title: 'User Signup' });
  })
  .post(async (req, res) => {
    //code here for POST
      console.log(req.body);
      let {
          firstNameInput,
          lastNameInput,
          emailAddressInput,
          passwordInput,
          confirmPasswordInput,
      } = req.body;

      try {
          firstNameInput = checkName(firstNameInput);
          lastNameInput = checkName(lastNameInput);
          emailAddressInput = checkEmail(emailAddressInput);
          passwordInput = checkPassword(passwordInput);
          confirmPasswordInput = checkString(confirmPasswordInput);

          if (passwordInput !== confirmPasswordInput) {
              throw new Error("Passwords must match");
          }

          roleInput = checkString(roleInput);
          if (roleInput !== "admin" && roleInput !== "user") {
              throw new Error("Account must be 'admin' or 'user' type");
          }
      } catch (e) {
          return res.status(400).render("register", { title: 'User Signup', statusCode: 400, error: e });
      }
      try {
          const inserted = await createUser(firstNameInput, lastNameInput, emailAddressInput, passwordInput, roleInput);
          if (inserted.insertedUser = true) {
              return res.redirect("/login");
          }
          else {
              return res.status(500).render("register", { title: 'User Signup', statusCode: 500, error: "Internal Service Error" });
          }
      } catch (e) {
          return res.status(400).render("register", { title: 'User Signup', statusCode: 400, error: e });
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
      console.log(req.body);
      let {
          emailAddressInput,
          passwordInput
      } = req.body;

      try {
          emailAddressInput = checkEmail(emailAddressInput);
          passwordInput = checkPassword(passwordInput);

      } catch (e) {
          return res.status(400).render("login", { title: 'User Login', statusCode:400, error: e });
      }

      try {
          console.log("passed validation");
          const user = await checkUser(emailAddressInput, passwordInput);
          req.session.user = user;

          console.log("passed user check");
          if (req.session.user.role === "admin") {
              return res.redirect("/admin");
          }

          return res.redirect("/protected");
          
      } catch (e) {
          return res.status(400).render("login", { title: 'User Login', statusCode: 400, error: e });
      }
  });

// Logout route for users to log out
router.route('/logout').get(async (req, res) => {
  //code here for GET
    req.session.destroy();
    return res.render("logout", { title: 'Logged Out.' });

});

export default router;