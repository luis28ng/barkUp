import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import userData from "../data/users.js";
import parkData from "../data/parks.js";
import reviewData from "../data/reviews.js";
import petStoreData from "../data/petStores.js";

import { validPark, validPetStore, validReview } from "../helpers.js";

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

    return res.render("search", { results });
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
    return res.render("park_details", { park: park, reviews: reviews });
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
    return res.render("petstore_details", {
      petStore: petStore,
      reviews: reviews,
    });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
  });

router
  .route("/admin/addPark")
  .get(async (req, res) => {
    return res.render("admin_add_park");
  })
  .post(async (req, res) => {
    let parkInfo = req.body;
    let parkName = parkInfo.parkName;
    let location = parkInfo.location;

    try {
      validPark(parkName, location);
    } catch (error) {
      return res.status(400).render("admin_add_park", { error: error });
    }
    let park;
    try {
      park = await parkData.createPark(parkName, location);
    } catch (error) {
      return res.status(400).render("admin_add_park", { error: error });
    }
    return res.redirect(`/admin/park/${park._id}`);
  });

router
  .route("/admin/addStore")
  .get(async (req, res) => {
    return res.render("admin_add_store");
  })
  .post(async (req, res) => {
    let petStoreInfo = req.body;
    let storeName = petStoreInfo.storeName;
    let operationHours = petStoreInfo.operationHours;
    let location = petStoreInfo.location;

    try {
      validPetStore(storeName, operationHours, location);
    } catch (error) {
      return res.status(400).render("admin_add_store", { error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.createPetStore(
        storeName,
        operationHours,
        location
      );
    } catch (error) {
      return res.status(400).render("admin_add_store", { error: error });
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
    return res.render("admin_edit_park", { park: park, reviews: reviews });
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
      return res.status(400).render("admin_edit_park", { error: error });
    }
    let park;
    try {
      park = await parkData.updatePark(id, parkName, location);
    } catch (error) {
      return res.status(400).render("admin_edit_park", { error: error });
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
    return res.render("admin_edit_store", {
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
      return res.status(400).render("admin_edit_store");
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
      return res.status(500).render("admin_edit_store", { error: error });
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
    return res.render("admin_delete_store", { petStore: petStore });
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
    return res.render("admin_delete_park", { park: park });
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
router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    return res.render("register", { title: "User Signup" });
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
      return res.status(400).render("register", {
        title: "User Signup",
        statusCode: 400,
        error: e,
      });
    }
    try {
      const inserted = await userData.createUser(
        firstNameInput,
        lastNameInput,
        emailAddressInput,
        passwordInput,
        roleInput
      );
      if ((inserted.insertedUser = true)) {
        return res.redirect("/login");
      } else {
        return res.status(500).render("register", {
          title: "User Signup",
          statusCode: 500,
          error: "Internal Service Error",
        });
      }
    } catch (e) {
      return res.status(400).render("register", {
        title: "User Signup",
        statusCode: 400,
        error: e,
      });
    }
  });

// Login route
router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    return res.render("login", { title: "User Login" });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
    let { emailAddressInput, passwordInput } = req.body;

    try {
      emailAddressInput = checkEmail(emailAddressInput);
      passwordInput = checkPassword(passwordInput);
    } catch (e) {
      return res
        .status(400)
        .render("login", { title: "User Login", statusCode: 400, error: e });
    }

    try {
      console.log("passed validation");
      const user = await userData.checkUser(emailAddressInput, passwordInput);
      req.session.user = user;

      console.log("passed user check");
      if (req.session.user.role === "admin") {
        return res.redirect("/admin");
      }

      return res.redirect("/protected");
    } catch (e) {
      return res
        .status(400)
        .render("login", { title: "User Login", statusCode: 400, error: e });
    }
  });

// Logout route for users to log out
router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  return res.render("logout", { title: "Logged Out." });
});

export default router;
