<?php

/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Contains the getlocations_streetview style plugin.
 */

/**
 * Getlocations style plugin to render a row as a google streetview.
 *
 * @ingroup views_style_plugins
 */
class getlocations_plugin_style_streetview extends views_plugin_style {
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

    $options['width']                  = array('default' => $getlocations_defaults['width']);
    $options['height']                 = array('default' => $getlocations_defaults['height']);
    $options['sv_addresscontrol']         = array('default' => 1);
    $options['sv_addresscontrolposition'] = array('default' => '');
    $options['sv_pancontrol']             = array('default' => 1);
    $options['sv_pancontrolposition']     = array('default' => '');
    $options['sv_zoomcontrol']            = array('default' => 'default');
    $options['sv_zoomcontrolposition']    = array('default' => '');
    $options['sv_linkscontrol']           = array('default' => 1);
    $options['sv_imagedatecontrol']       = array('default' => 0);
    $options['sv_scrollwheel']            = array('default' => 1);
    $options['sv_clicktogo']              = array('default' => 1);
    $options['sv_fullscreen']             = array('default' => 0);

    return $options;

  } // end option_definition

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['#theme'] = 'getlocations_plugin_style_streetview_options_form';

    $handlers = $this->display->handler->get_handlers('field');
    $source_options = array('' => t('None'));

    foreach ($handlers as $handle) {
      $source_options[$handle->options['id']] = (!empty($handle->options['label'])) ? $handle->options['label'] : $handle->options['id'];
    }

    // streetview killswitch
    if (! getlocations_sv_global()) {
      $form['message'] = array(
        '#markup' => '<p><b>' . t('Streetview has been disabled globally, this plugin is inactive.') . '</b></p>',
      );
    }

    $form['width'] = getlocations_element_map_tf(
      t('Width'),
      $this->options['width'],
      t('The default width of a Google streetview, as a CSS length or percentage. Examples: <em>50px</em>, <em>5em</em>, <em>2.5in</em>, <em>95%</em>'),
      10,
      10,
      TRUE
    );

    $form['height'] = getlocations_element_map_tf(
      t('Height'),
      $this->options['height'],
      t('The default height of a Google streetview, as a CSS length or percentage. Examples: <em>50px</em>, <em>5em</em>, <em>2.5in</em>, <em>95%</em>'),
      10,
      10,
      TRUE
    );

    $controlpositions = getlocations_controlpositions();

    $form['sv_addresscontrol'] = getlocations_element_map_checkbox(
      t('Show address'),
      $this->options['sv_addresscontrol']
    );
    $form['sv_addresscontrol']['#suffix'] = '<div id="wrap-getlocations-addresscontrol">';
    $form['sv_addresscontrolposition'] = getlocations_element_dd(
      t('Position of address display'),
      $this->options['sv_addresscontrolposition'],
      $controlpositions
    );
    $form['sv_addresscontrolposition']['#suffix'] = '</div>';

    $form['sv_pancontrol'] = getlocations_element_map_checkbox(
      t('Show Pan Control'),
      $this->options['sv_pancontrol']
    );
    $form['sv_pancontrol']['#suffix'] = '<div id="wrap-getlocations-pancontrol">';
    $form['sv_pancontrolposition'] = getlocations_element_dd(
      t('Position of Pan Control'),
      $this->options['sv_pancontrolposition'],
      $controlpositions
    );
    $form['sv_pancontrolposition']['#suffix'] = '</div>';

    $form['sv_zoomcontrol'] = getlocations_element_map_zoom_controltype($this->options['sv_zoomcontrol']);
    $form['sv_zoomcontrol']['#suffix'] = '<div id="wrap-getlocations-zoomcontrol">';

    $form['sv_zoomcontrolposition'] = getlocations_element_dd(
      t('Position of Zoom Control'),
      $this->options['sv_zoomcontrolposition'],
      $controlpositions
    );
    $form['sv_zoomcontrolposition']['#suffix'] = '</div>';

    $form['sv_linkscontrol'] = getlocations_element_map_checkbox(
      t('Enable links'),
      $this->options['sv_linkscontrol']
    );
    $form['sv_imagedatecontrol'] = getlocations_element_map_checkbox(
      t('Show image date'),
      $this->options['sv_imagedatecontrol']
    );
    $form['sv_scrollwheel'] = getlocations_element_map_checkbox(
      t('Enable scrollwheel'),
      $this->options['sv_scrollwheel']
    );
    $form['sv_clicktogo'] = getlocations_element_map_checkbox(
      t('Enable clickToGo'),
      $this->options['sv_clicktogo'],
      t('Enable navigating Streetview by clicking on it.')
    );
    $form['sv_fullscreen'] = getlocations_element_map_checkbox(
      t('Show Fullscreen button'),
       $this->options['sv_fullscreen']
    );


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
