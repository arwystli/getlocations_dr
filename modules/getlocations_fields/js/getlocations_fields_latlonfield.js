/**
 * @file
 * getlocations_fields_latlonfield.js
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Derived from .numberField() by nikita.vanyasin@gmail.com
 * https://github.com/nikita-vanyasin/jquery.numberfield.js.git
 *
 * Javascript functions for getlocations module for Drupal 7
 * this is for googlemaps API version 3
*/

(function ($) {
  Drupal.behaviors.getlocations_fields_latlonfield = {
    attach: function () {

      $.fn.latlonField = function( options ) {
        if ( !options ) {
          options = {};
        }
        var defaultOptions = {ints: 3, floats: 6, separator: "."};
        options = $.extend( defaultOptions, options );
        var intNumAllow = options.ints;
        var floatNumAllow = options.floats;
        var separator = options.separator;
        $( this ).on( 'keydown keypress keyup paste input', function() {
          while ( (this.value.split( separator ).length - 1) > 1 ) {
            this.value = this.value.slice( 0, -1 );
            if ( (this.value.split( separator ).length - 1) <= 1 ) {
              return false;
            }
          }
          var re = new RegExp('[^0-9' + options.separator + '-' + ']', 'g');
          this.value = this.value.replace(re, '');

          var allowedLength;
          var iof = this.value.indexOf( separator );
          if ( (iof != -1) && (this.value.substring( 0, iof ).length > intNumAllow) ) {
            allowedLength = 0;
          }
          else if ( iof != -1 ) {
            allowedLength = iof + floatNumAllow + 1;
          }
          else {
            allowedLength = intNumAllow;
          }
          this.value = this.value.substring( 0, allowedLength );
          return true;
        });
        return $( this );
      };
    }
  };
})(jQuery);
