module.exports = function(minprice, maxprice, onslide) {
	var self = Ti.UI.createView({
		top : 5,
		height : 50
	});
	var slider = Ti.UI.createSlider({
		height : 30,
		top : 10,
		width : '66%',
		min : minprice,
		max : maxprice,
		value : maxprice
	});
	self.add(Ti.UI.createLabel({
		text : 'Preisfilter',
		color : '#bbb',
		width : Ti.UI.FILL,
		textAlign : 'left',
		top : 40,
		left : 10,
		font : {
			fontSize : 12,
			fontWeight : 'bold',
			fontFamily : 'DroidSans'
		}
	}));
	self.add(Ti.UI.createLabel({
		text : '€ ' + minprice,
		color : '#333',
		width : Ti.UI.SIZE,
		top : 10,
		left : 5,
		left : 10,
		font : {
			fontSize : 10,
		}
	}));
	self.add(Ti.UI.createLabel({
		text : '€ ' + maxprice,
		color : '#333',
		width : Ti.UI.SIZE,
		top : 10,
		right : 5,
		font : {
			fontSize : 10,
		}
	}));
	self.add(slider);
	slider.show();
	return slider;
};
