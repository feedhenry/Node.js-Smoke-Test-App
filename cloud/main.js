/* main.js 
 * All calls here are publicly exposed as REST API endpoints. 
 * - all parameters must be passed in a single JSON paramater.
 * - the return 'callback' method signature is 'callback (error, data)', where 'data' is a JSON object.
*/
var util = require('util');

/* 'configCall' server side REST API method.
 * Trivial example of pulling in a shared config file.
 */
exports.configCall = function(params, callback) {
  console.log("in configCall()");
  var cfg = require('config.js');
  console.dir(cfg);
  callback(undefined, {data: cfg.config.cloudData});
};

/* 'webCall' server side REST API method.
 * Example of using $fh.web, see http://docs.feedhenry.com/wiki/Web_Requests.
 */
exports.webCall = function(params, callback) {
  console.log("in webCall() params: " + util.inspect(params));
  var query = params.query != undefined ? params.query : 'ireland';
  var opts = { 'url': 'http://search.twitter.com/search.json?q=' + query + '&rpp=5', 'method': 'GET'};
  $fh.web(opts, function(err, webResp) {
    if(err) return callback(err);
    callback(err, {data: JSON.parse(webResp.body)});
  });
};

/* Sample $fh.feed call */
exports.feedCall = function(params, callback) {
  var feedParams = {          
    'link': 'http://www.feedhenry.com/feed',
    'list-max' : 10
  };
  console.log("in feedCall");
  $fh.feed(feedParams, function(err, feedResp) {
    callback(err, feedResp);
  });
};

/* 'geoCall' server side REST API method.
 * Example of using a third party Node.js module, see https://github.com/feliperazeek/geonode.
 */
exports.geoCall = function(params, callback) {
  console.log("in geoCall()");
  var geo = require('geo');
  var demoAddress = '885 6th Ave #15D New York, NY 10001';
  var address = params.address != undefined ? params.address: demoAddress;
  geo.geocoder(geo.google, address, false, function(formattedAddress, latitude, longitude) {
    callback(undefined, {data: {'address': formattedAddress, 'latitude': latitude, 'longitude': longitude}});
  });
};

/* 'cacheCall' server side REST API method.
 * Example of using $fh.cache, see http://docs.feedhenry.com/wiki/Cache.
 */
exports.cacheCall = function(params, callback) {
    console.log("in cacheCall()");
    var expireTime = (params.expire != undefined && params.expire != "") ? params.expire: 10;
    var bypass = params.bypass != undefined ? params.bypass : false;
  
    $fhserver.cache({act:'load', key: 'time'}, function (err, cachedTime) {
      if (err) return callback(err);    
      var currentTime = Date.now();
      console.log("cachedTime: " + cachedTime);

      if (bypass || cachedTime == undefined || (parseInt(cachedTime) + (expireTime * 1000)) < currentTime) {
        $fhserver.cache({act: 'save', key: 'time', value: JSON.stringify(currentTime), expire: expireTime}, function (err) {          
          var d = new Date(parseInt(currentTime));
          return callback(err, {data: {time: d, cached: false}});
        });
      }else {
        var d = new Date(parseInt(cachedTime));
        return callback(undefined, {data: {time: d, cached: true}});
      }
    });
};

/** XML processing, using the libxmljs module */
exports.xmlCall = function(params, callback) {
  console.log("in xmlCall()");
  var libxmljs = require("libxmljs");
  var xml =  '<?xml version="1.0" encoding="UTF-8"?>' +
           '<root>' +
               '<child foo="bar">' +
                   '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
               '</child>' +
               '<sibling>with content!</sibling>' +
           '</root>';

  var xmlDoc = libxmljs.parseXmlString(xml);

  // xpath queries
  var gchild = xmlDoc.get('//grandchild');
  //console.log(gchild.text());  // prints "grandchild content"

  var children = xmlDoc.root().childNodes();
  var child = children[0];

  console.log(child.attr('foo').value()); // prints "bar"
  
  callback(undefined, {data: child.attr('foo').value()});
};

/** XML processing, using the xml2js module */
exports.xml2jsCall = function(params, callback) {
  console.log("in xml2jsCall()");
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    callback(undefined, {data: result.sub[0].field1});
  });

  var xmlSample = 
    "<root>" +
    "  <sub><field1>value1_1</field1><field2>value1_2</field2></sub>" +
    "  <sub><field1>value2_1</field1><field2>value2_2</field2></sub>" +
    "  <sub><field1>value3_1</field1><field2>value3_2</field2></sub>" +
    "</root>";
  parser.parseString(xmlSample);
};

exports.echoCall = function(params, callback) {
  console.log("in echoCall() params: " + util.inspect(params));
  console.log("Echo: " + params.echo);
  callback(undefined, {echo: params.echo});
};

exports.clearCache = function(params, callback) {
  console.log("in clearCache()");
  $fhserver.cache({act:'remove', key: 'time'}, function (err, data) {
    callback(err, {data: data});    
  });
};

exports.fhdbCall = function(params, callback) {
  console.log("In dbCall()");
  $fh.db({
      "act" : "create",
      "type" : "dbtest1",
      "fields" : {
        "firstName" : "Joe",
        "lastName" : "Bloggs",
        "address1" : "22 Blogger Lane",
        "address2" : "Bloggsville",
        "country" : "Bloggland",
       "phone" : "555-123456"
      }
  }, function(err, res){
    if(err) return callback(err);
    $fh.db({
      "act" : "read",
      "type" : "dbtest1",
      "guid" : res.guid
    }, function(err, res){
      if(err) return callback(err);
      $fh.log(res);
      callback(undefined, res);
    });
  });   
};

// tests returning html, note the custom headers being returned..
exports.htmlCall = function(params, callback) {
  var html = "<div>"
  + "<p>"
  + "Hello World"
  + "</p>"
  + "</div>";

  return callback(undefined, html, {'Content-Type' : 'text/html'});
};

