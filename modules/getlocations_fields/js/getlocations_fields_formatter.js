
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_fields module admin
 * jquery gee whizzery
*/
(function ($) {
  Drupal.behaviors.getlocations_fields_formatter = {
    attach: function() {

      if ($("input[id$=settings-trafficinfo], input[id$=options-trafficinfo]").attr('checked')) {
        $("#wrap-getlocations-trafficinfo").show();
      }
      else {
        $("#wrap-getlocations-trafficinfo").hide();
      }
      $("input[id$=settings-trafficinfo], input[id$=options-trafficinfo]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-trafficinfo").show();
        }
        else {
          $("#wrap-getlocations-trafficinfo").hide();
        }
      });

      if ($("input[id$=settings-bicycleinfo], input[id$=options-bicycleinfo]").attr('checked')) {
        $("#wrap-getlocations-bicycleinfo").show();
      }
      else {
        $("#wrap-getlocations-bicycleinfo").hide();
      }
      $("input[id$=settings-bicycleinfo], input[id$=options-bicycleinfo]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-bicycleinfo").show();
        }
        else {
          $("#wrap-getlocations-bicycleinfo").hide();
        }
      });

      if ($("input[id$=settings-transitinfo], input[id$=options-transitinfo]").attr('checked')) {
        $("#wrap-getlocations-transitinfo").show();
      }
      else {
        $("#wrap-getlocations-transitinfo").hide();
      }
      $("input[id$=settings-transitinfo], input[id$=options-transitinfo]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-transitinfo").show();
        }
        else {
          $("#wrap-getlocations-transitinfo").hide();
        }
      });

      if ($("input[id$=settings-panoramio-show], input[id$=options-panoramio-show]").attr('checked')) {
        $("#wrap-getlocations-panoramio").show();
      }
      else {
        $("#wrap-getlocations-panoramio").hide();
      }
      $("input[id$=settings-panoramio-show], input[id$=options-panoramio-show]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-panoramio").show();
        }
        else {
          $("#wrap-getlocations-panoramio").hide();
        }
      });

      if ($("input[id$=settings-weather-show], input[id$=options-weather-show]").attr('checked')) {
        $("#wrap-getlocations-weather").show();
      }
      else {
        $("#wrap-getlocations-weather").hide();
      }
      $("input[id$=settings-weather-show], input[id$=options-weather-show]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-weather").show();
        }
        else {
          $("#wrap-getlocations-weather").hide();
        }
      });

      if ($("input[id$=settings-weather-cloud], input[id$=options-weather-cloud]").attr('checked')) {
        $("#wrap-getlocations-weather-cloud").show();
      }
      else {
        $("#wrap-getlocations-weather-cloud").hide();
      }
      $("input[id$=settings-weather-cloud], input[id$=options-weather-cloud]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-weather-cloud").show();
        }
        else {
          $("#wrap-getlocations-weather-cloud").hide();
        }
      });


      if ($("input[id*=polygons-enable]").attr('checked')) {
        $("#wrap-getlocations-polygons").show();
      }
      else {
        $("#wrap-getlocations-polygons").hide();
      }
      $("input[id*=polygons-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-polygons").show();
        }
        else {
          $("#wrap-getlocations-polygons").hide();
        }
      });

      if ($("input[id*=rectangles-enable]").attr('checked')) {
        $("#wrap-getlocations-rectangles").show();
      }
      else {
        $("#wrap-getlocations-rectangles").hide();
      }
      $("input[id*=rectangles-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-rectangles").show();
        }
        else {
          $("#wrap-getlocations-rectangles").hide();
        }
      });

      if ($("input[id*=circles-enable]").attr('checked')) {
        $("#wrap-getlocations-circles").show();
      }
      else {
        $("#wrap-getlocations-circles").hide();
      }
      $("input[id*=circles-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-circles").show();
        }
        else {
          $("#wrap-getlocations-circles").hide();
        }
      });

      if ($("input[id*=polylines-enable]").attr('checked')) {
       $("#wrap-getlocations-polylines").show();
      }
      else {
        $("#wrap-getlocations-polylines").hide();
      }
      $("input[id*=polylines-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-polylines").show();
        }
        else {
          $("#wrap-getlocations-polylines").hide();
        }
      });

    }
  };
}(jQuery));

