import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  validFN,
  validLN,
  validEmail,
  validPass,
  validUser,
  validRole
} from "../helpers.js";
import bcrypt from "bcrypt";

const exportedMethods = {
  async registerUser (firstName,
    lastName,
    emailAddress,
    username,
    password,
    role) {


  if(!validFN(firstName)){
    throw new Error("First name must be a non empty string, not containing numbers and should be at least 2 characters long with a max of 25 characters")
  };
  if (!validLN(lastName)) {
    throw new Error("Last name must be a non empty string, not containing numbers and should be at least 2 characters long with a max of 25 characters");
  }

  if (!validEmail(emailAddress)) {
    throw new Error("Invalid email address");
  }

  if (!validPass(password)) {
    throw new Error("Invalid password");
  }

  if (!validUser(username)) {
    throw new Error("Invalid Username");
  }

  if (!validRole(role)) {
    throw new Error("Invalid role");
    }

  firstName = firstName.trim();
  lastName = lastName.trim();
  emailAddress = emailAddress.trim();
  password = password.trim();
  username = username.trim();
  role = role.trim();

const newmail = emailAddress.toLowerCase();
const lowername = username.toLowerCase();
const getuser = await users();
const usermail = await getuser.findOne({emailAddress: newmail});
const useruser = await getuser.findOne({username: lowername});

  if (usermail) {
    throw new Error("Email address already in use");
  }

  if (useruser) {
    throw new Error("Username already in use");
  }

const saltRounds = 10;
const newpass = await bcrypt.hash(password, saltRounds);

const newuser = {
  firstName,
  lastName,
  emailAddress: newmail,
  username: lowername,
  password: newpass,
  role
};

const insertResult = await getuser.insertOne(newuser);

if (!insertResult.acknowledged || !insertResult.insertedId) {
  throw new Error("Error in Register");
}

return {insertedUser: true};
},

  async loginUser (username, password) {
    
    if(!validPass(password) || !validUser(username)){
      throw new Error("Invalid credentials");
    };
    password = password.trim();
    username = username.trim();
    try{
    const newuser = username.toLowerCase();
    const getuser = await users();
    const user = await getuser.findOne({username: newuser});
    
    if (!user) {
      throw new Error("Either the username or password is invalid");
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if(!match){
      throw new Error("Either the username or password is invalid");
    }

    const userId = user._id.toString()
    
    const result = {
      userId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      username: user.username,
      role: user.role
    }
    return result;
    
    }
    catch(e){
      throw new Error("Login error");
    }
      },

  async updateUser(userId, firstName, lastName, emailAddress, password, role) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const updates = {};
    if (firstName) {
      if (!validFN(firstName)) throw new Error("Invalid first name");
      firstName = firstName.trim();
      updates.firstName = firstName;
    }
    if (lastName) {
      if (!validLN(lastName)) throw new Error("Invalid last name");
      lastName = lastName.trim();
      updates.lastName = lastName;
    }
    if (emailAddress) {
      if (!validEmail(emailAddress)) throw new Error("Invalid email address");
      lastName = lastName.trim();
      updates.emailAddress = emailAddress;
    }
    if (password) {
      if (!validPass(password)) throw new Error("Invalid password");
      const saltRounds = 10;
      password = password.trim();
      updates.password = await bcrypt.hash(password, saltRounds);
    }
    if (role) {
      if (!validRole(role)) throw new Error("Invalid role");
      role = role.trim();
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
