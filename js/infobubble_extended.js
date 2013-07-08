/**
 * @file
 * @author https://drupal.org/user/2210776
 * @copyright GNU GPL
 * Adds two new methods to the Infobubble.prototype class.
 * Adapted from the gmap_style_bubbles module.
 * See https://drupal.org/node/2035847
 */

if (typeof InfoBubble === 'function') {
  /* First new method: bubbleBackgroundClassName allows theming of the whole
     popup bubble via css. */
  InfoBubble.prototype.setBubbleBackgroundClassName = function(className) {
    this.contentContainer_.classList.add(className);
  };
  InfoBubble.prototype['setBubbleBackgroundClassName'] =
    InfoBubble.prototype.setBubbleBackgroundClassName;

  /* Second new method: closeImage allows reference to a custom image to
     close the popup window. */
  InfoBubble.prototype.setCloseImage = function(image) {
    this.close_.src = image;
  };
  InfoBubble.prototype['setCloseImage'] =
    InfoBubble.prototype.setCloseImage;
}
