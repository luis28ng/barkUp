import { Router, json } from 'express';
const router = Router();
import reviews from '../data/reviews.js'


router.route('/').get(async (req, res) => {
    //code here for GET
    res.render('review_form');
  });

router.route('/:id').get(async (req, res) => {
    const reviewId = req.params.id
    try {
        const review = await reviews.getReviewById(reviewId)
        res.json(review)
    } catch (e) {
        res.status(404).json(`No review found with ID: ${reviewId}`);
    };
    
  })


router
  .route('/addReview/:id')
  .get(async (req, res) => {
    const placeName = req.params.id;
    // try {
    //     const place = await reviews.getReviewById(id);

    // } catch (e) {
    //     res.render(json("No place with that ID"))
    // }
    res.render('review_form', { placeName });
  })
  .post(async (req, res) => {

    console.log(req.body);
    // const placeId = req.params.id;
    const placeId = '65776cac0c0bfc7b13fd7a86';
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