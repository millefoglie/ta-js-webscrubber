function prepareHtml(stores) {
	stores = stores || [];

	var start = 
	'<!doctype html>\n' +
	'<html>\n' +
		'<body>\n' +
			'<style>th, td { padding: 0 1em} </style>' +
			'<table>\n' +
				'<tr>\n' +
					'<th>id</th>\n' +
					'<th>address</th>\n' +
					'<th>country</th>\n' +
					'<th>postal code</th>\n' +
					'<th>latitude</th>\n' +
					'<th>longitude</th>\n' +
				'</tr>';

	var rows = '';
	
	stores.forEach(function(it) {
		rows += '<tr>' + prepareTableRow(it) + '</tr>';
	});

	var end = '</table>\n</body>';

	return start + rows + end;
}

function prepareTableRow(store) {
	store = store || {};
	var cells = [];

	cells.push(prepareTableCell(store.id || ''));
	cells.push(prepareTableCell((store.name || '') + ' ' +
		 (store.address_1 || '') + ', ' + (store.city || '')));
	cells.push(prepareTableCell(store.country_code || ''));
	cells.push(prepareTableCell(store.postal_code || ''));
	cells.push(prepareTableCell(store.latitude || ''));
	cells.push(prepareTableCell(store.longitude || ''));

	return cells.join('');
}

function prepareTableCell(field) {
	return '<td>' + field + '</td>\n';
}

module.exports = {
	prepareHtml: prepareHtml,
	prepareTableRow: prepareTableRow,
	prepareTableCell: prepareTableCell
};