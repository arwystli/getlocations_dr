/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations module for Drupal 7
 * this is for googlemaps API version 3
*/

// global vars
var getlocations_inputmap = [];
var getlocations_map = [];
var getlocations_markers = [];
var getlocations_settings = {};

(function ($) {

  function getlocations_init() {

    // in icons.js
    Drupal.getlocations.iconSetup();

    // each map has its own settings
    $.each(Drupal.settings.getlocations, function (key, settings) {

      // functions
      function FullScreenControl(fsd) {
        fsd.style.margin = "5px";
        fsd.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
        fsdiv = document.createElement("DIV");
        fsdiv.style.height = "22px";
        fsdiv.style.backgroundColor = "white";
        fsdiv.style.borderColor = "#717B87";
        fsdiv.style.borderStyle = "solid";
        fsdiv.style.borderWidth = "1px";
        fsdiv.style.cursor = "pointer";
        fsdiv.style.textAlign = "center";
        fsdiv.title = Drupal.t('Full screen');
        fsdiv.innerHTML = '<img id="btnFullScreen" src="' + js_path + '/images/fs-map-full.png"/>';
        fsd.appendChild(fsdiv);
        google.maps.event.addDomListener(fsdiv, "click", function() {
          toggleFullScreen();
        });
      }

      function toggleFullScreen() {
        var cnt = getlocations_map[key].getCenter();
        $("#getlocations_map_wrapper_" + key).toggleClass("fullscreen");
        $("html,body").toggleClass("fullscreen-body");
        $(document).scrollTop(0);
        google.maps.event.trigger(getlocations_map[key], "resize");
        getlocations_map[key].setCenter(cnt);
        setTimeout( function() {
          if($("#getlocations_map_wrapper_" + key).hasClass("fullscreen")) {
            $("#btnFullScreen").attr("src", js_path + '/images/fs-map-normal.png');
            fsdiv.title = Drupal.t('Normal screen');
          }
          else {
            $("#btnFullScreen").attr("src", js_path + '/images/fs-map-full.png');
            fsdiv.title = Drupal.t('Full screen');
          }
        },200);
      }

      function doAllMarkers (map, gs, mkey) {

        var arr = gs.latlons;
        for (var i = 0; i < arr.length; i++) {
          arr2 = arr[i];
          if (arr2.length < 2) {
            return;
          }
          lat = arr2[0];
          lon = arr2[1];
          lid = arr2[2];
          name = arr2[3];
          mark = arr2[4];
          lidkey = arr2[5];
          customContent = arr2[6];
          if (mark === '') {
            gs.markdone = gs.defaultIcon;
          }
          else {
            gs.markdone = Drupal.getlocations.getIcon(mark);
          }
          m = Drupal.getlocations.makeMarker(map, gs, lat, lon, lid, name, lidkey, customContent, mkey);
          // still experimental
          getlocations_markers[mkey].lids[lid] = m;
          if (gs.usemarkermanager || gs.useclustermanager) {
            gs.batchr.push(m);
          }
        }
        // add batchr
        if (gs.usemarkermanager) {
        gs.mgr.addMarkers(gs.batchr, gs.minzoom, gs.maxzoom);
          gs.mgr.refresh();
        }
        else if (gs.useclustermanager) {
          gs.cmgr.addMarkers(gs.batchr, 0);
        }
      }

      // end functions

      // is there really a map?
      if ( $("#getlocations_map_canvas_" + key).is('div') ) {

        // defaults
        global_settings = {
          maxzoom: 16,
          minzoom: 7,
          nodezoom: 12,
          minzoom_map: -1,
          maxzoom_map: -1,
          mgr: '',
          cmgr: '',
          cmgr_gridSize: null,
          cmgr_maxZoom: null,
          cmgr_minClusterSize: null,
          cmgr_styles: '',
          cmgr_style: null,
          defaultIcon: '',
          useInfoBubble: false,
          useInfoWindow: false,
          useCustomContent: false,
          useLink: false,
          markeraction: 0,
          markeractiontype: 1,
          show_maplinks: false,
          show_bubble_on_one_marker: false,
          infoBubbles: [],
          datanum: 0,
          trafficInfo: {},
          bicycleInfo: {},
          transitInfo: {},
          traffictoggleState: [],
          bicycletoggleState: [],
          transittoggleState: [],
          panoramioLayer: {},
          panoramiotoggleState: [],
          weatherLayer: {},
          weathertoggleState: [],
          cloudLayer: {},
          cloudtoggleState: [],
          batchr: []
        };

        var lat = parseFloat(settings.lat);
        var lng = parseFloat(settings.lng);
        var selzoom = parseInt(settings.zoom);
        var controltype = settings.controltype;
        var pancontrol = settings.pancontrol;
        var scale = settings.scale;
        var overview = settings.overview;
        var overview_opened = settings.overview_opened;
        var streetview_show = settings.streetview_show;
        var scrollw = settings.scrollwheel;
        var maptype = (settings.maptype ? settings.maptype : '');
        var baselayers = (settings.baselayers ? settings.baselayers : '');
        var map_marker = settings.map_marker;
        var poi_show = settings.poi_show;
        var transit_show = settings.transit_show;
        var pansetting = settings.pansetting;
        var draggable = settings.draggable;
        var map_styles = settings.styles;
        var map_backgroundcolor = settings.map_backgroundcolor;
        var fullscreen = (settings.fullscreen ? true : false);
        var js_path = settings.js_path;

        global_settings.info_path = settings.info_path;
        global_settings.preload_data = settings.preload_data;
        if (settings.preload_data) {
          global_settings.getlocations_info = Drupal.settings.getlocations_info[key];
        }

        getlocations_markers[key] = {};
        getlocations_markers[key].coords = {};
        getlocations_markers[key].lids = {};

        global_settings.locale_prefix = settings.locale_prefix ? settings.locale_prefix + "/" : "";
        global_settings.show_bubble_on_one_marker = (settings.show_bubble_on_one_marker ? true : false);
        global_settings.minzoom = parseInt(settings.minzoom);
        global_settings.maxzoom = parseInt(settings.maxzoom);
        global_settings.nodezoom = parseInt(settings.nodezoom);

        if (settings.minzoom_map == -1) {
          global_settings.minzoom_map = null;
        }
        else {
          global_settings.minzoom_map = parseInt(settings.minzoom_map);
        }
        if (settings.maxzoom_map == -1) {
          global_settings.maxzoom_map = null;
        }
        else {
          global_settings.maxzoom_map = parseInt(settings.maxzoom_map);
        }

        global_settings.datanum = settings.datanum;
        global_settings.markermanagertype = settings.markermanagertype;
        global_settings.pansetting = settings.pansetting;
        // mobiles
        global_settings.is_mobile = settings.is_mobile;
        global_settings.show_maplinks = settings.show_maplinks;

        // prevent old msie from running markermanager
        var ver = Drupal.getlocations.msiedetect();
        var pushit = false;
        if ( (ver == '') || (ver && ver > 8)) {
          pushit = true;
        }

        if (pushit && settings.markermanagertype == 1 && settings.usemarkermanager) {
          global_settings.usemarkermanager = true;
          global_settings.useclustermanager = false;
        }
        else if (pushit && settings.markermanagertype == 2 && settings.useclustermanager == 1) {
          global_settings.cmgr_styles = Drupal.settings.getlocations_markerclusterer;
          global_settings.cmgr_style = (settings.markerclusterer_style == -1 ? null : settings.markerclusterer_style);
          global_settings.cmgr_gridSize = (settings.markerclusterer_size == -1 ? null : parseInt(settings.markerclusterer_size));
          global_settings.cmgr_maxZoom = (settings.markerclusterer_zoom == -1 ? null : parseInt(settings.markerclusterer_zoom));
          global_settings.cmgr_minClusterSize = (settings.markerclusterer_minsize == -1 ? null : parseInt(settings.markerclusterer_minsize));
          global_settings.cmgr_title = settings.markerclusterer_title;
          global_settings.useclustermanager = true;
          global_settings.usemarkermanager = false;
        }
        else {
          global_settings.usemarkermanager = false;
          global_settings.useclustermanager = false;
        }

        global_settings.markeraction = settings.markeraction;
        global_settings.markeractiontype = 'click';
        if (settings.markeractiontype == 2) {
          global_settings.markeractiontype = 'mouseover';
        }

        if (global_settings.markeraction == 1) {
          global_settings.useInfoWindow = true;
        }

        else if (global_settings.markeraction == 2) {
          global_settings.useInfoBubble = true;
        }
        else if (global_settings.markeraction == 3) {
          global_settings.useLink = true;
        }

        if((global_settings.useInfoWindow || global_settings.useInfoBubble) && settings.custom_content_enable == 1) {
          global_settings.useCustomContent = true;
        }
        global_settings.defaultIcon = Drupal.getlocations.getIcon(map_marker);

        // pipe delim
        global_settings.latlons = (settings.latlons ? settings.latlons : '');
        var minmaxes = (settings.minmaxes ? settings.minmaxes : '');
        var minlat = '';
        var minlon = '';
        var maxlat = '';
        var maxlon = '';
        var cenlat = '';
        var cenlon = '';

        if (minmaxes) {
          mmarr = minmaxes.split(',');
          minlat = parseFloat(mmarr[0]);
          minlon = parseFloat(mmarr[1]);
          maxlat = parseFloat(mmarr[2]);
          maxlon = parseFloat(mmarr[3]);
          cenlat = ((minlat + maxlat)/2);
          cenlon = ((minlon + maxlon)/2);
        }
        // menu type
        var mtc = settings.mtc;
        if (mtc == 'standard') { mtc = google.maps.MapTypeControlStyle.HORIZONTAL_BAR; }
        else if (mtc == 'menu' ) { mtc = google.maps.MapTypeControlStyle.DROPDOWN_MENU; }
        else { mtc = false; }

        // nav control type
        if (controltype == 'default') { controltype = google.maps.ZoomControlStyle.DEFAULT; }
        else if (controltype == 'small') { controltype = google.maps.ZoomControlStyle.SMALL; }
        else if (controltype == 'large') { controltype = google.maps.ZoomControlStyle.LARGE; }
        else { controltype = false; }

        // map type
        maptypes = [];
        if (maptype) {
          if (maptype == 'Map' && baselayers.Map) { maptype = google.maps.MapTypeId.ROADMAP; }
            if (maptype == 'Satellite' && baselayers.Satellite) { maptype = google.maps.MapTypeId.SATELLITE; }
            if (maptype == 'Hybrid' && baselayers.Hybrid) { maptype = google.maps.MapTypeId.HYBRID; }
            if (maptype == 'Physical' && baselayers.Physical) { maptype = google.maps.MapTypeId.TERRAIN; }
            if (baselayers.Map) { maptypes.push(google.maps.MapTypeId.ROADMAP); }
            if (baselayers.Satellite) { maptypes.push(google.maps.MapTypeId.SATELLITE); }
            if (baselayers.Hybrid) { maptypes.push(google.maps.MapTypeId.HYBRID); }
            if (baselayers.Physical) { maptypes.push(google.maps.MapTypeId.TERRAIN); }
        }
        else {
          maptype = google.maps.MapTypeId.ROADMAP;
          maptypes.push(google.maps.MapTypeId.ROADMAP);
          maptypes.push(google.maps.MapTypeId.SATELLITE);
          maptypes.push(google.maps.MapTypeId.HYBRID);
          maptypes.push(google.maps.MapTypeId.TERRAIN);
        }

        // map styling
        var styles_array = [];
        if (map_styles) {
          try {
            styles_array = eval(map_styles);
          } catch (e) {
            if (e instanceof SyntaxError) {
              console.log(e.message);
              // Error on parsing string. Using default.
              styles_array = [];
            }
          }
        }

        // Merge styles with our settings.
        var styles = styles_array.concat([
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: (poi_show ? 'on' : 'off') }] },
          { featureType: "transit", elementType: "labels", stylers: [{ visibility: (transit_show ? 'on' : 'off') }] }
        ]);

        var mapOpts = {
          zoom: selzoom,
          minZoom: global_settings.minzoom_map,
          maxZoom: global_settings.maxzoom_map,
          center: new google.maps.LatLng(lat, lng),
          mapTypeControl: (mtc ? true : false),
          mapTypeControlOptions: {style: mtc,  mapTypeIds: maptypes},
          zoomControl: (controltype ? true : false),
          zoomControlOptions: {style: controltype},
          panControl: (pancontrol ? true : false),
          mapTypeId: maptype,
          scrollwheel: (scrollw ? true : false),
          draggable: (draggable ? true : false),
          styles: styles,
          overviewMapControl: (overview ? true : false),
          overviewMapControlOptions: {opened: (overview_opened ? true : false)},
          streetViewControl: (streetview_show ? true : false),
          scaleControl: (scale ? true : false),
          scaleControlOptions: {style: google.maps.ScaleControlStyle.DEFAULT}
        };
        if (map_backgroundcolor) {
          mapOpts.backgroundColor = map_backgroundcolor;
        }

        getlocations_map[key] = new google.maps.Map(document.getElementById("getlocations_map_canvas_" + key), mapOpts);

        // input map
        if (settings.inputmap) {
          getlocations_inputmap[key] = getlocations_map[key];
        }

        // set up markermanager
        if (global_settings.usemarkermanager) {
          global_settings.mgr = new MarkerManager(getlocations_map[key], {
            borderPadding: 50,
            maxZoom: global_settings.maxzoom,
            trackMarkers: false
          });
        }
        else if (global_settings.useclustermanager) {
          global_settings.cmgr = new MarkerClusterer(
            getlocations_map[key],
            [],
            {
              gridSize: global_settings.cmgr_gridSize,
              maxZoom: global_settings.cmgr_maxZoom,
              styles: global_settings.cmgr_styles[global_settings.cmgr_style],
              minimumClusterSize: global_settings.cmgr_minClusterSize,
              title: global_settings.cmgr_title
            }
          );
        }

        if (settings.trafficinfo) {
          global_settings.trafficInfo[key] = new google.maps.TrafficLayer();
          if (settings.trafficinfo_state > 0) {
            global_settings.trafficInfo[key].setMap(getlocations_map[key]);
            global_settings.traffictoggleState[key] = 1;
          }
          else {
            global_settings.trafficInfo[key].setMap(null);
            global_settings.traffictoggleState[key] = 0;
          }
          $("#getlocations_toggleTraffic_" + key).click( function() {
            if ( global_settings.traffictoggleState[key] == 1) {
              global_settings.trafficInfo[key].setMap(null);
              global_settings.traffictoggleState[key] = 0;
              label = Drupal.t('Traffic Info On');
            }
            else {
              global_settings.trafficInfo[key].setMap(getlocations_map[key]);
              global_settings.traffictoggleState[key] = 1;
              label = Drupal.t('Traffic Info Off');
            }
            $("#getlocations_toggleTraffic_" + key).val(label);
          });
        }

        if (settings.bicycleinfo) {
          global_settings.bicycleInfo[key] = new google.maps.BicyclingLayer();
          if (settings.bicycleinfo_state > 0) {
            global_settings.bicycleInfo[key].setMap(getlocations_map[key]);
            global_settings.bicycletoggleState[key] = 1;
          }
          else {
            global_settings.bicycleInfo[key].setMap(null);
            global_settings.bicycletoggleState[key] = 0;
          }
          $("#getlocations_toggleBicycle_" + key).click( function() {
            if ( global_settings.bicycletoggleState[key] == 1) {
              global_settings.bicycleInfo[key].setMap(null);
              global_settings.bicycletoggleState[key] = 0;
              label = Drupal.t('Bicycle Info On');
            }
            else {
              global_settings.bicycleInfo[key].setMap(getlocations_map[key]);
              global_settings.bicycletoggleState[key] = 1;
              label = Drupal.t('Bicycle Info Off');
            }
            $("#getlocations_toggleBicycle_" + key).val(label);
          });
        }

        if (settings.transitinfo) {
          global_settings.transitInfo[key] = new google.maps.TransitLayer();
          if (settings.transitinfo_state > 0) {
            global_settings.transitInfo[key].setMap(getlocations_map[key]);
            global_settings.transittoggleState[key] = 1;
          }
          else {
            global_settings.transitInfo[key].setMap(null);
            global_settings.transittoggleState[key] = 0;
          }
          $("#getlocations_toggleTransit_" + key).click( function() {
            if ( global_settings.transittoggleState[key] == 1) {
              global_settings.transitInfo[key].setMap(null);
              global_settings.transittoggleState[key] = 0;
              label = Drupal.t('Transit Info On');
            }
            else {
              global_settings.transitInfo[key].setMap(getlocations_map[key]);
              global_settings.transittoggleState[key] = 1;
              label = Drupal.t('Transit Info Off');
            }
            $("#getlocations_toggleTransit_" + key).val(label);
          });
        }

        if (settings.panoramio_use && settings.panoramio_show) {
          global_settings.panoramioLayer[key] = new google.maps.panoramio.PanoramioLayer();
          if (settings.panoramio_state > 0) {
            global_settings.panoramioLayer[key].setMap(getlocations_map[key]);
            global_settings.panoramiotoggleState[key] = 1;
          }
          else {
            global_settings.panoramioLayer[key].setMap(null);
            global_settings.panoramiotoggleState[key] = 0;
          }
          $("#getlocations_togglePanoramio_" + key).click( function() {
            if ( global_settings.panoramiotoggleState[key] == 1) {
              global_settings.panoramioLayer[key].setMap(null);
              global_settings.panoramiotoggleState[key] = 0;
              label = Drupal.t('Panoramio On');
            }
            else {
              global_settings.panoramioLayer[key].setMap(getlocations_map[key]);
              global_settings.panoramiotoggleState[key] = 1;
              label = Drupal.t('Panoramio Off');
            }
            $("#getlocations_togglePanoramio_" + key).val(label);
          });
        }

        // weather layer
        if (settings.weather_use && settings.weather_show) {
          tu = google.maps.weather.TemperatureUnit.CELSIUS;
          if (settings.weather_temp == 2) {
            tu = google.maps.weather.TemperatureUnit.FAHRENHEIT;
          }
          sp = google.maps.weather.WindSpeedUnit.KILOMETERS_PER_HOUR;
          if (settings.weather_speed == 2) {
            sp = google.maps.weather.WindSpeedUnit.METERS_PER_SECOND;
          }
          else if (settings.weather_speed == 3) {
            sp = google.maps.weather.WindSpeedUnit.MILES_PER_HOUR;
          }
          var weatherOpts =  {
            temperatureUnits: tu,
            windSpeedUnits: sp,
            clickable: (settings.weather_clickable ? true : false),
            suppressInfoWindows: (settings.weather_info ? false : true)
          };
          if (settings.weather_label > 0) {
            weatherOpts.labelColor = google.maps.weather.LabelColor.BLACK;
            if (settings.weather_label == 2) {
              weatherOpts.labelColor = google.maps.weather.LabelColor.WHITE;
            }
          }
          global_settings.weatherLayer[key] = new google.maps.weather.WeatherLayer(weatherOpts);
          if (settings.weather_state > 0) {
            global_settings.weatherLayer[key].setMap(getlocations_map[key]);
            global_settings.weathertoggleState[key] = 1;
          }
          else {
            global_settings.weatherLayer[key].setMap(null);
            global_settings.weathertoggleState[key] = 0;
          }
          global_settings.weather_cloud = settings.weather_cloud;
          if (settings.weather_cloud) {
            global_settings.cloudLayer[key] = new google.maps.weather.CloudLayer();
            if (settings.weather_cloud_state > 0) {
              global_settings.cloudLayer[key].setMap(getlocations_map[key]);
              global_settings.cloudtoggleState[key] = 1;
            }
            else {
              global_settings.cloudLayer[key].setMap(null);
              global_settings.cloudtoggleState[key] = 0;
            }
            $("#getlocations_toggleCloud_" + key).click( function() {
              if ( global_settings.cloudtoggleState[key] == 1) {
                global_settings.cloudLayer[key].setMap(null);
                global_settings.cloudtoggleState[key] = 0;
                label = Drupal.t('Clouds On');
              }
              else {
                global_settings.cloudLayer[key].setMap(getlocations_map[key]);
                global_settings.cloudtoggleState[key] = 1;
                label = Drupal.t('Clouds Off');
              }
              $("#getlocations_toggleCloud_" + key).val(label);
            });
          }
          else {
            global_settings.cloudLayer[key] = null;
          }
          $("#getlocations_toggleWeather_" + key).click( function() {
            if ( global_settings.weathertoggleState[key] == 1) {
              global_settings.weatherLayer[key].setMap(null);
              global_settings.weathertoggleState[key] = 0;
              label = Drupal.t('Weather On');
            }
            else {
              global_settings.weatherLayer[key].setMap(getlocations_map[key]);
              global_settings.weathertoggleState[key] = 1;
              label = Drupal.t('Weather Off');
            }
            $("#getlocations_toggleWeather_" + key).val(label);
          });
        }

        // exporting global_settings to getlocations_settings
        getlocations_settings[key] = global_settings;

        // markers and bounding
        if (! settings.inputmap && ! settings.searchmap) {
          //setTimeout(function() { doAllMarkers(getlocations_map[key], global_settings, key) }, 300);
          doAllMarkers(getlocations_map[key], global_settings, key);

          if (pansetting == 1) {
            Drupal.getlocations.doBounds(getlocations_map[key], minlat, minlon, maxlat, maxlon, true);
          }
          else if (pansetting == 2) {
            Drupal.getlocations.doBounds(getlocations_map[key], minlat, minlon, maxlat, maxlon, false);
          }
          else if (pansetting == 3) {
            if (cenlat  && cenlon) {
              c = new google.maps.LatLng(parseFloat(cenlat), parseFloat(cenlon));
              getlocations_map[key].setCenter(c);
            }
          }
        }

        // fullscreen
        if (fullscreen) {
          var fsdiv = '';
          $(document).keydown( function(kc) {
            var cd = (kc.keyCode ? kc.keyCode : kc.which);
            if(cd == 27){
              if($("body").hasClass("fullscreen-body")){
                toggleFullScreen();
              }
            }
          });

          var fsdoc = document.createElement("DIV");
          var fs = new FullScreenControl(fsdoc);
          fsdoc.index = 0;
          getlocations_map[key].controls[google.maps.ControlPosition.TOP_RIGHT].setAt(0, fsdoc);
        }

      }
    }); // end each setting loop
    $("body").addClass("getlocations-maps-processed");

  } // end getlocations_init

  Drupal.getlocations.makeMarker = function(map, gs, lat, lon, lid, title, lidkey, customContent, mkey) {

    //if (! gs.markdone) {
    //  return;
    //}

    // check for duplicates
    var hash = lat + lon;
    hash = hash.replace(".","").replace(",", "").replace("-","");
    if (getlocations_markers[mkey].coords[hash] == null) {
      getlocations_markers[mkey].coords[hash] = 1;
    }
    else {
      // we have a duplicate
      // 10000 constrains the max, 0.0001 constrains the min distance
      m1 = (Math.random() /10000) + 0.0001;
      // randomise the operator
      m2 = Math.random();
      if (m2 > 0.5) {
        lat = parseFloat(lat) + m1;
      }
      else {
        lat = parseFloat(lat) - m1;
      }
      m1 = (Math.random() /10000) + 0.0001;
      m2 = Math.random();
      if (m2 > 0.5) {
        lon = parseFloat(lon) + m1;
      }
      else {
        lon = parseFloat(lon) - m1;
      }
    }

    // relocate function
    get_winlocation = function(gs, lid, lidkey) {
      if (gs.preload_data) {
        arr = gs.getlocations_info;
        for (var i = 0; i < arr.length; i++) {
          data = arr[i];
          if (lid == data.lid && lidkey == data.lidkey && data.content) {
            window.location = data.content;
          }
        }
      }
      else {
        // fetch link and relocate
        var path = Drupal.settings.basePath + "getlocations_cb/lidinfo";
        $.get(path, {'lid': lid, 'key': lidkey}, function(data) {
          if (data.content) {
            window.location = data.content;
          }
        });
      }
    };

    var mouseoverTimeoutId = null;
    var mouseoverTimeout = (gs.markeractiontype == 'mouseover' ? 300 : 0);
    var p = new google.maps.LatLng(lat, lon);
    var m = new google.maps.Marker({
      icon: gs.markdone.image,
      shadow: gs.markdone.shadow,
      shape: gs.markdone.shape,
      map: map,
      position: p,
      title: title,
      optimized: false
    });

    if (gs.markeraction > 0) {
      google.maps.event.addListener(m, gs.markeractiontype, function() {
        mouseoverTimeoutId = setTimeout(function() {
          if (gs.useLink) {
            get_winlocation(gs, lid, lidkey);
          }
          else {
            if(gs.useCustomContent) {
              var cc = [];
              cc.content = customContent;
              Drupal.getlocations.showPopup(map, m, gs, cc);
            }
            else {
              // fetch bubble content
              if (gs.preload_data) {
                arr = gs.getlocations_info;
                for (var i = 0; i < arr.length; i++) {
                  data = arr[i];
                  if (lid == data.lid && lidkey == data.lidkey && data.content) {
                    Drupal.getlocations.showPopup(map, m, gs, data);
                  }
                }
              }
              else {
                var path = gs.info_path;
                var qs = {'lid': lid, 'key': lidkey};
                if (gs.show_distance) {
                  if ($("#getlocations_search_slat_" + mkey).is('div')) {
                    var slat = $("#getlocations_search_slat_" + mkey).html();
                    var slon = $("#getlocations_search_slon_" + mkey).html();
                    var sunit = $("#getlocations_search_sunit_" + mkey).html();
                    if (slat && slon) {
                      qs = {'lid': lid, 'key': lidkey, 'sdist': sunit + '|' + slat + '|' + slon};
                    }
                  }
                }

                $.get(path, qs, function(data) {
                  Drupal.getlocations.showPopup(map, m, gs, data);
                });
              }
            }
          }
        }, mouseoverTimeout);
      });
      google.maps.event.addListener(m,'mouseout', function() {
        if(mouseoverTimeoutId) {
          clearTimeout(mouseoverTimeoutId);
          mouseoverTimeoutId = null;
        }
      });

    }
    // we only have one marker
    if (gs.datanum == 1) {
      map.setCenter(p);
      map.setZoom(gs.nodezoom);
      // show_bubble_on_one_marker
      if (gs.show_bubble_on_one_marker && (gs.useInfoWindow || gs.useInfoBubble)) {
        google.maps.event.trigger(m, 'click');
      }
    }

    // show_maplinks
    if (gs.show_maplinks && (gs.useInfoWindow || gs.useInfoBubble || gs.useLink)) {
      // add link
      $("div#getlocations_map_links_" + mkey + " ul").append('<li><a href="#maptop_' + mkey + '" class="lid-' + lid + '">' + title + '</a></li>');
      // Add listener
      $("div#getlocations_map_links_" + mkey + " a.lid-" + lid).click(function(){
        $("div#getlocations_map_links_" + mkey + " a").removeClass('active');
        $("div#getlocations_map_links_" + mkey + " a.lid-" + lid).addClass('active');
        if (gs.useLink) {
          // relocate
          get_winlocation(gs, lid, lidkey);
        }
        else {
          // emulate
          google.maps.event.trigger(m, 'click');
        }
      });
    }

    return m;

  };

  Drupal.getlocations.showPopup = function(map, m, gs, data) {
    var ver = Drupal.getlocations.msiedetect();
    var pushit = false;
    if ( (ver == '') || (ver && ver > 8)) {
      pushit = true;
    }

    if (pushit) {
      // close any previous instances
      for (var i in gs.infoBubbles) {
        gs.infoBubbles[i].close();
      }
    }

    if (gs.useInfoBubble) {
      if (typeof(infoBubbleOptions) == 'object') {
        var infoBubbleOpts = infoBubbleOptions;
      }
      else {
        var infoBubbleOpts = {};
      }
      infoBubbleOpts.content = data.content;
      var infoBubble = new InfoBubble(infoBubbleOpts);
      infoBubble.open(map, m);
      if (pushit) {
        // add to the array
        gs.infoBubbles.push(infoBubble);
      }
    }
    else {
      if (typeof(infoWindowOptions) == 'object') {
        var infoWindowOpts = infoWindowOptions;
      }
      else {
        var infoWindowOpts = {};
      }
      infoWindowOpts.content = data.content;
      var infowindow = new google.maps.InfoWindow(infoWindowOpts);
      infowindow.open(map, m);
      if (pushit) {
        // add to the array
        gs.infoBubbles.push(infowindow);
      }
    }

  };

  Drupal.getlocations.doBounds = function(map, minlat, minlon, maxlat, maxlon, dopan) {
    if (minlat !== '' && minlon !== '' && maxlat !== '' && maxlon !== '') {
      // Bounding
      var minpoint = new google.maps.LatLng(parseFloat(minlat), parseFloat(minlon));
      var maxpoint = new google.maps.LatLng(parseFloat(maxlat), parseFloat(maxlon));
      var bounds = new google.maps.LatLngBounds(minpoint, maxpoint);
      if (dopan) {
        map.panToBounds(bounds);
      }
      else {
        map.fitBounds(bounds);
      }
    }
  };

  Drupal.getlocations.msiedetect = function() {
    var ieversion = '';
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
     ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
    }
    return ieversion;
  };

  Drupal.getlocations.getGeoErrCode = function(errcode) {
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
  };

  Drupal.getlocations.geolocationErrorMessages = function(errcode) {
    var codes = [
      Drupal.t("due to an unknown error"),
      Drupal.t("because you didn't give me permission"),
      Drupal.t("because your browser couldn't determine your location"),
      Drupal.t("because it was taking too long to determine your location")];
    return codes[errcode];
  };

  // gogogo
  Drupal.behaviors.getlocations = {
    attach: function() {
      if (! $(".getlocations-maps-processed").is("body")) {
        getlocations_init();
      }
    }
  };

})(jQuery);
