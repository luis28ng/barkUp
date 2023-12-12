import { Router, json } from 'express';
const router = Router();
import reviews from '../data/reviews.js';


router.route('/').get(async (req, res) => {
    //code here for GET
    res.render('review_form');
  });

router.route('/:id').get(async (req, res) => {
    const reviewId = req.params.id
    try {
        const review = await reviews.getReviewById(reviewId)
        const reviewTitle = review.reviewTitle;
        const reviewDescription = review.reviewDescription;
        const rating = review.rating;

        res.render('review', { reviewTitle, reviewDescription, rating })
    } catch (e) {
        res.status(404).json(`No review found with ID: ${reviewId}`);
    };
    
  })


router
  .route('/addReview/:id')
  .get(async (req, res) => {
    // Maybe at some point add a GET park and store function
    // const placeId = req.params.id;
    // try {
    //     const place = await reviews.getReviewById(placeId);
    //     const placeName = place.placeName;
    //     res.render('review_form', { placeName });
    // } catch (e) {
    //     res.json("No place with that ID")
    // }
    const placeName = req.params.id
    res.render('review_form', { placeName });
  })
  .post(async (req, res) => {

    console.log(req.body);
    const placeId = req.params.id;
    // const userId = req.session.user.userId;
    const userId = '65776cac0c0bfc7b13fd7a8a'
    const reviewTitle = req.body.reviewTitle;
    const rating = parseInt(req.body.rating);
    const reviewDescription = req.body.reviewDescription;


    try {
        const newReview = await reviews.createReview(userId,placeId,reviewTitle,rating,reviewDescription)
        res.redirect(`/review/${newReview._id}`)
    } catch (e) {
        res.status(404).json("Error creating review")
    }

  });

export default router;