import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import userData from "../data/users.js";
import parkData from "../data/parks.js";
import reviewData from "../data/reviews.js";
import petStoreData from "../data/petStores.js";
import petData from "../data/pets.js"
import { users } from "../config/mongoCollections.js";

import {
  validPark,
  validPetStore,
  validReview,
  validEmail,
  validFN,
  validLN,
  validPass,
  validRole,
  validUser,
  checkId,
  isAdmin,
} from "../helpers.js";

// Probably will need some sort of helpers.js for error checking in routes
// unless it's all taken care of in data functions
// import {} from ../helpers.js

router.route("/").get(async (req, res) => {
  // Renders home page
  const tfAuth = !!req.session.user;
  const isAdmin = req.session.user && req.session.user.role === "admin";
  let parks;
  let stores;
  try {
    parks = await parkData.topRated();
  } catch (error) {
    return res.status(500).render("welcome", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
  }
  try {
    stores = await petStoreData.topRated();
  } catch (error) {
    return res.status(500).render("welcome", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
  }
  return res.render("welcome", {
    tfAuth: tfAuth,
    parks: parks,
    stores: stores,
    isAdmin:isAdmin
  });
});

router
  .route("/search")
  .get(async (req, res) => {
    //code here for GET
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    return res.render("search", {tfAuth:tfAuth,isAdmin:isAdmin});
  })
  .post(async (req, res) => {
    //code here for POST
    const isAdmin = req.session.user && req.session.user.role === "admin";
    const searchInfo = req.body;
    const tfAuth = !!req.session.user;
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
      return res.status(400).render("search", { tfAuth:tfAuth,isAdmin:isAdmin,error: error });
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
      return res.status(500).render("search", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }

    return res.render("search_results", {
      results,
      type: type,
      searchQuery: searchText,
      tfAuth: tfAuth,
      isAdmin:isAdmin
    });
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

// Profile
router
  .route("/profile")
  .get(async (req, res) => { 
    const tfAuth = !!req.session.user;
    const userId = req.session.user.userId;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    const userReviews = await reviewData.getAllReviewsByUser(userId);

    const userPets = await petData.getAllPets(userId);
    
    return res.render("user_profile", {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      userReviews,
      pets: userPets,
      tfAuth: tfAuth,
      isAdmin:isAdmin
    });
  })
  .post(async (req, res) => {
    //code here for POST
    let petInfo = req.body;

    let petName = petInfo.petNameInput;
    let petGender = petInfo.petGenderInput;
    let petBreed = petInfo.petBreedSelect;

    let userId = req.session.user.userId;
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";

    let addPetInfo = null;

    try {
      addPetInfo = await petData.createPet(userId, petName, petGender, petBreed);
      return res.status(200).redirect('/profile');
    } catch (e) {
      return res.status(404).render('error', {tfAuth:tfAuth, isAdmin:isAdmin,error: e});
    }
  });

// Admin Edit Park
router
  .route("/admin")
  .get(async (req, res) => {
    //code here for GET
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    return res.render("admin_panel", {tfAuth:tfAuth, isAdmin:isAdmin});
  })
  .post(async (req, res) => {
    //code here for POST
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    const searchInfo = req.body;
    let searchText = searchInfo.name;
    let searchZip = searchInfo.zipCode;
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
      return res.status(400).render("admin_panel", { tfAuth: tfAuth, isAdmin:isAdmin, error: error });
    }

    let searchResults = null;
    try {
      if (type === "store") {
        if (searchText || searchZip) {
          searchResults = await petStoreData.searchPetStores([
            searchText,
            searchZip,
          ]);
        } else {
          searchResults = await petStoreData.getAllPetStores();
        }
      } else if (type === "park") {
        if (searchText || searchZip) {
          searchResults = await parkData.searchParks([searchText, searchZip]);
        } else {
          searchResults = await parkData.getAllParks();
        }
      }
    } catch (error) {
      return res.status(500).render("admin_panel", { tfAuth: tfAuth, isAdmin:isAdmin, error: error });
    }

    return res.render("admin_panel", { tfAuth:tfAuth, isAdmin:isAdmin, searchResults });
  });

router
  .route("/admin/park/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      // Have to render error if id is not valid cannot get information
      return res.status(400).render("error", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    let park;
    try {
      park = await parkData.searchParksById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    

    // Add isCurrentUser flag to each review
    reviews.forEach((review) => {
      review.isCurrentUser =
        req.session.user && review.userId === req.session.user._id;
    });

    return res.render("establishment", {
      park: park,
      reviews: reviews,
      tfAuth:tfAuth,
      isAdmin: isAdmin,
    });
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
    const tfAuth = !!req.session.user;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.searchPetStoresById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    // Add isAdmin flag
    const isAdmin = req.session.user && req.session.user.role === "admin";
    // Add isCurrentUser flag to each review
    reviews.forEach((review) => {
      review.isCurrentUser =
        req.session.user && review.userId === req.session.user._id;
    });
    return res.render("establishment", {
      petStore: petStore,
      reviews: reviews,
      isAdmin: isAdmin,
      tfAuth:tfAuth
    });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
  });

router
  .route("/admin/addPark")
  .get(async (req, res) => {
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    return res.render("admin_add_establishment", { tfAuth:tfAuth, isAdmin:isAdmin, addingPark: true });
  })
  .post(async (req, res) => {
    let parkInfo = req.body;
    let parkName = parkInfo.parkName;
    let location = parkInfo.location;
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      validPark(parkName, location);
    } catch (error) {
      return res
        .status(400)
        .render("admin_add_establishment", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    let park;
    try {
      park = await parkData.createPark(parkName, location);
    } catch (error) {
      return res
        .status(400)
        .render("admin_add_establishment", { tfAuth:tfAuth, isAdmin:isAdmin, error: error });
    }
    return res.redirect(`/admin/park/${park._id}`);
  });

router
  .route("/admin/addStore")
  .get(async (req, res) => {
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    return res.render("admin_add_establishment", { tfAuth:tfAuth, isAdmin:isAdmin, addingPark: false });
  })
  .post(async (req, res) => {
    let petStoreInfo = req.body;
    let storeName = petStoreInfo.storeName;
    let operationHours = petStoreInfo.operationHours;
    let location = petStoreInfo.location;
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      validPetStore(storeName, operationHours, location);
    } catch (error) {
      return res
        .status(400)
        .render("admin_add_establishment", { tfAuth:tfAuth, isAdmin:isAdmin,error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.createPetStore(
        storeName,
        operationHours,
        location
      );
    } catch (error) {
      return res
        .status(400)
        .render("admin_add_establishment", { tfAuth:tfAuth, isAdmin:isAdmin,error: error });
    }
    return res.redirect(`/admin/store/${petStore._id}`);
  });

router
  .route("/admin/editPark/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let park;
    try {
      park = await parkData.searchParksById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    for (let i = 0; i < reviews.length; i++) {
      reviews[i]._id = reviews[i]._id.toString();
    }
    //Will render form with all park information filled in
    return res.render("admin_edit_establishment", {
      park: park,
      reviews: reviews,
      tfAuth: tfAuth, 
      isAdmin:isAdmin,
    });
  })
  .post(async (req, res) => {
    //code here for POST
    let parkInfo = req.body;
    let id = req.params.id;
    let parkName = parkInfo.parkName;
    let location = parkInfo.location;
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    try {
      validPark(parkName, location);
    } catch (error) {
      return res
        .status(400)
        .render("admin_edit_establishment", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let park;
    try {
      park = await parkData.updatePark(id, parkName, location);
    } catch (error) {
      return res
        .status(400)
        .render("admin_edit_establishment", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    return res.redirect(`/admin/park/${park._id}`);
  });

// Admin edit store
router
  .route("/admin/editStore/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.searchPetStoresById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let reviews;
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    for (let i = 0; i < reviews.length; i++) {
      reviews[i]._id = reviews[i]._id.toString();
    }
    return res.render("admin_edit_establishment", {
      petStore: petStore,
      reviews: reviews,
      tfAuth: tfAuth, 
      isAdmin:isAdmin,
    });
  })
  .post(async (req, res) => {
    //code here for POST
    let petStoreInfo = req.body;
    let id = req.params.id;
    let storeName = petStoreInfo.storeName;
    let operationHours = petStoreInfo.operationHours;
    let location = petStoreInfo.location;
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    try {
      validPetStore(storeName, operationHours, location);
    } catch (error) {
      return res.status(400).render("admin_edit_establishment", { tfAuth: tfAuth, isAdmin:isAdmin});
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
      return res
        .status(500)
        .render("admin_edit_establishment", { tfAuth:tfAuth, error: error,isAdmin:isAdmin });
    }
    return res.redirect(`/admin/store/${petStore._id}`);
  });

router
  .route("/admin/deleteReview/:id")
  .get(async (req, res) => {
    const tfAuth = !!req.session.user;
    let id = req.params.id;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let review;
    try {
      review = await reviewData.getReviewById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    return res.render("admin_delete_review", { tfAuth:tfAuth,isAdmin:isAdmin, review: review });
  })
  .post(async (req, res) => {
    let id = req.params.id;
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    try {
      let review = await reviewData.deleteReview(id);
    } catch (error) {
      return res.status(500).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    return res.redirect("/admin");
  });

router
  .route("/admin/deleteStore/:id")
  .get(async (req, res) => {
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let petStore;
    try {
      petStore = await petStoreData.searchPetStoresById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth, error: error });
    }
    return res.render("admin_delete_establishment", { tfAuth:tfAuth,isAdmin:isAdmin, petStore: petStore });
  })
  .post(async (req, res) => {
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    try {
      await petStoreData.deletePetStore(id);
    } catch (error) {
      return res.status(500).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    return res.redirect("/admin");
  });

router
  .route("/admin/deletePark/:id")
  .get(async (req, res) => {
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    let park;
    try {
      park = await parkData.searchParksById(id);
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    return res.render("admin_delete_establishment", { tfAuth:tfAuth,isAdmin:isAdmin, park: park });
  })
  .post(async (req, res) => {
    const tfAuth = !!req.session.user;
     const isAdmin = req.session.user && req.session.user.role === "admin";
    let id = req.params.id;
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (error) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    try {
      await parkData.deletePark(id);
    } catch (error) {
      return res.status(500).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: error });
    }
    return res.redirect("/admin");
  });

// Error route; not sure if we will need it
router.route("/error").get(async (req, res) => {
  //code here for GET
  const tfAuth = !!req.session.user;
  const isAdmin = req.session.user && req.session.user.role === "admin";
  return res.render("error", {
    title: "Error",
    statusCode: req.query.statusCode,
    error: req.query.error,
    tfAuth: tfAuth, 
    isAdmin:isAdmin
  });
});

router
  .route("/petstores")
  .get(async (req, res) => {
    //code here for GET
  const tfAuth = !!req.session.user;
  const isAdmin = req.session.user && req.session.user.role === "admin";
    let petStores;
    try {
      petStores = await petStoreData.getAllPetStores();
    } catch (e) {
      return res.status(500).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: e });
    }
    

    return res.render("search_results", { results: petStores, tfAuth: tfAuth,isAdmin:isAdmin });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
  });

router
  .route("/petstores/:id")
  .get(async (req, res) => {
    //code here for GET
    let id = req.params.id;
    let petstore;
    let reviews;
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      if (typeof id !== "string") {
        throw "ID must be a string.";
      }
      id = id.trim();
      if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    } catch (e) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: e });
    }
    try {
      petstore = await petStoreData.searchPetStoresById(id);
    } catch (e) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: e });
    }
    try {
      reviews = await reviewData.getAllReviewsOfPlace(id)
    } catch (e) {
      return res.status(400).render("error", { tfAuth:tfAuth,isAdmin:isAdmin, error: e });
    }
    return res.render("establishment", { petStore: petstore, tfAuth: tfAuth,isAdmin:isAdmin, reviews:reviews });
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(req.body);
  });

