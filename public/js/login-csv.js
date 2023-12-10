(function () {
  // Validation methods
  const validationMethods = {
    validateEmail(email) {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!email) throw new Error("Email address input is required");
      if (!emailRegex.test(email))
        throw new Error("Invalid email address format");
      return true;
    },
    validatePassword(password) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!password) throw new Error("Password input is required");
      if (password.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (!hasUppercase)
        throw new Error("Password must have at least one uppercase");
      if (!hasNumber) throw new Error("Password must have at least one number");
      if (!hasSpecialCharacter)
        throw new Error("Password must have at least one special character.");
      return true;
    },
  };

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    const emailInput = document.getElementById("emailAddressInput");
    const passwordInput = document.getElementById("passwordInput");

    // Create a new error container to hold and show errors
    errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    loginForm.insertAdjacentElement("beforebegin", errorContainer);

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Hide error container by default
      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = ""; // Clear previous errors

      try {
        // Validate input values
        validationMethods.validateEmail(emailInput.value);
        validationMethods.validatePassword(passwordInput.value);

        // If validation passes, submit the form
        loginForm.submit();
      } catch (e) {
        // Show error message
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
