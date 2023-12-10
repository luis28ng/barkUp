import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import parks from "../data/parks.js";
import petStores from "../data/petStores.js";
import reviews from "../data/reviews.js";
import users from "../data/users.js";

const db = await dbConnection();

// Creating parks
let churchSquarePark = parks.createPark("Church Square Park", {address: "400 Garden St", city: "Hoboken", state: "NJ", zipCode: "07030"});

let stevensPark = parks.createPark("Stevens Park", {address: "401 Hudson St", city: "Hoboken", state: "NJ", zipCode: "07030"});

let elysianPark = parks.createPark("Elysian Park", {address: "1001 Hudson St", city: "Hoboken", state: "NJ", zipCode: "07030"});



// Creating petStores
let cornerstonePets = petStores.createPetStore("Cornerstone Pets", {open: "10:00AM", close: "6:00PM"}, {address: "105 9th St", city: "Hoboken", state: "NJ", zipCode: "07030"});

let hobokenPet = petStores.createPetStore("Hoboken Pet", {open: "9:00AM", close: "7:00PM"}, {address: "524 Washington St", city: "Hoboken", state: "NJ", zipCode: "07030"});

let caribbeanPets = petStores.createPetStore("Caribbean Pets", {open: "8:00AM", close: "6:00PM"}, {address: "298 Central Ave", city: "Jersey City", state: "NJ", zipCode: "07307"});

let fussyFriends = petStores.createPetStore("Fussy Friends Pet Supply", {open: "11:00AM", close: "8:00PM"}, {address: "458 Central Ave", city: "Jersey City", state: "NJ", zipCode: "07307"});

let houndAboutTown = petStores.createPetStore("Hound About Town", {open: "10:00AM", close: "8:00PM"}, {address: "17 McWilliams Place", city: "Jersey City", state: "NJ", zipCode: "07307"});



// Creating users
let user1 = users.registerUser("Jameson", "Railey", "JKRailey013@gmail.com", "JKRailey13", "Password123!", "user");

let user2 = users.registerUser("Justin", "Cross", "jcross@stevens.edu", "JCross10", "JCross123!", "user");
let user3 = users.registerUser("Head", "Founder", "admin123@admin.com", "Admin123", "Admin123!", "admin");


// Creating park reviews
reviews.createReview(user1._id, stevensPark._id, "Lovely park", 5, "This park has so much space for my little puppy to run around and play. Would recommend this place for anyone!");

reviews.createReview(user1._id, churchSquarePark._id, "Terrible park", 1, "This park is so small and poorly maintained. There is garbage everywhere each time I go. Will not be returning!");

reviews.createReview(user2._id, elysianPark._id, "Take your dog here", 5, "Awesome park. I'm so glad that I finally found one that I can trust and feel comfortable bringing my pup to.");

reviews.createReview(user2._id, churchSquarePark._id, "Not bad but convenient", 2, "This park is right next to my apartment so it's really convenient for me, but there are definitely better parks around town.");

// Creating store reviews
reviews.createReview(user1._id, houndAboutTown._id, "High quality pet food", 5, "This store has the best premium dog food. My little guy loves the food and it keeps him healthy!");

reviews.createReview(user1._id, hobokenPet._id, "Bad customer service", 1, "The cashier was very rude when I asked him a question. I just wanted to know more about a product, but I guess that was too much to ask!");

reviews.createReview(user2._id, cornerstonePets._id, "Great prices", 5, "This is a great store for pets. Very affordable and very high quality. Best of both worlds.");

reviews.createReview(user2._id, hobokenPet._id, "Good selection", 3, "You can't go wrong with this store. It has everything you could want or need for your pet and caters to all animals. The employees are young and not always the most helpful though.");

await closeConnection();
