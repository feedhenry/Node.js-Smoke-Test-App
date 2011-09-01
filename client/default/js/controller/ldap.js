var ldap = {
  initialised: false,
  
  show: function (container) {
    if(!ldap.initialised) {
      ldap.initialised = true;
      
      $('#ldap_search_button').bind('click', function (e) {
        e.preventDefault();
        
        ldap.showMembers();
        
        return false;
      });
    }
  },
  
  showMembers: function () {
    var ldap_group = $('#ldap_group'),
        ldap_members = $('#ldap_members').empty();
    
    $fh.act({
      act:'ldapCall',
      req: {
        group: ldap_group.find('option:selected').val(),
        timestamp: new Date().getTime()
      }
    },
    function(res) {
      var members = res.data;
      
      for (var mi=0,ml=members.length; mi<ml; mi++) {
        var member = members[mi];
       
        var paragraph = $('<p>');
        var text = ['CN: ', member.cn[0], '<br/>',
                    'Display Name: ', member.displayName[0], '<br/>',
                    'Home Phone: ', member.homePhone[0], '<br/>',
                    'Mobile: ', member.mobile[0], '<br/>',
                    'E-mail: ',member.mail[0],'<br/>'].join('');
        
        paragraph.text(text);
        
        ldap_members.append(paragraph);
      }
    }, function(code,errorprops,params) {
      alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
    });
  }
};