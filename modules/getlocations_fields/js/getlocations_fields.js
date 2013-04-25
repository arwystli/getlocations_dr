/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_fields module for Drupal 7
 * this is for googlemaps API version 3
 */

(function ($) {

  function getlocations_fields_init() {

    var gsettings = Drupal.settings.getlocations;
    var nodezoom = '';
    var mark = [];
    var map_marker = 'drupal';
    var adrsfield = 'getlocations_address_';
    var namefield = 'getlocations_name_';
    var streetfield = 'getlocations_street_';
    var additionalfield = 'getlocations_additional_';
    var cityfield = 'getlocations_city_';
    var provincefield = 'getlocations_province_';
    var postal_codefield = 'getlocations_postal_code_';
    var countryfield = 'getlocations_country_';
    var latfield = 'getlocations_latitude_';
    var lonfield = 'getlocations_longitude_';
    var point = [];
    var is_mobile = 0;
    var street_num_pos = 1;

    // each map has its own settings
    $.each(Drupal.settings.getlocations_fields, function (key, settings) {
      // is there really a map?
      if ($("#getlocations_map_canvas_" + key).is('div')) {

        var gset = gsettings[key];
        is_mobile = gset.is_mobile;
        var use_address = settings.use_address;
        var gkey = key;
        nodezoom = parseInt(settings.nodezoom);
        map_marker = settings.map_marker;
        var autocomplete_bias = settings.autocomplete_bias;
        var restrict_by_country = settings.restrict_by_country;
        var search_country = settings.search_country;
        var smart_ip_path = settings.smart_ip_path;
        street_num_pos = settings.street_num_pos;

        // we need to see if this is an update
        lat = $("#" + latfield + key).val();
        lng = $("#" + lonfield + key).val();
        if (lat && lng) {
          point[key] = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
          updateMap(getlocations_inputmap[key], point[key], key);
        }

        if (! mark[key]) {
          // make an icon
          if (! point[key]) {
            point[key] = new google.maps.LatLng(parseFloat(gset.lat), parseFloat(gset.lng));
            getlocations_inputmap[key].setCenter(point[key]);
          }
          makeMoveMarker(getlocations_inputmap[key], point[key], key);
        }

        if (use_address > 0) {
          if (use_address == 1) {
            $("#" + 'getlocations_geocodebutton_' + key).attr('disabled', 'disabled');
          }
          var input_adrs = document.getElementById(adrsfield + key);
          var fm_adrs = '';
          var opts = {};
          if (restrict_by_country > 0 && search_country) {
            var c = {'country':search_country};
            opts = {'componentRestrictions':c};
          }
          var ac_adrs = new google.maps.places.Autocomplete(input_adrs, opts);
          if (autocomplete_bias) {
            ac_adrs.bindTo('bounds', getlocations_inputmap[key]);
          }
          google.maps.event.addListener(ac_adrs, 'place_changed', function () {
            var place_adrs = ac_adrs.getPlace();
            if (use_address == 1) {
              // search box with geocode button
              $("#" + 'getlocations_geocodebutton_' + key).removeAttr('disabled');
              $("#" + 'getlocations_geocodebutton_' + key).click( function () {
                manageGeobutton(key, use_address, place_adrs);
                return false;
              });
            }
            else {
              manageGeobutton(key, use_address, place_adrs);
            }
          });
        }
        else {
          // no autocomplete
          $("#" + 'getlocations_geocodebutton_' + key).click( function () {
            manageGeobutton(key, use_address, '');
            return false;
          });
        }

        $("#" + 'getlocations_smart_ip_button_' + key).click( function () {
          manageSmartIpbutton(key, smart_ip_path);
          return false;
        });

        if (is_mobile) {
          if (navigator && navigator.geolocation) {
            $("#getlocations_geolocation_button_" + key + ":not(.getlocations-fields-geolocation-processed)").addClass("getlocations-fields-geolocation-processed").click( function () {
              manageGeolocationbutton(key);
              return false;
            });
          }
          else {
            $("#getlocations_geolocation_button_" + key).hide();
          }
        }

        // do 'fake' required fields
        var requireds = ['name', 'street', 'additional', 'city', 'province', 'postal_code', 'country'];
        $.each(requireds, function(k, v) {
          if ($(".getlocations_required_" + v + '_' + key).is("div")) {
            $("div.getlocations_required_" + v + "_" + key + " label").append(' <span class="form-required" title="' + Drupal.t("This field is required.") + '">*</span>');
          }
        });

        if (settings.latlon_warning > 0) {
          // warn on empty Latitude/Longitude
          $("input.form-submit#edit-submit").click( function () {
            if ($("#" + latfield + key).val() == '' && $("#" + lonfield + key).val() == '') {
              if (use_address > 0) {
                msg = Drupal.t('You must fill in the Latitude/Longitude fields. Use the Search or move the marker.');
              }
              else {
                 msg = Drupal.t('You must fill in the Latitude/Longitude fields. Use Geocoding or move the marker.');
              }
              alert(msg);
              return false;
            }
            return true;
          });
        }
      }
    }); // end each
    $("body").addClass("getlocations-fields-maps-processed");

    // functions

    function manageGeobutton(k, use_adrs, adrs) {
      var mmap = getlocations_inputmap[k];
      var kk = k;
      if (adrs == '') {
        // pull the address out of the form
        var input_adrs_arr = [];
        var streetfield_value = $("#" + streetfield + k).val();
        if (streetfield_value) {
          input_adrs_arr.push(streetfield_value);
        }
        var additionalfield_value = $("#" + additionalfield + k).val();
        if (additionalfield_value) {
          input_adrs_arr.push(additionalfield_value);
        }
        var cityfield_value = $("#" + cityfield + k).val();
        if (cityfield_value) {
          input_adrs_arr.push(cityfield_value);
        }
        var provincefield_value = $("#" + provincefield + k).val();
        if (provincefield_value) {
          input_adrs_arr.push(provincefield_value);
        }
        var postal_codefield_value = $("#" + postal_codefield + k).val();
        if (postal_codefield_value) {
          input_adrs_arr.push(postal_codefield_value);
        }
        var countryfield_value = $("#" + countryfield + k).val();
        if (countryfield_value && streetfield_value) {
          if (countryfield_value == 'GB' ) {
            countryfield_value = 'UK';
          }
          input_adrs_arr.push(countryfield_value);
        }
        var input_adrstmp = input_adrs_arr.join(", ");
      }
      else {
        var input_adrstmp = adrs.formatted_address;
      }
      if (input_adrstmp) {
        var input_adrs = {'address': input_adrstmp};
        // Create a Client Geocoder
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode(input_adrs, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            point[kk] = results[0].geometry.location;
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            $("#" + latfield + kk).val(lat);
            $("#" + lonfield + kk).val(lng);
            updateMap(mmap, point[kk], kk);
            if (use_adrs > 0) {
              set_address_components(kk, adrs.address_components);
            }
          }
          else {
            var prm = {'!a': input_adrstmp, '!b': Drupal.getlocations.getGeoErrCode(status) };
            var msg = Drupal.t('Geocode for (!a) was not successful for the following reason: !b', prm);
            alert(msg);
          }
        });
      }
      else if ( ($("#" + latfield + k).val() !== '') && ($("#" + lonfield + k).val() !== '')  ) {
        // reverse geocoding
        lat = $("#" + latfield + k).val();
        lng = $("#" + lonfield + k).val();
        point[k] = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        doReverseGeocode(point[k], k);
        updateMap(getlocations_inputmap[k], point[k], k);
      }
      else {
        var msg = Drupal.t('You have not entered an address.');
        alert(msg);
      }
    }

    // distribute the results to the various textfields
    function set_address_components(k, address_components) {
      streetfield_value = '';
      streetnumber_value = '';
      additionalfield_value = '';
      neighborhood_value = '';
      cityfield_value = '';
      provincefield_value = '';
      countryfield_value = '';
      postal_codefield_value = '';
      postal_code_prefix_field_value = '';
      admin_area_level_1 = '';
      admin_area_level_2 = '';
      admin_area_level_3 = '';
      for (var i = 0; i < address_components.length; i++) {
        type = address_components[i].types[0];
        //if (type == 'street_address') {
        //  streetfield_value = address_components[i].long_name;
        //}
        if (type == 'street_number') {
          streetnumber_value = address_components[i].long_name;
        }
        else if (type == 'route') {
          streetfield_value = address_components[i].long_name;
        }
        else if (type == 'locality') {
          cityfield_value = address_components[i].long_name;
        }
        else if (type == 'sublocality') {
          additionalfield_value = address_components[i].long_name;
        }
        else if (type == 'neighborhood') {
          neighborhood_value = address_components[i].long_name;
        }
        else if (type == 'administrative_area_level_3') {
          admin_area_level_3 = address_components[i].long_name;
        }
        else if (type == 'administrative_area_level_2') {
          admin_area_level_2 = address_components[i].long_name;
        }
        else if (type == 'administrative_area_level_1') {
          admin_area_level_1 = address_components[i].long_name;
        }
        else if (type == 'country') {
          countryfield_value = address_components[i].long_name;
        }
        else if (type == 'postal_code_prefix') {
          postal_code_prefix_field_value = address_components[i].long_name;
        }
        else if (type == 'postal_code') {
          postal_codefield_value = address_components[i].long_name;
        }
      }

      if (street_num_pos == 1) {
        $("#" + streetfield + k).val((streetnumber_value ? streetnumber_value + ' ' : '') + streetfield_value);
      }
      else {
        $("#" + streetfield + k).val(streetfield_value + (streetnumber_value ? ' ' + streetnumber_value : ''));
      }

      if (admin_area_level_1) {
        provincefield_value = admin_area_level_1;
      }
      if (admin_area_level_1 && admin_area_level_2) {
        provincefield_value = admin_area_level_2 + ', ' + admin_area_level_1;
      }
      if (admin_area_level_1 && admin_area_level_2 && admin_area_level_3) {
        provincefield_value = admin_area_level_3 + ', ' + admin_area_level_2 + ', ' + admin_area_level_1;
      }
      if (admin_area_level_2 && admin_area_level_3) {
        provincefield_value = admin_area_level_3 + ', ' + admin_area_level_2;
      }
      if (admin_area_level_2 && ! provincefield_value) {
        provincefield_value = admin_area_level_2;
      }
      if (admin_area_level_3  && ! provincefield_value) {
        provincefield_value = admin_area_level_3;
      }

      $("#" + provincefield + k).val(provincefield_value);
      $("#" + additionalfield + k).val((additionalfield_value ? additionalfield_value : neighborhood_value));
      $("#" + cityfield + k).val(cityfield_value);
      if (postal_codefield_value) {
        $("#" + postal_codefield + k).val(postal_codefield_value);
      }
      else {
        $("#" + postal_codefield + k).val(postal_code_prefix_field_value);
      }

      // input or select box
      if ($("#" + countryfield + k).is("input")) {
        $("#" + countryfield + k).val(countryfield_value);
      }
      else if ($("#" + countryfield + k).is("select")) {
        $("#" + countryfield + k + " option").each( function(index) {
          if (countryfield_value == $(this).text()) {
            $("#" + countryfield + k).val($(this).val()).attr('selected', 'selected');
          }
          // fix 'The Netherlands' which is what google returns
          if (countryfield_value == 'The Netherlands') {
            $("#" + countryfield + k).val('NL').attr('selected', 'selected');
          }
        });
      }
    } // set_address_components

    function makeMoveMarker(mmap, ppoint, mkey) {
      // remove existing marker
      if (mark[mkey]) {
        mark[mkey].setMap();
      }
      marker = Drupal.getlocations.getIcon(map_marker);
      mark[mkey] = new google.maps.Marker({
        icon: marker.image,
        shadow: marker.shadow,
        shape: marker.shape,
        map: mmap,
        position: ppoint,
        draggable: true,
        title: Drupal.t('Drag me to change position')
      });
      var mmmap = mmap;
      var mmkey = mkey;
      google.maps.event.addListener(mark[mkey], "dragend", function () {
        p = mark[mmkey].getPosition();
        mmmap.panTo(p);
        lat = p.lat();
        lng = p.lng();
        $("#" + latfield + mmkey).val(lat);
        $("#" + lonfield + mmkey).val(lng);
      });
      google.maps.event.addListener(mmap, "click", function (e) {
        p = e.latLng;
        mmmap.panTo(p);
        mark[mmkey].setPosition(p);
        lat = p.lat();
        lng = p.lng();
        $("#" + latfield + mmkey).val(lat);
        $("#" + lonfield + mmkey).val(lng);
      });
    }

    function updateMap(umap, pt, ukey) {
      umap.panTo(pt);
      umap.setZoom(nodezoom);
      makeMoveMarker(umap, pt, ukey);
    }

    function manageSmartIpbutton(k, p) {
      var kk = k;
      $.get(p, {}, function (loc) {
        if (loc) {
          lat = loc.latitude;
          lng = loc.longitude;
          if (lat && lng) {
            $("#" + latfield + kk).val(lat);
            $("#" + lonfield + kk).val(lng);
            if (loc.city) {
              $("#" + cityfield + kk).val(loc.city);
            }
            if (loc.region) {
              $("#" + provincefield + kk).val(loc.region);
            }
            if (loc.zip && loc.zip != '-') {
              $("#" + postal_codefield + kk).val(loc.zip);
            }

            if ($("#" + countryfield + kk).is("input")) {
              if (loc.country) {
                $("#" + countryfield + kk).val(loc.country);
              }
            }
            else if ($("#" + countryfield + kk).is("select")) {
              // do we already have countrycode?
              cc = '';
              if (loc.country_code) {
                if (loc.country_code == 'UK') {
                  cc = 'GB';
                }
                else {
                  cc = loc.country_code;
                }
              }
              if (cc) {
                $("#" + countryfield + kk).val(cc).attr('selected', 'selected');
              }
              else if (loc.country) {
                $("#" + countryfield + kk + " option").each( function(index) {
                  if (loc.country == $(this).text()) {
                    $("#" + countryfield + kk).val($(this).val()).attr('selected', 'selected');
                  }
                  // fix 'The Netherlands' which is what google returns
                  if (loc.country == 'The Netherlands') {
                    $("#" + countryfield + kk).val('NL').attr('selected', 'selected');
                  }
                });
              }
            }
            point[kk] = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
            updateMap(getlocations_inputmap[kk], point[kk], kk);
          }
        }
      });
    }

    // html5 geolocation
    function manageGeolocationbutton(k) {
      // html5
      var statusdiv = '#getlocations_geolocation_status_' + k;
      var statusmsg = '';
      $(statusdiv).html(statusmsg);
      navigator.geolocation.getCurrentPosition(
        function(position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          $("#" + latfield + k).val(lat);
          $("#" + lonfield + k).val(lng);
          point[k] = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
          updateMap(getlocations_inputmap[k], point[k], k);
          doReverseGeocode(point[k], k);
          //statusmsg = Drupal.t('Browser OK');
          //$(statusdiv).html(statusmsg);
        },
        function(error) {
          statusmsg = Drupal.t("Sorry, I couldn't find your location using the browser") + ' ' + Drupal.getlocations.geolocationErrorMessages(error.code) + ".";
          $(statusdiv).html(statusmsg);
        }, {maximumAge:10000}
      );
    }

    // reverse geocoding
    function doReverseGeocode(pt, k) {
      var kk = k;
      var input_ll = {'latLng': pt};
      // Create a Client Geocoder
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(input_ll, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            if ($("#" + namefield + kk).val() == '') {
              $("#" + namefield + kk).val(results[0].formatted_address);
            }
            set_address_components(kk, results[0].address_components);
          }
        }
        else {
          var prm = {'!b': Drupal.getlocations.getGeoErrCode(status) };
          var msg = Drupal.t('Geocode was not successful for the following reason: !b', prm);
          alert(msg);
        }
      });
    }

  } // end getlocations_fields_init

  Drupal.behaviors.getlocations_fields = {
    attach: function () {
      if (! $(".getlocations-fields-maps-processed").is("body")) {
        getlocations_fields_init();
      }
      // knock out the add more button, it wrecks all the maps
      $(".field-type-getlocations-fields input.field-add-more-submit").hide();
    }
  };
}(jQuery));
