var web = {
  initialised: false,
  
  show: function (container) {
    if (!web.initialised) {
      web.initialised = true;
      
      $('#web_search_button').bind('click', function(e) {
        e.preventDefault();
        
        web.search();
        
        return false;
      });
    }
  },
  
  search: function () {
    var search_input = $('#web_search_input'),
        search_amount = $('#web_search_amount'),
        query = search_input.val(),
        amount = search_amount.find('option:selected').val(),
        search_results = $('#web_search_results').empty();
    
    $fh.act({
      act:'webCall',
      req: {
        query: query,
        amount: amount,
        timestamp: new Date().getTime()
      }
    }, function(res) {
      var results = res.data.results;
      
      for (ri=0, rl=results.length; ri<rl; ri++) {
        var result = results[ri];
        
        var paragraph = $('<p>');
        
        paragraph.html('From: ' + result.from_user + '<br/>' + result.text);
            
        search_results.append(paragraph);
      }
      
    }, function(code,errorprops,params) {
       alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};