// Register Route
router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    try {
      return res.status(200).render("register");
    } catch (e) {
      return res.status(400).render("error", {
        error: e,
        tfAuth: tfAuth,
        isAdmin:isAdmin,
      });
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
    const tfAuth = !!req.session.user;
    const isAdmin = req.session.user && req.session.user.role === "admin";
    if (!validFN(firstName)) {
      return res
        .status(400)
        .render("register", { error: "Invalid First Name" });
    }
    if (!validLN(lastName)) {
      return res.status(400).render("register", { error: "Invalid Last Name" });
    }
    if (!validEmail(emailAddress)) {
      return res.status(400).render("register", { error: "Invalid Email" });
    }
    if (!validPass(password)) {
      return res.status(400).render("register", {
        error:
          "Password must be at least 8 characters long, have at least 1 uppercase letter, a number, and special character",
      });
    }
    if (!validUser(username)) {
      return res.status(400).render("register", { error: "Invalid Username" });
    }

    if (password !== confirm) {
      return res
        .status(400)
        .render("register", { error: "Passwords do not match" });
    }

    try {
      const newmail = emailAddress.toLowerCase();
      const newuser = username.toLowerCase();
      const getuser = await users();
      const dupe = await getuser.findOne({ emailAddress: newmail });
      const dupeuser = await getuser.findOne({ username: newuser });

      if (dupe) {
        return res
          .status(400)
          .render("register", { error: "Email address already in use" });
      }

      if (dupeuser) {
        return res
          .status(400)
          .render("register", { error: "Username already in use" });
      }
    } catch (e) {
      return res.status(400).render("error", {
        error: e,
        tfAuth: tfAuth,
        isAdmin:isAdmin,
      });
    }
    try {
      const user = await userData.registerUser(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.userNameInput,
        req.body.passwordInput,
        req.body.roleInput
      );
      if (!user.acknowledged) {
        return res.status(400).render("register", { error: user.error });
      }
      return res.status(200).redirect("/login");
    } catch (e) {
      return res.status(500).render("error", {
        error: "Internal server error",
        tfAuth: tfAuth,
        isAdmin:isAdmin
      });
    }
  });

