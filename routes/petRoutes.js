import {Router} from 'express';
const router = Router();
import {usersData, petData} from '../data/index.js';
import {ObjectId} from "mongodb";
import {checkId} from "../helpers.js";


router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    // Ensure that user id is a valid
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error: "User ID parameter is invalid"});

    // Try to get the pets
    try {
      const pets = await petData.getAllPets(req.params.id);
      return res.render();
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let petInfo = req.body;
    // make sure there is something request params have values
    if (!petInfo || Object.keys(petInfo).length === 0) {
      return res
          .status(400)
          .json({error: 'There are no fields in the request body'});
    }

    // Check and trim URL parameters
    petInfo.petName = petInfo.petName.trim();
    petInfo.petType = petInfo.petType.trim();
    petInfo.petBreed = petInfo.petBreed.trim();

    if (!petInfo.petName || !petInfo.petType || !petInfo.petBreed) throw "Please supply a pet name, pet type, and pet breed."

    // Check eventId URL parameter
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error: "Invalid event ID parameter"});

    // Create the attendee
    try {
      const userInfo = await petData.createPet(req.params.id, petInfo.petName, petInfo.petType, petInfo.petBreed);
      res.status(200).render('user_profile', {});
    } catch (e) {
      res.status(404).json({error: e});
    }
  });

router
  .route('/attendee/:id')
  .get(async (req, res) => {
    //code here for GET
    // Ensure attendee id is a valid object id
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error: "Attendee ID URL parameter is not a valid object ID"});

    // Get attendee info
    try {
      const petInfo = await petData.getPet(req.params.id);
      return res.json(petInfo);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    // Ensure attendee id is a valid object id
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error: "Attendee ID URL parameter is not a valid object ID"});

    // Get attendee info
    try {
      const petInfo = await petData.removePet(req.params.id);
      return res.render('user_profile');
    } catch (e) {
      return res.status(404).json({error: e});
    }
  });

export default router;