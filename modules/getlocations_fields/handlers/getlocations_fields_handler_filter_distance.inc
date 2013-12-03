<?php

/**
 * @file getlocations_fields_handler_filter_distance.inc
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Views 3 support for getlocations_fields.
 */

/**
 * General proximity filter for location latitude/longitude.
 */
class getlocations_fields_handler_filter_distance extends views_handler_filter {
  // This is always multiple, because we can have distance, units etc.
  var $always_multiple = TRUE;

  function option_definition() {
    $options = parent::option_definition();

    $options['operator'] = array('default' => 'mbr');
    $options['identifier'] = array('default' => 'distance');
    $options['group'] = array('default' => '0');
    $options['origin'] = array('default' => 'nid_arg');

    $options['value'] = array(
      'default' => array(
        'latitude' => '',
        'longitude' => '',
#        'postal_code' => '',
#        'country' => '',
        'php_code' => '',
        'nid_arg' => '',
        'nid_loc_field' => 'node',
        'uid_arg' => '',
        'uid_loc_field' => 'user',
        'tid_arg' => '',
        'tid_loc_field' => 'taxonomy_term',
        'cid_arg' => '',
        'cid_loc_field' => 'comment',
        'search_distance' => 100,
        'search_units' => 'km',
      ),
    );

    $options['expose']['contains']['operator_id'] = array('default' => 'mbr');
    $options['expose']['contains']['search_units'] = array('default' => 'km');
    $options['expose']['contains']['search_distance'] = array('default' => 10);

    return $options;
  }

  function admin_summary() {
    if (!empty($this->options['exposed'])) {
      return t('Exposed');
    }
    return '';
  }

  function operator_options() {
    return array(
      'mbr' => t('Proximity (Rectangular)'),
      'dist' => t('Proximity (Circular)'),
    );
  }
  // TODO
  function expose_options() {
    parent::expose_options();

    $this->options['expose']['search_units'] = array('default' => 'km');
    $this->options['expose']['search_distance'] = array('default' => 10);
  }

  function value_form(&$form, &$form_state) {
    parent::value_form($form, $form_state);
    $form['origin'] = getlocations_fields_element_origin($this->options['origin']);

    if (! empty($form_state['exposed'])) {
      $identifier = $this->options['expose']['identifier'];
      if (! isset($form_state['input'][$identifier])) {
        // We need to pretend the user already inputted the defaults, because
        // fapi will malfunction otherwise.
        $form_state['input'][$identifier] = $this->value;
      }
    }

    $form['value'] = array(
      '#tree' => TRUE,
    );
    $form['value']['latitude'] = getlocations_fields_element_latitude($this->value['latitude']);
    $form['value']['longitude'] = getlocations_fields_element_longitude($this->value['longitude']);
    #$form['value']['postal_code'] = getlocations_fields_element_postal_code($this->value['postal_code']);
    #$form['value']['country'] = getlocations_fields_element_country($this->value['country']);
    $form['value']['php_code'] = getlocations_fields_element_php_code($this->value['php_code']);

    list($nid_argument_options, $uid_argument_options, $tid_argument_options, $cid_argument_options) = getlocations_fields_views_proximity_get_argument_options($this->view);
    $loc_field_options = getlocations_fields_views_proximity_get_location_field_options();
    if ($nid_argument_options) {
      $form['value']['nid_arg'] = getlocations_fields_element_nid_arg($this->value['nid_arg'], $nid_argument_options);
      $form['value']['nid_loc_field'] = getlocations_fields_element_nid_loc_field($this->value['nid_loc_field'], $loc_field_options);
    }
    if ($uid_argument_options) {
      $form['value']['uid_arg'] = getlocations_fields_element_uid_arg($this->value['uid_arg'], $uid_argument_options);
      $form['value']['uid_loc_field'] = getlocations_fields_element_uid_loc_field($this->value['uid_loc_field'], $loc_field_options);
    }
    if ($tid_argument_options) {
      $form['value']['tid_arg'] = getlocations_fields_element_tid_arg($this->value['tid_arg'], $tid_argument_options);
      $form['value']['tid_loc_field'] = getlocations_fields_element_tid_loc_field($this->value['tid_loc_field'], $loc_field_options);
    }
    ## not tested yet
    if ($cid_argument_options) {
      $form['value']['cid_arg'] = getlocations_fields_element_cid_arg($this->value['cid_arg'], $cid_argument_options);
      $form['value']['cid_loc_field'] = getlocations_fields_element_cid_loc_field($this->value['cid_loc_field'], $loc_field_options);
    }


    $form['value']['search_units'] = getlocations_element_distance_unit($this->value['search_units']);
    $form['value']['search_distance'] = getlocations_element_search_distance($this->value['search_distance']);

  }
  // TODO
  function exposed_form(&$form, &$form_state) {
    parent::exposed_form($form, $form_state);
    $key = $this->options['expose']['identifier'];
    $origin = $this->options['origin'];

    // Strip dependencies off on exposed form.
    foreach (element_children($form[$key]) as $el) {
      if (!empty($form[$key][$el]['#dependency'])) {
        $form[$key][$el]['#dependency'] = array();
      }
    }
    // unset anything not needed on exposed form
    unset($form[$key]['latitude']);
    unset($form[$key]['longitude']);
    unset($form[$key]['php_code']);
    unset($form[$key]['nid_arg']);
    unset($form[$key]['nid_loc_field']);
    unset($form[$key]['uid_arg']);
    unset($form[$key]['uid_loc_field']);
    unset($form[$key]['tid_arg']);
    unset($form[$key]['tid_loc_field']);
    unset($form[$key]['cid_arg']);
    unset($form[$key]['cid_loc_field']);
    unset($form['origin']);
  }

