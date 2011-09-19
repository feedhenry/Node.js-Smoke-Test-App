var xml = {
  show: function (container) {
    container.empty();

    $fh.act({
      act:'xmlCall',
      req: {
        timestamp: new Date().getTime()
      }
    },
      function(res) {      
        var paragraph = $('<p>');
        paragraph.html("libxml: " + res.data);
        container.append(paragraph);
        
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });

    $fh.act({
      act:'xml2jsCall',
      req: {
        timestamp: new Date().getTime()
      }
    },
      function(res) {      
        var paragraph = $('<p>');
        paragraph.html("xml2js: " + res.data);
        container.append(paragraph);
        
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });

  }
};