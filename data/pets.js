import { ObjectId } from "mongodb";
import {users} from "../config/mongoCollections.js";
import { checkId, validPet } from "../helpers.js";
import userData from "../data/users.js";
import { after } from "node:test";

let exportedMethods = {
    async createPet(userId, petName, petType, petBreed) {
        validPet(petName, petType, petBreed);

        userId = checkId(userId, "User ID");

        const pet = {
        _id: new ObjectId(),
        petName: petName,
        petType: petType,
        petBreed: petBreed
        };

        let user = await userData.getUser(userId);
        if (!user) throw "Unable to add pet as a user with that ID does not exist.";

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

        const user = userCollection.find({_id: new ObjectId(userId)}).toArray();
        if (!user) throw "There are no users with that ID";

        let pets = user[0].pets;
        return pets;
    },

    async getPet (petId) {
        petId = checkId(petId);

        const userCollection = await users();

        const user = await userCollection.find({'pets._id': new ObjectId(petId)}).toArray();

        if (!user) throw "Unable to find a user who owns that pet";

        let pet = user[0].pets.filter(obj => obj._id.toString() === petId);

        if (!pet) throw "A pet with that pet id does not exist";

        return pet[0];
    },

    async removePet(petId) {
        petId = checkId(petId);

        const userCollection = await users();

        let pet = await getPet(petId);

        let user = await userCollection.findOneAndUpdate({'pets._id': new ObjectId(petId)},
            {$pull: {pets: pet}},
            {returnDocument: "after"});

        if (!user) throw "No user who owns that pet";

        return user;
    }};

export default exportedMethods;