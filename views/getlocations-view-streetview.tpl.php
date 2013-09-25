<?php
/**
 * @file getlocations-view-streetview.tpl.php
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Default simple view template to display a list of rows.
 * Derived from views-view-unformatted.tpl.php
 *
 * @ingroup views_templates
 */
?>
<!-- getlocations-view-streetview.tpl -->
<?php if (! empty($streetview)): ?>
  <?php if (!empty($title)): ?>
  <h3><?php print $title; ?></h3>
  <?php endif; ?>
  <div class="getlocations_streetview_wrapper"><?php print $streetview; ?></div>
<?php endif; ?>
<!-- /getlocations-view-streetview.tpl -->
