<?php

/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * drush integration for getlocations.
 * 'drush getlocations-markers' will install the basic getlocations marker set
 * 'drush getlocations-geojson' will install the GeoJSON javascript library
 */

/**
 * Implementation of hook_drush_command().
 *
 * In this hook, you specify which commands your
 * drush module makes available, what it does and
 * description.
 *
 * Notice how this structure closely resembles how
 * you define menu hooks.
 *
 * See `drush topic docs-commands` for a list of recognized keys.
 *
 * @return
 *   An associative array describing your command(s).
 */
function getlocations_drush_command() {
  $items = array();

  // the key in the $items array is the name of the command.
  $items['getlocations-markers'] = array(
    'callback' => 'drush_getlocations_markers',
    'description' => dt('Download and install the basic set of getlocations markers.'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUSH, // No bootstrap.
    'arguments' => array(
      'path' => dt('Optional. A path where to install the Getlocations markers. If omitted Drush will use the default location.'),
    ),
    'aliases' => array('getlocationsmarkers'),
  );
  $items['getlocations-geojson'] = array(
    'callback' => 'drush_getlocations_geojson',
    'description' => dt('Download and install the GeoJSON javascript library.'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUSH, // No bootstrap.
    'arguments' => array(
      'path' => dt('Optional. A path where to install the GeoJSON javascript library. If omitted Drush will use the default location.'),
    ),
    'aliases' => array('getlocationsgeojson'),
  );

  return $items;
}

/**
 * Implementation of hook_drush_help().
 *
 * This function is called whenever a drush user calls
 * 'drush help <name-of-your-command>'
 *
 * @param
 *   A string with the help section (prepend with 'drush:')
 *
 * @return
 *   A string with the help text for your command.
 */
function getlocations_drush_help($section) {
  switch ($section) {
    case 'drush:getlocations-markers':
      return dt('Download and install the basic set of getlocations markers from Dropbox, default location is sites/all/libraries.');
    case 'drush:getlocations-geojson':
      return dt('Download and install the GeoJSON javascript library from Github, default location is sites/all/libraries.');
  }
}

/**
 * Command to download the basic Getlocations markers.
 */
function drush_getlocations_markers() {
  $args = func_get_args();
  if (!empty($args[0])) {
    $path = $args[0];
  }
  else {
    $path = 'sites/all/libraries';
  }

  // Create the path if it does not exist.
  if (!is_dir($path)) {
    drush_op('mkdir', $path);
    drush_log(dt('Directory @path was created', array('@path' => $path)), 'notice');
  }

  // Set the directory to the download location.
  $olddir = getcwd();
  chdir($path);

  $zip = 'http://dl.dropboxusercontent.com/u/41489105/Drupal/getlocations/getlocations-markers.zip';
  $dirname = 'getlocations';

  // Getlocations markers directory exists, bailing out
  if (is_dir($dirname)) {
    drush_log(dt('An existing Getlocations markerset was found in @path, not continuing.', array('@path' => $path)), 'notice');
    return;
  }

  // Download the zip archive
  if ($filepath = drush_download_file($zip)) {
    $filename = basename($filepath);

    // Decompress the zip archive
    drush_tarball_extract($filename);
  }

  if (is_dir($dirname)) {
    drush_log(dt('Getlocations markers have been installed in @path', array('@path' => $path)), 'success');
  }
  else {
    drush_log(dt('Drush was unable to install the Getlocations markers to @path', array('@path' => $path)), 'error');
  }

  // Set working directory back to the previous working directory.
  chdir($olddir);
}


/**
 * Command to download the GeoJSON javascript library.
 */
function drush_getlocations_geojson() {
  $args = func_get_args();
  if (!empty($args[0])) {
    $path = $args[0];
  }
  else {
    $path = 'sites/all/libraries';
  }

  // Create the path if it does not exist.
  if (!is_dir($path)) {
    drush_op('mkdir', $path);
    drush_log(dt('Directory @path was created', array('@path' => $path)), 'notice');
  }

  // Set the directory to the download location.
  $olddir = getcwd();
  chdir($path);

  $zip = 'https://github.com/JasonSanford/GeoJSON-to-Google-Maps/archive/master.zip';
  $dirname = 'GeoJSON';
  // Download the zip archive
  if ($filepath = drush_download_file($zip)) {
    $filename = basename($filepath);

     // Remove any existing directory
    if (is_dir($dirname)) {
      drush_delete_dir($dirname, TRUE);
      drush_log(dt('An existing GeoJSON library was deleted from @path', array('@path' => $path)), 'notice');
    }

    // Decompress the zip archive
    drush_tarball_extract($filename);

    // Change the directory name to "GeoJSON" if needed.
    if (is_dir('GeoJSON-to-Google-Maps-master')) {
      drush_move_dir('GeoJSON-to-Google-Maps-master', $dirname, TRUE);
    }
  }

  if ($filepath && is_dir($dirname)) {
    drush_log(dt('GeoJSON javascript library has been installed in @path', array('@path' => $path)), 'success');
  }
  else {
    drush_log(dt('Drush was unable to install the GeoJSON javascript library to @path', array('@path' => $path)), 'error');
  }

  // Set working directory back to the previous working directory.
  chdir($olddir);
}

