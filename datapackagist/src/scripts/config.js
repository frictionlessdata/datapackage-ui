module.exports = {
	corsProxyURL: function(url) { return 'http://crossorigin.me/' + url; },

	// How many rows of CSV to process when parsing it into object and infering schema
	maxCSVRows: 100
};
