//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

export const validFN = (firstName) => {
    if (firstName === null) {
      return false;
    }
    if(firstName.trim() === "" || typeof firstName.trim() !== "string" || firstName.trim().length < 2 || firstName.trim().length > 25 || /\d/.test(firstName.trim())) {
      return false;
    }
    return true;
  }
  
  export const validLN = (lastName) => {
    if (lastName === null) {
      return false;
    }
    if(lastName.trim() === "" || typeof lastName.trim() !== "string" || lastName.trim().length < 2 || lastName.trim().length > 25 || /\d/.test(lastName.trim())) {
      return false;
    }
    return true;
  }
  
  export const validEmail = (emailAddress) => { 
    if (emailAddress === null) {
      return false;
    }
  
    if(typeof emailAddress.trim() !== "string" || emailAddress.trim() === "" || !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailAddress.trim())) {
      return false;
    }
    return true;
  }
  
  export const validPass = (password) => {
    if (password === null) {
      return false;
    }
    if(password.trim() === "" || typeof password.trim() !== "string" || password.trim().length < 8) {
      return false;
    }
  
    if(!/[A-Z]/.test(password.trim())) {
      return false;
    }
  
    if(!/\d/.test(password.trim())) {
      return false;
    }
  
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(password.trim())){
      return false;
    }
    return true;
  }
  
  export const validRole = (role) => {
    if (role !== "admin" && role !== "user") {
      return false;
    }
    return true;
  }

  export const validUser = (user) => {
    if (user === null) {
      return false;
    }
    if (user.trim() === '' || typeof user !== "string" || user.trim().length > 25) {
      return false;
    }
    return true;
  }
  
  export const isAdmin = (role) => {
    if (role === "admin") {
      return true;
    }
    return false;
  }
  
  export const test = (role) => {
    if (role == "admin") {
      return res.redirect('/admin');
    }
    else {
      return res.redirect('/protected');
    }
  }
  
  