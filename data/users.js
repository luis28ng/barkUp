import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  validFN,
  validLN,
  validEmail,
  validPass,
  validRole,
} from "../helpers.js";
import bcrypt from "bcrypt";

const exportedMethods = {
  async registerUser(firstName, lastName, emailAddress, password, role) {
    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();
    role = role.trim();

    if (!validFN(firstName)) {
      throw new Error(
        "First name must be a non empty string, not containing numbers and should be at least 2 characters long with a max of 25 characters"
      );
    }
    if (!validLN(lastName)) {
      throw new Error(
        "Last name must be a non empty string, not containing numbers and should be at least 2 characters long with a max of 25 characters"
      );
    }

    if (!validEmail(emailAddress)) {
      throw new Error("Invalid email address");
    }

    if (!validPass(password)) {
      throw new Error("Invalid password");
    }

    if (!validRole(role)) {
      throw new Error("Invalid role");
    }

    const newmail = emailAddress.toLowerCase();
    const getuser = await users();
    const user = await getuser.findOne({ emailAddress: newmail });

    if (user) {
      throw new Error("Email address already in use");
    }

    const saltRounds = 10;
    const newpass = await bcrypt.hash(password, saltRounds);

    const newuser = {
      firstName,
      lastName,
      emailAddress: newmail,
      password: newpass,
      role,
    };

    const insertResult = await getuser.insertOne(newuser);

    if (!insertResult.acknowledged || !insertResult.insertedId) {
      throw new Error("Error in Register");
    }

    return insertResult;
  },

  async loginUser(emailAddress, password) {
    emailAddress = emailAddress.trim();
    password = password.trim();
    if (!validEmail(emailAddress) || !validPass(password)) {
      throw new Error("Invalid email or password");
    }
    try {
      const newmail = emailAddress.toLowerCase();
      const getuser = await users();
      const user = await getuser.findOne({ emailAddress: newmail });

      if (!user) {
        throw new Error("Either the email address or password is invalid");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new Error("Either the email address or password is invalid");
      }

      const result = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        role: user.role,
      };
      //console.log(result);
      return result;
    } catch (e) {
      throw new Error("Login error");
    }
  },
  async updateUser(userId, firstName, lastName, emailAddress, password, role) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const updates = {};
    if (firstName) {
      firstName = firstName.trim();
      if (!validFN(firstName)) throw new Error("Invalid first name");
      updates.firstName = firstName;
    }
    if (lastName) {
      lastName = lastName.trim();
      if (!validLN(lastName)) throw new Error("Invalid last name");
      updates.lastName = lastName;
    }
    if (emailAddress) {
      emailAddress = emailAddress.trim().toLowerCase();
      if (!validEmail(emailAddress)) throw new Error("Invalid email address");
      updates.emailAddress = emailAddress;
    }
    if (password) {
      password = password.trim();
      if (!validPass(password)) throw new Error("Invalid password");
      const saltRounds = 10;
      updates.password = await bcrypt.hash(password, saltRounds);
    }
    if (role) {
      role = role.trim();
      if (!validRole(role)) throw new Error("Invalid role");
      updates.role = role;
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    const userCollection = await users();
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );

    if (!updateResult.matchedCount && !updateResult.modifiedCount) {
      throw new Error("Update failed");
    }

    return updateResult;
  },

  async removeUser(userId) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const userCollection = await users();
    const deletionResult = await userCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (!deletionResult.deletedCount) {
      throw new Error("Delete failed");
    }

    return deletionResult;
  },
};

export default exportedMethods;
