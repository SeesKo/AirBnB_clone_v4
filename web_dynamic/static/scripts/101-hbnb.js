$(document).ready(function () {
  // Dictionaries to store selected amenities, states, and cities
  const selectedAmenities = {};
  const selectedLocations = { states: {}, cities: {} };

  // Variable to track if reviews are visible
  let reviewsVisible = false;

  // Checkbox logic for tracking selected amenities, states, and cities
  $('input[type="checkbox"]').change(function () {
    const itemId = $(this).data('id');
    const itemName = $(this).data('name');

    if ($(this).is(':checked')) {
      if ($(this).closest('ul').parent().find('h2').length) {
        if ($(this).closest('ul').parent().has('h2').length) {
          // It's a state
          selectedLocations.states[itemId] = itemName;
        } else {
          // It's a city
          selectedLocations.cities[itemId] = itemName;
        }
      } else {
        // It's an amenity
        selectedAmenities[itemId] = itemName;
      }
    } else {
      if ($(this).closest('ul').parent().has('h2').length) {
        delete selectedLocations.states[itemId]; // If it's a state
      } else if ($(this).closest('ul').parent().find('h2').length) {
        delete selectedLocations.cities[itemId]; // If it's a city
      } else {
        delete selectedAmenities[itemId]; // If it's an amenity
      }
    }

    // Update state/city/amenity names
    const stateNames = Object.values(selectedLocations.states).join(', ');
    $('.locations h4').text(stateNames);

    const amenityNames = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenityNames);
  });

  // Toggle reviews on click
  $('#toggle-reviews').click(function () {
    const $reviewsSection = $('section.reviews');

    if (reviewsVisible) {
      $reviewsSection.find('div.review').remove(); // Remove all reviews
      $(this).text('show'); // Change text to "show"
      reviewsVisible = false; // Update state
    } else {
      // Fetch and display reviews
      $.get('http://0.0.0.0:5001/api/v1/reviews/', function (data) {
        data.forEach(function (review) {
          const $reviewDiv = $('<div class="review"></div>');
          $reviewDiv.append(`<strong>${review.user.first_name} ${review.user.last_name}</strong>`);
          $reviewDiv.append(`<p>${review.text}</p>`);
          $reviewsSection.append($reviewDiv); // Add review to section
        });
        $('#toggle-reviews').text('hide'); // Change text to "hide"
        reviewsVisible = true; // Update state
      });
    }
  });

  // POST request when "Search" button is clicked with selected filters
  $('#filter-button').click(function () {
    const amenityIds = Object.keys(selectedAmenities);
    const stateIds = Object.keys(selectedLocations.states);
    const cityIds = Object.keys(selectedLocations.cities);

    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: amenityIds, states: stateIds, cities: cityIds }),
      success: function (data) {
        const $placesSection = $('section.places');
        $placesSection.empty(); // Clear existing content

        // Add places based on response
        data.forEach(function (place) {
          const $article = $('<article></article>');

          const $titleBox = $('<div class="title_box"></div>');
          $titleBox.append(`<h2>${place.name}</h2>`);
          $titleBox.append(`<div class="price_by_night">$${place.price_by_night}</div>`);

          const $information = $('<div class="information"></div>');
          $information.append(`<div class="max_guest">${place.max_guest} Guest(s)</div>`);
          $information.append(`<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`);
          $information.append(`<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`);

          const $description = $('<div class="description"></div>').text(place.description);

          $article.append($titleBox);
          $article.append($information);
          $article.append($description);

          $placesSection.append($article); // Add new articles
        });
      },
      error: function (err) {
        console.error('Error fetching places:', err);
      }
    });
  });

  // API status check
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});
