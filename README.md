# Node.js Smoke Test App

## Overview

The Smoke Test is an application developed to demonstrate key parts of the FeedHenry server side functionality in Node.js. The app is made up of a number of tabs each of which demonstrates cloud call to some various Node.js functions.

* Config
* Web
* Geo
* Redis
* XML
* Feed
* Echo
* Data

## Config

When the 'Config' tab is displayed it makes an call to the cloud (act: 'configCall'). 

	exports.configCall = function(params, callback) {
	  console.log("in configCall()");
	  var cfg = require('config.js');
	  console.dir(cfg);
	  callback(undefined, {data: cfg.config.cloudData});
	};

This function includes the config.js file found in the shared directory and returns the data found using the reference 'cfg.config.cloudData'.

	var config = {
	  cloudData: [
	    'This is data that was returned from the cloud.',
	    'A special click event for this tab was bound in /client/default/js/init.js which causes a $fh.act() request to be made each time the tab is clicked.',
	    'Look at the file /cloud/main.js (configCall() function)to see it reading the "cloudData" key from the /shared/config.js file.'
	  ]
	}
	    
	exports.config = config;

## Web

In this example we use the $fh.web API to make a request to twitter. The results of this request are based on the input from the textfield on this tab.

Client

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

Cloud

	exports.webCall = function(params, callback) {
	  console.log("in webCall() params: " + util.inspect(params));
	  var query = params.query != undefined ? params.query : 'ireland';
	  var opts = { 'url': 'http://search.twitter.com/search.json?q=' + query + '&rpp=5', 'method': 'GET'};
	  $fh.web(opts, function(err, webResp) {
	    if(err) return callback(err);
	    callback(err, {data: JSON.parse(webResp.body)});
	  });
	};

## Geo

The 'geoCall' function looks up a location based on a default value or the value from the textfield. Using this value it does a lookup to get the address, latitude and longitude. This is returned to the client side and it rendered on the map.

	exports.geoCall = function(params, callback) {
	  console.log("in geoCall()");
	  var geo = require('geo');
	  var demoAddress = '885 6th Ave #15D New York, NY 10001';
	  var address = params.address != undefined ? params.address: demoAddress;
	  geo.geocoder(geo.google, address, false, function(formattedAddress, latitude, longitude) {
	    callback(undefined, {data: {'address': formattedAddress, 'latitude': latitude, 'longitude': longitude}});
	  });
	};

## Redis

The Redis tab demonstrates caching on the server side. A cache time parameter is present to set the amount of time the data should be cached for. If the cache has expired it will generate the data again and cache it.

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

## XML

The XML tab demonstrates two different ways of parsing XML (libxmljs and xml2js).

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

## Feed

The 'feedCall' function will return a JSON representation of an RSS feed.

Client

	show: function (container) {
		feed_results = $('#feed_results').empty();
		$fh.act({
		  act:'feedCall',
		  req: {
		    timestamp: new Date().getTime()
		  }
		},
		  function(res) {        
		    var results = JSON.parse(res.body).list;     
		    for (ri=0, rl=results.length; ri<rl; ri++) {
		      var result = results[ri];
		      var paragraph = $('<p>');

		      paragraph.html('Author: ' + result.fields.author + '<br/>' + result.fields.description);            
		      feed_results.append(paragraph);
		    }
		}, function(code,errorprops,params) {
		  alert('Error retrieving web results: code: ' + code + " errorprops: " + errorprops + " params: " + params);
		});
	}

Cloud

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

## Echo

The echo tab will return back the 'echo' parameter sent to it.

Client

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

Cloud

	exports.echoCall = function(params, callback) {
	  console.log("in echoCall() params: " + util.inspect(params));
	  console.log("Echo: " + params.echo);
	  callback(undefined, {echo: params.echo});
	};

## Data

The data tab demonstrates creating an entity in a database. If the creation is successful it will do a read on the database and then return the entity. The client side code does a cloud call to the ‘fhdbCall’ function and then generates the HTML based on the response from this function.

Client

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

Cloud

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