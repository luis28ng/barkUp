import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import parks from "../data/parks.js";
import petStores from "../data/petStores.js";
import reviews from "../data/reviews.js";
import users from "../data/users.js";
import pets from "../data/pets.js";

const db = await dbConnection();
await db.dropDatabase();

// Creating parks
let churchSquarePark = null;
let stevensPark = null;
let elysianPark = null;
try {
    churchSquarePark = await parks.createPark("Church Square Park", {address: "400 Garden St", city: "Hoboken", state: "NJ", zipCode: "07030"});

    stevensPark = await parks.createPark("Stevens Park", {address: "401 Hudson St", city: "Hoboken", state: "NJ", zipCode: "07030"});

    elysianPark = await parks.createPark("Elysian Park", {address: "1001 Hudson St", city: "Hoboken", state: "NJ", zipCode: "07030"});
} catch (e) {
    console.log(e);
}


// Creating petStores
let cornerstonePets = null;
let hobokenPet = null;
let caribbeanPets = null;
let fussyFriends = null;
let houndAboutTown = null;

try {
    cornerstonePets = await petStores.createPetStore("Cornerstone Pets", {open: "10:00AM", close: "6:00PM"}, {address: "105 9th St", city: "Hoboken", state: "NJ", zipCode: "07030"});

    hobokenPet = await petStores.createPetStore("Hoboken Pet", {open: "9:00AM", close: "7:00PM"}, {address: "524 Washington St", city: "Hoboken", state: "NJ", zipCode: "07030"});

    caribbeanPets = await petStores.createPetStore("Caribbean Pets", {open: "8:00AM", close: "6:00PM"}, {address: "298 Central Ave", city: "Jersey City", state: "NJ", zipCode: "07307"});

    fussyFriends = await petStores.createPetStore("Fussy Friends Pet Supply", {open: "11:00AM", close: "8:00PM"}, {address: "458 Central Ave", city: "Jersey City", state: "NJ", zipCode: "07307"});

    houndAboutTown = await petStores.createPetStore("Hound About Town", {open: "10:00AM", close: "8:00PM"}, {address: "17 McWilliams Place", city: "Jersey City", state: "NJ", zipCode: "07307"});
} catch (e) {
    console.log(e);
}


// Creating users
let user1 = null;
let user2 = null;
let user3 = null;

try {
    user1 = await users.registerUser("Jameson", "Railey", "JKRailey013@gmail.com", "JKRailey013", "Password123!", "user");
    user2 = await users.registerUser("Justin", "Cross", "jcross@stevens.edu", "JCross", "JCross123!", "user");
    user3 = await users.registerUser("Head", "Founder", "admin123@admin.com", "Admin123", "Admin123!", "admin");
} catch (e) {
    console.log(e);
}

let pet1 = null; 
let pet2 = null;
let pet3 = null;
// Adding pets
try {
    pet1 = await pets.createPet(user1.insertedId.toString(), "Rocky", "male", "german shepard");

    pet2 = await pets.createPet(user2.insertedId.toString(), "Bubbles", "female", "poodle")
} catch (e) {
    console.log(e);
}


// Creating park reviews
let parkReview1 = null;
let parkReview2 = null;
let parkReview3 = null;
let parkReview4 = null;

try {
    parkReview1 = await reviews.createReview(user1.insertedId.toString(), stevensPark._id.toString(), "Lovely park", 5, "This park has so much space for my little puppy to run around and play. Would recommend this place for anyone!");
    
    parkReview2 = await reviews.createReview(user1.insertedId.toString(), churchSquarePark._id.toString(), "Terrible park", 1, "This park is so small and poorly maintained. There is garbage everywhere each time I go. Will not be returning!");

    parkReview3 = await reviews.createReview(user2.insertedId.toString(), elysianPark._id.toString(), "Take your dog here", 5, "Awesome park. I'm so glad that I finally found one that I can trust and feel comfortable bringing my pup to.");

    parkReview4 = await reviews.createReview(user2.insertedId.toString(), churchSquarePark._id.toString(), "Not bad but convenient", 2, "This park is right next to my apartment so it's really convenient for me, but there are definitely better parks around town.");
} catch (e) {
    console.log(e);
}

// Creating store reviews
let storeReview1 = null;
let storeReview2 = null;
let storeReview3 = null;
let storeReview4 = null;


try {
    storeReview1 = await reviews.createReview(user1.insertedId.toString(), houndAboutTown._id.toString(), "High quality pet food", 5, "This store has the best premium dog food. My little guy loves the food and it keeps him healthy!");

    storeReview2 = await reviews.createReview(user1.insertedId.toString(), hobokenPet._id.toString(), "Bad customer service", 1, "The cashier was very rude when I asked him a question. I just wanted to know more about a product, but I guess that was too much to ask!");

    storeReview3 = await reviews.createReview(user2.insertedId.toString(), cornerstonePets._id.toString(), "Great prices", 5, "This is a great store for pets. Very affordable and very high quality. Best of both worlds.");

    storeReview4 = await reviews.createReview(user2.insertedId.toString(), hobokenPet._id.toString(), "Good selection", 3, "You can't go wrong with this store. It has everything you could want or need for your pet and caters to all animals. The employees are young and not always the most helpful though.");
} catch (e) {
    console.log(e);
}

await closeConnection();
