var util = require('util');
var async = require('async');
// See https://github.com/jeremycx/node-LDAP for instructions on how to use the LDAP module
var LDAP = require('LDAP');
var ldap;

// Initialize our LDAP connection
function init(callback){ 
  if(ldap) return callback(undefined, ldap);
  // Change these as appropriate for your ldap server
  ldap = new LDAP({ uri: 'ldap://fh-ldap.me'});
  ldap.open(function(err){
    return callback(err, ldap);
  });
};

exports.ldapMember = function(uid, callback) {
  init(function(err, ldap){         
    if(err) return callback(err);
    
    // Change these as appropriate for your domain
    var search_options = {
      base: 'dc=example,dc=com',
      filter: '(uid=' + uid + ')'
    };
 
    ldap.search(search_options, function(err, memberDetails) {
      if (err) return callback(err);
      callback(err, memberDetails[0]);
    });
  });
};

exports.ldapGroupMembers = function(group, callback) {
  init(function(err, ldap){         
    if(err) return callback(err);

    // Change these as appropriate for your domain
    var search_options = {
      base: 'dc=example,dc=com',
      scope: '',
      filter: '(cn=' + group + ')',
      attrs: ''
    };

    ldap.search(search_options, function(err, groupDetails) {
        if (err) return callback(err);      
      
        // Search for each members details
        async.map(groupDetails[0].memberUid, exports.ldapMember, function(err, membersDetails){
          return callback(err, membersDetails);
        });
    });
  });
};