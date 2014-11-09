exports.get = function(id, callback) {
	if (Ti.App.Properties.hasProperty('product_' + id)) {
		console.log('Info: product is in cache ' + id);
		try {
			setTimeout(function() {
				callback(JSON.parse(Ti.App.Properties.getString('product_' + id)));
			}, 5);
			return;
		} catch(E) {
			console.log('Warning: cannot parse prop ' + 'product_' + id);
		}
		return;
	}
	var url = 'https://www.frontlineshop.com/api/product/' + id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var res = JSON.parse(this.responseText).response;
			// Caching
			res.images.forEach(function(image) {
				require('vendor/cachedimage')({
					url : 'https:' + image.replace('small2', 'large')
				});
			});
			res.siblings.forEach(function(sibling) {
				sibling.images.forEach(function(image) {
					require('vendor/cachedimage')({
						url : 'https:' + image.replace('small2', 'large')
					});
				});
			});
			Ti.App.Properties.setString('product_' + id, JSON.stringify(res));
			callback(res);
		},
		onerror : function() {
			alert('No internet – no fun!');
			callback(null);
		}
	});
	xhr.open('GET', url, true);
	xhr.send(null);
};

