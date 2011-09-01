var feed = {
  show: function (container) {
    feed_results = $('#feed_results').empty();
    $fh.act({
      act:'feedCall',
      req: {
        timestamp: new Date().getTime()
      }
    },
      function(res) {        
        var results = JSON.parse(res.body).list;     
        for (ri=0, rl=results.length; ri<rl; ri++) {
          var result = results[ri];
          var paragraph = $('<p>');

          paragraph.html('Author: ' + result.fields.author + '<br/>' + result.fields.description);            
          feed_results.append(paragraph);
        }
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};