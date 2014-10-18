<?php

/**
 * @file getlocations_leaflet_plugin_style.inc
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Extension of the Views Plugin Style for Leaflet Map
 * Adapted from the GeoField Map views module and the OpenLayers Views module.
 */
class getlocations_leaflet_plugin_style extends views_plugin_style {

  /**
   * If this view is displaying an entity, save the entity type and info.
   */
  function init(&$view, &$display, $options = NULL) {
    parent::init($view, $display, $options);

    foreach (entity_get_info() as $key => $info) {
      if ($view->base_table == $info['base table']) {
        $this->entity_type = $key;
        $this->entity_info = $info;
        break;
      }
    }
  }

  /**
   * Set default options
   */
  function options(&$options) {
    parent::options($options);
    $options['empty_result'] = FALSE;
  }

  function option_definition() {
    $options = parent::option_definition();

    $getlocations_leaflet_defaults = getlocations_leaflet_defaults();
    foreach ($getlocations_leaflet_defaults AS $key => $value) {
      $options[$key] = array('default' => $value);
    }

    $options['map_resize']            = array('default' =>  0);
    $options['fullscreen_disable']    = array('default' =>  0);
    $options['styles']                = array('default' => '');
    $options['jquery_colorpicker_enabled'] = array('default' => 0);
    // empty_result
    $options['empty_result'] = array('default' => FALSE);

    return $options;
  }

