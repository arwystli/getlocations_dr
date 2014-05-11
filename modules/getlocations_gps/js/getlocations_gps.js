
/**
 * @file getlocations_gps.js
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_gps module for Drupal 7
 */

(function ($) {
  Drupal.behaviors.getlocations_gps = {
    attach: function (context, settings) {

      // functions
      function deactive_throbber(k) {
        $("#getlocations_gps_throbber_" + k).removeClass('getlocations_gps_throbber_active');
        $("#getlocations_gps_throbber_" + k).addClass('getlocations_gps_throbber_inactive');
      }
      // end functions

      $(".getlocations_map_canvas", context).once('getlocations-gps-map-processed', function(index, element) {
        var elemID = $(element).attr('id');
        var key = elemID.replace(/^getlocations_map_canvas_/, '');
        // is there really a map?
        if ($("#getlocations_map_canvas_" + key).is('div') && settings.getlocations_gps[key] !== undefined ) {
          var gps_marker = Drupal.getlocations.getIcon(settings.getlocations_gps[key].gps_marker);
          var gps_marker_title = settings.getlocations_gps[key].gps_marker_title;
          var gps_bubble = settings.getlocations_gps[key].gps_bubble;
          var gps_geocode = settings.getlocations_gps[key].gps_geocode;
          var gps_center = settings.getlocations_gps[key].gps_center;
          var gs = getlocations_settings[key];
          var getlocations_gps_marker = [];
          var accuracies = [];
          accuracies['APPROXIMATE'] = Drupal.t('Approximate');
          accuracies['GEOMETRIC_CENTER'] = Drupal.t('Center');
          accuracies['RANGE_INTERPOLATED'] = Drupal.t('Interpolated');
          accuracies['ROOFTOP'] = Drupal.t('Exact');
          if (gps_bubble ) {
            if (Drupal.settings.getlocations[key].markeraction == 2) {
              var infoBubble = {};
            }
            else {
              var infowindow = {};
            }
          }
          gs.markdone = gps_marker;
          // gps button
          $("#getlocations_gps_show_" + key).click( function() {
            var result = [];
            result['lat'] = false;
            result['lon'] = false;
            result['formatted_address'] = '';
            $("#getlocations_gps_throbber_" + key).removeClass('getlocations_gps_throbber_inactive');
            $("#getlocations_gps_throbber_" + key).addClass('getlocations_gps_throbber_active');
            gs.markeraction = 0;
            gs.useLink = false;
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
                        if (gps_bubble) {
                          var customContent = '';
                          customContent = '<div class="location vcard">';
                          customContent += '<h4>' + gps_marker_title + '</h4>';
                          customContent += '<div class="adr">' + result['formatted_address'];
                          if (results[0].geometry.location_type) {
                            customContent += '<br />' + Drupal.t('Accuracy') + ' : ' + accuracies[results[0].geometry.location_type];
                          }
                          customContent += '</div>';
                          customContent += '</div>';
                        }
                        var ll = new google.maps.LatLng(parseFloat(result['lat']), parseFloat(result['lon']));
                        if (getlocations_gps_marker[key] !== undefined) {
                          // already got a marker so reposition
                          getlocations_gps_marker[key].setPosition(ll);
                          if (gps_bubble && customContent) {
                            if (Drupal.settings.getlocations[key].markeraction == 2) {
                              if (infoBubble !== undefined) {
                                infoBubble.setContent(customContent);
                              }
                            }
                            else {
                              if (infowindow !== undefined) {
                                infowindow.setContent(customContent);
                              }
                            }
                          }
                          deactive_throbber(key);
                        }
                        else {
                          getlocations_gps_marker[key] = Drupal.getlocations.makeMarker(getlocations_map[key], gs, result['lat'], result['lon'], 0, gps_marker_title, '', '', '', key);
                          if (gps_bubble && customContent) {
                            var opts = {content: customContent};
                            if (Drupal.settings.getlocations[key].markeraction == 2) {
                              infoBubble = new InfoBubble(opts);
                            }
                            else {
                              infowindow = new google.maps.InfoWindow(opts);
                            }
                            google.maps.event.addListener(getlocations_gps_marker[key], 'click', function() {
                              if (Drupal.settings.getlocations[key].markeraction == 2) {
                                // use infobubble
                                infoBubble.open(getlocations_map[key], getlocations_gps_marker[key]);
                                getlocations_settings[key].infoBubbles.push(infoBubble);
                              }
                              else {
                                // use infowindow
                                infowindow.open(getlocations_map[key], getlocations_gps_marker[key]);
                                getlocations_settings[key].infoBubbles.push(infowindow);
                              }
                            });
                          }
                          getlocations_gps_marker[key].setVisible(true);
                          if (gps_center) {
                            getlocations_map[key].setCenter(ll);
                          }
                          deactive_throbber(key);
                        }
                      }
                      else {
                        var prm = {'!b': Drupal.getlocations.getGeoErrCode(status) };
                        var msg = Drupal.t('Geocode was not successful for the following reason: !b', prm);
                        alert(msg);
                      }
                    });
                  }
                  else {
                    // no geocode done
                    if (getlocations_gps_marker[key] !== undefined) {
                      getlocations_gps_marker[key].setPosition(p);
                    }
                    else {
                      getlocations_gps_marker[key] = Drupal.getlocations.makeMarker(getlocations_map[key], gs, result['lat'], result['lon'], 0, gps_marker_title, '', '', '', key);
                      getlocations_gps_marker[key].setVisible(true);
                    }
                    if (gps_center) {
                      getlocations_map[key].setCenter(p);
                    }
                    deactive_throbber(key);
                  }
                },
                function(error) {
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
          }); // end button click
        } //  end is there really a map?
      }); // end once
    } // end attach
  }; // end behaviors
}(jQuery));

