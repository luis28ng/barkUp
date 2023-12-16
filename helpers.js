//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from 'mongodb';


export const validFN = (firstName) => {
  if (firstName === null) {
    return false;
  }
  if (
    firstName.trim() === "" ||
    typeof firstName.trim() !== "string" ||
    firstName.trim().length < 2 ||
    firstName.trim().length > 25 ||
    /\d/.test(firstName.trim())
  ) {
    return false;
  }
  return true;
};

export const validLN = (lastName) => {
  if (lastName === null) {
    return false;
  }
  if (
    lastName.trim() === "" ||
    typeof lastName.trim() !== "string" ||
    lastName.trim().length < 2 ||
    lastName.trim().length > 25 ||
    /\d/.test(lastName.trim())
  ) {
    return false;
  }
  return true;
};

export const validEmail = (emailAddress) => {
  if (emailAddress === null) {
    return false;
  }

  if (
    typeof emailAddress.trim() !== "string" ||
    emailAddress.trim() === "" ||
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      emailAddress.trim()
    )
  ) {
    return false;
  }
  return true;
};

export const validUser = (user) => {
  if (user === null) {
    return false;
  }
  if (user.trim() === '' || typeof user !== "string" || user.trim().length > 25) {
    return false;
  }
  return true;
};


export const validPass = (password) => {
  if (password === null) {
    return false;
  }
  if (
    password.trim() === "" ||
    typeof password.trim() !== "string" ||
    password.trim().length < 8
  ) {
    return false;
  }

  if (!/[A-Z]/.test(password.trim())) {
    return false;
  }

  if (!/\d/.test(password.trim())) {
    return false;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.trim())) {
    return false;
  }
  return true;
};

export const validRole = (role) => {
  if (role !== "admin" && role !== "user") {
    return false;
  }
  return true;
};

export const isAdmin = (role) => {
  if (role === "admin") {
    return true;
  }
  return false;
};

export const test = (role) => {
  if (role == "admin") {
    return res.redirect("/admin");
  } else {
    return res.redirect("/protected");
  }
};

export const validPark = (parkName, location) => {
  if (!parkName) throw "Must provide park name.";
  if (typeof parkName !== "string") throw "Park name must be a string";
  if (parkName.trim().length === 0) {
    throw "Park name cannot be an empty string";
  }
  parkName = parkName.trim();

  if (typeof location !== "object" || Array.isArray(location)) {
    throw "Location must be an object.";
  }

  if (
    !location.address ||
    !location.city ||
    !location.state ||
    !location.zipCode
  ) {
    throw "All info must be provided for park location.";
  }

  if (
    typeof location.address !== "string" ||
    typeof location.city !== "string" ||
    typeof location.state !== "string" ||
    typeof location.zipCode !== "string"
  ) {
    throw "All fields in location must be string.";
  }
  if (
    location.address.trim() === 0 ||
    location.city.trim() === 0 ||
    location.state.trim() === 0 ||
    location.zipCode.trim() === 0
  ) {
    throw "Location fields cannot be empty strings.";
  }
  location.address = location.address.trim();
  location.city = location.city.trim();
  location.state = location.state.trim();
  location.zipCode = location.zipCode.trim();
  const states = new Set([
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]);

  if (!states.has(location.state.toUpperCase())) throw "Invalid state";

  const zipReg = /^\d{5}$/;
  if (!zipReg.test(location.zipCode)) throw "Invalid zip code";
};

export const validPetStore = (storeName, operationHours, location) => {
  if (!storeName) throw "Must provide a store name.";
  if (typeof storeName !== "string") throw "Store name must be a string.";
  if (storeName.trim().length === 0) {
    throw "Store name cannot be an empty string.";
  }
  storeName = storeName.trim();

  if (typeof operationHours !== "object" || Array.isArray(operationHours)) {
    throw "Operation hours must be an object.";
  }

  if (!operationHours.open || !operationHours.close) {
    throw "All info must be provided for operation hours.";
  }

  if (
    typeof operationHours.open !== "string" ||
    typeof operationHours.close !== "string"
  ) {
    throw "All fields in operation hours must be a string.";
  }
  const timeReg = /^(0?[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/;
  if (
    !timeReg.test(operationHours.open) ||
    !timeReg.test(operationHours.close)
  ) {
    throw "Time must be in valid format.";
  }

  if (typeof location !== "object" || Array.isArray(location)) {
    throw "Location must be an object.";
  }

  if (
    !location.address ||
    !location.city ||
    !location.state ||
    !location.zipCode
  ) {
    throw "All information must be provided for store location.";
  }

  if (
    typeof location.address !== "string" ||
    typeof location.city !== "string" ||
    typeof location.state !== "string" ||
    typeof location.zipCode !== "string"
  ) {
    throw "All fields in store location must be strings.";
  }
  if (
    location.address.trim().length === 0 ||
    location.city.trim().length === 0 ||
    location.state.trim().length === 0 ||
    location.zipCode.trim().length === 0
  ) {
    throw "Location fields cannot be empty strings.";
  }
  location.address = location.address.trim();
  location.city = location.city.trim();
  location.state = location.state.trim();
  location.zipCode = location.zipCode.trim();
  const states = new Set([
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]);

  if (!states.has(location.state.toUpperCase())) throw "Invalid state";

  const zipReg = /^\d{5}$/;
  if (!zipReg.test(location.zipCode)) throw "Invalid zip code.";
};

export const validReview = (reviewTitle, rating, reviewDescription) => {
  if (
    reviewTitle === null ||
    reviewTitle === undefined ||
    rating === null ||
    rating === undefined ||
    reviewDescription === null ||
    reviewDescription === undefined
  ) {
    throw "All fields must be defined";
  }

  if (
    typeof reviewTitle !== "string" ||
    typeof reviewDescription !== "string"
  ) {
    throw "Inputs MUST be strings";
  }

  reviewTitle = reviewTitle.trim();
  reviewDescription = reviewDescription.trim();

  if (reviewTitle === "" || reviewDescription === "") {
    throw "Inputs cannot be empty or empty strings with just spaces";
  }

  if (typeof rating !== "number") {
    throw "Rating must be a number!";
  }

  if (rating < 1 || rating > 5) {
    throw "Ratings can only be on a scale from 1 to 5.";
  }
};

export const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

export const validPet = (petName, petType, petBreed) => {
  petName = petName.trim();
  petType = petType.trim();
  petBreed = petBreed.trim();

  if (!petName || !petType || !petBreed) throw "All pet information must be supplied";

  if (typeof petName !== 'string') throw "Pet name must be a string";
  if (typeof petType !== 'string') throw "Pet type must be a string";
  if (typeof petBreed !== 'string') throw "Pet breed must be a string";
}