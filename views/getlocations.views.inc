<?php

/**
 * @file getlocations.views.inc
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Getlocations Map Views support.
 */

/**
 * Implements hook_views_plugins().
 */
function getlocations_views_plugins() {

  return array(
    'module' => 'getlocations',
    'style' => array(
      'getlocations' => array(
        'title' => t('GetLocations'),
        'help' => t('Displays rows as a map.'),
        'handler' => 'getlocations_plugin_style_map',
        'theme' => 'getlocations_view_map',
        'theme path' => GETLOCATIONS_PATH . '/views',
        'uses row plugin' => FALSE,
        'uses grouping' => FALSE,
        'uses options' => TRUE,
        'type' => 'normal',
        'uses fields' => TRUE,
      ),
    ),
  );
}

/**
 * Preprocess function for getlocations_view_map.tpl.
 */
function template_preprocess_getlocations_view_map(&$variables) {
  global $language;

  // TODO revisit this, see if entity_type can be pulled using entity_get_info
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

  $latlons = array();
  $minmaxes = array('minlat' => 0, 'minlon' => 0, 'maxlat' => 0, 'maxlon' => 0);
  $ct = 0;
  $thiskey = FALSE;

  if (count($locations)) {
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
            if ($row) {
              $location['entity_type'] = $row->entity_type;
              $entity_type_found = $row->entity_type;
              $location['bundle'] = $row->bundle;
              $location['entity_id'] = $row->entity_id;
            }
            else {
              unset($locations[$key]);
              continue;
            }
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

        // ??? fix field name
        $location['field_name'] = getlocations_get_fieldname($location['type'], $entity_type);
        $location['latitude'] = $location[$location['field_name']];
        $location['longitude'] = $location[$location['field_name'] . '_1'];
      }
      elseif (module_exists('geolocation') && isset($location[$base_field]) && $location[$base_field] > 0 ) {
        $lid = $location[$base_field];
        // ??? fix field name
        $location['field_name'] = getlocations_get_fieldname($location['type'], $entity_type);
        $location['latitude'] = $location[$location['field_name']];
        $location['longitude'] = $location[$location['field_name'] . '_1'];
      }
      if ($lid > 0) {

        // default
        $marker = $options['map_marker'];
        if ($entity_type_found && $options[$entity_type_found . '_map_marker']) {
          $marker = $options[$entity_type_found . '_map_marker'];
        }
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
                      $marker = $options[$mkey];
                    }

                  }
                }
              }
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
          $minmaxes = getlocations_do_minmaxes($ct, $location, $minmaxes);

          $name = htmlspecialchars_decode(isset($location['name']) && $location['name'] ? strip_tags($location['name']) : (isset($location['title']) && $location['title'] ? strip_tags($location['title']) : ''), ENT_QUOTES);

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

          $latlons[$ct] = array($location['latitude'], $location['longitude'], $lid, $name, $marker, $base_field, $custom_content, $cat);
          // special case for ajax, a custom content field containing the key of the map associated with an exposed form
          $thiskey = FALSE;
          if (isset($location['nothing']) && preg_match("/^key_/", $location['nothing'])) {
            $thiskey = trim($location['nothing']);
          }

          $ct++;
        }
      }
    }
  }
  if ($ct < 2 || $lid == 0) {
    unset($minmaxes);
    $minmaxes = '';
  }

  // get the defaults and override with the style plugin options
  $getlocations_defaults = getlocations_defaults();
  $newdefaults = getlocations_adjust_vars($getlocations_defaults, $options);

  $mapid = getlocations_setup_map($newdefaults);
  if ($thiskey) {
    $mapid = $thiskey;
  }

  getlocations_js_settings_do($newdefaults, $latlons, $minmaxes, $mapid);

  // show_search_distance
  if (isset($variables['view']->exposed_data['distance']) && isset($variables['view']->exposed_data['distance']['latitude']) && $variables['view']->exposed_data['distance']['latitude'] && isset($variables['view']->exposed_data['distance']['longitude']) && $variables['view']->exposed_data['distance']['longitude'] && $variables['view']->exposed_data['distance']['search_distance']) {
    $newdefaults['search_dist_info'] = $variables['view']->exposed_data['distance'];
  }

  $variables['map']  = theme('getlocations_show', array('width' => $newdefaults['width'], 'height' => $newdefaults['height'], 'defaults' => $newdefaults, 'mapid' => $mapid, 'latlons' => $latlons, 'minmaxes' => $minmaxes, 'entity_info' => '', 'object' => ''));

}

