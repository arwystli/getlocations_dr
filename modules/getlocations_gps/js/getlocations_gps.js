
/**
 * @file
 * getlocations_gps.js
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_gps module for Drupal 7
 */

(function ($) {
  Drupal.getlocations_gps = {};
  Drupal.getlocations_gps.dolocation = function(key, settings) {
    active_throbber(key);
    var gps_marker = Drupal.getlocations.getIcon(settings.getlocations_gps[key].gps_marker);
    var gps_marker_title = settings.getlocations_gps[key].gps_marker_title;
    var gps_bubble = settings.getlocations_gps[key].gps_bubble;
    var gps_geocode = settings.getlocations_gps[key].gps_geocode;
    var gps_center = settings.getlocations_gps[key].gps_center;
    var gs = Drupal.getlocations_settings[key];
    var accuracies = [];
    accuracies['APPROXIMATE'] = Drupal.t('Approximate');
    accuracies['GEOMETRIC_CENTER'] = Drupal.t('Center');
    accuracies['RANGE_INTERPOLATED'] = Drupal.t('Interpolated');
    accuracies['ROOFTOP'] = Drupal.t('Exact');
    gs.markdone = gps_marker;
    var result = [];
    result['lat'] = false;
    result['lon'] = false;
    result['formatted_address'] = '';
    gs.markeraction = 0;
    gs.useLink = false;
    Drupal.getlocations_gps.marker = Drupal.getlocations_gps.marker || [];
    if (Drupal.getlocations_gps.marker[key] !== undefined) {
      Drupal.getlocations_gps.marker[key].setMap();
      Drupal.getlocations_gps.marker = [];
    }
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          result['lat'] = position.coords.latitude;
          result['lon'] = position.coords.longitude;
          var p = new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
          if (gps_geocode) {
            // start geocoder
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': p}, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                result['formatted_address'] = results[0].formatted_address;
                result['lat'] = results[0].geometry.location.lat();
                result['lon'] = results[0].geometry.location.lng();
                var customContent = '';
                if (gps_bubble) {
                  customContent = '<div class="location vcard">';
                  customContent += '<h4>' + gps_marker_title + '</h4>';
                  customContent += '<div class="adr">' + result['formatted_address'];
                  if (results[0].geometry.location_type) {
                    customContent += '<br />' + Drupal.t('Accuracy') + ' : ' + accuracies[results[0].geometry.location_type];
                  }
                  customContent += '</div></div>';
                  gs.useCustomContent = true;
                  gs.useInfoBubble = (Drupal.settings.getlocations[key].markeraction == 2 ? true : false);
                  gs.markeraction = Drupal.settings.getlocations[key].markeraction;
                }
                var ll = new google.maps.LatLng(parseFloat(result['lat']), parseFloat(result['lon']));
                Drupal.getlocations_gps.marker[key] = Drupal.getlocations.makeMarker(Drupal.getlocations_map[key], gs, result['lat'], result['lon'], 0, gps_marker_title, '', customContent, '', key);
                Drupal.getlocations_gps.marker[key].setVisible(true);
                if (gps_center) {
                  Drupal.getlocations_map[key].setCenter(ll);
                }
                deactive_throbber(key);
              }
              else {
                deactive_throbber(key);
                var prm = {'!b': Drupal.getlocations.getGeoErrCode(status) };
                var msg = Drupal.t('Geocode was not successful for the following reason: !b', prm);
                alert(msg);
              }
            });
          }
          else {
            // no geocode done
            if (Drupal.getlocations_gps.marker[key] !== undefined) {
              Drupal.getlocations_gps.marker[key].setPosition(p);
            }
            else {
              Drupal.getlocations_gps.marker[key] = Drupal.getlocations.makeMarker(Drupal.getlocations_map[key], gs, result['lat'], result['lon'], 0, gps_marker_title, '', '', '', key);
              Drupal.getlocations_gps.marker[key].setVisible(true);
            }
            if (gps_center) {
              Drupal.getlocations_map[key].setCenter(p);
            }
            deactive_throbber(key);
          }
        },
        function(error) {
          deactive_throbber(key);
          msg = Drupal.t("Sorry, I couldn't find your location using the browser") + ' ' + Drupal.getlocations.geolocationErrorMessages(error) + ".";
          alert(msg);
        },
        {
          maximumAge:10000
        }
      ); // end getCurrentPosition
    } // end if navigator
    else {
      msg = Drupal.t('Sorry, no browser navigator available.');
      alert(msg);
    }
    // functions
    function deactive_throbber(k) {
      $("#getlocations_gps_throbber_" + k).removeClass('getlocations_gps_throbber_active');
      $("#getlocations_gps_throbber_" + k).addClass('getlocations_gps_throbber_inactive');
    }
    function active_throbber(k) {
      $("#getlocations_gps_throbber_" + k).removeClass('getlocations_gps_throbber_inactive');
      $("#getlocations_gps_throbber_" + k).addClass('getlocations_gps_throbber_active');
    }
    // end functions
  };

  Drupal.behaviors.getlocations_gps = {
    attach: function (context, settings) {

      $(".getlocations_map_canvas", context).once('getlocations-gps-map-processed', function(index, element) {
        var elemID = $(element).attr('id');
        var key = elemID.replace(/^getlocations_map_canvas_/, '');
        // is there really a map?
        if ($("#getlocations_map_canvas_" + key).is('div') && settings.getlocations_gps[key] !== undefined ) {
          // gps button
          $("#getlocations_gps_show_" + key).click( function() {
            Drupal.getlocations_gps.dolocation(key, settings);
          }); // end button click
        } //  end is there really a map?
      }); // end once
    } // end attach
  }; // end behaviors
}(jQuery));

