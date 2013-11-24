
/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_leaflet categories support
*/
(function ($) {
  Drupal.behaviors.getlocations_leaflet_categories = {
    attach: function() {

      $.each(Drupal.settings.getlocations_leaflet, function (key, settings) {

        // categories
        if (settings.map_settings.category_showhide_buttons) {
          var cats = (settings.map_settings.categories ? settings.map_settings.categories : []);
          if (cats) {
            $.each(cats, function (cat, label) {
              //categoriesGetClicks(key, cat, label);

            });
          }
        }

      });

    }
  };
}(jQuery));

/*

      function categoriesGetClicks(k, c, l) {
        var tgt = "#getlocations_leaflet_toggle_" + c + '_' + k;
        if ($(tgt).is('input')) {
          $(tgt).click( function() {
            $.each(getlocations_leaflet_markers[k].lids, function (lid, mark) {
              if (getlocations_leaflet_markers[k].cat[lid] == c) {
                vis = false;
                //vis = mark.getVisible();
                if (vis) {
                  label = l + ' ' + Drupal.t('On');
                  sv = false;
                }
                else {
                  label = l + ' ' + Drupal.t('Off');
                  sv = true;
                }
                //mark.setVisible(sv);
                $(tgt).val(label);
              }
            });
          });
        }
      }


*/
