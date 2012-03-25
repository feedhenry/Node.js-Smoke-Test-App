/*global requires */
var assert = require('assert');
var util = require('util');
var fh = require('fh-fhc');

var fhcLoaded = false;

var appId = 'py0xWygG3P3-d7Vo5rgBvmHd';


module.exports = {

  testEcho: function () {
    console.log('testEcho');

    var params = {"echo" : "hello", "now" : new Date()};
    doCloudCall('echoCall', params, function (res) {
      assert.equal("hello", res.echo);
    });
  },
};

function doCloudCall(action, params, callback) {
  console.log("\n***************************\n** " + action + ' params :: ' + JSON.stringify(params));
  loadFhc(function() {
    fh.act([appId, action, JSON.stringify(params)], function (err, res) {
      if (null !== err && undefined !== err) {
        console.log(err);
        assert.isNull(err);
      }    
      console.log("** " + action + " returned :: " + util.inspect(res, true, null) + "\n***************************\n");
      callback(res);
    });
  });
}

function loadFhc(callback) {
  if( fhcLoaded === false ) {
    fh.fhc.load(function(res) {
      fhcLoaded = true;
      callback();
    });
  }
  else {
    callback();
  }
}