  /**
   * Options form
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    #if (! module_exists('getlocations_fields')) {
    #  return;
    #}

    $form['#theme'] = 'getlocations_leaflet_plugin_style_options_form';

    $getlocations_leaflet_paths = getlocations_leaflet_paths_get();
    $getlocations_paths = getlocations_paths_get();

    $form['#attached']['js'] = array(
      $getlocations_leaflet_paths['getlocations_leaflet_formatter_path'],
      $getlocations_paths['getlocations_views_path'],
    );

    $handlers = $this->display->handler->get_handlers('field');
    $source_options = array('' => t('None'));
    foreach ($handlers as $handle) {
      $source_options[$handle->options['id']] = (!empty($handle->options['label'])) ? $handle->options['label'] : $handle->options['id'];
    }

    $labels = array(
      'width' => t('Width'),
      'height' => t('Height'),
    );

    $form += getlocations_map_display_basics_form($this->options, $labels);
    unset($form['map_resize']);
    unset($form['fullscreen_disable']);
    unset($form['styles']);

    unset($form['zoom']['#options']['21']);
    unset($form['zoom']['#options']['20']);
    unset($form['zoom']['#options']['19']);

    unset($form['minzoom_map']['#options']['21']);
    unset($form['minzoom_map']['#options']['20']);
    unset($form['minzoom_map']['#options']['19']);

    unset($form['maxzoom_map']['#options']['21']);
    unset($form['maxzoom_map']['#options']['20']);
    unset($form['maxzoom_map']['#options']['19']);

    $form += getlocations_leaflet_display_options_form($this->options);

    unset($form['nodezoom']['#options']['21']);
    unset($form['nodezoom']['#options']['20']);
    unset($form['nodezoom']['#options']['19']);

    $fieldables = getlocations_get_fieldable_entity_types();

    // markers
    if ($this->options['awesome'] && $this->options['marker_type'] == 'fa') {
      $getlocations_markers = variable_get('getlocations_markers', array());
      $type_markers = getlocations_get_type_markers();
      $per_field_markers = FALSE;
      foreach ($type_markers AS $entity_type => $bundles) {
        if (isset($getlocations_markers[$entity_type]['enable']) && $getlocations_markers[$entity_type]['enable']) {
          $per_field_markers = TRUE;
          $entity_get_info = entity_get_info($entity_type);
          $entity_type_label = $entity_get_info['label'];
          foreach ($bundles AS $bundle => $field_names) {
            foreach ($field_names AS $field_name => $marker_data) {
              $bundle_label = $marker_data['bundle_label'];
              $label = t('Type %etl, Bundle %name, Field %field Map marker', array('%etl' => $entity_type_label, '%name' => $bundle_label, '%field' => $field_name));
              $mkey = $entity_type . '__' . $bundle . '__' . $field_name;
              $labels = array(
                'awesome_icon'         => t($label . ' Awesome icon'),
                'awesome_icon_color'   => t($label . ' Awesome icon color'),
                'awesome_marker_color' => t($label . ' Awesome marker color'),
                'awesome_title'        => t($label . ' Awesome Fonts icon settings'),
                'awesome_icon_spin'    => t($label . ' Awesome icon spin'),
                'awesome_icon_size'    => t($label . ' Awesome icon size'),
                'awesome_icon_type'    => t($label . ' Awesome icon type'),
                'awesome_icon_flip'    => t($label . ' Awesome icon flip and rotate'),
              );
              $form += getlocations_leaflet_awesome_markers_elements_get($this->options, $labels, $mkey);
            }
          }
        }
      }
      if (! $per_field_markers) {
        foreach ($fieldables AS $entity_type) {
          if (getlocations_check_entity_type($entity_type)) {
            $entity_get_info = entity_get_info($entity_type);
            $label = $entity_get_info['label'];
            $labels = array(
              'awesome_icon'         => t($label . ' Awesome icon'),
              'awesome_icon_color'   => t($label . ' Awesome icon color'),
              'awesome_marker_color' => t($label . ' Awesome marker color'),
              'awesome_title'        => t($label . ' Awesome Fonts icon settings'),
              'awesome_icon_spin'    => t($label . ' Awesome icon spin'),
              'awesome_icon_size'    => t($label . ' Awesome icon size'),
              'awesome_icon_type'    => t($label . ' Awesome icon type'),
              'awesome_icon_flip'    => t($label . ' Awesome icon flip and rotate'),
            );
            $form += getlocations_leaflet_awesome_markers_elements_get($this->options, $labels, $entity_type);
          }
          else {
            $form += getlocations_leaflet_awesome_markers_elements_get($this->options);
          }
        }
      }
    }
    else {
      $markers = getlocations_get_marker_titles();
      $getlocations_markers = variable_get('getlocations_markers', array());
      $type_markers = getlocations_get_type_markers();
      $per_field_markers = FALSE;
      foreach ($type_markers AS $entity_type => $bundles) {
        if (isset($getlocations_markers[$entity_type]['enable']) && $getlocations_markers[$entity_type]['enable']) {
          $per_field_markers = TRUE;
          $entity_get_info = entity_get_info($entity_type);
          $entity_type_label = $entity_get_info['label'];
          foreach ($bundles AS $bundle => $field_names) {
            foreach ($field_names AS $field_name => $marker_data) {
              $bundle_label = $marker_data['bundle_label'];
              $mkey = 'marker__' . $entity_type . '__' . $bundle . '__' . $field_name;
              if (! isset($this->options[$mkey])) {
                $this->options[$mkey] = (isset($getlocations_markers[$entity_type][$bundle][$field_name]['marker'] ) ? $getlocations_markers[$entity_type][$bundle][$field_name]['marker'] : (isset($getlocations_defaults[$entity_type . '_map_marker']) ? $this->options[$entity_type . '_map_marker'] : $this->options['map_marker']));
              }
              $form[$mkey] = getlocations_element_map_marker(
                t('Type %etl, Bundle %name, Field %field Map marker', array('%etl' => $entity_type_label, '%name' => $bundle_label, '%field' => $field_name)),
                $markers,
                $this->options[$mkey]
              );
            }
          }
        }
      }
      if (! $per_field_markers) {
        // markers
        foreach ($fieldables AS $entity_type) {
          $entity_get_info = entity_get_info($entity_type);
          $label = $entity_get_info['label'];
          $desc = '';
          if (getlocations_check_entity_type($entity_type)) {
            $form[$entity_type . '_map_marker'] = getlocations_element_map_marker(
              t('Default !label Map marker', array('!label' => $label)),
              $markers,
              $this->options[$entity_type . '_map_marker'],
              $desc
            );
          }
        }
      }
    }

    // search markers
    if (module_exists('getlocations_fields') && module_exists('views')) {
      $form += getlocations_fields_views_search_form($this->options, TRUE);
    }

    // end markers

    // categories
    $term_reference_fields = getlocations_get_term_reference_fields();
    $opts = array(0 => t('None'), 1 => t('Content Type'));
    if ($term_reference_fields) {
      $opts += array(2 => t('Term reference'));
    }
    $form['category_method'] = getlocations_element_dd(
      t('Category method'),
      $this->options['category_method'],
      $opts,
      t('To ensure that this works you will need to add either a Content type or a Term reference field to the Field list in your View.')
    );
    $form['category_method']['#suffix'] = '<div id="wrap-category1">';
    if ($term_reference_fields) {
      $form['category_term_reference_field'] = getlocations_element_dd(
        t('Term reference field name'),
        $this->options['category_term_reference_field'],
        $term_reference_fields,
        t('Select the field on which you are categorising.')
      );
      $form['category_term_reference_field']['#prefix'] = '<div id="wrap-category2">';
      $form['category_term_reference_field']['#suffix'] = '</div>';
    }
    $form['category_showhide_buttons'] = getlocations_element_map_checkbox(
      t('Enable category show/hide buttons'),
      $this->options['category_showhide_buttons'],
      t('This option will place toggle buttons on the map.')
    );
    $form['category_showhide_buttons']['#suffix'] = '</div>';


    // custom content
    $form['custom_content_enable'] = getlocations_element_map_checkbox(
      t('Replace default content'),
      $this->options['custom_content_enable']
    );
    $form['custom_content_enable']['#prefix'] = '<div id="wrap-custom-content-enable">';
    $form['custom_content_enable'][ '#suffix'] = '</div>';
    $form['custom_content_source'] = getlocations_element_dd(
      t('Popup Data'),
      $this->options['custom_content_source'],
      $source_options,
      t('The field to use as a data source for the marker popup.')
    );
    $form['custom_content_source']['#prefix'] = '<div id="wrap-custom-content-source">';
    $form['custom_content_source']['#suffix'] = '</div>';


#    $form['nodezoom'] = getlocations_element_map_zoom(
#      t('Default Zoom for Single location'),
#      $this->options['nodezoom'],
#      t('The Default zoom level for a single marker.')
#    );

    $form['empty_result'] = getlocations_element_map_checkbox(
      t('Show map even if view has no results'),
      $this->options['empty_result']
    );
    #$form['empty_result'] = array('#type' => 'value', '#value' => 0);

    // munge the title and description
    $form['category_showhide_buttons']['#title'] = t('Enable category show/hide checkboxes');
    $form['category_showhide_buttons']['#description'] = t('This option will place checkboxes on the layer control');

  } // end options_form

  /**
   * Validate the options form.
   */
  function options_validate(&$form, &$form_state) {

        // css check
    if (isset($form_state['values']['style_options']['width'])) {
      if ($check = getlocations_dim_check($form_state['values']['style_options']['width'])) {
        $form_state['values']['style_options']['width'] = $check;
      }
      else {
        form_set_error('style_options][width', t('Width must be valid css'));
      }
    }
    if (isset($form_state['values']['style_options']['height'])) {
      if ($check = getlocations_dim_check($form_state['values']['style_options']['height'])) {
        $form_state['values']['style_options']['height'] = $check;
      }
      else {
        form_set_error('style_options][height', t('Height must be valid css'));
      }
    }

    // latlong
    if (isset($form_state['values']['style_options']['latlong'])) {
      if ($latlon = getlocations_latlon_check($form_state['values']['style_options']['latlong'])) {
        $form_state['values']['style_options']['latlong'] = $latlon;
      }
      else {
        form_set_error('style_options][latlong', t('Map coordinates must be expressed as a decimal latitude and longitude, separated by a comma.'));
      }
    }

  }

  function even_empty() {
    return parent::even_empty() || !empty($this->options['empty_result']);
  }

  function render() {
    if (isset($this->view->live_preview) && $this->view->live_preview) {
      return t('Getlocations Leaflet views are not compatible with live preview.');
    }
    return parent::render();
  }


}
