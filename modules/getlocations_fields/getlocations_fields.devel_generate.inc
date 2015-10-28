<?php

/**
 * @file
 * Getlocations field Devel Generate code.
 */

/**
 * Implements hook_devel_generate().
 *
 * Included only when needed.
 */
function getlocations_fields_devel_generate($entity, $field, $instance, $bundle) {
  $places = _get_locations_get_random_places(1);

  return $places[0];
}

/**
 * Get random places.
 *
 * @param type $quantity the minimum number of items to return
 * @return array
 */
function _get_locations_get_random_places($quantity = 1) {
  $places = array();
  while ($quantity > count($places)) {
    $qs = array(
      'lat' => rand(0, 90),
      'lng' => rand(0, 180),
      'radius' => 300,
      'username' => variable_get('geonames_webservice_username_parameter', 'demo'),
    );
    $url = 'http://ws.geonames.org/findNearbyPlaceNameJSON?' . http_build_query($qs);
    $result = drupal_http_request($url);
    $data = json_decode($result->data);
    if (!empty($data->geonames)) {
      foreach ($data->geonames as $geoname) {
        $places[] = array(
          'name' => $geoname->name,
          'latitude' => $geoname->lat,
          'longitude' => $geoname->lng,
        );
      }
    }
    sleep(rand(1, 4));
  }
  return $places;
}
