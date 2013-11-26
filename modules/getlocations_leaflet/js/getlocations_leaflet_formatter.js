

/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_leaflet module admin
 * jquery gee whizzery
*/
(function ($) {
  Drupal.behaviors.getlocations_leaflet_formatter = {
    attach: function(context, settings) {

      if ($("input[id$=scalecontrol]").attr('checked')) {
        $("#wrap-getlocations-scalecontrol").show();
      }
      else {
        $("#wrap-getlocations-scalecontrol").hide();
      }
      $("input[id$=scalecontrol]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-scalecontrol").show();
        }
        else {
          $("#wrap-getlocations-scalecontrol").hide();
        }
      });

      if ($("input[id$=zoomcontrol]").attr('checked')) {
        $("#wrap-getlocations-zoomcontrol").show();
      }
      else {
        $("#wrap-getlocations-zoomcontrol").hide();
      }
      $("input[id$=zoomcontrol]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-zoomcontrol").show();
        }
        else {
          $("#wrap-getlocations-zoomcontrol").hide();
        }
      });

      if ($("input[id$=attributioncontrol]").attr('checked')) {
        $("#wrap-getlocations-attributioncontrol").show();
      }
      else {
        $("#wrap-getlocations-attributioncontrol").hide();
      }
      $("input[id$=attributioncontrol]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-attributioncontrol").show();
        }
        else {
          $("#wrap-getlocations-attributioncontrol").hide();
        }
      });

      if ($("input[id$=layercontrol]").attr('checked')) {
        $("#wrap-getlocations-layercontrol").show();
      }
      else {
        $("#wrap-getlocations-layercontrol").hide();
      }
      $("input[id$=layercontrol]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-layercontrol").show();
        }
        else {
          $("#wrap-getlocations-layercontrol").hide();
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

      if ($("input[id$=geojson-enable]").attr('checked')) {
       $("#wrap-getlocations-geojson-enable").show();
      }
      else {
        $("#wrap-getlocations-geojson-enable").hide();
      }
      $("input[id$=geojson-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-getlocations-geojson-enable").show();
        }
        else {
          $("#wrap-getlocations-geojson-enable").hide();
        }
      });

      if ($("input[id$=returnlink-node-enable]").attr('checked')) {
        $("#wrap-node-link").show();
      }
      else {
        $("#wrap-node-link").hide();
      }
      $("input[id$=returnlink-node-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-node-link").show();
        }
        else {
          $("#wrap-node-link").hide();
        }
      });

      if ($("input[id$=returnlink-user-enable]").attr('checked')) {
        $("#wrap-user-link").show();
      }
      else {
        $("#wrap-user-link").hide();
      }
      $("input[id$=returnlink-user-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-user-link").show();
        }
        else {
          $("#wrap-user-link").hide();
        }
      });

      if ($("input[id$=returnlink-term-enable]").attr('checked')) {
        $("#wrap-term-link").show();
      }
      else {
        $("#wrap-term-link").hide();
      }
      $("input[id$=returnlink-term-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-term-link").show();
        }
        else {
          $("#wrap-term-link").hide();
        }
      });

      if ($("input[id$=returnlink-comment-enable]").attr('checked')) {
        $("#wrap-comment-link").show();
      }
      else {
        $("#wrap-comment-link").hide();
      }
      $("input[id$=returnlink-comment-enable]").change(function() {
        if ($(this).attr('checked')) {
          $("#wrap-comment-link").show();
        }
        else {
          $("#wrap-comment-link").hide();
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

      if($('#edit-style-options-custom-content-enable').attr('checked')) {
        $('#wrap-custom-content-source').show();
      }
      else {
        $('#wrap-custom-content-source').hide();
      }
      $("#edit-style-options-custom-content-enable").change(function() {
        if($(this).attr('checked')) {
          $('#wrap-custom-content-source').show();
        }
        else {
          $('#wrap-custom-content-source').hide();
        }
      });


    }
  };
}(jQuery));
