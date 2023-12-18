import { ObjectId } from "mongodb";
import {users} from "../config/mongoCollections.js";
import { checkId, validPet } from "../helpers.js";
import userData from "../data/users.js";
import { after } from "node:test";

let exportedMethods = {
    async createPet(userId, petName, petGender, petBreed) {
        validPet(petName, petGender, petBreed);

        userId = checkId(userId, "User ID");

        const pet = {
        _id: new ObjectId(),
        petName: petName,
        petGender: petGender,
        petBreed: petBreed
        };

        const userCollection = await users();
        const updatedUser = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$push: {pets: pet}},
            {returnDocument: 'after'}
        );

        return updatedUser;
    },

    async getAllPets(userId) {
        userId = checkId(userId, 'User ID');

        const userCollection = await users();

        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) throw "There are no users with that ID";

        let pets = user.pets;
        return pets;
    },

    async getPet (petId) {
        petId = checkId(petId);

        const userCollection = await users();

        let user = null;
        try {
            user = await userCollection.find({'pets._id': new ObjectId(petId)}).toArray();
        } catch (e) {
            console.log(e);
        }

        if (!user) throw "Unable to find a user who owns that pet";

        let pet = user[0].pets.filter(obj => obj._id.toString() === petId);

        if (!pet) throw "A pet with that pet id does not exist";

        return pet[0];
    },

    async removePet(petId) {
        petId = checkId(petId);

        const userCollection = await users();

        let user = null;
        try {
            user = await userCollection.findOne({'pets._id': new ObjectId(petId)});
        } catch (e) {
            console.log(e);
        }

        let newPetArray = user.pets.filter(obj => 
            obj._id.toString() !== petId);
        console.log(newPetArray);

        let newUser = null;
        try {
            newUser = await userCollection.findOneAndUpdate({'_id': new ObjectId(user._id)},
            {$set: {pets: newPetArray}},
            {returnDocument: 'after'});
        } catch (e) {
            console.log(e);
        }

        if (!user) throw "No user who owns that pet";

        return user;
    },

    async updatePet(petId, petName, petGender, petBreed) {
        if (
          petName === null ||
          petName === undefined ||
          petGender === null ||
          petGender === undefined ||
          petGender === null ||
          petGender === undefined
        ) {
          throw "All fields must be defined";
        }
    
        if (
          typeof petName !== "string" ||
          typeof petGender !== "string" ||
          typeof petBreed !== "string"
        ) {
          throw "Inputs MUST be strings";
        }
    
        petName = petName.trim();
        petGender = petGender.trim();
        petBreed = petBreed.trim();
    
        if (petName === "" || petGender === "" || petBreed === "") {
          throw "Inputs cannot be empty or empty strings with just spaces";
        }    
    
        if (!petId || petId === null || petId === undefined) {
          throw "You must provide an id";
        }
    
        if (typeof petId !== "string") {
          throw "ID must be a string";
        }
    
        petId = petId.trim();
    
        if (petId.length === 0) {
          throw "ID can not be an empty strings with just spaces";
        }
    
        if (!ObjectId.isValid(petId)) {
          throw "Invalid Object ID";
        }
    
        const userCollection = await users();
    
        let user = await userCollection.findOne({
          'pets._id': new ObjectId(petId),
        });
    
        if (user === null) {
          throw `No pet with ID: ${petId}`;
        }
    
        for (let i = 0; i < user.pets.length; i++) {
            if (user.pets[i]._id.toString() === petId) {
                user.pets[i].petName = petName;
                user.pets[i].petGender = petGender;
                user.pets[i].petBreed = petBreed;
            } 
        };

        user = await userCollection.findOneAndUpdate({_id: user._id}, 
            {$set: {pets: user.pets}}, {returnDocument: 'after'});
    
        //
        // END OF UPDATE PET
        //
        return user;
      }};

export default exportedMethods;