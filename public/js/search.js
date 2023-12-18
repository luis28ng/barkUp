
(function () {
  // Validation methods
  const validationMethods = {
    validateSearchText(searchText) {
      searchText = filterXSS(searchText);
      if (typeof searchText !== "string")
        throw new Error("Input must be string");
      if (!searchText) throw new Error("Search text is required");
      if (searchText.length < 2 || searchText.length > 50)
        throw new Error(
          "Search text must be between 2 and 50 characters long."
        );
    },
    validateZipCode(zipCode) {
      zipCode = filterXSS(zipCode);
      const zipCodeRegex = /^[0-9]{5}$/;
      if (zipCode && !zipCodeRegex.test(zipCode))
        throw new Error("Invalid zip code format");
    },
    validateType(type) {
      type = filterXSS(type);
      if (!type) throw new Error("Type selection is required");
    },
  };

  const searchForm = document.getElementById("search-form");

  if (searchForm) {
    const searchTextInput = document.getElementById("searchText");
    const searchZipInput = document.getElementById("searchZip");
    const typeSelect = document.getElementById("type");

    let errorContainer = document.createElement("div");
    errorContainer.classList.add("errors", "hidden");
    searchForm.insertAdjacentElement("beforebegin", errorContainer);

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = "";

      try {
        validationMethods.validateSearchText(searchTextInput.value);
        validationMethods.validateZipCode(searchZipInput.value);
        validationMethods.validateType(typeSelect.value);

        searchForm.submit();
      } catch (e) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = e.message;
        errorContainer.appendChild(errorMessage);
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