  function query() {

    if (empty($this->value)) {
      return;
    }

    // We need to merge with $this->options['value'] for filter values
    // and $this->value for exposed filter values.
    $options = array_merge($this->options, $this->options['value'], $this->value);
    $coordinates = getlocations_fields_views_proximity_get_reference_location($this->view, $options);
    // If we don't have any coordinates or distance, there's nothing to filter by, so don't modify the query at all.
    if (empty($coordinates) || empty($this->value['search_distance'])) {
      return;
    }

    $this->ensure_my_table();

    $lat = $coordinates['latitude'];
    $lon = $coordinates['longitude'];

    $distance_meters = getlocations_convert_distance_to_meters($this->value['search_distance'], $this->value['search_units']);
    $latrange = getlocations_earth_latitude_range($lat, $lon, $distance_meters);
    $lonrange = getlocations_earth_longitude_range($lat, $lon, $distance_meters);

    // If the table alias is specified, add on the separator.
    $table_alias = (empty($this->table_alias) ? '' : $this->table_alias . '.');

    // Add MBR check (always).
    // In case we go past the 180/-180 mark for longitude.
    if ($lonrange[0] > $lonrange[1]) {
      $where = $table_alias . "latitude > :minlat
      AND " . $table_alias . "latitude < :maxlat
      AND ((" . $table_alias . "longitude < 180
      AND " . $table_alias . "longitude > :minlon)
      OR (" . $table_alias . "longitude < :maxlon
      AND " . $table_alias . "longitude > -180))";
    }
    else {
      $where = $table_alias . "latitude > :minlat
      AND " . $table_alias . "latitude < :maxlat
      AND " . $table_alias . "longitude > :minlon
      AND " . $table_alias . "longitude < :maxlon";
    }
    $this->query->add_where_expression($this->options['group'], $where, array(':minlat' => $latrange[0], ':maxlat' => $latrange[1], ':minlon' => $lonrange[0], ':maxlon' => $lonrange[1]));
    if ($this->operator == 'dist') {
      // Add radius check.
      $this->query->add_where_expression($this->options['group'], getlocations_earth_distance_sql($lat, $lon, $this->table_alias) . ' < :distance', array(':distance' => $distance_meters));
    }
  }
}
