import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import userData from "../data/users.js";
import parkData from "../data/parks.js";
import reviewData from "../data/reviews.js";
import petStoreData from "../data/petStores.js";

import { validPark, validPetStore, validReview, validEmail, validFN, validLN, validPass, validRole, validUser } from "../helpers.js";

// Probably will need some sort of helpers.js for error checking in routes
// unless it's all taken care of in data functions
// import {} from ../helpers.js

router.route("/").get(async (req, res) => {
  // Renders home page
  return res.render("welcome", {});
});

router
  .route("/search")
  .get(async (req, res) => {
    //code here for GET
    return res.render("search", {});
  })
  .post(async (req, res) => {
    //code here for POST
    const searchInfo = req.body;
    let searchText = searchInfo.searchText;
    let searchZip = searchInfo.searchZip;
    let type = searchInfo.type;

    try {
      if (typeof type !== "string") {
        throw "Type must be a string.";
      }
      type = type.trim();
      if (type.length === 0) {
        throw "Type cannot be an empty string.";
      }
      if (type === "park" || type === "store") {
      } else {
        throw "Type must either be park or store.";
      }
      if (searchText) {
        if (typeof searchText !== "string") throw "Text must be a string.";
        searchText = searchText.trim();
        if (searchText.length === 0) throw "Text cannot be an empty string.";
      }
      if (searchZip) {
        if (typeof searchZip !== "string") throw "Zip code must be a string.";
        searchZip = searchZip.trim();
        const zipReg = /^\d{5}$/;
        if (!zipReg.test(searchZip)) throw "Invalid zip code";
      }
    } catch (error) {
      return res.status(400).render("search", { error: error });
    }

    let results = null;
    try {
      if (type === "store") {
        if (searchText || searchZip) {
          results = await petStoreData.searchPetStores([searchText, searchZip]);
        } else {
          results = await petStoreData.getAllPetStores();
        }
      } else if (type === "park") {
        if (searchText || searchZip) {
          results = await parkData.searchParks([searchText, searchZip]);
        } else {
          results = await parkData.getAllParks();
        }
      }
    } catch (error) {
      return res.status(500).render("search", { error: error });
    }

    return res.render("search", { results, type: type, searchQuery: searchText });
  });

// Location
router
  .route("/location/:name")
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
  .route("/addReview/:id")
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
  .route("/profile")
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
  .route("/editReview/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let review;
    try {
      review = await reviewData.getReviewById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    return res.render("edit_review", { review: review });
  })
  .post(async (req, res) => {
    //code here for POST
    let reviewInfo = req.body;
    let id = req.params.id;
    let reviewTitle = reviewInfo.reviewTitle;
    let rating = reviewInfo.rating;
    let reviewDescription = reviewInfo.reviewDescription;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    try {
      validReview(reviewTitle, rating, reviewDescription);
    } catch (error) {
      return res.status(400).render("edit_review", { error: error });
    }
    let review;
    try {
      review = await reviewData.updateReview(
        id,
        reviewTitle,
        rating,
        reviewDescription
      );
    } catch (error) {
      return res.status(400).render("edit_review", { error: error });
    }
    return res.redirect("/admin");
  });

// Admin Edit Park
router
  .route("/admin")
  .get(async (req, res) => {
    //code here for GET
    return res.render("admin_panel", {});
  })
  .post(async (req, res) => {
    //code here for POST
    const searchInfo = req.body;
    let searchText = searchInfo.searchText;
    let searchZip = searchInfo.searchZip;
    let type = searchInfo.type;

    try {
      if (typeof type !== "string") {
        throw "Type must be a string.";
      }
      type = type.trim();
      if (type.length === 0) {
        throw "Type cannot be an empty string.";
      }
      if (type === "park" || type === "store") {
      } else {
        throw "Type must either be park or store.";
      }
      if (searchText) {
        if (typeof searchText !== "string") throw "Text must be a string.";
        searchText = searchText.trim();
        if (searchText.length === 0) throw "Text cannot be an empty string.";
      }
      if (searchZip) {
        if (typeof searchZip !== "string") throw "Zip code must be a string.";
        searchZip = searchZip.trim();
        const zipReg = /^\d{5}$/;
        if (!zipReg.test(searchZip)) throw "Invalid zip code";
      }
    } catch (error) {
      return res.status(400).render("admin_panel", { error: error });
    }

    let results = null;
    try {
      if (type === "store") {
        if (searchText || searchZip) {
          results = await petStoreData.searchPetStores([searchText, searchZip]);
        } else {
          results = await petStoreData.getAllPetStores();
        }
      } else if (type === "park") {
        if (searchText || searchZip) {
          results = await parkData.searchParks([searchText, searchZip]);
        } else {
          results = await parkData.getAllParks();
        }
      }
    } catch (error) {
      return res.status(500).render("admin_panel", { error: error });
    }

    return res.render("admin_panel", { results });
  });

