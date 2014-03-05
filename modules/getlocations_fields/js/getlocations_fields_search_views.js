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
    attach: function() {

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

    }
  };

}(jQuery));
