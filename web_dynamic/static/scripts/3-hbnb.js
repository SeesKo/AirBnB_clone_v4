$(document).ready(function () {
  const selectedAmenities = {};

  $('input[type="checkbox"]').click(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

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

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    success: function (data) {
      const $placesSection = $('section.places');
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
