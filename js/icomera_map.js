var data = {};
var _position = {};
(function($) {
	var MAP_MARKER = 1; // 1 = Train, 2 = Bus, 3 = Boat
	$(document).ready(function(){
		data.map;
		data.marker;
	});

	$(window).load(function(){
			$('.map_speed').show();
	});

	function shouldPan(map, pos) {
		if (map == null || pos == null)
			return false;
		if (!map.getBounds().contains(pos))
			return true;
		var swBound = map.getBounds().getSouthWest();
		var neBound = map.getBounds().getNorthEast();
		var totalLat = Math.abs(neBound.lat() - swBound.lat());
		var totalLng = Math.abs(neBound.lng() - swBound.lng());

		var nearestLat = Math.min(Math.abs(neBound.lat() - pos.lat()), Math.abs(swBound.lat() - pos.lat()));
		var nearestLng = Math.min(Math.abs(neBound.lng() - pos.lng()), Math.abs(swBound.lng() - pos.lng()));

		if (nearestLat / totalLat < 0.2 | nearestLng / totalLng < 0.2)
			return true;
		else
			return false;

	}

	this.moveMarker = function() {
		updateMap();
	};
	this.stopMarker = function() {
		clearInterval(data.interval);
	};

	/**
	 * Update all data
	 */
	this.updateAll = function() {
		//updatePosition();
	};

	/**
	 * Update map
	 *
	 * This fires event "map_create" when map has been created for the first time
	 * This fires event "map_update" when complete (also fires when map is created)
	 */
	this.updateMap = function() {
		console.log("map updated");
		if(data.map === undefined) {
			// Create map
			var latlng = new google.maps.LatLng(parent._position.latitude, parent._position.longitude);
			var options = {
				zoom: 8,
				maxZoom: 13,
				minZoom: 6,
				center: latlng,
				rotateControl: false,
				streetViewControl: false,
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_container"), options);
			// Custom icon for vehicle marker
			var markerUrl = "images/map/marker-train.png";
			switch (MAP_MARKER) {
				case 3:
					marker_url = "images/map/marker-boat.png";
					break;
				case 2:
					marker_url = "images/map/marker-bus.png";
					break;
				default:
					marker_url = "images/map/marker-train.png";
			}
			var icon = new google.maps.MarkerImage(markerUrl,
				new google.maps.Size(30.0, 36.0),
				new google.maps.Point(0, 0),
				new google.maps.Point(15.0, 18.0)
			);
			var shadow = new google.maps.MarkerImage("images/map/marker-shadow.png",
				new google.maps.Size(49.0, 36.0),
				new google.maps.Point(0, 0),
				new google.maps.Point(17.0, 18.0)
			);
			// Vehicle marker
			var marker = new google.maps.Marker({
				position: latlng,
				map: map,
				icon: icon,
				shadow: shadow
			});
			// Save map and marker reference
			data.map = map;
			data.marker = marker;
			// Fire create event
			$(document).trigger('map_create');
		}
		else {
			// Map already exists, update marker position
			data.marker.position = new google.maps.LatLng(parent._position.latitude, parent._position.longitude);
			data.marker.setMap(data.map);

			if (shouldPan(data.map, data.marker.position))
			{
				data.map.panTo(data.marker.position);
			}
		}
		// Fire update event
		$(document).trigger('map_update');
	};

})(jQuery);
