
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_search module
*/
(function ($) {

  var search_markersArray = [];

  function getlocations_search_init() {

    var searchmarker = {};

    // each map has its own settings
    $.each(Drupal.settings.getlocations_search, function (key, searchsettings) {
      // is there really a map?
      if ($("#getlocations_map_canvas_" + key).is('div')) {
        // getlocations settings for current map
        var gset = getlocations_settings[key];
        var method = searchsettings.method;
        gset.do_lookup = searchsettings.do_lookup;
        gset.show_distance = searchsettings.show_distance;
        gset.do_search_marker = searchsettings.do_search_marker;
        gset.search_marker = searchsettings.search_marker;
        gset.search_info_path = searchsettings.search_info_path;
        var autocomplete_bias = searchsettings.autocomplete_bias;
        var restrict_by_country = searchsettings.restrict_by_country;
        var country = searchsettings.country;
        var maxzoom = searchsettings.maxzoom;
        var mapid = key;
        var mapid2 = key.replace("_", "-");

        if (gset.markermanagertype == 1 && gset.usemarkermanager == 1) {
          gset.usemarkermanager = true;
          gset.mgr = new MarkerManager(getlocations_map[key], {
            borderPadding: 50,
            maxZoom: maxzoom,
            trackMarkers: false
          });
        }
        else if (gset.markermanagertype == 2 && gset.useclustermanager == 1) {
          gset.useclustermanager = true;
          gset.cmgr = new MarkerClusterer(
            getlocations_map[key],
            [],
            {
              gridSize: gset.cmgr_gridSize,
              maxZoom: gset.cmgr_maxZoom,
              styles: gset.cmgr_styles[gset.cmgr_style],
              minimumClusterSize: gset.cmgr_minClusterSize,
              title: gset.cmgr_title
            }
          );
        }

        if (method == 'google_ac') {
          var input_adrs = document.getElementById("edit-getlocations-search-" + mapid2);
          var fm_adrs = '';
          var opts = {};
          if (restrict_by_country > 0 && country) {
            var c = {'country':country};
            opts = {'componentRestrictions':c};
          }
          var ac_adrs = new google.maps.places.Autocomplete(input_adrs, opts);
          if (autocomplete_bias) {
            ac_adrs.bindTo('bounds', getlocations_map[key]);
          }
          google.maps.event.addListener(ac_adrs, 'place_changed', function () {
            var place_adrs = ac_adrs.getPlace();
            fm_adrs = {'address': place_adrs.formatted_address};
            // Create a Client Geocoder
            do_Geocode(getlocations_map[key], gset, fm_adrs, key);
          });
        }
        else {
          $("#edit-getlocations-search-submit-" + mapid2).click( function() {
            // collect the search string
            input_adrs = $("#edit-getlocations-search-" + mapid2).val();
            fm_adrs = {'address': input_adrs};
            // Create a Client Geocoder
            do_Geocode(getlocations_map[key], gset, fm_adrs, key);
            return false;
          });
        }

        if (gset.is_mobile) {
          if (navigator && navigator.geolocation) {
            $("#getlocations_search_geolocation_button-" + mapid2).click( function () {
              do_Geolocationbutton(getlocations_map[key], gset, key);
              return false;
            });
          }
          else {
            $("#getlocations_search_geolocation_button-" + mapid2).hide();
          }
        }
      }
    });
  }

  // cleans out any existing markers, sets up a new geocoder and runs it, filling in the results.
  function do_Geocode(map, gs, adrs, mkey) {
    // are there any markers already?
    if (search_markersArray.length) {
      getlocations_search_deleteOverlays();
      // clear out manager
      if (gs.usemarkermanager) {
        gs.mgr.clearMarkers();
      }
      else if (gs.useclustermanager) {
        gs.cmgr.clearMarkers();
      }
    }
    // clear out search marker
    if (gs.do_search_marker) {
      oldslat = $("#getlocations_search_slat_" + mkey).html();
      oldslon = $("#getlocations_search_slon_" + mkey).html();
      if (oldslat) {
        searchmarker.setMap();
      }
    }

    // close any previous instances
    for (var i in gs.infoBubbles) {
      gs.infoBubbles[i].close();
    }

    // clear the results box
    $("#getlocations_search_address_" + mkey).html('');
    $("#getlocations_search_count_" + mkey).html('');
    $("#getlocations_search_distance_" + mkey).html('');
    $("#getlocations_search_type_" + mkey).html('');
    $("#getlocations_search_lat_" + mkey).html('');
    $("#getlocations_search_lon_" + mkey).html('');
    if (gs.show_maplinks) {
      $("div#getlocations_map_links_" + mkey + " ul").html("");
    }

    // set up some display vars
    var unitsdisplay = {'km': Drupal.t('Kilometer'), 'm': Drupal.t('Meter'), 'mi': Drupal.t('Mile'), 'yd': Drupal.t('Yard'), 'nmi': Drupal.t('Nautical mile')};
    var unitsdisplaypl = {'km': Drupal.t('Kilometers'), 'm': Drupal.t('Meters'), 'mi': Drupal.t('Miles'), 'yd': Drupal.t('Yards'), 'nmi': Drupal.t('Nautical miles')};
    var typesdisplay = {'all': Drupal.t('All'), 'node': Drupal.t('Nodes'), 'user': Drupal.t('Users'), 'term': Drupal.t('Terms'), 'comment': Drupal.t('Comments')};
    // get settings from the DOM
    var mapid2 = mkey.replace("_", "-");
    var distance = $("#edit-getlocations-search-distance-" + mapid2).val();
    var units = $("#edit-getlocations-search-units-" + mapid2).val();
    var type = $("#edit-getlocations-search-type-" + mapid2).val();
    var limits = $("#edit-getlocations-search-limits-" + mapid2).val();
    // start geocoder
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(adrs, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var address = results[0].formatted_address;
        var slat = results[0].geometry.location.lat();
        var slon = results[0].geometry.location.lng();
        // go get the data
        $.get(gs.search_info_path, {
          'lat':slat,
          'lon':slon,
          'distance':distance,
          'units':units,
          'type':type,
          'limits':limits
        }, function(data) {
          // in data, an array of locations, minmaxes and info
          var locations = data['locations'];
          var minmaxes = data['minmaxes'];
          var minlat = ''; var minlon = ''; var maxlat = ''; var maxlon = ''; var cenlat = ''; var cenlon = '';
          if (minmaxes) {
            mmarr = minmaxes.split(',');
            minlat = parseFloat(mmarr[0]);
            minlon = parseFloat(mmarr[1]);
            maxlat = parseFloat(mmarr[2]);
            maxlon = parseFloat(mmarr[3]);
            cenlat = parseFloat((minlat + maxlat)/2);
            cenlon = parseFloat((minlon + maxlon)/2);
          }
          var info = data['info'];
          distance = 0;
          units = '';
          infoarr = info.split(',');
          distance = infoarr[0];
          units = infoarr[1];
          type = infoarr[2];
          latout = infoarr[3];
          lonout = infoarr[4];
          locationct = 0;
          for (var i = 0; i < locations.length; i++) {
            lidkey = 'nid';
            lid = 0;
            lidkey = locations[i].entity_key;
            lid = locations[i].entity_id;
            if (locations[i].glid > 0) {
              lid = locations[i].glid;
            }
            // just in case
            if (locations[i].marker === '') {
              gs.markdone = gs.defaultIcon;
            }
            else {
              gs.markdone = Drupal.getlocations.getIcon(locations[i].marker);
            }
            title = (locations[i].title ? locations[i].title : (locations[i].name ? locations[i].name : ''));
            // make a marker
            marker = Drupal.getlocations.makeMarker(map, gs, locations[i].latitude, locations[i].longitude, lid, title, lidkey, '', '', mkey);
            search_markersArray.push(marker);
            locationct++;
          }
          // display results
          $("#getlocations_search_address_" + mkey).html('<span class="results-label">' + Drupal.t('Search') + ':</span><span class="results-value">' +  address + '</span>');
          $("#getlocations_search_distance_" + mkey).html('<span class="results-label">' + Drupal.t('Distance') + ':</span><span class="results-value">' + distance + ' ' + (distance == 1 ? unitsdisplay[units] : unitsdisplaypl[units] ) + '</span>');
          if (gs.do_lookup) {
            $("#getlocations_search_count_" + mkey).html('<span class="results-label">' + Drupal.t('Locations found') + ':</span><span class="results-value">' + locationct + '</span>');
            $("#getlocations_search_type_" + mkey).html('<span class="results-label">' + Drupal.t('Search Type') + ':</span><span class="results-value">' + typesdisplay[type] + '</span>');
          }
          $("#getlocations_search_lat_" + mkey).html('<span class="results-label">' + Drupal.t('Latitude') + ':</span><span class="results-value">' + latout + '</span>');
          $("#getlocations_search_lon_" + mkey).html('<span class="results-label">' + Drupal.t('Longitude') + ':</span><span class="results-value">' + lonout + '</span>');
          // hidden stuff, used by search distance and search marker
          $("#getlocations_search_slat_" + mkey).html(slat);
          $("#getlocations_search_slon_" + mkey).html(slon);
          $("#getlocations_search_sunit_" + mkey).html(units);

          // markermanagers add batchr
          if (gs.usemarkermanager) {
            gs.mgr.addMarkers(search_markersArray, gs.minzoom, gs.maxzoom);
          }
          else if (gs.useclustermanager) {
            gs.cmgr.addMarkers(search_markersArray, 0);
          }
          if (minlat !== '' && minlon !== '' && maxlat !== '' && maxlon !== '') {
            if (gs.pansetting == 1) {
              Drupal.getlocations.doBounds(map, minlat, minlon, maxlat, maxlon, true);
            }
            else if (gs.pansetting == 2) {
              Drupal.getlocations.doBounds(map, minlat, minlon, maxlat, maxlon, false);
            }
            else if (gs.pansetting == 3) {
              if (cenlat && cenlon) {
                c = new google.maps.LatLng(cenlat, cenlon);
                map.setCenter(c);
              }
            }
          }
          if (gs.usemarkermanager) {
            gs.mgr.refresh();
          }
          else if (gs.useclustermanager) {
             gs.cmgr.repaint();
          }
          // search marker
          if (gs.do_search_marker) {
            smark = gs.search_marker;
            makeSearchcenterMarker(slat, slon, smark, map);
          }
          if (locationct == 1) {
            map.setZoom(gs.nodezoom);
            // show_bubble_on_one_marker
            if (gs.show_bubble_on_one_marker && (gs.useInfoWindow || gs.useInfoBubble)) {
              google.maps.event.trigger(marker, 'click');
            }
          }
        });
      }
      else {
        var prm = {'!a': place_adrs, '!b': Drupal.getlocations.getGeoErrCode(status) };
        var msg = Drupal.t('Geocode for (!a) was not successful for the following reason: !b', prm);
        alert(msg);
      }
    });
  }

  function do_Geolocationbutton(map, gs, mkey) {
    var statusdiv = '#getlocations_search_geolocation_status';
    var statusmsg = '';
    $(statusdiv).html(statusmsg);
    navigator.geolocation.getCurrentPosition(
      function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        var p = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        var fm_adrs = {'latLng': p};
        do_Geocode(map, gs, fm_adrs, mkey);
        //statusmsg = Drupal.t('Browser OK');
        //$(statusdiv).html(statusmsg);
      },
      function(error) {
        statusmsg = Drupal.t("Sorry, I couldn't find your location using the browser") + ' ' + Drupal.getlocations.geolocationErrorMessages(error.code) + ".";
        $(statusdiv).html(statusmsg);
      }, {maximumAge:10000}
    );
  }

  function makeSearchcenterMarker(slat, slon, smark, map) {
    smarkdone = Drupal.getlocations.getIcon(smark);
    var p = new google.maps.LatLng(slat, slon);
    searchmarker = new google.maps.Marker({
      icon: smarkdone.image,
      shadow: smarkdone.shadow,
      shape: smarkdone.shape,
      map: map,
      position: p,
      title: Drupal.t('Search center'),
      optimized: false
    });
  }

  // Deletes all markers in the array by removing references to them
  function getlocations_search_deleteOverlays() {
    if (search_markersArray) {
      for (i in search_markersArray) {
        search_markersArray[i].setMap(null);
      }
      search_markersArray.length = 0;
    }
  }

  Drupal.behaviors.getlocations_search = {
    attach: function () {
      getlocations_search_init();
    }
  };

})(jQuery);
