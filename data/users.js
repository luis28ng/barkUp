import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import {validFN, validLN, validEmail, validPass, validUser, validRole} from '../helpers.js';
import bcrypt from 'bcrypt';

let exportedMethods = {

    async getAllUsers () {

    },

    async createUser () {

    },

    async deleteUser () {

    },

    async updateUser () {

    },





    async registerUser (firstName,
      lastName,
      emailAddress,
      username,
      password,
      role) {
    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();
    username = username.trim();
    role = role.trim();
  
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
  password = password.trim();
  username = username.trim();
  if(!validPass(password) || !validUser(username)){
    throw new Error("Invalid credentials");
  };
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
  
  const result = {
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    username: user.username,
    role: user.role
  }
  console.log(result);
  return result;
  
  }
  catch(e){
    throw new Error("Login error");
  }
    }
};

export default exportedMethods