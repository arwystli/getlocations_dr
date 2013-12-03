<?php

/**
 * @file getlocations_fields.functions.inc
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Supplies getlocations fields functions.
 */

// form elements


/**
 * @param string $default
 *
 * @param bool $distance
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_origin($default, $distance=FALSE) {
  $options = array(
    'nid_arg' => t("Node's Lat/Lon from views nid argument"),
    'uid_arg' => t("User's Lat/Lon from views uid argument"),
  );
  if (getlocations_get_vocabularies()) {
    $options += array('tid_arg' => t("Term's Lat/Lon from views tid argument"));
  }
  if (module_exists('comment')) {
    $options += array('cid_arg' => t("Comment's Lat/Lon from views cid argument"));
  }
  if ($distance) {
    $options += array('distance_arg' => t("Lat/Lon from views argument"));
  }
  $options += array(
    'user' => t("User's Lat/Lon (blank if unset)"),
    'hybrid' => t("User's Lat/Lon (fall back to Static if unset)"),
    'static' => t('Static Lat/Lon'),
#    'tied' => t("Use Distance / Proximity filter"),
#    'postal' => t('Postal Code / Country'),
#    'postal_default' => t('Postal Code (assume default country)'),
    'php' => t('Use PHP code to determine Lat/Lon'),
  );

  $element = array(
    '#type' => 'select',
    '#title' => t('Origin'),
    '#options' => $options,
    '#description' => t("The way the latitude/longitude is determined. If the origin has multiple locations the first will be used."),
    '#default_value' => $default,
  );
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_latitude($default, $ctools=TRUE) {
  $element = array(
    '#type' => 'textfield',
    '#title' => t('Latitude'),
    '#default_value' => $default,
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('hybrid', 'static'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_longitude($default, $ctools=TRUE) {
  $element = array(
    '#type' => 'textfield',
    '#title' => t('Longitude'),
    '#default_value' => $default,
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('hybrid', 'static'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_postal_code($default, $ctools=TRUE) {
  $element = array(
    '#type' => 'textfield',
    '#title' => t('Postal code'),
    '#default_value' => $default,
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('postal', 'postal_default'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_country($default, $title="", $ctools=TRUE) {
  if (empty($title)) {
    $title = t('Country');
  }
  $element = array(
    '#type' => 'select',
    '#title' => $title,
    '#options' => array('' => '') + getlocations_get_countries_list(),
    '#default_value' => $default,
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('postal'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_php_code($default, $ctools=TRUE) {
  $element = array(
    '#type' => 'textarea',
    '#title' => t('PHP code for latitude, longitude'),
    '#default_value' => $default,
    '#description' => t("Enter PHP code that returns a latitude/longitude.  Do not use &lt;?php ?&gt;. You must return only an array with float values set for the 'latitude' and 'longitude' keys."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('php'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_nid_arg($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Node ID argument to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => empty($options) ? t("Select which of the view's arguments to use as the node ID. The latitude / longitude of the first location of that node will be used as the origin. You must have added arguments to the view to use this option.") : t("Select which of the view's arguments to use as the node ID. The latitude / longitude of the first location of that node will be used as the origin."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('nid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_nid_loc_field($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Location to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => t("Select which field to use as the origin. If the location supports multiple entries the first one will be used."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('nid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_uid_arg($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('User ID argument to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => empty($options) ? t("Select which of the view's arguments to use as the user ID. The latitude / longitude of the first location of that user will be used as the origin. You must have added arguments to the view to use this option.") : t("Select which of the view's arguments to use as the user ID. The latitude / longitude of the first location of that user will be used as the origin."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('uid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_uid_loc_field($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Location to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => t("Select which field to use as the origin. If the location supports multiple entries the first one will be used."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('uid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_tid_arg($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Term ID argument to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => empty($options) ? t("Select which of the view's arguments to use as the term ID. The latitude / longitude of the first location of that term will be used as the origin. You must have added arguments to the view to use this option.") : t("Select which of the view's arguments to use as the term ID. The latitude / longitude of the first location of that term will be used as the origin."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('tid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_tid_loc_field($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Location to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => t("Select which field to use as the origin. If the location supports multiple entries the first one will be used."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('tid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_cid_arg($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Comment ID argument to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => empty($options) ? t("Select which of the view's arguments to use as the comment ID. The latitude / longitude of the first location of that comment will be used as the origin. You must have added arguments to the view to use this option.") : t("Select which of the view's arguments to use as the comment ID. The latitude / longitude of the first location of that comment will be used as the origin."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('cid_arg'));
  }
  return $element;
}

/**
 * @param string $default
 *
 * @param bool $ctools
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_cid_loc_field($default, $options, $ctools=TRUE) {
  $element = array(
    '#type' => 'select',
    '#title' => t('Location to use'),
    '#options' => $options,
    '#default_value' => $default,
    '#description' => t("Select which field to use as the origin. If the location supports multiple entries the first one will be used."),
  );
  if ($ctools) {
    $element['#dependency'] = array('edit-options-origin' => array('cid_arg'));
  }
  return $element;
}

/**
 * @param string $title
 *
 * @param string $default
 *
 * @param string $description
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_weight($title, $default, $description='') {
  $options = array('' => '');
  $options += drupal_map_assoc(range(-50, 50));
  $element = array(
    '#type' => 'select',
    '#title' => $title,
    '#default_value' => $default,
    '#options' => $options,
  );
  if (! empty($description)) {
    $element['#description'] = $description;
  }
  return $element;
}

/**
 * @param string $title
 *
 * @param string $default
 *
 * @param string $description
 *
 * @return
 *   Returns form element
 *
 */
