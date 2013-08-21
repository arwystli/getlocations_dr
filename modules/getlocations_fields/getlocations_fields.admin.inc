<?php

/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * getlocations_fields module administration functions.
 *
 */

/**
 * Function to display the getlocations admin settings form
 * @return
 *   Returns the form.
 */
function getlocations_fields_settings_form() {

  $getlocations_fields_defaults = getlocations_fields_defaults();

  $form = array();

  $form['getlocations_fields_defaults'] = array(
    '#type' => 'fieldset',
    '#title' => t('Getlocations Fields Default settings'),
    '#description' => t('The settings here will provide the defaults for all Getlocations enabled content types.'),
    // This will store all the defaults in one variable.
    '#tree' => TRUE,
  );

  $form['getlocations_fields_defaults'] += getlocations_fields_input_settings_form($getlocations_fields_defaults);

  $form['getlocations_fields_defaults'] += getlocations_fields_display_settings_form($getlocations_fields_defaults);

  $form['getlocations_fields_paths'] = array(
    '#type' => 'fieldset',
    '#title' => t('Javascript paths'),
    '#description' => t('For advanced users who want to supply their own javascript.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    // This will store all the defaults in one variable.
    '#tree' => TRUE,
  );
  $getlocations_fields_paths = getlocations_fields_paths_get();
  $form['getlocations_fields_paths']['getlocations_fields_path'] = getlocations_element_path(
    t('Path to getlocations_fields javascript file'),
    $getlocations_fields_paths['getlocations_fields_path'],
    70,
    128,
    t('Where the getlocations_fields javascript file is located.')
  );
  $form['getlocations_fields_paths']['getlocations_fields_preview_path'] = getlocations_element_path(
    t('Path to getlocations_fields preview javascript file'),
    $getlocations_fields_paths['getlocations_fields_preview_path'],
    70,
    128,
    t('Where the getlocations_fields preview javascript file is located.')
  );
  $form['getlocations_fields_paths']['reset'] = getlocations_element_map_checkbox(
    t('Reset'),
    0,
    t('Reset the paths to the defaults.')
  );

  unset($form['#theme']);
  $form['#theme'] = 'getlocations_fields_settings_form';
  $form['#validate'][] = 'getlocations_fields_settings_validate';

  return system_settings_form($form);

}

/**
 * Validation function
 *
 */
function getlocations_fields_settings_validate($form, &$form_state) {

  if (empty($form_state['values']['getlocations_fields_defaults']['input_address_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_address_width']) || $form_state['values']['getlocations_fields_defaults']['input_address_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_address_width', t('Search textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_name_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_name_width']) || $form_state['values']['getlocations_fields_defaults']['input_name_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_name_width', t('Name textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_street_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_street_width']) || $form_state['values']['getlocations_fields_defaults']['input_street_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_street_width', t('Street textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_additional_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_additional_width']) || $form_state['values']['getlocations_fields_defaults']['input_additional_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_additional_width', t('Additional textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_city_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_city_width']) || $form_state['values']['getlocations_fields_defaults']['input_city_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_city_width', t('City textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_province_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_province_width']) || $form_state['values']['getlocations_fields_defaults']['input_province_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_province_width', t('Province textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_postal_code_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_postal_code_width']) || $form_state['values']['getlocations_fields_defaults']['input_postal_code_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_postal_code_width', t('Postal code textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_country_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_country_width']) || $form_state['values']['getlocations_fields_defaults']['input_country_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_country_width', t('Country textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_latitude_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_latitude_width']) || $form_state['values']['getlocations_fields_defaults']['input_latitude_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_latitude_width', t('Latitude textbox must be a positive number'));
  }
  if (empty($form_state['values']['getlocations_fields_defaults']['input_longitude_width']) || ! is_numeric($form_state['values']['getlocations_fields_defaults']['input_longitude_width']) || $form_state['values']['getlocations_fields_defaults']['input_longitude_width'] < 1 ) {
    form_set_error('getlocations_fields_defaults][input_longitude_width', t('Longitude textbox must be a positive number'));
  }
  $reset = $form_state['values']['getlocations_fields_paths']['reset'];
  unset($form_state['values']['getlocations_fields_paths']['reset']);
  if ($reset) {
    $form_state['values']['getlocations_fields_paths'] = getlocations_fields_paths_get(TRUE);
  }

}
