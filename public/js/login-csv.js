
(function () {
  // Validation methods
  const validationMethods = {
    validatePassword(password) {
      password = filterXSS(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (typeof password !== "string")
        throw new Error("Password input must be a string");
      if (!password) throw new Error("Password input is required");
      if (password.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (!hasUppercase)
        throw new Error("Password must have at least one uppercase letter");
      if (!hasNumber) throw new Error("Password must have at least one number");
      if (!hasSpecialCharacter)
        throw new Error("Password must have at least one special character");
    },
    
    validateUsername(username) {
      username = filterXSS(username);
      if (!username){
        throw new Error("Username input is required");
      }
      if (username.trim() === '' || username.length > 25) {
        throw new Error("Invalid username format");
      }
    }
  };

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    const userNameInput = document.getElementById("userNameInput");
    const passwordInput = document.getElementById("passwordInput");

    // Create a new error container to hold and show errors
    let errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    loginForm.insertAdjacentElement("beforebegin", errorContainer);

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Hide error container by default
      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = ""; // Clear previous errors

      try {
        // Validate input values
        validationMethods.validateUsername(userNameInput.value);
        validationMethods.validatePassword(passwordInput.value);

        // If validation passes, submit the form
        loginForm.submit();
      } catch (e) {
        // Show error message
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e.message;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
