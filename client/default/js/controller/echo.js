var echo = {
  initialised: false,
  
  show: function (container) {
    if (!echo.initialised) {
      echo.initialised = true;
      
      $('#echo_button').bind('click', function(e) {
        e.preventDefault();
        
        echo.doEcho();
        
        return false;
      });
    }
  },
  
  doEcho: function () {
    var echo_input = $('#echo_input'),
        echo = echo_input.val(),
        echo_results = $('#echo_results').empty();

    $fh.act({
      act:'echoCall',
      req: {
        echo: echo,
        timestamp: new Date().getTime()
      }
    }, function(res) {
        console.log(res)
        var tabData = res.echo
        
        var paragraphData = tabData;
    
        // Creating a paragraph tag for each data element.
        var paragraph = $('<p>');
    
        // Add the text to the paragraph tag.
        paragraph.html("Echo: " + paragraphData);
    
        // Add the paragraph tag to the tabContent
        echo_results.append(paragraph);
          
    }, function(code,errorprops,params) {
       alert('Error retrieving echo: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};