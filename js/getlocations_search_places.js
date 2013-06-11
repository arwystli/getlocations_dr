/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations search_places support
 * jquery stuff
*/
(function ($) {

  var sp_markers = [];

  Drupal.getlocations_search_places = function(key) {
    // attach it
    var getlocations_search_places_Box = new google.maps.places.SearchBox(document.getElementById('search_places_input_' + key));
    getlocations_search_places_Box.bindTo('bounds', getlocations_map[key]);
    google.maps.event.addListener(getlocations_search_places_Box, 'places_changed', function() {
      var places = getlocations_search_places_Box.getPlaces();

      // clear out existing markers
      Drupal.getlocations_search_places_clearmarkers(key, false);
      for (var ip = 0; ip < places.length; ip++) {
        var place = places[ip];
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        var sp_marker = new google.maps.Marker({
          map: getlocations_map[key],
          icon: image,
          title: place.name,
          position: place.geometry.location
        });
        do_sp_bubble(sp_marker, place, key);
        sp_markers.push(sp_marker);
      }
    });

  }

  function do_sp_bubble(marker, place, key) {

    var ver = Drupal.getlocations.msiedetect();
    var pushit = false;
    if ( (ver == '') || (ver && ver > 8)) {
      pushit = true;
    }
    var sp_content = "";
    sp_content += '<div class="location vcard container-inline">';
    sp_content += '<div class="sp_left1">';
    sp_content += '<img class="placeIcon" src="' + place.icon + '"/>';
    sp_content += '</div>';
    sp_content += '<div class="sp_left2">';
    if (place.url !== undefined) {
      sp_content += '<h4><a href="' + place.url + '">' + place.name + '</a></h4>';
    }
    else {
      sp_content += '<h4>' + place.name + '</h4>';
    }
    if (place.formatted_address !== undefined) {
      sp_content += '<p>' + place.formatted_address + '</p>';
    }
    if (place.formatted_phone_number !== undefined) {
      sp_content += '<p>' + place.formatted_phone_number + '</p>';
    }
    else if (place.international_phone_number !== undefined) {
      sp_content += '<p>' + place.international_phone_number + '</p>';
    }
    if (place.website !== undefined) {
      sp_content += '<p>' + place.website + '</p>';
    }
    sp_content += '</div>';
    sp_content += '</div>';

    google.maps.event.addListener(marker, 'click', function() {
      // close any previous instances
      if (pushit) {
        for (var i in getlocations_settings[key].infoBubbles) {
          getlocations_settings[key].infoBubbles[i].close();
        }
      }
      if (getlocations_settings[key].markeraction == 2) {
        var sp_iw = new InfoBubble({content: sp_content});
      }
      else {
        var sp_iw = new google.maps.InfoWindow({content: sp_content});
      }
      sp_iw.open(getlocations_map[key], marker);
      if (pushit) {
        getlocations_settings[key].infoBubbles.push(sp_iw);
      }
    });

  }

  Drupal.getlocations_search_places_clearmarkers = function(key, state) {
    // clear out existing markers
    for (var i = 0; i < sp_markers.length; i++) {
      sp_marker = sp_markers[i]
      sp_marker.setMap(null);
    }
    sp_markers = [];
    if (state) {
      $("#search_places_input_" + key).val('');
    }
  }

}(jQuery));
