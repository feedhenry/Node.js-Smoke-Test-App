console.log("ldap1")
var util = require('util');
var LDAP = require('LDAP');
console.log("ldap2")

var cnx = new LDAP.Connection();
var async = require('async');
console.log("ldap3")

exports.ldapMember = function(uid, callback) {
  cnx.search("dc=example,dc=com", "uid=" + uid,"*", function(err, memberDetails) {
    if (err) return callback(err, null);
    callback(err, memberDetails[0]);
  });
};

exports.ldapGroupMembers = function(group, callback) {
  cnx.open("ldap://fh-ldap.me", function() {
    cnx.search("dc=example,dc=com", "cn=" + group, "*",function(err, groupDetails) {
      if (err) return callback(err, null);      
      //
      // Search for each members details
      //
      async.map(groupDetails[0].memberUid, exports.ldapMember, function(err, membersDetails){
        callback(err, membersDetails);
        cnx.close();          
      });
    });
  });
};