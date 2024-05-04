$(document).ready(function () {
  const selectedAmenities = {};
  const selectedLocations = { states: {}, cities: {} };

  $('input[type="checkbox"]').click(function () {
    const itemId = $(this).data('id');
    const itemName = $(this).data('name');

    if ($(this).closest('ul').parent().has('h2').length) {
      if ($(this).is(':checked')) {
        selectedLocations.states[itemId] = itemName;
      } else {
        delete selectedLocations.states[itemId];
      }
    } else {
      const stateNode = $(this).closest('ul').parent().find('h2');
      if (stateNode.length) {
        if ($(this).is(':checked')) {
          selectedLocations.cities[itemId] = itemName;
        } else {
          delete selectedLocations.cities[itemId];
        }
      } else {
        if ($(this).is(':checked')) {
          selectedAmenities[itemId] = itemName;
        } else {
          delete selectedAmenities[itemId];
        }
      }
    }

    const stateNames = Object.values(selectedLocations.states).join(', ');
    $('.locations h4').text(stateNames);

    const amenityNames = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenityNames);
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

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
        $placesSection.empty();

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

          $placesSection.append($article);
        });
      },
      error: function (err) {
        console.error('Error fetching places:', err);
      }
    });
  });
});