router
  .route("/admin/park/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      // Have to render error if id is not valid cannot get information
      return res.status(400).render("error", { error: error });
    }
    let park;
    try {
      park = await parkData.searchParksById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
     // Add isAdmin flag
     const isAdmin = req.session.user && req.session.user.role === 'admin';

     // Add isCurrentUser flag to each review
     reviews.forEach(review => {
         review.isCurrentUser = req.session.user && review.userId === req.session.user._id;

     });

    return res.render("establishment", { park: park, reviews: reviews , isAdmin: isAdmin});
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
  });

router
  .route("/admin/store/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.searchPetStoresById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
      // Add isAdmin flag
      const isAdmin = req.session.user && req.session.user.role === 'admin';

      // Add isCurrentUser flag to each review
      reviews.forEach(review => {
          review.isCurrentUser = req.session.user && review.userId === req.session.user._id;

      });
    return res.render("establishment", {
      petStore: petStore,
      reviews: reviews,
      isAdmin: isAdmin
    });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
  });

router
  .route("/admin/addPark")
  .get(async (req, res) => {
    return res.render("admin_add_establishment", {addingPark: true});
  })
  .post(async (req, res) => {
    let parkInfo = req.body;
    let parkName = parkInfo.parkName;
    let location = parkInfo.location;

    try {
      validPark(parkName, location);
    } catch (error) {
      return res.status(400).render("admin_add_establishment", { error: error });
    }
    let park;
    try {
      park = await parkData.createPark(parkName, location);
    } catch (error) {
      return res.status(400).render("admin_add_establishment", { error: error });
    }
    return res.redirect(`/admin/park/${park._id}`);
  });

router
  .route("/admin/addStore")
  .get(async (req, res) => {
    return res.render("admin_add_establishment", {addingPark: false});
  })
  .post(async (req, res) => {
    let petStoreInfo = req.body;
    let storeName = petStoreInfo.storeName;
    let operationHours = petStoreInfo.operationHours;
    let location = petStoreInfo.location;

    try {
      validPetStore(storeName, operationHours, location);
    } catch (error) {
      return res.status(400).render("admin_add_establishment", { error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.createPetStore(
        storeName,
        operationHours,
        location
      );
    } catch (error) {
      return res.status(400).render("admin_add_establishment", { error: error });
    }
    return res.redirect(`/admin/store/${petStore._id}`);
  });

router
  .route("/admin/editPark/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let park;
    try {
      park = await parkData.searchParksById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    for (let i = 0; i < reviews.length; i++) {
      reviews[i]._id = reviews[i]._id.toString();
    }
    //Will render form with all park information filled in
    return res.render("admin_edit_establishment", { park: park, reviews: reviews });
  })
  .post(async (req, res) => {
    //code here for POST
    let parkInfo = req.body;
    let id = req.params.id;
    let parkName = parkInfo.parkName;
    let location = parkInfo.location;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    try {
      validPark(parkName, location);
    } catch (error) {
      return res.status(400).render("admin_edit_establishment", { error: error });
    }
    let park;
    try {
      park = await parkData.updatePark(id, parkName, location);
    } catch (error) {
      return res.status(400).render("admin_edit_establishment", { error: error });
    }
    return res.redirect(`/admin/park/${park._id}`);
  });

// Admin edit store
router
  .route("/admin/editStore/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.searchPetStoresById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    for (let i = 0; i < reviews.length; i++) {
      reviews[i]._id = reviews[i]._id.toString();
    }
    return res.render("admin_edit_establishment", {
      petStore: petStore,
      reviews,
      reviews,
    });
  })
  .post(async (req, res) => {
    //code here for POST
    let petStoreInfo = req.body;
    let id = req.params.id;
    let storeName = petStoreInfo.storeName;
    let operationHours = petStoreInfo.operationHours;
    let location = petStoreInfo.location;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    try {
      validPetStore(storeName, operationHours, location);
    } catch (error) {
      return res.status(400).render("admin_edit_establishment");
    }
    let petStore;
    try {
      petStore = await petStoreData.updatePetStore(
        id,
        storeName,
        operationHours,
        location
      );
    } catch (error) {
      return res.status(500).render("admin_edit_establishment", { error: error });
    }
    return res.redirect(`/admin/store/${petStore._id}`);
  });

