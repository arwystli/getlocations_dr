<?php
/**
 * @file getlocations-leaflet-view-map.tpl.php
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Default simple view template to display a list of rows.
 * Derived from views-view-unformatted.tpl.php
 *
 * @ingroup views_templates
 */
?>
<!-- getlocations-leaflet-view-map.tpl -->
<?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
<?php endif; ?>

<?php print $map; ?>

<!-- /getlocations-leaflet-view-map.tpl -->
