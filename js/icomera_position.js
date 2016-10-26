/************************************************************************************
* icomera_position.js
* Created 2014-09-09 by Henrik Engman
*
* A javascript for supporting position API usage
*
*************************************************************************************/
var _position = {};
var mapEnabled = true;
(function($) {
  $(document).ready(function(){
    updatePosition();
    _position.updateinterval = setInterval("updatePosition()", 3000);
    $(document).bind('position_update', null, updatePositionDetails);
  });

  this.updatePosition = function() {
    /**
     * Response holds the following keys:
     * --------------------------------------------------------------------------------
     * KEY		  EXAMPLE		NOTE
     * --------------------------------------------------------------------------------
     * time		 1903245111.0   Unix timestamp
     * latitude	 57.1241
     * longitude	10.2213
     * altitude	 50.4		   Altitude above approximated 0-level, not ocean level
     * speed		50.3		  In m/s
     * cmg		  270.0		  Direction currently moving in
     * satellites   4			  Number of connected satellites
     * --------------------------------------------------------------------------------
     */
    $.getJSON("http://www.ombord.info/api/jsonp/position/?callback=?",function(response) {
      // Save data
      _position.time			 	= parseInt(response.time);
      _position.latitude		= parseFloat(response.latitude);
      _position.longitude		= parseFloat(response.longitude);
      _position.altitude		= parseFloat(response.altitude);
      _position.speed			  = parseFloat(response.speed);
      _position.speed			  = _position.speed < 1 ? 0.0 : _position.speed;
      _position.speed_r		  = parseInt(Math.round(_position.speed));
      _position.speed_mph		= _position.speed > 0 ? (_position.speed * 2.236936) : 0.0;
      _position.speed_mph		= _position.speed_mph.toFixed(2);
      _position.speed_mph_r	= parseInt(Math.round(_position.speed_mph));
      _position.direction		= parseFloat(response.cmg);
      _position.satellites	= parseInt(response.satellites);

      // Fire update event
      $(document).trigger('position_update');
    });
  };

  this.updateIframeMap = function () {
    var back_off = true;
    try {
      window.frames.ico_map.updateMap();
    }
    catch (e){
      back_off = false;
    }
    finally{
       // When the Map has loaded back off and don't query the API as often.
       if(back_off){
        clearInterval(_position.updateinterval);
        _position.updateinterval = setInterval("updatePosition()", 60000);
       }
    }
  };

  this.updatePositionDetails = function() {
    if (mapEnabled){
      updateIframeMap();
    }

    $('.data_time').each(function(){
      o = $(this);
      if(o.attr('format') === undefined) {
        format = jQuery.trim(o.html());
        format = format == '' ? 'j M Y' : format;
        format = format.replace('<!--','');
        format = format.replace('-->','');
        o.attr('format',format);
      }
      o.html(date(o.attr('format'),_position.time));
    });
    $('.data_latitude').html(_position.latitude);
    $('.data_longitude').html(_position.longitude);
    $('.data_altitude').html(_position.altitude);
    $('.data_speed').html(_position.speed);
    $('.data_speed_r').html(_position.speed_r);
    $('.data_speed_mph').html(_position.speed_mph);
    $('.data_speed_mph_r').html(_position.speed_mph_r);
    $('.data_direction').html(_position.direction);
    $('.data_satellites').html(_position.satellites);
  };
})(jQuery);