router
  .route("/admin/deleteReview/:id")
  .get(async (req, res) => {
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let review;
    try {
      review = await reviewData.getReviewById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    return res.render("admin_delete_review", { review: review });
  })
  .post(async (req, res) => {
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    try {
      let review = await reviewData.deleteReview(id);
    } catch (error) {
      return res.status(500).render("error", { error: error });
    }
    return res.redirect("/admin");
  });

router
  .route("/admin/deleteStore/:id")
  .get(async (req, res) => {
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.searchPetStoresById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    return res.render("admin_delete_establishment", { petStore: petStore });
  })
  .post(async (req, res) => {
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    try {
      await petStoreData.deletePetStore(id);
    } catch (error) {
      return res.status(500).render("error", { error: error });
    }
    return res.redirect("/admin");
  });

router
  .route("/admin/deletePark/:id")
  .get(async (req, res) => {
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    let park;
    try {
      park = await parkData.searchParksById(id);
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    return res.render("admin_delete_establishment", { park: park });
  })
  .post(async (req, res) => {
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { error: error });
    }
    try {
      await parkData.deletePark(id);
    } catch (error) {
      return res.status(500).render("error", { error: error });
    }
    return res.redirect("/admin");
  });

// Error route; not sure if we will need it
router.route("/error").get(async (req, res) => {
  //code here for GET
  return res.render("error", {
    title: "Error",
    statusCode: req.query.statusCode,
    error: req.query.error,
  });
});

// Register Route
// Register Route
router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    try{
      return res.status(200).render('register')
    }
    catch(e){
      return res.status(400).render('error', {
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

    if(!validFN(firstName)){
      return res.status(400).render('register', {error: "Invalid First Name"})
    }
    if(!validLN(lastName)){
      return res.status(400).render('register', {error: "Invalid Last Name"})
    }
    if(!validEmail(emailAddress)){
      return res.status(400).render('register', { error: "Invalid Email"})
    }
    if(!validPass(password)){
      return res.status(400).render('register', { error: "Password must be at least 8 characters long, have at least 1 uppercase letter, a number, and special character"})
    }
    if(!validUser(username)){
      return res.status(400).render('register', {error: "Invalid Username"})
    }

    if(password !== confirm){
      return res.status(400).render('register', {error: "Passwords do not match"})
    }

    try{
    const newmail = emailAddress.toLowerCase();
    const newuser = username.toLowerCase();
    const getuser = await users();
    const dupe = await getuser.findOne({emailAddress: newmail});
    const dupeuser = await getuser.findOne({username: newuser});

  if (dupe) {
    return res.status(400).render('register', {error: "Email address already in use"})
  }

  if (dupeuser) {
    return res.status(400).render('register', {error: "Username already in use"})
  }
}
catch(e){
  return res.status(400).render('error', {
    error: e});
}
try{

  const user = await userData.registerUser(req.body.firstNameInput, req.body.lastNameInput, req.body.emailAddressInput, req.body.userNameInput, req.body.passwordInput, req.body.roleInput);
        if(!user.insertedUser){
           return res.status(400).render('register', { error: user.error})
}
  return res.status(200).redirect('/login')
}
catch(e){
  return res.status(500).render('error', {
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
      return res.status(200).render('login', {error: "All fields are required"})
    }
    if(!validUser(username) || !validPass(password)){
      return res.status(200).render('login', {error: "Invalid Username or Password"})
    }

    try{
      const user = await userData.loginUser(username, password);
      if (!user) {
        return res.status(400).render('login', {error: "Invalid Username or Password"})
      }
      req.session.user = {firstName: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress, username: user.username, role: user.role}
      if (user.role === 'admin') {
        return res.redirect('/admin_panel');
    } else {
        return res.redirect('/');
    }
    }
    catch(e){
      return res.status(400).render('error', {
        error: e});
    }
  });

// Logout route for users to log out
router.route('/logout').get(async (req, res) => {
  //code here for GET
    req.session.destroy();
    return res.render("/welcome");

});

export default router;
