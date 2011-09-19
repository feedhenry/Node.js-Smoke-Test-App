var html = {
  initialised: false,
  
  show: function (container) {
    if (!html.initialised) {
      html.initialised = true;
      
      $('#html_button').bind('click', function(e) {
        e.preventDefault();        
        html.doHtml();
        
        return false;
      });
    }
  },
  
  doHtml: function () {
    var html_input = $('#html_input'),
        html_results = $('#html_results').empty();

    $fh.act({
      act:'htmlCall',
      req: {
        timestamp: new Date().getTime()
      }
    }, function(res) {
        console.log(res);
        paragraph.html(res);
    
        // Add the paragraph tag to the tabContent
        html_results.append(paragraph);
          
    }, function(code,errorprops,params) {
       alert('Error retrieving html: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};