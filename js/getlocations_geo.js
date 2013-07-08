/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript geo functions for getlocations module for Drupal 7
 * this is for googlemaps API version 3
 */

(function ($) {
  Drupal.getlocations.geo = {};
  Drupal.getlocations.geo.EARTH_RADIUS_SEMIMAJOR = 6378137.0;
  Drupal.getlocations.geo.EARTH_RADIUS_SEMIMINOR = (6378137.0*(1-(1/298.257223563)));
  //Drupal.getlocations.geo.EARTH_FLATTENING = (1/298.257223563);
  //Drupal.getlocations.geo.EARTH_ECCENTRICITY_SQ = (2*(1/298.257223563)-Math.pow((1/298.257223563), 2));

  /**
   * Normalizes a latitude to the [-90,90] range. Latitudes above 90 or
   * below -90 are capped, not wrapped.
   * @param {Number} lat The latitude to normalize, in degrees.
   * @type Number
   * @return Returns the latitude, fit within the [-90,90] range.
   */
  Drupal.getlocations.geo.normalizeLat = function(lat) {
    return Math.max(-90, Math.min(90, lat));
  };

  /**
   * Normalizes a longitude to the [-180,180] range. Longitudes above 180
   * or below -180 are wrapped.
   * @param {Number} lng The longitude to normalize, in degrees.
   * @type Number
   * @return Returns the longitude, fit within the [-180,180] range.
   */
  Drupal.getlocations.geo.normalizeLng = function(lng) {
    if (lng % 360 == 180) {
      return 180;
    }
    lng = lng % 360;
    return lng < -180 ? lng + 360 : lng > 180 ? lng - 360 : lng;
  };

  /**
   * Decimal Degrees to Radians.
   * @param {Number} Decimal Degrees
   * @returns {Number} Radians
   *
   */
  Drupal.getlocations.geo.toRad = function(deg) {
    return deg * Math.PI / 180;
  }

  /**
   * Radians to Decimal Degrees.
   * @param {Number} Radians
   * @returns {Number} Decimal Degrees
   *
   */
  Drupal.getlocations.geo.toDeg = function(rad) {
    return rad * 180 / Math.PI;
  }

  /**
   * Returns the earth's radius at a given latitude
   * @param {Number} Latitude
   * @returns {Number} radius
   *
   */
  Drupal.getlocations.geo.earth_radius = function(latitude) {
    var lat = Drupal.getlocations.geo.toRad(latitude);
    var x = (Math.cos(lat) / Drupal.getlocations.geo.EARTH_RADIUS_SEMIMAJOR);
    var y = (Math.sin(lat) / Drupal.getlocations.geo.EARTH_RADIUS_SEMIMINOR);
    var r = (1 / (Math.sqrt(x * x + y * y)));
    return r;
  }

  /**
   * Estimate the min and max longitudes within distance of a given location.
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Number} distance in meters
   * @returns {Array}
   *
   */
  Drupal.getlocations.geo.earth_longitude_range = function(latitude, longitude, distance) {

    if (! distance > 0) {
      distance = 1;
    }
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    distance = parseInt(distance);
    var lng = Drupal.getlocations.geo.toRad(longitude);
    var lat =  Drupal.getlocations.geo.toRad(latitude);
    var radius = Drupal.getlocations.geo.earth_radius(latitude) * Math.cos(lat);
    var angle = 0;
    if (radius > 0) {
      angle = Math.abs(distance / radius);
      angle = Math.min(angle, Math.PI);
    }
    else {
      angle = Math.PI;
    }
    var minlong = lng - angle;
    var maxlong = lng + angle;
    if (minlong < -Math.PI) {
      minlong = minlong + Math.PI * 2;
    }
    if (maxlong > Math.PI) {
      maxlong = maxlong - Math.PI * 2;
    }
    var minlongDeg = Drupal.getlocations.geo.toDeg(minlong);
    minlongDeg = Drupal.getlocations.geo.normalizeLng(minlongDeg);
    var maxlongDeg = Drupal.getlocations.geo.toDeg(maxlong);
    maxlongDeg = Drupal.getlocations.geo.normalizeLng(maxlongDeg);
    var r = [minlongDeg.toFixed(6), maxlongDeg.toFixed(6)];
    return r;
  }

  /**
   * Estimate the min and max latitudes within distance of a given location.
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Number} distance in meters
   * @returns {Array}
   *
   */
  Drupal.getlocations.geo.earth_latitude_range = function(latitude, longitude, distance) {

    if (! distance > 0) {
      distance = 1;
    }
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    distance = parseInt(distance);
    var lng = Drupal.getlocations.geo.toRad(longitude);
    var lat =  Drupal.getlocations.geo.toRad(latitude);
    var radius = Drupal.getlocations.geo.earth_radius(latitude);
    var angle = distance / radius;
    var minlat = lat - angle;
    var maxlat = lat + angle;
    var rightangle = Math.PI / 2;
    var overshoot = 0;
    if (minlat < -rightangle) { // wrapped around the south pole
      overshoot = -minlat - rightangle;
      minlat = -rightangle + overshoot;
      if (minlat > maxlat) {
        maxlat = minlat;
      }
      minlat = -rightangle;
    }
    if (maxlat > rightangle) { // wrapped around the north pole
      overshoot = maxlat - rightangle;
      maxlat = rightangle - overshoot;
      if (maxlat < minlat) {
        minlat = maxlat;
      }
      maxlat = rightangle;
    }
    var minlatDeg = Drupal.getlocations.geo.toDeg(minlat);
    minlatDeg = Drupal.getlocations.geo.normalizeLat(minlatDeg);
    var maxlatDeg = Drupal.getlocations.geo.toDeg(maxlat);
    maxlatDeg = Drupal.getlocations.geo.normalizeLat(maxlatDeg);
    var r = [minlatDeg.toFixed(6), maxlatDeg.toFixed(6)];
    return r;
  }

  /**
   * Estimate the earth-surface distance between two locations.
   *
   * @param {Number} latitude1
   * @param {Number} longitude1
   * @param {Number} latitude2
   * @param {Number} longitude2
   * @returns {Number} distance in meters
   */
  Drupal.getlocations.geo.earth_distance = function(latitude1, longitude1, latitude2, longitude2) {
    latitude1  = parseFloat(latitude1);
    longitude1 = parseFloat(longitude1);
    latitude2  = parseFloat(latitude2);
    longitude2 = parseFloat(longitude2);

    var lat1 = Drupal.getlocations.geo.toRad(latitude1);
    var lng1 = Drupal.getlocations.geo.toRad(longitude1);
    var lat2 = Drupal.getlocations.geo.toRad(latitude2);
    var lng2 = Drupal.getlocations.geo.toRad(longitude2);
    var radius = Drupal.getlocations.geo.earth_radius((latitude1 + latitude2) / 2);
    var cosangle = Math.cos(lat1) * Math.cos(lat2) * (Math.cos(long1) * Math.cos(long2) + Math.sin(long1) * Math.sin(long2)) + Math.sin(lat1) * Math.sin(lat2);
    return Math.acos(cosangle) * radius;
  }

  /**
   * Convert a distance to meters
   * @param {Number} distance
   * @param {String} the distance unit
   * @returns {Number} the distance in meters
   */
  Drupal.getlocations.geo.convert_distance_to_meters = function(distance, distance_unit) {
    if (typeof(distance) !== 'number' || !distance > 0) {
      return null;
    }
    var units = {
      'km': 1000.0,
      'm': 1.0,
      'mi': 1609.344,
      'yd': 0.9144,
      'nmi': 1852.0
    };
    if (units[distance_unit] === "undefined") {
      distance_unit = 'km';
    }
    var conv = units[distance_unit];
    var n = parseFloat(distance) * parseFloat(conv);
    var retval = n.toFixed(2);
    return retval;
  }

  /**
   * Convert meters to a distance
   * @param {Number} meters
   * @param {String} the distance unit
   * @returns {Number} the distance in the distance unit
   */
  Drupal.getlocations.geo.convert_meters_to_distance = function(meters, distance_unit) {
    if (typeof(meters) !== 'number' || !meters > 0) {
      return null;
    }
    var units = {
      'km': 0.001,
      'm': 1.0,
      'mi': 0.000621371,
      'yd': 1.093613298,
      'nmi': 0.000539957
    };
    if (units[distance_unit] === "undefined") {
      distance_unit = 'km';
    }
    var conv = units[distance_unit];
    var n = parseFloat(meters) * parseFloat(conv);
    var retval = n.toFixed(2);
    return retval;
  }


}(jQuery));
