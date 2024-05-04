$(document).ready(function() {
  const selectedAmenities = {};

  $('input[type="checkbox"]').click(function() {
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

  $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
    if (data.status === "OK") {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeclass('available');
    }
  });
});
