import xss from "xss";

(function () {
  // Validation methods
  const validationMethods = {
    validateName(name) {
      name = xss(name);
      if (typeof name !== "sring")
        throw new Error("Name input must be a string");
      if (!name) throw new Error("Name input is required");
      if (name.length < 2 || name.length > 50)
        throw new Error("Name must be between 2 and 50 characters long.");
    },
    validateZipCode(zipCode) {
      zipCode = xss(zipCode);
      const zipCodeRegex = /^[0-9]{5}$/;
      if (zipCode && !zipCodeRegex.test(zipCode))
        throw new Error("Invalid zip code format");
    },
    validateType(type) {
      type = xss(type);
      if (!type) throw new Error("Type selection is required");
    },
  };

  const adminPanelForm = document.getElementById("admin-search");

  if (adminPanelForm) {
    const nameInput = document.getElementById("name");
    const zipCodeInput = document.getElementById("zipCode");
    const typeSelect = document.getElementById("type");

    let errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    adminPanelForm.insertAdjacentElement("beforebegin", errorContainer);

    adminPanelForm.addEventListener("submit", (event) => {
      event.preventDefault();

      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = "";

      try {
        validationMethods.validateName(nameInput.value);
        validationMethods.validateZipCode(zipCodeInput.value);
        validationMethods.validateType(typeSelect.value);

        adminPanelForm.submit();
      } catch (e) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e.message;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
