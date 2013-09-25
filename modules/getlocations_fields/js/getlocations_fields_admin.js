
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_fields module admin
 * jquery gee whizzery
*/
(function ($) {
  Drupal.behaviors.getlocations_fields_admin = {
    attach: function() {

      // config page
      if ($("#edit-getlocations-fields-defaults-use-address").is('input')) {
        if ($("#edit-getlocations-fields-defaults-use-address").attr('checked')) {
          $("#wrap-input_address_width").show();
        }
        else {
          $("#wrap-input_address_width").hide();
        }
        $("#edit-getlocations-fields-defaults-use-address").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-input_address_width").show();
          }
          else {
            $("#wrap-input_address_width").hide();
          }
        });
      }

      // content-type config
      if ($("#edit-field-settings-use-address").is('input')) {
        if ($("#edit-field-settings-use-address").attr('checked')) {
          $("#wrap-input_address_width").show();
        }
        else {
          $("#wrap-input_address_width").hide();
        }
        $("#edit-field-settings-use-address").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-input_address_width").show();
          }
          else {
            $("#wrap-input_address_width").hide();
          }
        });
       }

      if ($("#edit-getlocations-fields-defaults-restrict-by-country,#edit-field-settings-restrict-by-country").is('input')) {
        if ($("#edit-getlocations-fields-defaults-restrict-by-country,#edit-field-settings-restrict-by-country").attr('checked')) {
          $("#getlocations_fields_search_country").show();
        }
        else {
          $("#getlocations_fields_search_country").hide();
        }
        $("#edit-getlocations-fields-defaults-restrict-by-country,#edit-field-settings-restrict-by-country").change( function() {
          if ($("#edit-getlocations-fields-defaults-restrict-by-country,#edit-field-settings-restrict-by-country").attr('checked')) {
            $("#getlocations_fields_search_country").show();
          }
          else {
            $("#getlocations_fields_search_country").hide();
          }
        });
      }

      if ($("#edit-getlocations-fields-defaults-pancontrol,#edit-field-settings-pancontrol").is('input')) {
        if ($("#edit-getlocations-fields-defaults-pancontrol,#edit-field-settings-pancontrol").attr('checked')) {
          $("#wrap-pancontrol").show();
        }
        else {
          $("#wrap-pancontrol").hide();
        }
        $("#edit-getlocations-fields-defaults-pancontrol,#edit-field-settings-pancontrol").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-pancontrol").show();
          }
          else {
            $("#wrap-pancontrol").hide();
          }
        });
      }

      if ($("#edit-getlocations-fields-defaults-controltype,#edit-field-settings-controltype").is('select')) {
        if ($("#edit-getlocations-fields-defaults-controltype,#edit-field-settings-controltype").val() == 'none') {
          $("#wrap-zoomcontrol").hide();
        }
        else {
          $("#wrap-zoomcontrol").show();
        }
        $("#edit-getlocations-fields-defaults-controltype,#edit-field-settings-controltype").change(function() {
          if ($(this).val() == 'none') {
            $("#wrap-zoomcontrol").hide();
          }
          else {
            $("#wrap-zoomcontrol").show();
          }
        });
      }

      if ($("#edit-getlocations-fields-defaults-mtc,#edit-field-settings-mtc").is('select')) {
        if ($("#edit-getlocations-fields-defaults-mtc,#edit-field-settings-mtc").val() == 'none') {
          $("#wrap-mapcontrol").hide();
        }
        else {
          $("#wrap-mapcontrol").show();
        }
        $("#edit-getlocations-fields-defaults-mtc,#edit-field-settings-mtc").change(function() {
          if ($(this).val() == 'none') {
            $("#wrap-mapcontrol").hide();
          }
          else {
            $("#wrap-mapcontrol").show();
          }
        });
      }

      if ($("#edit-getlocations-fields-defaults-scale,#edit-field-settings-scale").is('input')) {
        if ($("#edit-getlocations-fields-defaults-scale,#edit-field-settings-scale").attr('checked')) {
          $("#wrap-scale").show();
        }
        else {
          $("#wrap-scale").hide();
        }
        $("#edit-getlocations-fields-defaults-scale,#edit-field-settings-scale").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-scale").show();
          }
          else {
            $("#wrap-scale").hide();
          }
        });
      }

      if ($("#edit-getlocations-fields-defaults-sv-show,#edit-field-settings-sv-show").is('input')) {
        if ($("#edit-getlocations-fields-defaults-sv-show,#edit-field-settings-sv-show").attr('checked')) {
          $("#wrap-sv-show").show();
        }
        else {
          $("#wrap-sv-show").hide();
        }
        $("#edit-getlocations-fields-defaults-sv-show,#edit-field-settings-sv-show").change(function() {
          if ($(this).attr('checked')) {
            $("#wrap-sv-show").show();
          }
          else {
            $("#wrap-sv-show").hide();
          }
        });
      }


    }
  };
}(jQuery));
