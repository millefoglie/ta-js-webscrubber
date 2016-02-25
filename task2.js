var fs = require('fs');
var webpage = require('webpage');
var util = require('./util.js');

var locatorPageUrl = 'http://www.truevalue.com/store_locator.jsp';
var iframeId = 'where2getitframe';
var postalCodes = [20004, 94101];
var outPath = 'output-task2.html';

// page on truevalue.com
var locatorPage = webpage.create();

locatorPage.open(locatorPageUrl, function() {
	var apiHtmlUrl = locatorPage.evaluate(function(iframeId) {
		return document.getElementById(iframeId).getAttribute('src');
	}, iframeId);

	// page on where2getit
	var w2giPage = webpage.create();

	w2giPage.open(apiHtmlUrl, function() {
		var W2GI = w2giPage.evaluate(function() {
			return W2GI;
		});

		var appkey = W2GI.config.appkey;
		var apiurl = apiHtmlUrl.substring(0, apiHtmlUrl.lastIndexOf('/') + 1);

		processPostalCodesRequests(apiurl, appkey);
	});
});

function processPostalCodesRequests(apiurl, appkey) {
	var requestsTotal = postalCodes.length;
	var requestsMade = 0;

	var allStores = [];

	// event to finish data processing
	var finishEvent = new Event('finish');

	global.addEventListener('finish', function(evt) {
		fs.write(outPath, util.prepareHtml(allStores), 'w');
		phantom.exit();
	});

	// prepare xml requests and write received data to file
	postalCodes.forEach(function(it) {
		var url = makeXmlRequestUrl(apiurl, appkey, it);

		// temp page to perform request
		var page = webpage.create();
		
		page.onConsoleMessage = function(msg) { 
			console.log(msg);
		};

		page.onError = function(error) {
			console.error(error);
		};

		page.open(url, function() {
			var extractedStores = page.evaluate(function(util) {
				var nodes = document.documentElement.getElementsByTagName('poi');
				var i;
				var stores = [];
				var store;
				var node;

				for (i = 0; i < nodes.length; i++) {
					store = {};
					node = nodes[i];

					store.id =
					node.getElementsByTagName('uid')[0].textContent;
					
					store.name = 
					node.getElementsByTagName('name')[0].textContent;
					
					store.address_1 = 
					node.getElementsByTagName('address1')[0].textContent;
					
					store.city = 
					node.getElementsByTagName('city')[0].textContent;
					
					store.country_code = 
					node.getElementsByTagName('country')[0].textContent;
					
					store.postal_code = 
					node.getElementsByTagName('postalcode')[0].textContent;
					
					store.latitude = 
					node.getElementsByTagName('latitude')[0].textContent;
					
					store.longitude = 
					node.getElementsByTagName('longitude')[0].textContent;

					stores.push(store);
				}

				return stores;
			}, util);

			allStores = allStores.concat(extractedStores);

			requestsMade++;
			console.log('Finished ' + requestsMade + '/' + requestsTotal);

			if (requestsMade === requestsTotal) {
				global.dispatchEvent(finishEvent);
			}
		});
	});
}

function makeXmlRequestUrl(apiurl, appkey, postalcode) {
	var xmlRequestStart = '<request><appkey>' + appkey + '</appkey>' +
	'<formdata id="locatorsearch"><dataview>store_default</dataview>' +
	'<limit>40</limit><geolocs>';

	var xmlRequestMid =
	'<geoloc><addressline>' + postalcode + '</addressline></geoloc>';

	var xmlRequestEnd =	'</geolocs>' +
	'<where><and><tvr><eq></eq></tvr><ja><eq></eq></ja><tvpaint><eq></eq>' +
	'</tvpaint><activeshiptostore><in></in></activeshiptostore><localad>' +
	'<eq></eq></localad><giftcard><eq></eq></giftcard><tv><eq>1</eq></tv>' +
	'<creditcard><eq></eq></creditcard></and></where>' +
	'<searchradius>40|50|80</searchradius></formdata></request>';

	var xmlRequest = xmlRequestStart + xmlRequestMid + xmlRequestEnd;

	return apiurl + 'ajax?xml_request=' + encodeURI(xmlRequest);
}