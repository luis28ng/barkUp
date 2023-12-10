import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import {validFN, validLN, validEmail, validPass, validRole} from '../helpers.js';
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
      password,
      role) {
        firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();
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
  
    if (!validRole(role)) {
      throw new Error("Invalid role");
    }
  
  const newmail = emailAddress.toLowerCase();
  const getuser = await users();
  const user = await getuser.findOne({emailAddress: newmail});
  
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
    role
  };
  
  const insertResult = await getuser.insertOne(newuser);
  
  if (!insertResult.acknowledged || !insertResult.insertedId) {
    throw new Error("Error in Register");
  }
  
  return {insertedUser: true};
    },





  async loginUser (emailAddress, password) {
      emailAddress = emailAddress.trim();
  password = password.trim();
  if(!validEmail(emailAddress) || !validPass(password)){
    throw new Error("Invalid email or password");
  };
  try{
  const newmail = emailAddress.toLowerCase();
  const getuser = await users();
  const user = await getuser.findOne({emailAddress: newmail});
  
  if (!user) {
    throw new Error("Either the email address or password is invalid");
  }
  
  const match = await bcrypt.compare(password, user.password);
  
  if(!match){
    throw new Error("Either the email address or password is invalid");
  }
  
  const result = {
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    role: user.role
  }
  return result;
  }
  catch(e){
    throw new Error("Login error");
  }
    }
};

export default exportedMethods