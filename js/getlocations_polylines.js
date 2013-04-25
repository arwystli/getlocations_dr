
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations polylines support
 * jquery stuff
*/
(function ($) {
  Drupal.behaviors.getlocations_polylines = {
    attach: function() {

      var default_polyline_settings = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
      };
      $.each(Drupal.settings.getlocations_polylines, function (key, settings) {

        var strokeColor = (settings.strokeColor ? settings.strokeColor : default_polyline_settings.strokeColor);
        var strokeOpacity = (settings.strokeOpacity ? settings.strokeOpacity : default_polyline_settings.strokeOpacity);
        var strokeWeight = (settings.strokeWeight ? settings.strokeWeight : default_polyline_settings.strokeWeight);
        var clickable = (settings.clickable ? settings.clickable : default_polyline_settings.clickable);
        var message = (settings.message ? settings.message : default_polyline_settings.message);

        var polylines = settings.polylines;
        var p_strokeColor = strokeColor;
        var p_strokeOpacity = strokeOpacity;
        var p_strokeWeight = strokeWeight;
        var p_clickable = clickable;
        var p_message = message;
        for (var i = 0; i < polylines.length; i++) {
          pl = polylines[i];
          if (pl.coords) {
            if (pl.strokeColor) {
              p_strokeColor = pl.strokeColor;
            }
            if (pl.strokeOpacity) {
              p_strokeOpacity = pl.strokeOpacity;
            }
            if (pl.strokeWeight) {
              p_strokeWeight = pl.strokeWeight;
            }
            if (pl.clickable) {
              p_clickable = pl.clickable;
            }
            if (pl.message) {
              p_message = pl.message;
            }
            p_clickable = (p_clickable ? true : false);
            var mcoords = [];
            var poly = [];
            scoords = pl.coords.split("|");
            for (var s = 0; s < scoords.length; s++) {
              ll = scoords[s];
              lla = ll.split(",");
              mcoords[s] = new google.maps.LatLng(parseFloat(lla[0]), parseFloat(lla[1]));
            }
            if (mcoords.length > 1) {
              var polyOpts = {};
              polyOpts.path = mcoords;
              polyOpts.strokeColor = p_strokeColor;
              polyOpts.strokeOpacity = p_strokeOpacity;
              polyOpts.strokeWeight = p_strokeWeight;
              polyOpts.clickable = p_clickable;

              poly[i] = new google.maps.Polyline(polyOpts);
              poly[i].setMap(getlocations_map[key]);

              if (p_clickable && p_message) {
                infowindow = new google.maps.InfoWindow();
                google.maps.event.addListener(poly[i], 'click', function(event) {
                  infowindow.setContent(p_message);
                  infowindow.setPosition(event.latLng);
                  infowindow.open(getlocations_map[key]);
                });
              }
            }
          }
        }
      });

    }
  };
}(jQuery));
