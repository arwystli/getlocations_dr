<?php

/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * getlocations module administration functions.
 * using version 3 googlemaps API
 */

/**
 * Function to display the getlocations admin settings form
 * @return
 *   Returns the form.
 */
function getlocations_settings_form() {
  $getlocations_defaults = getlocations_defaults();
  drupal_add_js(GETLOCATIONS_PATH . '/js/getlocations_admin.js');

  $form = array();

  $form['rebuild'] = array(
    '#type' => 'fieldset',
    '#title' => t('Regenerate Getlocations marker cache'),
    '#description' => t('If you are having problems with markers, or have changed anything in the markers library, click on the Regenerate button.'),
  );
  if (file_default_scheme() != 'public') {
    $form['rebuild']['getlocations_private_markerfile'] = getlocations_element_map_tf(
      t('Path to getlocations_markers.js'),
      variable_get('getlocations_private_markerfile', ''),
      t('You are using the <em>Private</em> download method. For markers to work properly. you must press the <em>Regenerate</em> button, manually copy js/getlocations_markers.js from the files directory to a location accessible by the webserver, and enter the file path relative to the Drupal root (including the filename) in this field. Example: <em>sites/default/misc/getlocations_markers.js</em>'),
      60,
      255,
      FALSE
    );
  }
  if (! getlocations_get_markerfile()) {
    $form['rebuild']['errmsg'] = array(
      '#value' => '<p class="messages error">' . t('You need to regenerate the markers, file not found.') . '</p>'
    );
  }
  $form['rebuild']['rebuild_marker_js'] = array(
    '#type' => 'submit',
    '#value' => t('Regenerate'),
    '#submit' => array('_getlocations_rebuild_marker_js_submit'),
  );
  $form['rebuild']['getlocations_flush'] = getlocations_element_map_checkbox(
    t('Flush marker cache'),
    variable_get('getlocations_flush', 1),
    t('Include the marker cache when the Drupal cache is flushed.')
  );

  // google api3 key
  $apikey = variable_get('getlocations_api3_key', '');
  $form['api3'] = array(
    '#type' => 'fieldset',
    '#title' => t('Google API key'),
    '#description' => t('This key is currently not required by Google.'),
    '#collapsible' => TRUE,
    #'#collapsed' => ($apikey ? TRUE : FALSE),
    '#collapsed' => TRUE,
  );

  $form['api3']['getlocations_api3_key'] = getlocations_element_map_tf(
    t('Your Google maps API Version 3 key'),
    $apikey,
    t('For more information about this key see this !u', array('!u' => l(t('page on google'), 'http://code.google.com/apis/maps/documentation/javascript/tutorial.html#api_key', array('attributes' => array('target' => '_blank'))))),
    95,
    255,
    FALSE
  );

  // preview
  $form['getlocations_preview'] = array(
    '#type' => 'fieldset',
    '#title' => t('Getlocations Preview'),
    '#description' => t('A preview of the current map settings.<br />You can adjust the default Map center, Zoom and Default map type by changing the map.<br /> For all other changes use the form. Remember to Save configuration when you are done.'),
    // This will store all the defaults in one variable.
    '#tree' => FALSE,
  );
  $form['getlocations_preview']['preview_map'] = array('#markup' => '');

  $form['getlocations_default'] = array(
    '#type' => 'fieldset',
    '#title' => t('Getlocations Default map settings'),
    // This will store all the defaults in one variable.
    '#tree' => TRUE,
  );

  $form['getlocations_default'] += getlocations_map_display_basics_form($getlocations_defaults);

  $form['getlocations_default'] += getlocations_map_display_options_form($getlocations_defaults);

  // default node marker
  $markers = getlocations_get_marker_titles();
  $desc = '';
  $form['getlocations_default']['map_marker'] = getlocations_element_map_marker(
    t('Default Content Map marker'),
    $markers,
    $getlocations_defaults['map_marker'],
    $desc
  );

  $fieldables = getlocations_get_fieldable_entity_types();
  foreach ($fieldables AS $entity_type) {
    $entity_get_info = entity_get_info($entity_type);
    $label = $entity_get_info['label'];
    $desc = '';
    if (getlocations_check_entity_type($entity_type)) {
      $desc = t('In use');
    }
    $form['getlocations_default'][$entity_type . '_map_marker'] = getlocations_element_map_marker(
      t('Default !label Map marker', array('!label' => $label)),
      $markers,
      $getlocations_defaults[$entity_type . '_map_marker'],
      $desc
    );

  }

  if (module_exists('getlocations_fields')) {
    // default input marker
    $form['getlocations_default']['input_map_marker'] = getlocations_element_map_marker(
      t('Default Input Map marker'),
      $markers,
      $getlocations_defaults['input_map_marker'],
      t('The draggable marker used on add/edit maps.')
    );
  }

  $form['getlocations_default']['markeractiontype'] = getlocations_element_map_markeractiontype($getlocations_defaults['markeractiontype']);
  $form['getlocations_default']['markeraction'] = getlocations_element_map_markeraction($getlocations_defaults['markeraction']);

  $form['getlocations_default']['preload_data'] = getlocations_element_map_checkbox(
    t('Preload marker data'),
    $getlocations_defaults['preload_data'],
    t('This will load all the data for InfoBubble/InfoWindow or link beforehand. This may result in slower initial page loads but faster marker click response.')
  );

  $form['getlocations_default']['nodezoom'] = getlocations_element_map_zoom(
    t('Default Zoom for Single location'),
    $getlocations_defaults['nodezoom'],
    t('The Default zoom level for a single marker.')
  );

  // marker manager
  $form['getlocations_default']['markermanagertype'] = getlocations_element_markermanagertype($getlocations_defaults['markermanagertype']);
  $form['getlocations_default']['usemarkermanager'] = getlocations_element_map_checkbox(
    t('Use Marker manager'),
    $getlocations_defaults['usemarkermanager'],
    t('Use Marker manager. Switching this off will use no manager.')
  );

  $form['getlocations_default']['minzoom'] = getlocations_element_map_zoom(
    t('Minimum Zoom'),
    $getlocations_defaults['minzoom'],
    t('The Minimum zoom level at which markers will be visible.')
  );

  $form['getlocations_default']['maxzoom'] = getlocations_element_map_zoom(
    t('Maximum Zoom'),
    $getlocations_defaults['maxzoom'],
    t('The Maximum zoom level at which markers will be visible.')
  );

  $form['getlocations_default']['useclustermanager'] = getlocations_element_map_checkbox(
    t('Use Cluster manager'),
    $getlocations_defaults['useclustermanager'],
    t('Use Cluster manager. Switching this off will use no manager.')
  );

  if (file_exists(GETLOCATIONS_PATH . '/getlocations.markerclusterer_override.inc')) {
    module_load_include('inc', 'getlocations', 'getlocations.markercluster_override');
  }
  else {
    module_load_include('inc', 'getlocations', 'getlocations.markercluster');
  }
  $form['getlocations_default']['markerclusterer_style'] = getlocations_element_markerclusterer_style($getlocations_defaults['markerclusterer_style']);
  $form['getlocations_default']['markerclusterer_title'] = getlocations_element_map_tf(
    t('Markerclusterer tooltip'),
    $getlocations_defaults['markerclusterer_title'],
    t('The text of a Markerclusterer tooltip'),
    30,
    64,
    TRUE
  );

  $form['getlocations_default']['markerclusterer_zoom'] = getlocations_element_markerclusterer_zoom($getlocations_defaults['markerclusterer_zoom']);
  $form['getlocations_default']['markerclusterer_size'] = getlocations_element_markerclusterer_size($getlocations_defaults['markerclusterer_size']);
  $form['getlocations_default']['markerclusterer_minsize'] = getlocations_element_markerclusterer_minsize($getlocations_defaults['markerclusterer_minsize']);

  $form['getlocations_default']['pansetting'] = getlocations_element_map_pansetting($getlocations_defaults['pansetting']);

  // return links
  foreach ($fieldables AS $entity_type) {
    $entity_get_info = entity_get_info($entity_type);
    $label = $entity_get_info['label'];
    if (getlocations_check_entity_type($entity_type)) {
      $form['getlocations_default']['returnlink_' . $entity_type . '_enable'] = getlocations_element_map_checkbox(
        t('Show link back to !label', array('!label' => $label)),
        $getlocations_defaults['returnlink_' . $entity_type . '_enable']
      );
      $form['getlocations_default']['returnlink_' . $entity_type . '_link'] = getlocations_element_map_tf(
        t('Text of !label return link', array('!label' => $label)),
        $getlocations_defaults['returnlink_' . $entity_type . '_link'],
        t('Use %t to insert the !label title', array('!label' => $label)),
        30,
        64
      );
    }
  }

  $form['getlocations_default']['getlocations_js_weight'] = getlocations_element_map_tf(
    t('Getlocations Javascript weight'),
    $getlocations_defaults['getlocations_js_weight'],
    t('Set the weight of the getlocations javascript loading, only change this if you are having problems. For advanced users only.'),
    5,
    99,
    TRUE
  );

  $getlocations_markers = variable_get('getlocations_markers', array());
  $type_markers = getlocations_get_type_markers();
  if ($type_markers) {
    $form['getlocations_markers'] = array(
      '#type' => 'fieldset',
      '#title' => t('Entity Type markers'),
      // This will store all the defaults in one variable.
      '#tree' => TRUE,
    );
    foreach ($type_markers AS $entity_type => $bundles) {
      // enable $entity_markers
      $entity_get_info = entity_get_info($entity_type);
      $entity_type_label = $entity_get_info['label'];
      $form['getlocations_markers'][$entity_type]['enable'] = getlocations_element_map_checkbox(
        t('Enable Markers for !t types', array('!t' => $entity_type_label)),
        (isset($getlocations_markers[$entity_type]['enable']) ? $getlocations_markers[$entity_type]['enable'] : 0)
      );
      foreach ($bundles AS $bundle => $field_names) {
        foreach ($field_names AS $field_name => $marker_data) {
          $bundle_label = $marker_data['bundle_label'];
          $form['getlocations_markers'][$entity_type][$bundle][$field_name]['marker'] = getlocations_element_map_marker(
            t('Type %etl, Bundle %name, Field %field Map marker', array('%etl' => $entity_type_label, '%name' => $bundle_label, '%field' => $field_name)),
            $markers,
            (isset($getlocations_markers[$entity_type][$bundle][$field_name]['marker'] ) ? $getlocations_markers[$entity_type][$bundle][$field_name]['marker'] : (isset($getlocations_defaults[$entity_type . '_map_marker']) ? $getlocations_defaults[$entity_type . '_map_marker'] : $getlocations_defaults['map_marker']))
          );
        }
      }
    }
  }

  // colorbox
  if (module_exists('colorbox')) {
    $getlocations_colorbox = getlocations_colorbox_settings();
    $form['getlocations_colorbox'] = array(
      '#type' => 'fieldset',
      '#title' => t('Colorbox settings'),
      // This will store all the defaults in one variable.
      '#tree' => TRUE,
    );
    $form['getlocations_colorbox']['enable'] = getlocations_element_map_checkbox(
      t('Enable Colorbox'),
      $getlocations_colorbox['enable'],
      t('Show Getlocations in a Colorbox.')
    );
    $form['getlocations_colorbox']['width'] = getlocations_element_map_tf(
      t('Colorbox width'),
      $getlocations_colorbox['width'],
      '',
      5,
      10,
      TRUE
    );
    // need this to get validation to work
    $form['getlocations_colorbox']['width']['#parents'] = array('getlocations_colorbox', 'width');
    $form['getlocations_colorbox']['height'] = getlocations_element_map_tf(
      t('Colorbox height'),
      $getlocations_colorbox['height'],
      '',
      5,
      10,
      TRUE
    );
    // need this to get validation to work
    $form['getlocations_colorbox']['height']['#parents'] = array('getlocations_colorbox', 'height');
    $form['getlocations_colorbox']['marker_enable'] = getlocations_element_map_checkbox(
      t('Enable Marker picker'),
      $getlocations_colorbox['marker_enable'],
      t('Show Markers in a Colorbox.')
    );
    $form['getlocations_colorbox']['marker_width'] = getlocations_element_map_tf(
      t('Marker Colorbox width'),
      $getlocations_colorbox['marker_width'],
      '',
      5,
      10,
      TRUE
    );
    // need this to get validation to work
    $form['getlocations_colorbox']['marker_width']['#parents'] = array('getlocations_colorbox', 'marker_width');
    $form['getlocations_colorbox']['marker_height'] = getlocations_element_map_tf(
      t('Marker Colorbox height'),
      $getlocations_colorbox['marker_height'],
      '',
      5,
      10,
      TRUE
    );
    // need this to get validation to work
    $form['getlocations_colorbox']['marker_height']['#parents'] = array('getlocations_colorbox', 'marker_height');
  }

  $form['getlocations_ua'] = array(
    '#type' => 'fieldset',
    '#title' => t('User Agent detection'),
    '#description' => t('For advanced users who want to edit the User Agent detection string.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    // This will store all the defaults in one variable.
    '#tree' => TRUE,
  );

  $getlocations_ua = getlocations_ua_get();
  $form['getlocations_ua']['ua_string'] = getlocations_element_map_tf(
    t('User Agent detection'),
    $getlocations_ua['ua_string'],
    t('User Agent detection is used to determine wether the browser is on a mobile device. Edit this regular expression with care.'),
    60,
    255,
    TRUE
  );

  $form['getlocations_paths'] = array(
    '#type' => 'fieldset',
    '#title' => t('Javascript paths'),
    '#description' => t('For advanced users who want to supply their own javascript.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    // This will store all the defaults in one variable.
    '#tree' => TRUE,
  );

  $getlocations_paths = getlocations_paths_get();
  $form['getlocations_paths']['infobubble_path'] = getlocations_element_path(
    t('Path to InfoBubble javascript file'),
    $getlocations_paths['infobubble_path'],
    60,
    128,
    t('Where the InfoBubble javascript file is located.')
  );
  $form['getlocations_paths']['infobubble_extended_path'] = getlocations_element_path(
    t('Path to InfoBubble extended javascript file'),
    $getlocations_paths['infobubble_extended_path'],
    60,
    128,
    t('Where the InfoBubble extended javascript file is located.')
  );

  $form['getlocations_paths']['infowindow_options_path'] = getlocations_element_path(
    t('Path to InfoWindow options javascript file'),
    $getlocations_paths['infowindow_options_path'],
    60,
    128,
    t('Where the InfoWindow options javascript file is located. If this file does not exist the default settings will be used.')
  );
  $form['getlocations_paths']['infobubble_options_path'] = getlocations_element_path(
    t('Path to InfoBubble options javascript file'),
    $getlocations_paths['infobubble_options_path'],
    60,
    128,
    t('Where the InfoBubble options javascript file is located. If this file does not exist the default settings will be used.')
  );
  $form['getlocations_paths']['markermanager_path'] = getlocations_element_path(
    t('Path to markermanager javascript file'),
    $getlocations_paths['markermanager_path'],
    60,
    128,
    t('Where the markermanager javascript file is located.')
  );

  $form['getlocations_paths']['markerclusterer_path'] = getlocations_element_path(
    t('Path to markerclusterer javascript file'),
    $getlocations_paths['markerclusterer_path'],
    60,
    128,
    t('Where the markerclusterer javascript file is located.')
  );

  $form['getlocations_paths']['getlocations_polygons_path'] = getlocations_element_path(
    t('Path to getlocations Polygons javascript file'),
    $getlocations_paths['getlocations_polygons_path'],
    60,
    128,
    t('Where the getlocations polygons javascript file is located.')
  );
  $form['getlocations_paths']['getlocations_rectangles_path'] = getlocations_element_path(
    t('Path to getlocations Rectangles javascript file'),
    $getlocations_paths['getlocations_rectangles_path'],
    60,
    128,
    t('Where the getlocations rectangles javascript file is located.')
  );
  $form['getlocations_paths']['getlocations_circles_path'] = getlocations_element_path(
    t('Path to getlocations Circles javascript file'),
    $getlocations_paths['getlocations_circles_path'],
    60,
    128,
    t('Where the getlocations circles javascript file is located.')
  );
  $form['getlocations_paths']['getlocations_polylines_path'] = getlocations_element_path(
    t('Path to getlocations Polylines javascript file'),
    $getlocations_paths['getlocations_polylines_path'],
    60,
    128,
    t('Where the getlocations polylines javascript file is located.')
  );

  // categories
  $form['getlocations_paths']['getlocations_categories_path'] = getlocations_element_path(
    t('Path to getlocations Categories javascript file'),
    $getlocations_paths['getlocations_categories_path'],
    60,
    128,
    t('Where the getlocations categories javascript file is located.')
  );
  // search_places
  $form['getlocations_paths']['getlocations_search_places_path'] = getlocations_element_path(
    t('Path to getlocations Search Places javascript file'),
    $getlocations_paths['getlocations_search_places_path'],
    60,
    128,
    t('Where the getlocations search places javascript file is located.')
  );
  // geo
  $form['getlocations_paths']['getlocations_geo_path'] = getlocations_element_path(
    t('Path to getlocations Geo javascript file'),
    $getlocations_paths['getlocations_geo_path'],
    60,
    128,
    t('Where the getlocations geo javascript file is located.')
  );
  // preview
  $form['getlocations_paths']['getlocations_preview_path'] = getlocations_element_path(
    t('Path to getlocations Preview javascript file'),
    $getlocations_paths['getlocations_preview_path'],
    60,
    128,
    t('Where the getlocations preview javascript file is located.')
  );
  // geojson
  $form['getlocations_paths']['getlocations_geojson_path'] = getlocations_element_path(
    t('Path to getlocations Geojson javascript file'),
    $getlocations_paths['getlocations_geojson_path'],
    60,
    128,
    t('Where the getlocations geojson javascript file is located.')
  );

  $form['getlocations_paths']['getlocations_path'] = getlocations_element_path(
    t('Path to getlocations javascript file'),
    $getlocations_paths['getlocations_path'],
    60,
    128,
    t('Where the getlocations javascript file is located.')
  );
  $form['getlocations_paths']['reset'] = getlocations_element_map_checkbox(
    t('Reset'),
    0,
    t('Reset the paths to the defaults.')
  );

  unset($form['#theme']);
  $form['#theme'] = 'getlocations_settings_form';
  $form['#validate'][] = 'getlocations_settings_validate';

  return system_settings_form($form);

}

function getlocations_settings_validate($form, &$form_state) {

  if ($latlon = getlocations_latlon_check($form_state['values']['getlocations_default']['latlong'])) {
    $form_state['values']['getlocations_default']['latlong'] = $latlon;
  }
  else {
    form_set_error('getlocations_default][latlong', t('Map coordinates must be expressed as a decimal latitude and longitude, separated by a comma.'));
  }
  $found = FALSE;
  foreach ($form_state['values']['getlocations_default']['baselayers'] as $l) {
    if ($l) {
      $found = TRUE;
      break;
    }
  }
  if (!$found) {
    form_set_error('getlocations_default][baselayers', t('You must select at least one baselayer!'));
  }

  if (isset($form_state['values']['getlocations_default']['returnlink_page_enable']) && $form_state['values']['getlocations_default']['returnlink_page_enable'] && empty($form_state['values']['getlocations_default']['returnlink_page_link'])) {
    form_set_error('getlocations_default][returnlink_page_link', t('Page return link must be filled in'));
  }
  if (module_exists('getlocations_fields')) {
    if (isset($form_state['values']['getlocations_default']['returnlink_user_enable']) && $form_state['values']['getlocations_default']['returnlink_user_enable'] && empty($form_state['values']['getlocations_default']['returnlink_user_link'])) {
      form_set_error('getlocations_default][returnlink_user_link', t('User return link must be filled in'));
    }
    if (isset($form_state['values']['getlocations_default']['returnlink_term_enable']) && $form_state['values']['getlocations_default']['returnlink_term_enable'] && empty($form_state['values']['getlocations_default']['returnlink_term_link'])) {
      form_set_error('getlocations_default][returnlink_term_link', t('Term return link must be filled in'));
    }
    if (isset($form_state['values']['getlocations_default']['returnlink_comment_enable']) && $form_state['values']['getlocations_default']['returnlink_comment_enable'] && empty($form_state['values']['getlocations_default']['returnlink_comment_link'])) {
      form_set_error('getlocations_default][returnlink_comment_link', t('Comment return link must be filled in'));
    }
  }
  if (! $form_state['values']['getlocations_default']['markermanagertype']) {
    $form_state['values']['getlocations_default']['usemarkermanager'] = 0;
    $form_state['values']['getlocations_default']['useclustermanager'] = 0;
  }
  elseif ($form_state['values']['getlocations_default']['markermanagertype'] == 1) {
    $form_state['values']['getlocations_default']['useclustermanager'] = 0;
  }
  elseif ($form_state['values']['getlocations_default']['markermanagertype'] == 2) {
    $form_state['values']['getlocations_default']['usemarkermanager'] = 0;
  }

  if ( ! is_numeric($form_state['values']['getlocations_default']['getlocations_js_weight'])) {
    form_set_error('getlocations_default][getlocations_js_weight', t('Getlocations js weight must be a number'));
  }

  if (module_exists('colorbox') && isset($form_state['values']['getlocations_colorbox']['enable']) && $form_state['values']['getlocations_colorbox']['enable']) {
    if (empty($form_state['values']['getlocations_colorbox']['width']) || ! is_numeric($form_state['values']['getlocations_colorbox']['width']) || $form_state['values']['getlocations_colorbox']['width'] < 1 ) {
      form_set_error('getlocations_colorbox][width', t('Colorbox width must be a number'));
    }
    if (empty($form_state['values']['getlocations_colorbox']['height']) || ! is_numeric($form_state['values']['getlocations_colorbox']['height']) || $form_state['values']['getlocations_colorbox']['height'] < 1 ) {
      form_set_error('getlocations_colorbox][height', t('Colorbox height must be a number'));
    }
  }

  if (module_exists('colorbox') && isset($form_state['values']['getlocations_colorbox']['marker_enable']) && $form_state['values']['getlocations_colorbox']['marker_enable']) {
    if (empty($form_state['values']['getlocations_colorbox']['marker_width']) || ! is_numeric($form_state['values']['getlocations_colorbox']['marker_width']) || $form_state['values']['getlocations_colorbox']['marker_width'] < 1 ) {
      form_set_error('getlocations_colorbox][marker_width', t('Colorbox width must be a number'));
    }
    if (empty($form_state['values']['getlocations_colorbox']['marker_height']) || ! is_numeric($form_state['values']['getlocations_colorbox']['marker_height']) || $form_state['values']['getlocations_colorbox']['marker_height'] < 1 ) {
      form_set_error('getlocations_colorbox][marker_height', t('Colorbox height must be a number'));
    }
  }

  $list = array('Map', 'Satellite', 'Hybrid', 'Physical', 'OpenStreetMap');
  $found = FALSE;
  foreach ($list AS $maptype) {
    if ($form_state['values']['getlocations_default']['maptype'] == $maptype && $form_state['values']['getlocations_default']['baselayers'][$maptype] ) {
      $found = TRUE;
      break;
    }
  }
  if (! $found) {
    // force a setting
    $form_state['values']['getlocations_default']['maptype'] = 'Map';
    $form_state['values']['getlocations_default']['baselayers']['Map'] = 1;
  }

  // markers
  $type_markers = getlocations_get_type_markers();
  foreach ($type_markers AS $entity_type => $bundles) {
    if (isset($form_state['values']['getlocations_' . $entity_type . '_marker']) && ! $form_state['values']['getlocations_' . $entity_type . '_marker']['enable']) {
      unset($form_state['values']['getlocations_' . $entity_type . '_marker']);
      $form_state['values']['getlocations_' . $entity_type . '_marker']['enable'] = 0;
    }
  }
  // search_places
  if ($form_state['values']['getlocations_default']['search_places']) {
    $form_state['values']['getlocations_default']['places'] = 1;
  }

  $reset = $form_state['values']['getlocations_paths']['reset'];
  unset($form_state['values']['getlocations_paths']['reset']);
  if ($reset) {
    $form_state['values']['getlocations_paths'] = getlocations_paths_get(TRUE);
  }

}

/**
 * Rebuild marker js.
 */
function _getlocations_rebuild_marker_js_submit($form, &$form_state) {
  getlocations_regenerate_markers();
  drupal_set_message(t('Marker cache regenerated.'));
}
