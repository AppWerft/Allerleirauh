module.exports = function(product) {
	var self = Ti.UI.createView({
		layout : 'horizontal',
		height : Ti.UI.SIZE
	});
	var colorbutton = Ti.UI.createButton({
		title : product.siblings[0].color,
		top : -10,
		width : '60%',
		borderWidth : 1,
		borderColor : 'silver',
		borderRadius : 5,
		left : 0,
		backgroundColor : 'white'
	});
	page.add(colorbutton);
	colorbutton.addEventListener('click', function() {
		var colors = [];
		product.siblings.forEach(function(sibling) {
			colors.push(sibling.color);
		});
		var opts = {
			options : colors,
			title : 'Wähle die Farbe'
		};
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show();
		dialog.addEventListener('click', function(_e) {
			updateGallery(product.siblings[_e.index].images);
		});
	});

	return self;
};
