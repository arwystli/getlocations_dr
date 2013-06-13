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
  var places_service;

  Drupal.getlocations_search_places = function(key) {
    // attach it
    var getlocations_search_places_Box = new google.maps.places.SearchBox(document.getElementById('search_places_input_' + key));
    getlocations_search_places_Box.bindTo('bounds', getlocations_map[key]);
    google.maps.event.addListener(getlocations_search_places_Box, 'places_changed', function() {
      var places = getlocations_search_places_Box.getPlaces();
      places_service = new google.maps.places.PlacesService(getlocations_map[key]);

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

        sp_getdetails(sp_marker, place, key);

        sp_markers.push(sp_marker);
      }
    });

  }

  function do_sp_bubble(marker, p, key) {

    var ver = Drupal.getlocations.msiedetect();
    var pushit = false;
    if ( (ver == '') || (ver && ver > 8)) {
      pushit = true;
    }
    var main = '';
    if (p.formatted_address !== undefined) {
      main += '<p>' + p.formatted_address + '</p>';
    }
    if (p.formatted_phone_number !== undefined) {
      main += '<p>' + Drupal.t('Phone') + ': '  + p.formatted_phone_number + '</p>';
    }
    else if (p.international_phone_number !== undefined) {
      main += '<p>' + Drupal.t('Int. Phone') + ': ' + p.international_phone_number + '</p>';
    }
    if (p.website !== undefined) {
      main += '<p>' + Drupal.t('Web') + ': ' + '<a href="' + p.website + '" target="_blank" >' + p.name + '</a></p>';
    }
    if (p.url !== undefined) {
      main += '<p>' + Drupal.t('Google') + ': ' + '<a href="' + p.url + '" target="_blank" >' + p.name + '</a></p>';
    }

    photo = '';
    if (p.photos !== undefined && p.photos.length > 0 ) {
      if (p.photos.length > 1)   {
        // pick one at random
        rn = Math.floor((Math.random() * p.photos.length )+1);
      }
      else {
        rn = p.photos.length;
      }
      ph = p.photos[rn - 1].getUrl({'maxWidth': 75});
      photo += '<img class="sp_picture" src="' + ph + '" alt="' + p.name + '" title="' + p.name + '" />';
    }

    var sp_content = "";
    sp_content += '<div class="location vcard">';
    sp_content += '<div class="container-inline">';

    sp_content += '<div class="sp_left1">';
    sp_content += '<img class="placeIcon" src="' + p.icon + '"/>';
    sp_content += '</div>';
    sp_content += '<div class="sp_left2">';
    sp_content += '<h4>' + p.name + '</h4>';
    sp_content += '</div>';
    sp_content += '</div>';
    sp_content += '<div class="sp_main">';

    if (photo) {
    sp_content += '<div class="container-inline">';
      sp_content += '<div class="sp_left3">';
      sp_content += photo;
      sp_content += '</div>';
      sp_content += '<div class="sp_left4">';
      sp_content += main;
      sp_content += '</div>';
      sp_content += '</div>';
    }
    else {
      sp_content += main;
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

  function sp_getdetails(m, p, k) {
    places_service.getDetails({reference: p.reference}, function(result, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        do_sp_bubble(m, result, k);
      }
      else {
        do_sp_bubble(m, p, k);
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
