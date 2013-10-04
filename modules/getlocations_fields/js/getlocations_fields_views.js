/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_fields module in Views
 * jquery stuff
*/
(function ($) {

  Drupal.behaviors.getlocations_fields_views = {
    attach: function() {

      // streetview plugin
      if ($("#edit-style-options-sv-addresscontrol").is('input')) {
        if ($("#edit-style-options-sv-addresscontrol").attr('checked')) {
          $("#wrap-getlocations-addresscontrol").show();
        }
        else {
          $("#wrap-getlocations-addresscontrol").hide();
        }
        $("#edit-style-options-sv-addresscontrol").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-addresscontrol").show();
          }
          else {
            $("#wrap-getlocations-addresscontrol").hide();
          }
        });
      }
      if ($("#edit-style-options-sv-pancontrol").is('input')) {
        if ($("#edit-style-options-sv-pancontrol").attr('checked')) {
          $("#wrap-getlocations-pancontrol").show();
        }
        else {
          $("#wrap-getlocations-pancontrol").hide();
        }
        $("#edit-style-options-sv-pancontrol").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-pancontrol").show();
          }
          else {
            $("#wrap-getlocations-pancontrol").hide();
          }
        });
      }
      if ($("#edit-style-options-sv-zoomcontrol").is('select')) {
        if ($("#edit-style-options-sv-zoomcontrol").val() == 'none') {
          $("#wrap-getlocations-zoomcontrol").hide();
        }
        else {
          $("#wrap-getlocations-zoomcontrol").show();
        }
        $("#edit-style-options-sv-zoomcontrol").change(function() {
          if ($(this).val() == 'none') {
            $("#wrap-getlocations-zoomcontrol").hide();
          }
          else {
            $("#wrap-getlocations-zoomcontrol").show();
          }
        });
      }

      if ($("#edit-style-options-sv-show").is('input')) {
        if ($("#edit-style-options-sv-show").attr('checked')) {
          $("#wrap-getlocations-sv-show").show();
        }
        else {
          $("#wrap-getlocations-sv-show").hide();
        }
        $("#edit-style-options-sv-show").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-getlocations-sv-show").show();
          }
          else {
            $("#wrap-getlocations-sv-show").hide();
          }
        });
      }

    }
  };

}(jQuery));
