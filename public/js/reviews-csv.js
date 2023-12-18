
(function reviewValidation() {
  const form = document.getElementById("review-form");
  let errorDiv = document.getElementById("error");
  let reviewTitle = document.getElementById("reviewTitle");
  let rating = document.getElementById("rating");
  let reviewDescription = document.getElementById("reviewDescription");

  if (form) {
    form.addEventListener("submit", (event) => {
      let error = false;

      console.log("form submitted");
      console.log(reviewTitle.value);
      console.log(rating.value);
      console.log(reviewDescription.value);

      try {
        reviewTitle.value = checkString(reviewTitle.value, "Review title");
      } catch (e) {
        error = true;
        errorDiv.innerHTML = e;
        errorDiv.hidden = false;

        event.preventDefault();
      }

      if (reviewTitle.value.length < 2 || reviewTitle.value.length > 50) {
        error = true;
        errorDiv.innerHTML =
          "The title can not be less than 2 characters or more than 50";
        errorDiv.hidden = false;

        event.preventDefault();
      }

      try {
        reviewDescription.value = checkString(
          reviewDescription.value,
          "Review description"
        );
      } catch (e) {
        error = true;
        errorDiv.innerHTML = e;
        errorDiv.hidden = false;

        event.preventDefault();
      }

      if (
        reviewDescription.value.length < 2 ||
        reviewDescription.value.length > 150
      ) {
        error = true;
        errorDiv.innerHTML =
          "The description can not be less than 2 characters or more than 150";
        errorDiv.hidden = false;

        event.preventDefault();
      }

      if (!rating) {
        error = true;
        errorDiv.innerHTML = "Rating can only be a number between 1-5";
        errorDiv.hidden = false;

        event.preventDefault();
      }

      if (rating < 1 || rating > 5) {
        error = true;
        errorDiv.innerHTML = "Rating can only be a number between 1-5";
        errorDiv.hidden = false;

        event.preventDefault();
      }

      if (error === false) {
        errorDiv.hidden = true;
        return true;
      }

      event.preventDefault();
    });
  }

  function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = filterXSS(strVal.trim());
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  }
})();