function getlocations_fields_element_opts($title, $default, $description='') {

  $element = array(
    '#type' => 'select',
    '#title' => $title,
    '#default_value' => $default,
    '#options' => array(
      '0' => t('Normal'),
      '1' => t('Required'),
      '2' => t('Read only'),
      '3' => t('Display only'),
      '4' => t('Hidden'),
    ),
  );
  if (! empty($description)) {
    $element['#description'] = $description;
  }
  return $element;
}

/**
 * ajax callback
 *
 * @return
 *   Returns country code
 *
 */
#function getlocations_fields_countryinfo() {
#  $country = $_GET['country'];
#  $content = FALSE;
#  if (drupal_strlen($country) == 2 ) {
#    $content = drupal_strtoupper($country);
#  }
#  else {
#    $content = getlocations_get_country_id($country);
#  }
#  // fix 'The Netherlands' which is what google returns
#  if ($country == 'The Netherlands' || $country == 'Pays-Bas') {
#    $content = 'NL';
#  }
#  drupal_json_output(array('content' => $content));
#}

/**
 * autocomplete for country
 *
 * @param string $string
 *
 * @return
 *   Returns country names
 *
 */
function getlocations_fields_country_autocomplete($string = '') {
    $matches = array();
  if ($string) {
    $countries = getlocations_get_countries_list();
    foreach ($countries AS $country) {
      $s = drupal_strtolower($string);
      $c = drupal_strtolower($country);
      preg_match_all("/^$s/", $c, $m);
      if (count( $m[0])) {
        $matches[$country] = $country;
      }
    }
  }
  drupal_json_output($matches);
}

/**
 * autocomplete for province
 *
 * @param string $string
 *
 * @return
 *   Returns province names
 *
 */
function getlocations_fields_province_autocomplete($string = '') {
  $matches = array();
  if ($string) {
    //
    $query = db_select('getlocations_fields', 'f');
    $query->fields('f', array('province'));
    $query->where("LOWER(province) LIKE LOWER(:st)", array(':st' => $string . '%'));
    $query->range(0, 15);
    $result = $query->execute();
    foreach ($result AS $row) {
      $matches[$row->province] = check_plain($row->province);
    }
  }
  drupal_json_output($matches);
}

/**
 * autocomplete for city
 *
 * @param string $string
 *
 * @return
 *   Returns city names
 *
 */
function getlocations_fields_city_autocomplete($string = '') {
  $matches = array();
  if ($string) {
    //
    $query = db_select('getlocations_fields', 'f');
    $query->fields('f', array('city'));
    $query->where("LOWER(city) LIKE LOWER(:st)", array(':st' => $string . '%'));
    $query->range(0, 15);
    $result = $query->execute();
    foreach ($result AS $row) {
      $matches[$row->city] = check_plain($row->city);
    }
  }
  drupal_json_output($matches);
}

/**
 * @return
 *   Returns location array
 *
 */
function getlocations_fields_smart_ip() {
  $location = getlocations_fields_smart_ip_get();
  drupal_json_output($location);
}

/**
 * @return
 *   Returns location array
 *
 */
function getlocations_fields_smart_ip_get() {
  $location = FALSE;
  if (module_exists('smart_ip')) {
    global $user;
    if ($user->uid > 0 && isset($user->data['geoip_location'])) {
      $location = $user->data['geoip_location'];
    }
    elseif (isset($_SESSION['smart_ip']['location'])) {
      $location = $_SESSION['smart_ip']['location'];
    }
  }
  return $location;
}
