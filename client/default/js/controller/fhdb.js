var fhdb = {
  initialised: false,
  
  show: function (container) {
    if (!fhdb.initialised) {
      fhdb.initialised = true;
      
      $('#fhdb_button').bind('click', function(e) {
        e.preventDefault();        
        fhdb.doFhdb();
        
        return false;
      });
    }
  },
  
  doFhdb: function () {
    var fhdb_input = $('#fhdb_input'),
        fhdb_results = $('#fhdb_results').empty();

    $fh.act({
      act:'fhdbCall',
      req: {
        timestamp: new Date().getTime()
      }
    }, function(res) {
        console.log(res);
        var paragraphData = JSON.stringify(res.fields);
    
        // Creating a paragraph tag for each data element.
        var paragraph = $('<p>');
    
        // Add the text to the paragraph tag.
        paragraph.html("Fhdb: " + paragraphData);
    
        // Add the paragraph tag to the tabContent
        fhdb_results.append(paragraph);
          
    }, function(code,errorprops,params) {
       alert('Error retrieving fhdb: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};