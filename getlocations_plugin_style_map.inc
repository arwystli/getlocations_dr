<?php

/**
 * @file
 * Contains the getlocations style plugin.
 */

/**
 * Getlocations style plugin to render rows as icons on a map.
 *
 * @ingroup views_style_plugins
 */
class getlocations_plugin_style_map extends views_plugin_style {
  /**
   * Set default options
   */
  function options(&$options) {
    parent::options($options);
    $options['empty_result'] = FALSE;
  }

  function option_definition() {
    drupal_add_js(GETLOCATIONS_PATH . '/js/getlocations_views.js');
    $options = parent::option_definition();

    $getlocations_defaults = getlocations_defaults();

    $options['width']            = array('default' => $getlocations_defaults['width']);
    $options['height']           = array('default' => $getlocations_defaults['height']);
    $options['node_map_marker']  = array('default' => $getlocations_defaults['node_map_marker']);
    $options['latlong']          = array('default' => $getlocations_defaults['latlong']);
    $options['zoom']             = array('default' => $getlocations_defaults['zoom']);
    $options['controltype']      = array('default' => $getlocations_defaults['controltype']);
    $options['pancontrol']       = array('default' => $getlocations_defaults['pancontrol']);
    $options['mtc']              = array('default' => $getlocations_defaults['mtc']);
    $options['maptype']          = array('default' => $getlocations_defaults['maptype']);
    $options['baselayers']       = array('default' => $getlocations_defaults['baselayers']);
    $options['behavior']         = array('default' => $getlocations_defaults['behavior']);
    $options['streetview_show']  = array('default' => $getlocations_defaults['streetview_show']);
    $options['trafficinfo']      = array('default' => $getlocations_defaults['trafficinfo']);
    $options['trafficinfo_state'] = array('default' => $getlocations_defaults['trafficinfo_state']);
    $options['transitinfo']      = array('default' => $getlocations_defaults['transitinfo']);
    $options['transitinfo_state'] = array('default' => $getlocations_defaults['transitinfo_state']);
    $options['bicycleinfo']      = array('default' => $getlocations_defaults['bicycleinfo']);
    $options['bicycleinfo_state'] = array('default' => $getlocations_defaults['bicycleinfo_state']);
    $options['panoramio_use']    = array('default' => $getlocations_defaults['panoramio_use']);
    $options['panoramio_state']  = array('default' => $getlocations_defaults['panoramio_state']);
    $options['panoramio_show']   = array('default' => $getlocations_defaults['panoramio_show']);
    $options['places']           = array('default' => $getlocations_defaults['places']);
    $options['poi_show']         = array('default' => $getlocations_defaults['poi_show']);
    $options['transit_show']     = array('default' => $getlocations_defaults['transit_show']);
    $options['minzoom']          = array('default' => $getlocations_defaults['minzoom']);
    $options['maxzoom']          = array('default' => $getlocations_defaults['maxzoom']);
    $options['nodezoom']         = array('default' => $getlocations_defaults['nodezoom']);
    $options['markeraction']     = array('default' => $getlocations_defaults['markeraction']);
    $options['markeractiontype'] = array('default' => $getlocations_defaults['markeractiontype']);
    $options['markermanagertype'] = array('default' => $getlocations_defaults['markermanagertype']);
    $options['usemarkermanager'] = array('default' => $getlocations_defaults['usemarkermanager']);
    $options['useclustermanager']     = array('default' => $getlocations_defaults['useclustermanager']);
    $options['weather_use']           = array('default' => $getlocations_defaults['weather_use']);
    $options['weather_show']          = array('default' => $getlocations_defaults['weather_show']);
    $options['weather_state']         = array('default' => $getlocations_defaults['weather_state']);
    $options['map_backgroundcolor']   = array('default' => $getlocations_defaults['map_backgroundcolor']);
    if (! $getlocations_defaults['markermanagertype']) {
      $options['usemarkermanager'] = 0;
      $options['useclustermanager'] = 0;
    }
    $options['markerclusterer_style'] = array('default' => $getlocations_defaults['markerclusterer_style']);
    $options['markerclusterer_zoom']  = array('default' => $getlocations_defaults['markerclusterer_zoom']);
    $options['markerclusterer_size']  = array('default' => $getlocations_defaults['markerclusterer_size']);
    $options['markerclusterer_minsize']  = array('default' => $getlocations_defaults['markerclusterer_minsize']);
    $options['pansetting']       = array('default' => $getlocations_defaults['pansetting']);
    $options['draggable']        = array('default' => $getlocations_defaults['draggable']);
    $options['styles']           = array('default' => $getlocations_defaults['styles']);
    $options['custom_content_enable'] = array('default' => $getlocations_defaults['custom_content_enable']);
    $options['custom_content_source'] = array('default' => $getlocations_defaults['custom_content_source']);

    // node type markers
    $getlocations_node_marker = variable_get('getlocations_node_marker', array('enable' => 0));
    if ($getlocations_node_marker['enable']) {
      if ($types = getlocations_get_types()) {
        foreach ($types AS $type => $name) {
          $mkey = 'node_marker__' . $type;
          $mmarker = (isset($getlocations_node_marker['content_type'][$type]['map_marker']) ? $getlocations_node_marker['content_type'][$type]['map_marker'] : $getlocations_defaults['map_marker']);
          $options[$mkey] = array('default' => $mmarker);
        }
      }
    }

    return $options;

  } // end option_definition

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $handlers = $this->display->handler->get_handlers('field');
    $source_options = array('' => t('None'));

