var xml = {
  show: function (container) {
    $fh.act({
      act:'xmlCall',
      req: {
        timestamp: new Date().getTime()
      }
    },
      function(res) {
        var tabData = res.data
        container.empty();
        
        var paragraphData = tabData;
    
        // Creating a paragraph tag for each data element.
        var paragraph = $('<p>');
    
        // Add the text to the paragraph tag.
        paragraph.html("Data returned: " + paragraphData);
    
        // Add the paragraph tag to the tabContent
        container.append(paragraph);
        
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};