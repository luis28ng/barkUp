(function () {
  // Validation methods
  const validationMethods = {
    validateName(name) {
      const hasLettersOnly = /^[a-zA-Z]+$/.test(name);
      if (!name) throw new Error("Name input is required");
      if (!hasLettersOnly) throw new Error("Name ");
      if (name.length < 2 || name.length > 25)
        throw new Error("Name must be between 2 and 25 characters long.");
    },
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
    confirmPassword(password, confirmPassword) {
      if (password !== confirmPassword)
        throw new Error("Passwords do not match");
      return true;
    },
  };

  const registrationForm = document.getElementById("registration-form");

  if (registrationForm) {
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const emailInput = document.getElementById("emailAddressInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordInput = document.getElementById(
      "confirmPasswordInput"
    );

    // Error container to hold and show errors

    errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    registrationForm.insertAdjacentElement("beforebegin", errorContainer);

    registrationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Hide and clear error container by default
      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = "";

      try {
        // Validate input values
        validationMethods.validateName(firstNameInput.value);
        validationMethods.validateName(lastNameInput.value);
        validationMethods.validateEmail(emailInput.value);
        validationMethods.validatePassword(passwordInput.value);
        validationMethods.confirmPassword(
          passwordInput.value,
          confirmPasswordInput.value
        );

        // If validation passes, submit the form
        registrationForm.submit();
      } catch (e) {
        // Show error messages
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