// Login route
//There is an issue where if the credentials are valid, but there is not user in the database, it will redirect to error the if(!user) statement is not working
router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    return res.render("login", { title: "User Login" });
  })
  .post(async (req, res) => {
    //code here for POST
    const username = req.body.userNameInput.toLowerCase().trim();
    const password = req.body.passwordInput.trim();
    if (
      username === null ||
      username === "" ||
      password === null ||
      password === ""
    ) {
      return res
        .status(400)
        .render("login", { error: "All fields are required" });
    }
    if (!validUser(username) || !validPass(password)) {
      return res
        .status(400)
        .render("login", { error: "Invalid Username or Password" });
    }

    try {
      const user = await userData.loginUser(username, password);
      if (!user) {
        return res
          .status(400)
          .render("login", { error: "Invalid Username or Password" });
      }
      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        username: user.username,
        role: user.role,
        userId: user.userId,
      };
      if (user.role === "admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/");
      }
    } 
    catch (e) {
      return res.status(400).render("login", {
        error: e,
      });
    }
  });

// Logout route for users to log out
router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.clearCookie("AuthState");
  res.redirect("/");
});

router.route("/parks").get(async (req, res) => {
  let parkList;
  const tfAuth = !!req.session.user;
  const isAdmin = req.session.user && req.session.user.role === "admin";
  try {
    parkList = await parkData.getAllParks();
  } catch (error) {
    return res.status(500).render("error", { error: error });
  }

    return res.render("search_results", { results: parkList, tfAuth: tfAuth, isAdmin:isAdmin });
});

router.route("/parks/:id").get(async (req, res) => {
  let parkId = req.params.id;
  const tfAuth = !!req.session.user;
  const isAdmin = req.session.user && req.session.user.role === "admin";
  let park;
  let reviews;

  try {
    if (typeof parkId !== "string") {
      throw "Park ID must be a string.";
    }
    parkId = parkId.trim();
    if (!ObjectId.isValid(parkId)) throw "Not a valid Park ID.";

    parkId = checkId(parkId, "Park ID");
  } catch (e) {
    return res.status(400).render("error", { error: e,tfAuth:tfAuth,isAdmin:isAdmin });
  }
  try {
    park = await parkData.searchParksById(parkId)
  } catch (error) {
    return res.status(400).render("error", { error: error,isAdmin:isAdmin, tfAuth:tfAuth });
  }
  try {
    reviews = await reviewData.getAllReviewsOfPlace(parkId);
  } catch (error) {
    return res.status(400).render("error", { error: error, isAdmin:isAdmin, tfAuth:tfAuth });
  }
  return res.render("establishment", { park: park, tfAuth: tfAuth,isAdmin:isAdmin, reviews: reviews });
});

export default router;
