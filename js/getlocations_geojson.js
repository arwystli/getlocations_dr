/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations geojson support
 * jquery stuff
*/
(function ($) {

  var geojson_object;

  Drupal.getlocations_geojson = function(key) {

    var geojson_data = Drupal.settings.getlocations[key].geojson_data;
    var geojson_data_parsed = JSON.parse(geojson_data);
    var geojson_options = Drupal.settings.getlocations[key].geojson_options;
    var geojson_options_parsed = null;
    if (geojson_options) {
      geojson_options_parsed = JSON.parse(geojson_options);
    }

    // get the object
    geojson_object = new GeoJSON(geojson_data_parsed, geojson_options_parsed);

    if (geojson_object.length){
      for (var i = 0; i < geojson_object.length; i++){
        if(geojson_object[i].length){
          for(var j = 0; j < geojson_object[i].length; j++){
            geojson_object[i][j].setMap(getlocations_map[key]);
            if(geojson_object[i][j].geojsonProperties) {
              do_geojson_bubble(geojson_object[i][j], key);
            }
          }
        }
        else{
          geojson_object[i].setMap(getlocations_map[key]);
        }
        if (geojson_object[i].geojsonProperties) {
          do_geojson_bubble(geojson_object[i], key);
        }
      }
    }else{
      geojson_object.setMap(getlocations_map[key]);
      if (geojson_object.geojsonProperties) {
        do_geojson_bubble(geojson_object, key);
      }
    }

  };

  function do_geojson_bubble(data_item, key) {

    var main = '';
		for (var j in data_item.geojsonProperties) {
			main += data_item.geojsonProperties[j] + "<br />";
		}
    if (main == '') {
      return;
    }

    var ver = Drupal.getlocations.msiedetect();
    var pushit = false;
    if ( (ver == '') || (ver && ver > 8)) {
      pushit = true;
    }

    var geojson_content = "";
    geojson_content += '<div class="location vcard">';
    geojson_content += '<div class="container-inline">';
    geojson_content += main;
    geojson_content += '</div>';
    geojson_content += '</div>';

		google.maps.event.addListener(data_item, "click", function(event) {
      if (pushit) {
        for (var i in getlocations_settings[key].infoBubbles) {
          getlocations_settings[key].infoBubbles[i].close();
        }
      }
      if (getlocations_settings[key].markeraction == 2) {
        var geojson_iw = new InfoBubble({content: geojson_content});
      }
      else {
        var geojson_iw = new google.maps.InfoWindow({content: geojson_content});
      }
      geojson_iw.open(getlocations_map[key], data_item);
      if (pushit) {
        getlocations_settings[key].infoBubbles.push(geojson_iw);
      }

    });

  }


}(jQuery));
