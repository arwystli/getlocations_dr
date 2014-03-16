<?php

/**
 * @file getlocations_leaflet.views.inc
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Getlocations Leaflet maps views integration.
 */

/**
 * Define leaflet views style.
 *
 * Implements hook_views_plugins().
 */
function getlocations_leaflet_views_plugins() {
  $plugins = array(
    'module' => 'getlocations_leaflet',
    'style' => array(
      'getlocations_leaflet' => array(
        'title' => t('Getlocations Leaflet Map'),
        'help' => t('Displays a View as a Getlocations Leaflet map.'),
        'path' => GETLOCATIONS_LEAFLET_PATH,
        'handler' => 'getlocations_leaflet_plugin_style',
        'theme' => 'getlocations_leaflet_view_map',
        'theme path' => GETLOCATIONS_LEAFLET_PATH . '/views',
        'uses row plugin' => FALSE,
        'uses grouping' => FALSE,
        'uses options' => TRUE,
        'type' => 'normal',
        'uses fields' => TRUE,
      ),
    ),
  );

  return $plugins;
}

/**
 * Preprocess function for getlocations_leaflet_view_map.tpl
 */
function template_preprocess_getlocations_leaflet_view_map(&$variables) {
  global $language;

  $locations = $variables['view']->style_plugin->rendered_fields;
  $options = $variables['view']->style_plugin->options;
  $base_field = $variables['view']->style_plugin->view->base_field;
  $entity_get_info = entity_get_info();
  $entity_type = FALSE;
  $entity_type_found = FALSE;
  foreach ($entity_get_info AS $et => $entity_info) {
    if ($base_field == $entity_info['entity keys']['id']) {
      $entity_type = $et;
    }
  }

  if ($options['custom_content_enable'] and !empty($options['custom_content_source'])) {
    $custom_content_source = $options['custom_content_source'];
  }
  else {
    $custom_content_source = NULL;
  }

  $thiskey = FALSE;
  $latlons = array();
  $minmaxes = array('minlat' => 0, 'minlon' => 0, 'maxlat' => 0, 'maxlon' => 0);
  $iconlist = array();
  $cat = FALSE;
  $cats = array();
  $ct = 0;

  if (count($locations)) {
    $cats = array();
    // we should loop over them and dump bummers with no lat/lon
    foreach ($locations AS $key => $location) {

      $custom_content = $custom_content_source ? $location[$custom_content_source] : '';
      $lid = 0;
      if (module_exists('getlocations_fields') && isset($location['glid']) && $location['glid'] > 0) {
        $lid = $location['glid'];
        if (! $entity_type) {
          if (isset($location['field_name'])) {
            $table = 'field_data_' . $location['field_name'];
            $col = $location['field_name'] . '_glid';
            $query = db_select($table, 't');
            $query->fields('t', array('entity_type', 'bundle', 'entity_id'));
            $query->condition('t.' . $col, $location['glid']);
            $row = $query->execute()->fetchObject();
            $location['entity_type'] = $row->entity_type;
            $entity_type_found = $row->entity_type;
            $location['bundle'] = $row->bundle;
            $location['entity_id'] = $row->entity_id;
          }
        }
        else {
          $entity_type_found = $entity_type;
        }
      }
      elseif (module_exists('location') && isset($location['lid']) && $location['lid'] > 0) {
        $lid = $location['lid'];
        // if we have lid we can get field_name from location_instance.genid, then we can get the rest from the field_data
        $query = db_select('location_instance', 'i')
          ->fields('i', array('nid', 'uid', 'genid'))
          ->condition('i.lid', $lid);
        $row = $query->execute()->fetchAssoc();
        $genid = $row['genid'];
        $arr = explode(":", $genid);
        $location['field_name'] = $arr[1];
        # probably don't need this
        if ($row['nid']) {
          $location['entity_key'] = 'nid';
        }
        elseif ($row['uid']) {
          $location['entity_key'] = 'uid';
        }
        $table = 'field_data_' . $location['field_name'];
        $col = $location['field_name'] . '_lid';
        $query = db_select($table, 't');
        $query->fields('t', array('entity_type', 'bundle', 'entity_id'));
        $query->condition('t.' . $col, $location['lid']);
        $row2 = $query->execute()->fetchObject();
        $location['entity_type'] = $row2->entity_type;
        $location['bundle'] = $row2->bundle;
        $location['entity_id'] = $row2->entity_id;

        #if (isset($location['type'])) {
        #// ??? fix field name
        #  $location['field_name'] = getlocations_get_fieldname($location['type'], $entity_type);
        #}
      }
      elseif (module_exists('geofield') && isset($location[$base_field]) && $location[$base_field] > 0 ) {
        $lid = $location[$base_field];
        $location['field_name'] = getlocations_get_fieldname($location['type'], $entity_type);
        $location['latitude'] = $location[$location['field_name']];
        $location['longitude'] = $location[$location['field_name'] . '_1'];
      }
      elseif (module_exists('geolocation') && isset($location[$base_field]) && $location[$base_field] > 0 ) {
        $lid = $location[$base_field];
        $location['field_name'] = getlocations_get_fieldname($location['type'], $entity_type);
        $location['latitude'] = $location[$location['field_name']];
        $location['longitude'] = $location[$location['field_name'] . '_1'];
      }
      if ($lid > 0) {
        $marker = '';
        $vector = '';
        // awesome
        if ($options['awesome'] && $options['marker_type'] == 'fa') {
          $per_field_markers = FALSE;
          $getlocations_markers = variable_get('getlocations_markers', array());
          if ($entity_type_found && isset($getlocations_markers[$entity_type_found]['enable']) && $getlocations_markers[$entity_type_found]['enable']) {
            $type_markers = getlocations_get_type_markers();
            foreach ($type_markers AS $et => $bundles) {
              if ($et == $entity_type_found) {
                foreach ($bundles AS $bundle => $field_names) {
                  foreach ($field_names AS $field_name => $marker_data) {
                    if ($field_name == $location['field_name']) {
                      $per_field_markers = TRUE;
                      $m = $entity_type_found . '__' . $bundle . '__' . $field_name;
                      $vicon = getlocations_leaflet_awesome_marker_get($options, $m);
                    }
                  }
                }
              }
            }
          }
          if (! $per_field_markers) {
            if ($entity_type_found) {
              $vicon = getlocations_leaflet_awesome_marker_get($options, $entity_type_found);
            }
            else {
              // default
              $vicon = getlocations_leaflet_awesome_marker_get($options);
            }
          }
          $vector = $vicon;
        }
        else {
          $per_field_markers = FALSE;
          // getlocations_markers
          $getlocations_markers = variable_get('getlocations_markers', array());
          if ($entity_type_found && isset($getlocations_markers[$entity_type_found]['enable']) && $getlocations_markers[$entity_type_found]['enable']) {
            $type_markers = getlocations_get_type_markers();
            foreach ($type_markers AS $et => $bundles) {
              if ($et == $entity_type_found) {
                foreach ($bundles AS $bundle => $field_names) {
                  foreach ($field_names AS $field_name => $marker_data) {
                    if ($field_name == $location['field_name']) {
                      $mkey = 'marker__' . $entity_type_found . '__' . $bundle . '__' . $field_name;
                      if (isset($options[$mkey]) && $options[$mkey]) {
                        $per_field_markers = TRUE;
                        $marker = $options[$mkey];
                      }
                    }
                  }
                }
              }
            }
          }
          if (! $per_field_markers) {
            if ($entity_type_found && $options[$entity_type_found . '_map_marker']) {
              $marker = $options[$entity_type_found . '_map_marker'];
            }
            else {
              // default
              $marker = $options['map_marker'];
            }
          }
        }

        // per item marker
        if (isset($location['marker']) && ! empty($location['marker'])) {
          $marker = $location['marker'];
        }
        // dump bummers with no lat/lon
        if ($latlon = getlocations_latlon_check($location['latitude'] . ',' . $location['longitude'])) {
          $ll = explode(',', $latlon);
          $location['latitude'] = $ll[0];
          $location['longitude'] = $ll[1];
          $title = htmlspecialchars_decode(isset($location['name']) && $location['name'] ? strip_tags($location['name']) : (isset($location['title']) && $location['title'] ? strip_tags($location['title']) : ''), ENT_QUOTES);
          $minmaxes = getlocations_do_minmaxes($ct, $location, $minmaxes);

          // per item marker
          if (isset($location['marker']) && ! empty($location['marker'])) {
            $marker = $location['marker'];
          }
          if (isset($location['mapzoom'])) {
            $mapzoom = $location['mapzoom'];
          }

          // categories
          $cat = '';
          if ($options['category_method']) {
            if ($options['category_method'] == 1) {
              // content type
              if (! isset($location['type']) && isset($location['machine_name'])) {
                $location['type'] = $location['machine_name'];
              }
              if (isset($location['type'])) {
                $cat = $location['type'];
                // lookup label
                $query = db_select('node_type', 't');
                $query->fields('t', array('name'));
                $query->condition('t.type', $cat);
                $label = $query->execute()->fetchField();
                $cats[$cat] = $label;
              }
            }
            elseif ($options['category_method'] == 2) {
              // term_reference_field
              if (isset($location[$options['category_term_reference_field']])) {
                $label = $location[$options['category_term_reference_field']];
                $cat = preg_replace("/\s+/", "_", $label);
                $cat = preg_replace("/'/", "", $cat);
                $cat = drupal_strtolower($cat);
                $cats[$cat] = $label;
              }
            }
            if ($cat) {
              $options['categories'] = $cats;
            }
          }

          if ($options['markeraction'] == 'popup') {
            $extra = FALSE;
            if (isset($options['getdirections_link'])) {
              $extra['gdlink'] = $options['getdirections_link'];
            }

            $markeraction = array('type' => 'popup', 'data' => ($custom_content ? $custom_content : getlocations_getinfo($lid, $base_field, $extra)));
          }
          elseif ($options['markeraction'] == 'link') {
            $markeraction = array('type' => 'link', 'data' => getlocations_getlidinfo($lid, $base_field));
          }
          else {
            $markeraction = array();
          }

          $iconlist[$marker] = getlocations_leaflet_get_marker($marker);

          $latlons[$ct] = array($location['latitude'], $location['longitude'], $base_field, 0, $lid, $title, $marker, $vector, $markeraction, $cat);

          // special case for ajax, a custom content field containing the key of the map associated with an exposed form
          $thiskey = FALSE;
          if (isset($location['nothing']) && preg_match("/^key_/", $location['nothing'])) {
            $thiskey = trim($location['nothing']);
          }

          $ct++;
        }
      }
    } // end foreach locations
  }

  if ($ct < 2 || $lid == 0) {
    unset($minmaxes);
    $minmaxes = '';
  }

  $map_settings = getlocations_leaflet_map_get_info('Getlocations OSM');
  $map_settings = getlocations_leaflet_get_map_layers($map_settings);

  if (! empty($options['baselayers'])) {
    $map_layers = array();
    foreach ($options['baselayers'] AS $k => $v) {
      if ($options['baselayers'][$k] && isset($map_settings['map_layers'][$k])) {
        $map_layers[$k] = $map_settings['map_layers'][$k];
      }
    }
    if (! empty($map_layers)) {
      $map_settings['map_layers'] = $map_layers;
    }
  }

  $nodezoom = FALSE;
  if ($ct == 1 && $options['nodezoom']) {
    $nodezoom = $options['nodezoom'];
    $map_settings['map_opts']['center'] = array($location['latitude'], $location['longitude']);
    $map_settings['map_opts']['zoom'] = $nodezoom;
  }
  elseif ($ct < 1) {
    $ll = explode(',', $options['latlong']);
    $map_settings['map_opts']['center'] = array($ll[0], $ll[1]);
    $map_settings['map_opts']['zoom'] = $options['zoom'];
  }

  $mapid = getlocations_setup_map('', FALSE, FALSE, TRUE);
  if ($thiskey) {
    $mapid = $thiskey;
  }
  // add in some more
  $map_settings = getlocations_leaflet_map_settings_do($map_settings, $options, $latlons, $mapid);

  $map_settings['map_settings']['nodezoom'] = ($nodezoom ? $nodezoom : FALSE);
  $map_settings['map_settings']['minmaxes'] = (empty($minmaxes) ? FALSE : implode(',', $minmaxes));

  $map_settings['icons'] = $iconlist;
  $map_settings['datanum'] = $ct;
  $map_settings['latlons'] = $latlons;
  $map_settings['map_settings']['categories'] = $cats;
  $map_settings['map_settings']['category_showhide_buttons'] = $options['category_showhide_buttons'];

  drupal_add_library('getlocations_leaflet', 'getlocations-leaflet');

  $variables['map'] = theme('getlocations_leaflet_map', array(
    'width' => $options['width'],
    'height' => $options['height'],
    'map_settings' => $map_settings,
    'mapid' => $mapid,
    'links' => '',
  ));

}
