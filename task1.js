var fs = require('fs');
var util = require('./util.js');

var url = 'http://www.urbanoutfitters.com/uk/stores';
var countryCode = 'GB';
var outPath = 'output-task1.html';

var page = require('webpage').create();

page.open(url, function(status) {
	var allStores = page.evaluate(function() {
		return myBWAPI.all_stores();
	});

	var stores = allStores.filter(function(it) {
		return it.country_code === countryCode;
	});
	
	var output = util.prepareHtml(stores);

	fs.write(outPath, output, 'w');
	phantom.exit();
});
