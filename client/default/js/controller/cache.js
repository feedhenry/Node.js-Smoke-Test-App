var cache = {
  initialised: false,
  
  show: function (container) {
    if (!cache.initialised) {
      cache.initialised = true;
      
      $('#cache_update').bind('click', function (e) {
        e.preventDefault();
        cache.update();
        
        return false;
      });
      
      $('#cache_clear').bind('click', function (e) {
        e.preventDefault();
        
        cache.clear();
        
        return false;
      });
    }
  },
  
  update: function () {
    var cache_expire = $('#cache_expire'),
        cache_cached = $('#cache_cached').empty(),
        cache_output = $('#cache_output').text('reloading...');
    
    $fh.act({
      act:'cacheCall',
      req: {
        expire: cache_expire.val(),
        timestamp: new Date().getTime()
      }
    }, function(res) {
      var time = res.data.time,
          from_cache = res.data.cached;
      
      cache_cached.text(from_cache);
      cache_output.text(time);
    }, function(code,errorprops,params) {
      alert('Error in cacheCall: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  },
  
  clear: function () {
    var cache_expire = $('#cache_expire'),
        cache_cached = $('#cache_cached').empty(),
        cache_output = $('#cache_output').text('reloading...');
    
    $fh.act({
      act:'clearCache',
      req: {
        timestamp: new Date().getTime()
      }
    }, function(res) {
      cache_cached.text('cleared: ' + res.data);
      cache_output.text('');
    }, function(code,errorprops,params) {
      alert('Error clearing cache: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};