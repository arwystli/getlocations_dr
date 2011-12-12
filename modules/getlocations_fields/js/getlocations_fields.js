/**
 * @file
 * Javascript functions for getlocations module for Drupal 7
 *
 * @author Bob Hutchinson http://drupal.org/user/52366
 * this is for googlemaps API version 3
 */


(function ($) {


  Drupal.behaviors.getlocations_fields = {
    attach: function () {

      var point = '';
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
      var nodezoom = '';
      var use_address = '';
      var gkey = '';
      var map_marker = 'drupal';
      var mark = [];

      var settings = Drupal.settings.getlocations_fields;

      // each map has its own settings
      jQuery.each(settings, function (key, sett) {

        var gkey = key;
        nodezoom = parseInt(sett.nodezoom);
        use_address = sett.use_address;
        map_marker = sett.map_marker;

       // we need to see if this is an update
        lat = $("#" + latfield + key).val();
        lng = $("#" + lonfield + key).val();
        if (lat && lng) {
          point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
          updateMap(inputmap[key], point, key);
        }

        if (use_address) {

          var input_adrs = document.getElementById(adrsfield + key);
          var fm_adrs = '';
          var ac_adrs = new google.maps.places.Autocomplete(input_adrs);
          google.maps.event.addListener(ac_adrs, 'place_changed', function () {
            var place_adrs = ac_adrs.getPlace();
            fm_adrs = {'address': place_adrs.formatted_address};
            // Create a Client Geocoder
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(fm_adrs, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                point = results[0].geometry.location;
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                $("#" + latfield + gkey).val(lat);
                $("#" + lonfield + gkey).val(lng);
                $("#" + adrsfield + gkey).val(place_adrs.formatted_address);
                updateMap(inputmap[gkey], point, gkey);

// NEEDS WORK //////////////////////////

                address_components = place_adrs.address_components;
                streetfield_value = '';
                streetnumber_value = '';
                additionalfield_value = '';
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
                $("#" + streetfield + gkey).val( (streetnumber_value ? streetnumber_value + ' ' : '') + streetfield_value);
                if (admin_area_level_3 ) {
                  provincefield_value = admin_area_level_3;
                }
                if (admin_area_level_2 && ! provincefield_value) {
                  provincefield_value = admin_area_level_2;
                }
                if (admin_area_level_1 && ! provincefield_value) {
                  provincefield_value = admin_area_level_1;
                }
                $("#" + provincefield + gkey).val(provincefield_value);
                $("#" + additionalfield + gkey).val(additionalfield_value);
                $("#" + cityfield + gkey).val(cityfield_value);
                if (postal_codefield_value) {
                  $("#" + postal_codefield + gkey).val(postal_codefield_value);
                }
                else {
                  $("#" + postal_codefield + gkey).val(postal_code_prefix_field_value);
                }

                // input or select box
                if ($("#" + countryfield + gkey).is("input")) {
                  $("#" + countryfield).val(countryfield_value);
                }
                else if ($("#" + countryfield + gkey).is("select")) {
                  // country list is keyed on two letter codes so we need to get
                  // the code from the server in order to set the selectbox correctly
                  var path = Drupal.settings.basePath + "getlocations_fields/countryinfo";
                  $.get(path, {'country': countryfield_value}, function (data) {
                    if (data) {
                      $("#" + countryfield + gkey).val(data).attr('selected', 'selected');
                    }
                  });
                }

////////////////////////////
              }
              else {
                var prm = {'!a': place_adrs, '!b': getGeoErrCode(status) };
                var msg = Drupal.t('Geocode for (!a) was not successful for the following reason: !b', prm);
                alert(msg);
              }
            });

          });

        }
        else {
          // no autocomplete
          $("#" + 'getlocations_geocodebutton_' + key).click( function () {
            manageGeobutton(key);
            return false;
          });
        }

        function manageGeobutton(k) {
          var mmap = inputmap[k];
          var kk = k;
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
          if (countryfield_value) {
            if (countryfield_value == 'GB' ) {
              countryfield_value = 'UK';
            }
            input_adrs_arr.push(countryfield_value);
          }

          var input_adrstmp = input_adrs_arr.join(", ");
          if (input_adrstmp) {
            var input_adrs = {address: input_adrstmp};
            // Create a Client Geocoder
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(input_adrs, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                point = results[0].geometry.location;
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                $("#" + latfield + kk).val(lat);
                $("#" + lonfield + kk).val(lng);
                updateMap(mmap, point, kk);
              }
              else {
                var prm = {'!a': input_adrstmp, '!b': getGeoErrCode(status) };
                var msg = Drupal.t('Geocode for (!a) was not successful for the following reason: !b', prm);
                alert(msg);
              }
            });
          }
          else {
            var msg = Drupal.t('You have not entered an address.');
            alert(msg);
          }
        }

        google.maps.event.addListener(inputmap[gkey], 'click', function (event) {
          if (! mark[gkey]) {
            // make an icon
            if (! point) {
              //point = inputmap[gkey].getCenter();
              point = event.latLng;
              inputmap[gkey].setCenter(point);
            }
            makeMoveMarker(inputmap[gkey], point, gkey);
          }
        });

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
        }

        function updateMap(umap, pt, ukey) {
          umap.panTo(pt);
          umap.setZoom(nodezoom);
          makeMoveMarker(umap, pt, ukey);
        }

      }); // end each setting loop

      function getGeoErrCode(errcode) {
        var errstr;
        if (errcode == google.maps.GeocoderStatus.ERROR) {
          errstr = Drupal.t("There was a problem contacting the Google servers.");
        }
        else if (errcode == google.maps.GeocoderStatus.INVALID_REQUEST) {
          errstr = Drupal.t("This GeocoderRequest was invalid.");
        }
        else if (errcode == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          errstr = Drupal.t("The webpage has gone over the requests limit in too short a period of time.");
        }
        else if (errcode == google.maps.GeocoderStatus.REQUEST_DENIED) {
          errstr = Drupal.t("The webpage is not allowed to use the geocoder.");
        }
        else if (errcode == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
          errstr = Drupal.t("A geocoding request could not be processed due to a server error. The request may succeed if you try again.");
        }
        else if (errcode == google.maps.GeocoderStatus.ZERO_RESULTS) {
          errstr = Drupal.t("No result was found for this GeocoderRequest.");
        }
        return errstr;
      }


    }
  };
})(jQuery);
