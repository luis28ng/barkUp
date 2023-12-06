import { parks } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
  async getAllParks() {
    const parkCollection = await parks();
    let parkList = await parkCollection.find({}).toArray();
    if (!parkList) throw "Could not get parks.";
    return parkList;
  },

  async searchParks(searchCriteria) {
    // Search Criteria: [searchText, searchZip] from searchbar. At least one must be valid string.
    // If neither are provided it should be routed to getAllParks().
    if (
      !searchCriteria ||
      !Array.isArray(searchCriteria) ||
      searchCriteria.length !== 2
    ) {
      throw "Please provide valid search criteria.";
    }
    const searchText = searchCriteria[0];
    const searchZip = searchCriteria[1];
    if (!searchText && !searchZip) throw "Must provide text or zip code.";
    if (searchText) {
      if (typeof searchText !== "string") throw "Text must be a string.";
      searchText = searchText.trim();
      if (searchText.length === 0) throw "Text cannot be an empty string.";
    }
    if (searchZip) {
      if (typeof searchZip !== "string") throw "Zip code must be a string.";
      searchZip = searchZip.trim();
      const zipReg = /^\d{5}$/;
      if (!zipReg.test(searchZip)) throw "Invalid zip code";
    }

    const parkCollection = await parks();
    let parkList = null;

    if (searchText && searchZip) {
      //TODO: Check if mongo regex function for searchText is working.
      parkList = await parkCollection
        .find({
          $and: [
            { parkName: `/${searchText}/` },
            { "location.zipCode": { $eq: searchZip } },
          ],
        })
        .toArray();
    } else if (searchText) {
      parkList = await parkCollection
        .find({ parkName: `/${searchText}/` })
        .toArray();
    } else if (searchZip) {
      parkList = await parkCollection
        .find({
          "location.zipCode": { $eq: searchZip },
        })
        .toArray();
    }

    if (!parkList) throw "Could not get parks.";
    return parkList;
  },

  async searchParksById(id) {
    if (!id) throw "Must provide ID.";
    if (typeof id !== "string") throw "ID must be a string.";
    if (id.trim().length === 0) throw "ID cannot be an empty string.";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    const parkCollection = await parks();
    const park = await parkCollection.findOne({ _id: new ObjectId(id) });
    if (!park) throw "No park found.";
    return park;
  },

  async createParks(parkName, location) {
    if (!parkName) throw "Must provide park name.";
    if (typeof parkName !== "string") throw "Park name must be a string.";
    if (parkName.trim().length === 0) {
      throw "Park name cannot be an empty string.";
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
      throw "All information must be provided for park location.";
    }

    if (
      typeof location.address !== "string" ||
      typeof location.city !== "string" ||
      typeof location.state !== "string" ||
      typeof location.zipCode !== "string"
    ) {
      throw "All fields in park location must be strings.";
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

    if (!states.has(location.state.toUpperCase())) throw "Invalid state.";

    const zipReg = /^\d{5}$/;
    if (!zipReg.test(location.zipCode)) throw "Invalid zip code.";

    let newPark = {
      parkName: parkName,
      location: location,
      rating: 0.0,
      reviews: [],
    };

    const parkCollection = await parks();
    const insertInfo = await parkCollection.insertOne(newPark);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add park.";
    }
    const newId = insertInfo.insertedId.toString();
    const park = await this.searchParksById(newId);
    return park;
  },

  async deleteParks(id) {
    if (!id) throw "Must provide ID.";
    if (typeof id !== "string") throw "ID must be a string.";
    if (id.trim().length === 0) throw "ID cannot be an empty string.";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    const parkCollection = await parks();
    const deletionInfo = await parkCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!deletionInfo) throw "Could not delete park.";
    return {
      parkName: deletionInfo.parkName,
      deleted: true,
    };
  },

  async updateParks(id, parkName, location) {
    if (!id) throw "Must provide ID.";
    if (typeof id !== "string") throw "ID must be a string.";
    if (id.trim().length === 0) throw "ID cannot be an empty string.";
    id = id.trim();

    if (!ObjectId.isValid(id)) throw "Not a valid ID.";
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

    const parkCollection = await parks();
    const currentPark = await this.searchParksById(id);
    const updatedInfo = await parkCollection.findOneAndReplace(
      { _id: new ObjectId(id) },
      {
        parkName: parkName,
        location: location,
        rating: currentPark.rating,
        reviews: currentPark.reviews,
      },
      { returnDocument: "after" }
    );
    if (!updatedInfo) {
      throw "Could not update park.";
    }
    return updatedInfo;
  },
};

export default exportedMethods;
