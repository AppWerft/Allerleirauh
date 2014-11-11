module.exports = function(item, genderage) {
	var row = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		height : 100,
		titletext : item.name,
		itemId : item.urlKey,
		genderage : genderage
	});
	row.add(Ti.UI.createLabel({
		text : item.name,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 110,
		font : {
			fontSize : 22,
			fontWeight : 'bold',
			fontFamily : 'DroidSans'
		}
	}));
	row.add(Ti.UI.createImageView({
		image : 'https:' + item.thumbnail,
		left : 0,
		top : 5,
		defaultImage : '/assets/fls.png',
		bottom : 5,
		width : 80,
		height : 100
	}));
	return row;
};
