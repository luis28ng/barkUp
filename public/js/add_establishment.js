import xss from "xss";

(function () {
  // Validation methods
  const validationMethods = {
    validateName(name) {
      name = xss(name);
      const hasLettersOnly = /^[a-zA-Z\s]+$/.test(name);
      if (typeof name !== "sring")
        throw new Error("Name input must be a string");
      if (!name) throw new Error("Name input is required");
      if (!hasLettersOnly)
        throw new Error("Name must contain letters and spaces only");
      if (name.length < 2 || name.length > 50)
        throw new Error("Name must be between 2 and 50 characters long.");
    },
    validateTime(time) {
      time = xss(time);
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/;
      if (!time) throw new Error("Time input is required");
      if (!timeRegex.test(time)) throw new Error("Invalid time format ");
    },
    validateAddress(address) {
      address = xss(address);
      if (typeof address !== "sring")
        throw new Error("Address input must be a string");
      if (!address) throw new Error("Address input is required");
      if (address.length < 5 || address.length > 100)
        throw new Error("Address must be between 5 and 100 characters long.");
    },
    validateZipCode(zipCode) {
      zipCode = xss(zipCode);
      const zipCodeRegex = /^[0-9]{5}$/;
      if (!zipCode) throw new Error("Zip code is required");
      if (!zipCodeRegex.test(zipCode)) throw new Error("Invalid zip code");
    },
    validateState(state) {
      state = xss(state);
      if (!state) throw new Error("State selection is required");
    },
  };

  const addEstablishmentForm = document.getElementById(
    "add-establishment-form"
  );

  if (addEstablishmentForm) {
    const nameInput = document.getElementById("name");
    const openTimeInput = document.getElementById("openTime");
    const closeTimeInput = document.getElementById("closeTime");
    const addressInput = document.getElementById("address");
    const cityInput = document.getElementById("city");
    const stateSelect = document.getElementById("state");
    const zipCodeInput = document.getElementById("zipCode");

    let errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    addEstablishmentForm.insertAdjacentElement("beforebegin", errorContainer);

    addEstablishmentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = "";

      try {
        validationMethods.validateName(nameInput.value);
        if (openTimeInput) validationMethods.validateTime(openTimeInput.value);
        if (closeTimeInput)
          validationMethods.validateTime(closeTimeInput.value);
        validationMethods.validateAddress(addressInput.value);
        validationMethods.validateName(cityInput.value);
        validationMethods.validateState(stateSelect.value);
        validationMethods.validateZipCode(zipCodeInput.value);

        addEstablishmentForm.submit();
      } catch (e) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e.message;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
