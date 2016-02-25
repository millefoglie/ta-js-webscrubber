var fs = require('fs');
var util = require('./util.js');

var url = 'http://www.urbanoutfitters.com/uk/stores';

var outPath = 'output-1-dumb.html';

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.open(url, function() {
	var stores = page.evaluate(function() {
		var showMoreBtn;

		document.querySelector('#bwt-q').value = 'United Kingdom';
		document.querySelector('button[type="submit"]').click();
		
		// preload all stores on the page
		while ((showMoreBtn = document.querySelector('#show_more_link'))
				&& (showMoreBtn.style.display !== 'none')) {
			showMoreBtn.click();
		}

		var stores = [];
		var store;

		var storeList = document.querySelectorAll('.bwt-store-list > li');
		var i = -1;

		// collect all GB stores
		while (++i < storeList.length) {
			store = extractStoreData(storeList[i]);

			if (store.country_code !== 'GB') {
				continue;
			}

			stores.push(store);
		}

		function extractStoreData(storeElem) {
			var store = {};
			var storeAddress = 
			storeElem.querySelector('.bwt-index-store-body-details-address');

			store.id = storeElem.getAttribute('id').replace(/\D/g, '');
			
			store.country_code = 
			storeAddress
			.querySelector('a[href^="https://www.google.com/maps"]')
			.getAttribute('href').slice(-2);
			
			store.address_1 = 
			storeAddress.querySelector('[itemprop="streetAddress"]').textContent
			.replace(/[\n\,]/g, '');
			
			store.city = 
			storeAddress.querySelector('[itemprop="addressLocality"]').textContent
			.replace(/[\n\,]/g, '');
			
			store.postal_code = 
			storeAddress.querySelector('[itemprop="postalCode"]').textContent;

			var storeMapImage = storeElem.querySelector('.bwt-store-map-image');
			var mapSrc = storeMapImage.style.backgroundImage.match(/\-?\d+\.?\d+%\d+C\-?\d+\.?\d+/);
			var coordinates = mapSrc[0].match(/\-?\d+\.?\d+/g);

			store.latitude = coordinates[2];
			store.longitude = coordinates[0];

			return store;
		}

		return stores;
	});

	fs.write(outPath, util.prepareHtml(stores), 'w');
	phantom.exit();
});