    foreach ($handlers as $handle) {
      $source_options[$handle->options['id']] = (!empty($handle->options['label'])) ? $handle->options['label'] : $handle->options['id'];
    }

    $form['width'] = getlocations_element_map_tf(
      t('Map width'),
      $this->options['width'],
      10,
      10,
      t('The width of a Google map, as a CSS length or percentage. Examples: <em>50px</em>, <em>5em</em>, <em>2.5in</em>, <em>95%</em>')
    );

    $form['height'] = getlocations_element_map_tf(
      t('Map height'),
      $this->options['height'],
      10,
      10,
      t('The height of a Google map, as a CSS length or percentage. Examples: <em>50px</em>, <em>5em</em>, <em>2.5in</em>, <em>95%</em>')
    );

    $form['styles'] = array(
      '#type' => 'textarea',
      '#title' => t('Default styles'),
      '#default_value' => $this->options['styles'],
      '#description' => t('The default styles of a Google map. Use !link for generating your styles', array('!link' => l('http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/', 'http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/', array('external' => TRUE)))),
    );

    $form['latlong'] = getlocations_element_map_tf(
      t('Map center'),
      $this->options['latlong'],
      30,
      30,
      t('The center coordinates of a Google map, expressed as a decimal latitude and longitude, separated by a comma.')
    );

    $form['zoom'] = getlocations_element_map_zoom(
      t('Zoom'),
      $this->options['zoom'],
      t('The zoom level of a Google map.')
    );

    $form += getlocations_map_display_options_form($this->options, FALSE);

    // markers
    $markers = getlocations_get_marker_titles();
    $form['node_map_marker'] = getlocations_element_map_marker(
      t('Marker / fallback marker to use'),
      $markers,
      $this->options['node_map_marker']
    );

    // node type markers
    $getlocations_node_marker = variable_get('getlocations_node_marker', array('enable' => 0));
    if ($getlocations_node_marker['enable']) {
      if ($types = getlocations_get_types()) {
        foreach ($types AS $type => $name) {
          if (isset($getlocations_node_marker['content_type'][$type]['map_marker']) ) {
            $mkey = 'node_marker__' . $type;
            $form[$mkey] = getlocations_element_map_marker(
              t('%name Content Map Marker', array('%name' => $name)),
              $markers,
              (isset($this->options[$mkey]) ? $this->options[$mkey] : $getlocations_node_marker['content_type'][$type]['map_marker'])
            );
          }
        }
      }
    }

    $form['markeractiontype'] = getlocations_element_map_markeractiontype(
      $this->options['markeractiontype']
    );
    $form['markeraction'] = getlocations_element_map_markeraction(
      $this->options['markeraction']
    );

