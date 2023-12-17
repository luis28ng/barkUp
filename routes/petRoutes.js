import {Router} from 'express';
const router = Router();
import {usersData, petData} from '../data/index.js';
import {ObjectId} from "mongodb";
import {checkId} from "../helpers.js";


// router
//   .route('/:id')
//   .get(async (req, res) => {
//     //code here for GET
//     // Try to get the pets
//     try {
//       const pets = await petData.getAllPets(req.session.user.userId);
//       return res.render('user_profile', {pets: pets});
//     } catch (e) {
//       return res.status(404).render('user_profile');
//     }
//   })
//   .post(async (req, res) => {
//     //code here for POST
//     let petInfo = req.body;
//     // make sure request params have values
//     if (!petInfo || Object.keys(petInfo).length === 0) {
//       return res
//           .status(400)
//           .render('user_profile');
//     }

//     // Check and trim URL parameters
//     petInfo.petName = petInfo.petName.trim();
//     petInfo.petType = petInfo.petType.trim();
//     petInfo.petBreed = petInfo.petBreed.trim();

//     if (!petInfo.petName || !petInfo.petType || !petInfo.petBreed) throw "Please supply a pet name, pet type, and pet breed."

//     try {
//       const userPets = await petData.createPet(req.session.user.userId, petInfo.petName, petInfo.petType, petInfo.petBreed);
//       res.status(200).render('user_profile', {pets: userPets});
//     } catch (e) {
//       res.status(404).render('user_profile');
//     }
//   });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    let petId = req.params.id;
    try {
        petId = checkId(petId, 'Pet ID');
    } catch (e) {
        return res.status(404).render('user_pet');
    }

    try {
      const petInfo = await petData.getPet(petId);
      const petName = petInfo.petName;
      const petGender = petInfo.petGender;
      const petBreed = petInfo.petBreed;
      return res.status(200).render('user_pet', {petName, petGender, petBreed, petId});
    } catch (e) {
      return res.status(404).render('user_pet', {error: e})
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    let petId = req.params.id;
    petId = checkId(petId, 'Pet ID');
    try {
      const deletePet = await petData.removePet(petId);
      return res.render('user_pet', {deletionSuccess: true});
    } catch (e) {
      return res.status(404).render('user_pet', {deletionSuccess: false});
    }
  })
  .put(async (req, res) => {
    let petId = req.params.id;
    let petName = req.body.petNameInput;
    let petGender = req.body.petGenderInput;
    let petBreed = req.body.petBreedSelect;

    console.log(req.body)

    let updatedPet = null;
    try {
      updatedPet = await petData.updatePet(petId,petName,petGender,petBreed);
      res.status(200).render('user_pet', { updateSuccess: true });
    } catch (e) {
      return res.status(404).render('user_pet', { updateSuccess: false });
    }
  });

export default router;