
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations module in views using custom-content in infobubble/infowindow
 * jquery stuff
*/
(function ($) {

  Drupal.behaviors.getlocations_views = {
    attach: function() {

      if($('#edit-style-options-markeraction').val() == 1 || $('#edit-style-options-markeraction').val() == 2) {
        $('#wrap-custom-content-enable').show();

          if($('#edit-style-options-custom-content-enable').attr('checked')) {
            $('#wrap-custom-content-source').show();
          }
          else {
            $('#wrap-custom-content-source').hide();
          }
      }
      else {
        $('#wrap-custom-content-enable').hide();
        $('#wrap-custom-content-source').hide();
      }

      $("#edit-style-options-markeraction").change(function() {
        if($(this).val() == 1 || $(this).val() == 2) {
          $('#wrap-custom-content-enable').show();

          if($('#edit-style-options-custom-content-enable').attr('checked')) {
            $('#wrap-custom-content-source').show();
          }
          else {
            $('#wrap-custom-content-source').hide();
          }
        }
        else {
          $('#wrap-custom-content-enable').hide();
          $('#wrap-custom-content-source').hide();
        }
      });

      $("#edit-style-options-custom-content-enable").change(function() {
        if($('#edit-style-options-markeraction').val() == 1 || $('#edit-style-options-markeraction').val() == 2) {
            if($(this).attr('checked')) {
              $('#wrap-custom-content-source').show();
            }
            else {
              $('#wrap-custom-content-source').hide();
            }
        }
      });

      if ($("#edit-fields-field-address-settings-edit-form-settings-trafficinfo, #edit-style-options-trafficinfo").is('input')) {
        if ($("#edit-fields-field-address-settings-edit-form-settings-trafficinfo, #edit-style-options-trafficinfo").attr('checked')) {
          $("#wrap-getlocations-trafficinfo").show();
        }
        else {
          $("#wrap-getlocations-trafficinfo").hide();
        }
        $("#edit-fields-field-address-settings-edit-form-settings-trafficinfo, #edit-style-options-trafficinfo").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-trafficinfo").show();
          }
          else {
            $("#wrap-getlocations-trafficinfo").hide();
          }
        });
      }

      if ($("#edit-fields-field-address-settings-edit-form-settings-bicycleinfo, #edit-style-options-bicycleinfo").is('input')) {
        if ($("#edit-fields-field-address-settings-edit-form-settings-bicycleinfo, #edit-style-options-bicycleinfo").attr('checked')) {
          $("#wrap-getlocations-bicycleinfo").show();
        }
        else {
          $("#wrap-getlocations-bicycleinfo").hide();
        }
        $("#edit-fields-field-address-settings-edit-form-settings-bicycleinfo, #edit-style-options-bicycleinfo").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-bicycleinfo").show();
          }
          else {
            $("#wrap-getlocations-bicycleinfo").hide();
          }
        });
      }

      if ($("#edit-fields-field-address-settings-edit-form-settings-transitinfo, #edit-style-options-transitinfo").is('input')) {
        if ($("#edit-fields-field-address-settings-edit-form-settings-transitinfo, #edit-style-options-transitinfo").attr('checked')) {
          $("#wrap-getlocations-transitinfo").show();
        }
        else {
          $("#wrap-getlocations-transitinfo").hide();
        }
        $("#edit-fields-field-address-settings-edit-form-settings-transitinfo, #edit-style-options-transitinfo").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-transitinfo").show();
          }
          else {
            $("#wrap-getlocations-transitinfo").hide();
          }
        });
      }

      if ($("#edit-fields-field-address-settings-edit-form-settings-panoramio-show, #edit-style-options-panoramio-show").is('input')) {
        if ($("#edit-fields-field-address-settings-edit-form-settings-panoramio-show, #edit-style-options-panoramio-show").attr('checked')) {
          $("#wrap-getlocations-panoramio").show();
        }
        else {
          $("#wrap-getlocations-panoramio").hide();
        }
        $("#edit-fields-field-address-settings-edit-form-settings-panoramio-show, #edit-style-options-panoramio-show").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-panoramio").show();
          }
          else {
            $("#wrap-getlocations-panoramio").hide();
          }
        });
      }

      if ($("#edit-fields-field-address-settings-edit-form-settings-weather-show, #edit-style-options-weather-show").is('input')) {
        if ($("#edit-fields-field-address-settings-edit-form-settings-weather-show, #edit-style-options-weather-show").attr('checked')) {
          $("#wrap-getlocations-weather").show();
        }
        else {
          $("#wrap-getlocations-weather").hide();
        }
        $("#edit-fields-field-address-settings-edit-form-settings-weather-show, #edit-style-options-weather-show").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-weather").show();
          }
          else {
            $("#wrap-getlocations-weather").hide();
          }
        });

        if ($("#edit-fields-field-address-settings-edit-form-settings-weather-cloud, #edit-style-options-weather-cloud").attr('checked')) {
          $("#wrap-getlocations-weather-cloud").show();
        }
        else {
          $("#wrap-getlocations-weather-cloud").hide();
        }
        $("#edit-fields-field-address-settings-edit-form-settings-weather-cloud, #edit-style-options-weather-cloud").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-weather-cloud").show();
          }
          else {
            $("#wrap-getlocations-weather-cloud").hide();
          }
        });
      }

      if ($("#edit-fields-field-address-settings-edit-form-settings-polygons-enable, #edit-style-options-polygons-enable").attr('checked')) {
        $("#wrap-getlocations-polygons").show();
      }
      else {
        $("#wrap-getlocations-polygons").hide();
      }
      $("#edit-fields-field-address-settings-edit-form-settings-polygons-enable, #edit-style-options-polygons-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-polygons").show();
        }
        else {
          $("#wrap-getlocations-polygons").hide();
        }
      });

      if ($("#edit-fields-field-address-settings-edit-form-settings-rectangles-enable, #edit-style-options-rectangles-enable").attr('checked')) {
        $("#wrap-getlocations-rectangles").show();
      }
      else {
        $("#wrap-getlocations-rectangles").hide();
      }
      $("#edit-fields-field-address-settings-edit-form-settings-rectangles-enable, #edit-style-options-rectangles-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-rectangles").show();
        }
        else {
          $("#wrap-getlocations-rectangles").hide();
        }
      });

      if ($("#edit-fields-field-address-settings-edit-form-settings-circles-enable, #edit-style-options-circles-enable").attr('checked')) {
        $("#wrap-getlocations-circles").show();
      }
      else {
        $("#wrap-getlocations-circles").hide();
      }
      $("#edit-fields-field-address-settings-edit-form-settings-circles-enable, #edit-style-options-circles-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-circles").show();
        }
        else {
          $("#wrap-getlocations-circles").hide();
        }
      });

      if ($("#edit-fields-field-address-settings-edit-form-settings-polylines-enable, #edit-style-options-polylines-enable").attr('checked')) {
        $("#wrap-getlocations-polylines").show();
      }
      else {
        $("#wrap-getlocations-polylines").hide();
      }
      $("#edit-fields-field-address-settings-edit-form-settings-polylines-enable, #edit-style-options-polylines-enable").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-polylines").show();
        }
        else {
          $("#wrap-getlocations-polylines").hide();
        }
      });

      // categories
      if ($("#edit-style-options-category-method").val() > 0) {
        $("#wrap-category1").show();
        if ($("#edit-style-options-category-method").val() == 2) {
          $("#wrap-category2").show();
        }
        else {
          $("#wrap-category2").hide();
        }
      }
      else {
        $("#wrap-category1").hide();
      }
      $("#edit-style-options-category-method").change(function() {
        if ($("#edit-style-options-category-method").val() > 0) {
          $("#wrap-category1").show();
          if ($("#edit-style-options-category-method").val() == 2) {
            $("#wrap-category2").show();
          }
          else {
            $("#wrap-category2").hide();
          }
        }
        else {
          $("#wrap-category1").hide();
        }
      });


    }
  };

}(jQuery));
