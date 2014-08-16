/**
 * @file getlocations_fields_views.js
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_fields module in Views
 * jquery stuff
*/
(function ($) {

  Drupal.behaviors.getlocations_fields_search_views = {
    attach: function(context) {

      // Manage Google Autocomplete
      if ($("#edit-distance-search-field").is('input') && $("#edit-distance-latitude").is('input') && $("#edit-distance-longitude").is('input')) {
        // settings
        var settings = Drupal.settings.getlocations_fields_search_views;
        // attach a geocoder
        var input_adrs = document.getElementById("edit-distance-search-field");
        var fm_adrs = '';
        var opts = {};
        if (settings.restrict_by_country > 0 && settings.country) {
          var c = {'country':settings.country};
          opts = {'componentRestrictions':c};
        }
        var ac_adrs = new google.maps.places.Autocomplete(input_adrs, opts);
        google.maps.event.addListener(ac_adrs, 'place_changed', function () {
          var place_adrs = ac_adrs.getPlace();
          fm_adrs = {'address': place_adrs.formatted_address};
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode(fm_adrs, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              $("#edit-distance-latitude").val(results[0].geometry.location.lat());
              $("#edit-distance-longitude").val(results[0].geometry.location.lng());
              $("#edit-distance-search-field").val(results[0].formatted_address);
            }
            else {
              var prm = {'!a': fm_adrs, '!b': Drupal.getlocations.getGeoErrCode(status) };
              var msg = Drupal.t('Geocode for (!a) was not successful for the following reason: !b', prm);
              alert(msg);
            }
          });
        });
      }

      //#edit-options-settings-restrict-by-country
      if ($("#edit-options-settings-restrict-by-country").is('input')) {
        if ($("#edit-options-settings-restrict-by-country").attr('checked')) {
          $("#getlocations_search_country").show();
        }
        else {
          $("#getlocations_search_country").hide();
        }
        $("#edit-options-settings-restrict-by-country").change( function() {
          if ($(this).attr('checked')) {
            $("#getlocations_search_country").show();
          }
          else {
            $("#getlocations_search_country").hide();
          }
        });
      }

      // work over all class 'getlocations_map_canvas'
      var gsettings = Drupal.settings.getlocations;
      $(".getlocations_map_canvas", context).once('getlocations-fields-views-search-marker-map-processed', function(index, element) {
        var elemID = $(element).attr('id');
        var key = elemID.replace(/^getlocations_map_canvas_/, '');
        // is there really a map?
        if ($("#getlocations_map_canvas_" + key).is('div')) {
          var gset = gsettings[key];
          // views_search
          if (gset.views_search_marker_enable) {
            var viewssearchmarkertoggleState = [];
            viewssearchmarkertoggleState[key] = true;
            if (! gset.views_search_marker_toggle_active) {
              viewssearchmarkertoggleState[key] = false;
            }
            $("#getlocations_toggleSearchMarker_" + key).attr('disabled', true);
          }

          if (gset.views_search_radshape_enable) {
            var viewssearchshapetoggleState = [];
            viewssearchshapetoggleState[key] = true;
            if (! gset.views_search_radshape_toggle_active) {
              viewssearchshapetoggleState[key] = false;
            }
            $("#getlocations_toggleSearchArea_" + key).attr('disabled', true);
          }
          // views_search_marker and views_search_radshape_enable
          var slat = false;
          var slon = false;
          var distance_meters = false;
          var done = false;
          if ($("#getlocations_fields_search_views_search_wrapper_" + key).is('div')) {
            slat = $("#getlocations_fields_search_views_search_latitude_" + key).html();
            slon = $("#getlocations_fields_search_views_search_longitude_" + key).html();
            distance_meters = $("#getlocations_fields_search_views_search_distance_meters_" + key).html();
          }
          if (slat && slon && distance_meters) {
            var point = new google.maps.LatLng(parseFloat(slat), parseFloat(slon));
            var lats = Drupal.getlocations.geo.earth_latitude_range(slat, slon, distance_meters);
            var lngs = Drupal.getlocations.geo.earth_longitude_range(slat, slon, distance_meters);
            // views_search_marker
            if (gset.views_search_marker_enable) {
              var gst = gset;
              gst.markdone = Drupal.getlocations.getIcon(gset.views_search_marker);
              gst.markeraction = 0;
              var vs_marker = {};
              vs_marker[key] = Drupal.getlocations.makeMarker(getlocations_map[key], gst, slat, slon, 0, '', '', '', '', key);
              // initial setting
              if (gset.views_search_marker_toggle) {
                if (gset.views_search_marker_toggle_active) {
                  vs_marker[key].setVisible(true);
                  viewssearchmarkertoggleState[key] = true;
                }
                else {
                  vs_marker[key].setVisible(false);
                  viewssearchmarkertoggleState[key] = false;
                }
                $("#getlocations_toggleSearchMarker_" + key).attr('disabled', false);
                // click on this
                $("#getlocations_toggleSearchMarker_" + key).click( function() {
                  var label = '';
                  if (viewssearchmarkertoggleState[key]) {
                    vs_marker[key].setVisible(false);
                    viewssearchmarkertoggleState[key] = false;
                    label = Drupal.t('Search marker On');
                  }
                  else {
                    vs_marker[key].setVisible(true);
                    viewssearchmarkertoggleState[key] = true;
                    label = Drupal.t('Search marker Off');
                  }
                  $(this).val(label);
                });
              }
              else {
                viewssearchmarkertoggleState[key] = true;
                vs_marker[key].setVisible(true);
              }
            }
            // views_search_radshape
            if (gset.views_search_radshape_enable) {
              if ( $("#views_search_operator").is('input')) {
                //views_search_operator
                var rShape = {};
                var op = $("#views_search_operator").val();
                if (op == 'dist') {
                  // radius circle
                  rShape[key] = new google.maps.Circle({
                    map: getlocations_map[key],
                    strokeColor: gset.views_search_radshape_strokecolor,
                    strokeOpacity: gset.views_search_radshape_strokeopacity,
                    strokeWeight: gset.views_search_radshape_strokeweight,
                    fillColor: gset.views_search_radshape_fillcolor,
                    fillOpacity: gset.views_search_radshape_fillopacity,
                    visible: false,
                    clickable: false
                  });

                  rShape[key].setRadius(parseInt(distance_meters));
                  rShape[key].setCenter(point);
                  if (gset.pansetting == 1) {
                    Drupal.getlocations.doBounds(getlocations_map[key], lats[0], lngs[0], lats[1], lngs[1], true);
                  }
                  else if (gset.pansetting == 2) {
                    Drupal.getlocations.doBounds(getlocations_map[key], lats[0], lngs[0], lats[1], lngs[1], false);
                  }
                  else if (gset.pansetting == 3) {
                    if (slat && slon) {
                      getlocations_map[key].setCenter(point);
                    }
                  }
                  done = true;
                }
                else if (op == 'mbr') {
                  // rectangle
                  rShape[key] = new google.maps.Rectangle({
                    map: getlocations_map[key],
                    strokeColor: gset.views_search_radshape_strokecolor,
                    strokeOpacity: gset.views_search_radshape_strokeopacity,
                    strokeWeight: gset.views_search_radshape_strokeweight,
                    fillColor: gset.views_search_radshape_fillcolor,
                    fillOpacity: gset.views_search_radshape_fillopacity,
                    visible: false,
                    clickable: false
                  });
                  // rectangle
                  var mcoords = [];
                  mcoords[0] = new google.maps.LatLng(parseFloat(lats[0]), parseFloat(lngs[0]));
                  mcoords[1] = new google.maps.LatLng(parseFloat(lats[1]), parseFloat(lngs[1]));
                  var b = new google.maps.LatLngBounds(mcoords[0], mcoords[1]);
                  rShape[key].setBounds(b);
                  done = true;
                }
                if (gset.views_search_radshape_toggle) {
                  if (gset.views_search_radshape_toggle_active) {
                    rShape[key].setVisible(true);
                    viewssearchshapetoggleState[key] = true;
                  }
                  else {
                    rShape[key].setVisible(false);
                    viewssearchshapetoggleState[key] = false;
                  }
                  $("#getlocations_toggleSearchArea_" + key).attr('disabled', false);
                  // click on this
                  $("#getlocations_toggleSearchArea_" + key).click( function() {
                    var label = '';
                    if (viewssearchshapetoggleState[key]) {
                      rShape[key].setVisible(false);
                      viewssearchshapetoggleState[key] = false;
                      label = Drupal.t('Search area On');
                    }
                    else {
                      rShape[key].setVisible(true);
                      viewssearchshapetoggleState[key] = true;
                      label = Drupal.t('Search area Off');
                    }
                    $(this).val(label);
                  });
                }
                else {
                  viewssearchshapetoggleState[key] = true;
                }
                if (done) {
                  if (viewssearchshapetoggleState[key]) {
                    rShape[key].setVisible(true);
                  }
                  else {
                    rShape[key].setVisible(false);
                  }
                }
              }
            }
            // views_search_center
            if (gset.views_search_center) {
              getlocations_map[key].setCenter(point);
            }
          } // end if slat && slon
        } // end is there really a map

      }); // end once

    }
  };

}(jQuery));