    $form['custom_content_enable'] = array(
      '#type' => 'checkbox',
      '#title' => t('replace default content'),
      '#default_value' => $this->options['custom_content_enable'],
      '#return_value' => 1,
      '#prefix' => '<div id="wrap-custom-content-enable">',
      '#suffix' => '</div>',
    );

    $form['custom_content_source'] = array(
      '#type' => 'select',
      '#title' => t('popup data'),
      '#options' => $source_options,
      '#default_value' => $this->options['custom_content_source'],
      '#description' => t('the field to use as a data source for the marker popup.'),
      '#prefix' => '<div id="wrap-custom-content-source">',
      '#suffix' => '</div>',
    );

    // markermanager option
    if ($this->options['markermanagertype'] == '1') {
      $form['usemarkermanager'] = getlocations_element_map_checkbox(
        t('Use Marker manager for this map'),
        $this->options['usemarkermanager']
      );
      $form['useclustermanager'] = array('#type' => 'hidden', '#value' => 0);
    }
    elseif ($this->options['markermanagertype'] == '2')  {
      $form['useclustermanager'] = getlocations_element_map_checkbox(
        t('Use Cluster manager for this map'),
        $this->options['useclustermanager']
      );
      $form['usemarkermanager'] = array('#type' => 'hidden', '#value' => 0);
      if (file_exists(GETLOCATIONS_PATH . '/getlocations.markercluster_override.inc')) {
        module_load_include('inc', 'getlocations', 'getlocations.markercluster_override');
      }
      else {
        module_load_include('inc', 'getlocations', 'getlocations.markercluster');
      }
      $form['markerclusterer_style'] = getlocations_element_markerclusterer_style($this->options['markerclusterer_style']);
      $form['markerclusterer_zoom'] = getlocations_element_markerclusterer_zoom($this->options['markerclusterer_zoom']);
      $form['markerclusterer_size'] = getlocations_element_markerclusterer_size($this->options['markerclusterer_size']);
      $form['markerclusterer_minsize'] = getlocations_element_markerclusterer_minsize($this->options['markerclusterer_minsize']);
    }
    else {

      $form['useclustermanager'] = array('#type' => 'hidden', '#value' => 0);
      $form['usemarkermanager'] = array('#type' => 'hidden', '#value' => 0);
    }

    $form['minzoom'] = getlocations_element_map_zoom(
      t('Minimum Zoom'),
      $this->options['minzoom'],
      t('The Minimum zoom level at which markers will be visible.')
    );
    $form['maxzoom'] = getlocations_element_map_zoom(
      t('Maximum Zoom'),
      $this->options['maxzoom'],
      t('The Maximum zoom level at which markers will be visible.')
    );
    $form['nodezoom'] = getlocations_element_map_zoom(
      t('Default Zoom for Single location'),
      $this->options['nodezoom'],
      t('The Default zoom level for a single marker.')
    );
    $form['pansetting'] = getlocations_element_map_pansetting(
      $this->options['pansetting']
    );
    $form['empty_result'] = getlocations_element_map_checkbox(
      t('Show map even if view has no results'),
      $this->options['empty_result']
    );

  } // end options_form

  /**
   * Validate the options form.
   */
  function options_validate(&$form, &$form_state) {

    $list = array('Map', 'Satellite', 'Hybrid', 'Physical');
    $found = FALSE;
    foreach ($list AS $maptype) {
      if ($form_state['values']['maptype'] == $maptype && $form_state['values']['baselayers'][$maptype] ) {
        $found = TRUE;
        break;
      }
    }
    if (! $found) {
      // force a setting
      $form_state['values']['maptype'] = 'Map';
      $form_state['values']['baselayers']['Map'] = 1;
    }
  }

  function even_empty() {
    return parent::even_empty() || !empty($this->options['empty_result']);
  }

  function render() {
    if (isset($this->view->live_preview) && $this->view->live_preview) {
      return t('Getlocations Map views are not compatible with live preview.');
    }
    return parent::render();
  }

}
