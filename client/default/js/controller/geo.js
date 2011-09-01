var geo = {
  initialised: false,
  
  show: function (container) {
    if (!geo.initialised) {
      geo.initialised = true;
      
      $('#geo_search_button').bind('click', function (e) {
        e.preventDefault();
        
        geo.search();
        
        return false;
      });
      
      var maps_div = $('#maps_div').css('height', '85%');
      maps_div.parents('.main_view').css('height', '100%');
      
      geo.init();
    }
  },
  
  search: function () {
    var geo_search_input = $('#geo_search_input'),
        query = geo_search_input.val();
    
    $fh.act({
      act:'geoCall',
      req: {
        address: query,
        timestamp: new Date().getTime()
      }
    },
    function(res) {
      var loc = res.data;
      
      if ('undefined' !== typeof loc.latitude) {
        var lat = loc.latitude,
            lon = loc.longitude;
        geo.map(lat, lon);
      }
      else {
        alert('No results found for "' + query + '"');
      }
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  },
  
  init: function () {
    // Initialise map to the users current location    
    $fh.geo({
      // setting an interval of 0 will only perform a single geolocation lookup
      interval: 0
    }, function (res) {
      // Got geolocation details in response. 
      geo.map(res.lat, res.lon);
    }, function (error) {
      // Problem getting geolocation details, so fallback to hardcoded values
      geo.map(53.5, -7.5);
    });
  },
  
  map: function (lat, lon) { 
    $fh.map({
      target: '#maps_div',
      lat: lat,
      lon: lon,
      zoom: 15
    }, function (res) {
      // Keep the reference to the map object;
      self.map = res.map;
      // Map is being shown, lets add a placemark
      var pos = new google.maps.LatLng(lat, lon);
      
      var marker = new google.maps.Marker({
        position: pos,
        map: self.map,
        title: 'Location'
      });
    }, function (error) {
      // something seriously wrong here. Show error
      alert(error);
    });
  }
};