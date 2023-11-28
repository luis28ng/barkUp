import { petStores } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
  async getAllPetStores() {
    const storeCollection = await petStores();
    let storeList = await storeCollection.find({}).toArray();
    if (!storeList) throw "Could not get stores.";
    return storeList;
  },

  async searchPetStores(searchCriteria) {
    // Search Criteria: [searchText, searchZip] from searchbar. At least one must be valid string.
    // If neither are provided it should be routed to getAllPetStores().
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
      if (!zipReg.test(searchZip)) throw "Invalid zip code.";
    }

    const storeCollection = await petStores();
    let storeList = null;

    if (searchText && searchZip) {
      //TODO: Check if mongo regex function for searchText is working.
      storeList = await storeCollection
        .find({
          $and: [
            { storeName: `/${searchText}/` },
            { "location.zipCode": { $eq: searchZip } },
          ],
        })
        .toArray();
    } else if (searchText) {
      storeList = await storeCollection
        .find({ storeName: `/${searchText}/` })
        .toArray();
    } else if (searchZip) {
      storeList = await storeCollection
        .find({
          "location.zipCode": { $eq: searchZip },
        })
        .toArray();
    }

    if (!storeList) throw "Could not get stores.";
    return storeList;
  },

  async searchPetStoresById(id) {
    if (!id) throw "Must provide ID.";
    if (typeof id !== "string") throw "ID must be a string";
    if (id.trim().length === 0) throw "ID cannot be an empty string.";
    if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    const storeCollection = await petStores();
    const store = await storeCollection.findOne({ _id: new ObjectId(id) });
    if (!store) throw "No store found.";
    return store;
  },

  async createPetStore(storeName, operationHours, location) {
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
      location.state.trim().length ||
      location.zipCode.trim().length
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

    let newStore = {
      storeName: storeName,
      operationHours: operationHours,
      location: location,
      rating: 0.0,
      reviews: [],
    };

    const storeCollection = await petStores();
    const insertInfo = await storeCollection.insertOne(newStore);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add store.";
    }
    const newId = insertInfo.insertedId.toString();
    const store = await this.searchPetStoresById(newId);
    return store;
  },

  async deletePetStores(id) {
    if (!id) throw "Must provide ID.";
    if (typeof id !== "string") throw "ID must be a string.";
    if (id.trim().length === 0) throw "ID cannot be an empty string.";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "Not a valid ID.";
    const storeCollection = await petStores();
    const deletionInfo = await storeCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!deletionInfo) throw "Could not delete store.";
    return {
      storeName: deletionInfo.storeName,
      deleted: true,
    };
  },

  async updatePetStore(id, storeName, operationHours, location) {
    if (!id) throw "Must provide ID.";
    if (typeof id !== "string") throw "ID must be a string.";
    if (id.trim().length === 0) throw "ID cannot be an empty string.";
    id = id.trim();
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
      location.state.trim().length ||
      location.zipCode.trim().length
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

    const storeCollection = await petStores();
    const currentStore = await this.searchPetStoresById(id);
    const updatedInfo = await storeCollection.findOneAndReplace(
      { _id: new ObjectId(id) },
      {
        storeName: storeName,
        operationHours: operationHours,
        location: location,
        rating: currentStore.rating,
        reviews: currentStore.reviews,
      },
      { returnDocument: "after" }
    );
    if (!updatedInfo) {
      throw "Could not update store.";
    }
    return updatedInfo;
  },
};

export default exportedMethods;
