
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations module admin
 * jquery stuff
*/
(function ($) {

  Drupal.behaviors.getlocations_admin = {
    attach: function() {

      if ($("#edit-getlocations-default-returnlink-page-enable").attr('checked')) {
        $("#wrap-page-link").show();
      }
      else {
        $("#wrap-page-link").hide();
      }
      $("#edit-getlocations-default-returnlink-page-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-page-link").show();
        }
        else {
          $("#wrap-page-link").hide();
        }
      });

      if ($("#edit-getlocations-default-returnlink-user-enable").attr('checked')) {
        $("#wrap-user-link").show();
      }
      else {
        $("#wrap-user-link").hide();
      }
      $("#edit-getlocations-default-returnlink-user-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-user-link").show();
        }
        else {
          $("#wrap-user-link").hide();
        }
      });

      if ($("#edit-getlocations-default-returnlink-term-enable").attr('checked')) {
        $("#wrap-term-link").show();
      }
      else {
        $("#wrap-term-link").hide();
      }
      $("#edit-getlocations-default-returnlink-term-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-term-link").show();
        }
        else {
          $("#wrap-term-link").hide();
        }
      });

      if ($("#edit-getlocations-default-returnlink-comment-enable").attr('checked')) {
        $("#wrap-comment-link").show();
      }
      else {
        $("#wrap-comment-link").hide();
      }
      $("#edit-getlocations-default-returnlink-comment-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-comment-link").show();
        }
        else {
          $("#wrap-comment-link").hide();
        }
      });

      if ($("#edit-getlocations-colorbox-enable").attr('checked')) {
        $("#wrap-getlocations-colorbox").show();
      }
      else {
        $("#wrap-getlocations-colorbox").hide();
      }
      $("#edit-getlocations-colorbox-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-colorbox").show();
        }
        else {
          $("#wrap-getlocations-colorbox").hide();
        }
      });

      if ($("#edit-getlocations-colorbox-marker-enable").attr('checked')) {
        $("#wrap-getlocations-marker-colorbox").show();
      }
      else {
        $("#wrap-getlocations-marker-colorbox").hide();
      }
      $("#edit-getlocations-colorbox-marker-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-marker-colorbox").show();
        }
        else {
          $("#wrap-getlocations-marker-colorbox").hide();
        }
      });

      if ($("#edit-getlocations-node-marker-enable").attr('checked')) {
        $("#wrap-getlocations-node-markers").show();
      }
      else {
        $("#wrap-getlocations-node-markers").hide();
      }
      $("#edit-getlocations-node-marker-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-node-markers").show();
        }
        else {
          $("#wrap-getlocations-node-markers").hide();
        }
      });

      if ($("#edit-getlocations-vocabulary-marker-enable").attr('checked')) {
        $("#wrap-getlocations-vocabulary-markers").show();
      }
      else {
        $("#wrap-getlocations-vocabulary-markers").hide();
      }
      $("#edit-getlocations-vocabulary-marker-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-vocabulary-markers").show();
        }
        else {
          $("#wrap-getlocations-vocabulary-markers").hide();
        }
      });

      if ($("#edit-getlocations-term-marker-enable").attr('checked')) {
        $("#wrap-getlocations-term-markers").show();
      }
      else {
        $("#wrap-getlocations-term-markers").hide();
      }
      $("#edit-getlocations-term-marker-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-term-markers").show();
        }
        else {
          $("#wrap-getlocations-term-markers").hide();
        }
      });

      if ($("#edit-getlocations-default-markermanagertype").val() == 1) {
        // markermanager
        $(".form-item-getlocations-default-usemarkermanager").show();
        $("#wrap-getlocations-clusteropts").hide();
        $("#wrap-getlocations-markeropts").show();
      }
      else if ($("#edit-getlocations-default-markermanagertype").val() == 2) {
        // markerclusterer
        $(".form-item-getlocations-default-usemarkermanager").hide();
        $("#wrap-getlocations-clusteropts").show();
        $("#wrap-getlocations-markeropts").hide();
      }
      else {
        // none
        $(".form-item-getlocations-default-usemarkermanager").hide();
        $("#wrap-getlocations-clusteropts").hide();
        $("#wrap-getlocations-markeropts").hide();
      }
      $("#edit-getlocations-default-markermanagertype").change(function() {
        if ($(this).val() == 1) {
          // markermanager
          $(".form-item-getlocations-default-usemarkermanager").show();
          $("#wrap-getlocations-clusteropts").hide();
          $("#wrap-getlocations-markeropts").show();
        }
        else if ($(this).val() == 2) {
          // markerclusterer
          $(".form-item-getlocations-default-usemarkermanager").hide();
          $("#wrap-getlocations-clusteropts").show();
          $("#wrap-getlocations-markeropts").hide();
        }
        else {
          // none
          $(".form-item-getlocations-default-usemarkermanager").hide();
          $("#wrap-getlocations-clusteropts").hide();
          $("#wrap-getlocations-markeropts").hide();
        }
      });

      if ($("#edit-getlocations-default-trafficinfo").is('input')) {
        if ($("#edit-getlocations-default-trafficinfo").attr('checked')) {
          $("#wrap-getlocations-trafficinfo").show();
        }
        else {
          $("#wrap-getlocations-trafficinfo").hide();
        }
        $("#edit-getlocations-default-trafficinfo").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-trafficinfo").show();
          }
          else {
            $("#wrap-getlocations-trafficinfo").hide();
          }
        });
      }

      if ($("#edit-getlocations-default-bicycleinfo").is('input')) {
        if ($("#edit-getlocations-default-bicycleinfo").attr('checked')) {
          $("#wrap-getlocations-bicycleinfo").show();
        }
        else {
          $("#wrap-getlocations-bicycleinfo").hide();
        }
        $("#edit-getlocations-default-bicycleinfo").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-bicycleinfo").show();
          }
          else {
            $("#wrap-getlocations-bicycleinfo").hide();
          }
        });
      }

      if ($("#edit-getlocations-default-transitinfo").is('input')) {
        if ($("#edit-getlocations-default-transitinfo").attr('checked')) {
          $("#wrap-getlocations-transitinfo").show();
        }
        else {
          $("#wrap-getlocations-transitinfo").hide();
        }
        $("#edit-getlocations-default-transitinfo").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-transitinfo").show();
          }
          else {
            $("#wrap-getlocations-transitinfo").hide();
          }
        });
      }

      if ( $("#edit-getlocations-default-panoramio-use").is('input') && $("#edit-getlocations-default-panoramio-show").is('input')) {

        if ($("#edit-getlocations-default-panoramio-use").attr('checked')) {
          $("#wrap-getlocations-panoramio-use").show();
        }
        else {
          $("#wrap-getlocations-panoramio-use").hide();
        }
        $("#edit-getlocations-default-panoramio-use").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-panoramio-use").show();
          }
          else {
            $("#wrap-getlocations-panoramio-use").hide();
          }
        });

        if ($("#edit-getlocations-default-panoramio-show").attr('checked')) {
          $("#wrap-getlocations-panoramio").show();
        }
        else {
          $("#wrap-getlocations-panoramio").hide();
        }
        $("#edit-getlocations-default-panoramio-show").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-panoramio").show();
          }
          else {
            $("#wrap-getlocations-panoramio").hide();
          }
        });
      }

      if ( $("#edit-getlocations-default-weather-use").is('input') && $("#edit-getlocations-default-weather-show").is('input')) {

        if ($("#edit-getlocations-default-weather-use").attr('checked')) {
          $("#wrap-getlocations-weather-use").show();
        }
        else {
          $("#wrap-getlocations-weather-use").hide();
        }
        $("#edit-getlocations-default-weather-use").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-weather-use").show();
          }
          else {
            $("#wrap-getlocations-weather-use").hide();
          }
        });

        if ($("#edit-getlocations-default-weather-show").attr('checked')) {
          $("#wrap-getlocations-weather").show();
        }
        else {
          $("#wrap-getlocations-weather").hide();
        }
        $("#edit-getlocations-default-weather-show").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-weather").show();
          }
          else {
            $("#wrap-getlocations-weather").hide();
          }
        });

        if ($("#edit-getlocations-default-weather-cloud").attr('checked')) {
          $("#wrap-getlocations-weather-cloud").show();
        }
        else {
          $("#wrap-getlocations-weather-cloud").hide();
        }
        $("#edit-getlocations-default-weather-cloud").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-weather-cloud").show();
          }
          else {
            $("#wrap-getlocations-weather-cloud").hide();
          }
        });

      }

      if ($("#edit-getlocations-default-polygons-enable").attr('checked')) {
        $("#wrap-getlocations-polygons").show();
      }
      else {
        $("#wrap-getlocations-polygons").hide();
      }
      $("#edit-getlocations-default-polygons-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-polygons").show();
        }
        else {
          $("#wrap-getlocations-polygons").hide();
        }
      });
      if ($("#edit-getlocations-default-rectangles-enable").attr('checked')) {
        $("#wrap-getlocations-rectangles").show();
      }
      else {
        $("#wrap-getlocations-rectangles").hide();
      }
      $("#edit-getlocations-default-rectangles-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-rectangles").show();
        }
        else {
          $("#wrap-getlocations-rectangles").hide();
        }
      });

      if ($("#edit-getlocations-default-circles-enable").attr('checked')) {
        $("#wrap-getlocations-circles").show();
      }
      else {
        $("#wrap-getlocations-circles").hide();
      }
      $("#edit-getlocations-default-circles-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-circles").show();
        }
        else {
          $("#wrap-getlocations-circles").hide();
        }
      });

      if ($("#edit-getlocations-default-polylines-enable").attr('checked')) {
        $("#wrap-getlocations-polylines").show();
      }
      else {
        $("#wrap-getlocations-polylines").hide();
      }
      $("#edit-getlocations-default-polylines-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-polylines").show();
        }
        else {
          $("#wrap-getlocations-polylines").hide();
        }
      });
      // search_places
      if ($("#edit-getlocations-default-search-places").attr('checked')) {
        $("#wrap-getlocations-search-places").show();
      }
      else {
        $("#wrap-getlocations-search-places").hide();
      }
      $("#edit-getlocations-default-search-places").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-search-places").show();
        }
        else {
          $("#wrap-getlocations-search-places").hide();
        }
      });

    }
  };

}(jQuery));
