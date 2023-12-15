import { Router, json } from 'express';
const router = Router();
import reviews from '../data/reviews.js';
import {checkId} from '../helpers.js';
import session from "express-session";
import parks from "../data/parks.js";
import stores from "../data/petStores.js";

router.route('/').get(async (req, res) => {
    //code here for GET
    res.redirect('/')
  });

router.route('/:id').get(async (req, res) => {
    let reviewId = req.params.id
    let userId = req.session.user.userId;
    let userReviewArray = [];
    let userRole = req.session.user.role;
    
    if (userRole !== 'admin') {
      try {
        const reviewsByUser = await reviews.getAllReviewsByUser(userId)
        userReviewArray = reviewsByUser.map(review => review._id.toString());
        const isReviewInArray = userReviewArray.includes(reviewId)
        if (!isReviewInArray) {
          return res.redirect('/')
        };
      } catch (e) {
        return res.redirect('/login')
      }
    };

    try {
        const review = await reviews.getReviewById(reviewId)
        const reviewTitle = review.reviewTitle;
        const reviewDescription = review.reviewDescription;
        const rating = review.rating;

        return res.render('review', { reviewTitle, reviewDescription, rating, reviewId })
    } catch (e) {
        return res.redirect('/')
    };
    
  })
  .delete(async (req,res) => {
    let reviewId = req.params.id
    try {
      reviewId = checkId(reviewId, 'Review Id')
    } catch (e) {
      return res.status(404).render('review', { deletionSuccess: false });
    };

    try {
      const deleteReview = await reviews.deleteReview(reviewId);
      return res.status(200).render('review', { deletionSuccess: true });
    } catch (e) {
      return res.status(404).render('review', { deletionSuccess: false });
    }
  })
  .put(async (req,res) => {
    let reviewId = req.params.id;
    let reviewTitle = req.body.updatedTitle;
    let reviewDescription = req.body.updatedDescription;
    let rating = parseInt(req.body.updatedRating);
    console.log(req.body)

    try {
      const updatedReview = await reviews.updateReview(reviewId,reviewTitle,rating,reviewDescription);
      console.log(updatedReview)
      res.status(200).render('review', { updateSuccess: true });
    } catch (e) {
      return res.status(404).render('review', { updateSuccess: false });
    }
  })


router
  .route('/addReview/:id')
  .get(async (req, res) => {
    const placeId = req.params.id

    let park = null;
    let store = null;
    let placeName = null

    try {
      park = await parks.searchParksById(placeId);
    } catch (e) {}
    try {
      store = await stores.searchPetStoresById(placeId);
    } catch (e) {}

    if (park) {
      placeName = park.parkName;
    } else if (store) {
      placeName = store.storeName;
    };

    res.render('review_form', { placeName });
  })
  .post(async (req, res) => {

    const placeId = req.params.id;
    const userId = req.session.user.userId;
    const reviewTitle = req.body.reviewTitle;
    const rating = parseInt(req.body.rating);
    const reviewDescription = req.body.reviewDescription;


    try {
        const newReview = await reviews.createReview(userId,placeId,reviewTitle,rating,reviewDescription)
        res.redirect(`/review/${newReview._id}`)
    } catch (e) {
        res.render('error', { error: e })
    }

  });

export default router;