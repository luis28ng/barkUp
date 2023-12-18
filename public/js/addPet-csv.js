

(function () {
  // Validation methods
  const validationMethods = {
    validateName(name) {
      name = filterXSS(name);
      if (typeof name !== "string")
        throw new Error("Name input must be a string");
      if(name.trim() === ''){
        throw new Error("Name input cant be empty or just spaces");
      }
      if (!name) throw new Error("Name input is required");
      if (name.length < 2 || name.length > 50)
        throw new Error("Name must be between 2 and 50 characters long.");
    },
    validateType(type) {
      type = filterXSS(type);
      if (!type) throw new Error("Type selection is required");
    },
  };

  const addPetForm = document.getElementById("addPetForm");

  if (addPetForm) {
    const petName = document.getElementById("petNameInput");

    let errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    addPetForm.insertAdjacentElement("beforebegin", errorContainer);

    addPetForm.addEventListener("submit", (event) => {
      event.preventDefault();

      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = "";

      try {
        validationMethods.validateName(petName.value);

        addPetForm.submit();
      } catch (e) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e.message;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();