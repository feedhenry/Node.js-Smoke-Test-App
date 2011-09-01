var configjs = {
  show: function (container) {
    $fh.act({
      act:'configCall',
      req: {
        timestamp: new Date().getTime()
      }
    },
      function(res) {
        var tabData = res.data
        container.empty();
        
        for(var i = 0; i < tabData.length; i++) {

        // Get the data element from the array
        var paragraphData = tabData[i];
    
        // Creating a paragraph tag for each data element.
        var paragraph = $('<p>');
    
        // Add the text to the paragraph tag.
        paragraph.html(paragraphData);
    
        // Add the paragraph tag to the tabContent
        container.append(paragraph);
      }
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};