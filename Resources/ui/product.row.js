module.exports = function(product) {
	var row = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		itemId : product.productNumber,
		itemName : product.name
	});
	row.add(Ti.UI.createImageView({
		left : 0,
		width : 80,
		height : 100,
		image : 'https:' + product.images[0],
	}));
	row.add(Ti.UI.createLabel({
		text : product.name,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		top : 5,
		height : 60,
		left : 90,
		right : 15,
		font : {
			fontSize : 22,
			fontFamily : 'DroidSans'
		}
	}));
	row.add(Ti.UI.createLabel({
		text : product.brand,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		bottom : 10,
		left : 90,
		font : {
			fontSize : 14,
			fontFamily : 'DroidSans'
		}
	}));
	var price = Ti.UI.createLabel({
		color : '#333',
		right : 0,
		bottom : 10,
		color : '#555',
		text : product.price,
		font : {
			fontSize : 25,
			fontFamily : 'SteelfishRG-Regular'
		}
	});
	row.add(price);
	return row;
};
