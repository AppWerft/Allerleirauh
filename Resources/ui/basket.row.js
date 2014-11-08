module.exports = function(item) {
	var row = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		height : Ti.UI.SIZE,
		titletext : item.name,
		itemId : item.urlKey
	});
	var container = Ti.UI.createView({
		left : 130,
		top : 5,
		layout : 'vertical',
		height : Ti.UI.SIZE
	});
	row.add(container);
	container.add(Ti.UI.createLabel({
		text : item.name,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 0,
		top : 0,
		font : {
			fontSize : 22,
			fontFamily : 'Georgia'
		}
	}));
	container.add(Ti.UI.createLabel({
		text : 'Kategorie: ' +item.bestmatchingCategory.name,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 0,
		top : 10,
		font : {
			fontSize : 16,
			fontFamily : 'Georgia'
		}
	}));
	container.add(Ti.UI.createLabel({
		text : 'Farbe: '+ item.color,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 0,
		top : 5,
		font : {
			fontSize : 16,
			fontFamily : 'Georgia'
		}
	}));
	container.add(Ti.UI.createLabel({
		text : 'Größe: ' +item.items[0].size,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 0,
		top : 5,
		font : {
			fontSize : 16,
			fontFamily : 'Georgia'
		}
	}));
	row.add(Ti.UI.createImageView({
		image : 'https:' + item.images[0],
		left : 0,
		top : 5,
		bottom : 5,
		width : 120,
		height : 150
	}));
	row.add(Ti.UI.createLabel({
		color : '#333',
		text : item.price,
		bottom : 5,
		right : 5,
		font : {
			fontSize : 24,
			fontFamily : 'SteelfishRG-Regular'
		}
	}));
	return row;
};
