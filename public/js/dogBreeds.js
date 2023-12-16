(function ($) {
  // Get reference to breed selection dropdown
  let $breedSelect = $('#petBreedSelect');

  // Function to handle successful AJAX response
  function handleResponse(response) {
    if (response.status === 'success') {
      const breeds = response.message;
      $.each(breeds, function(breed, subBreeds) {
        $breedSelect.append($('<option>').val(breed).text(breed));
        if (subBreeds.length) {
          subBreeds.forEach(function(subBreed) {
            $breedSelect.append($('<option>').val(breed + '/' + subBreed).text(breed + ' ' + subBreed));
          });
        }
      });
    } else {
      console.error('Failed to retrieve breeds:', response.message);
    }
  }

  // Function to handle AJAX failure
  function handleError(jqXHR, textStatus, errorThrown) {
    console.error('AJAX call failed:', textStatus, errorThrown);
  }

  // Function to make AJAX call to get dog breeds
  function getDogBreeds() {
    let requestConfig = {
      method: 'GET',
      url: 'https://dog.ceo/api/breeds/list/all',
      dataType: 'json'
    };

    $.ajax(requestConfig).done(handleResponse).fail(handleError);
  }

  // When the document is ready, make the AJAX call
  $(document).ready(function() {
    getDogBreeds();
  });
})(window.jQuery);
