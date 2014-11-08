module.exports = function(product) {
	var self = Ti.UI.createView({
		layout : 'horizontal',height:Ti.UI.SIZE
	});
	if (product.siblings && product.siblings.length > 1 && product.siblings[0].color) {
		/* Colorpicker from siblings node */
		var colorpicker = Ti.UI.createPicker({
			top : 0,
			left : 0,
		});
		var data = [];
		product.siblings.forEach(function(sibling) {
			data.push(Ti.UI.createPickerRow({
				title : sibling.color,
				productNumber : sibling.productNumber
			}));
		});
		colorpicker.add(data);
		colorpicker.selectionIndicator = true;
		self.add(colorpicker);
		colorpicker.addEventListener('change', function(_e) {
			product.mysibling = _e.rowIndex;
			updateGallery(product.siblings[_e.rowIndex].images);
		});

		/* Sizepicker from items node */
		var sizepicker = Ti.UI.createPicker({
			top : 0,
			left : 10,
		});
		var sizes = [];
		product.items.forEach(function(item) {
			sizes.push(Ti.UI.createPickerRow({
				title : item.size,
			}));
		});
		sizepicker.add(sizes);
		sizepicker.selectionIndicator = true;
		self.add(sizepicker);
		sizepicker.addEventListener('change', function(_e) {
			product.myitem = _e.rowIndex;
		});
	}
	return self;
};
