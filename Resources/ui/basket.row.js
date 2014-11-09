function getRemover(product) {

}

module.exports = function(parent, item) {
	var self = Ti.UI.createTableViewRow({
		hasChild : true,
		backgroundColor : 'white',
		height : 190
	});
	var mainview = Ti.UI.createView();
	var handlerviewleft = Ti.UI.createView({
		backgroundColor : '#f99'
	});
	var handlerviewright = Ti.UI.createView({
		backgroundColor : '#f99'
	});
	handlerviewright.addEventListener('click', function(_e) {
		parent.deleteRow(self);
		
	});
	handlerviewright.add(Ti.UI.createLabel({
		text : item.name,
		color : '#777',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 20,
		top : 20,
		right : 20,
		font : {
			fontSize : 22,
			fontFamily : 'DroidSans'
		}
	}));
	handlerviewright.add(Ti.UI.createImageView({
		right : 10,
		bottom : 10,
		image : '/assets/trash.png'
	}));
	handlerviewright.addEventListener('click', function(_e) {
		parent.deleteRow(self);
	});
	handlerviewleft.add(Ti.UI.createLabel({
		text : item.name,
		color : '#777',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 20,
		top : 20,
		right : 20,
		font : {
			fontSize : 22,
			fontFamily : 'DroidSans'
		}
	}));
	handlerviewleft.add(Ti.UI.createImageView({
		right : 10,
		bottom : 10,
		image : '/assets/trash.png'
	}));
	handlerviewleft.addEventListener('click', function(_e) {
		parent.deleteRow(self);
		return;
		self.animate({
			height : 10
		}, function() {
			parent.deleteRow(self);
		});
	});
	var thumbnail = Ti.UI.createImageView({
		image : 'https:' + item.images[0].replace('small2', 'large'),
		left : 0,
		top : 5,
		bottom : 5,
		width : 120,
		height : 150
	});
	mainview.add(thumbnail);
	var variantes = require('ui/variants.widget')(item, function(_image) {
		thumbnail.image = 'https:' + _image[0].replace('small2', 'large');
	});
	variantes.setTop(150);
	mainview.add(variantes);
	var container = Ti.UI.createView({
		left : 130,
		top : 5,
		layout : 'vertical',
		height : Ti.UI.SIZE
	});
	mainview.add(container);
	container.add(Ti.UI.createLabel({
		text : item.name,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 0,
		top : 0,
		font : {
			fontSize : 22,
			fontFamily : 'DroidSans'
		}
	}));
	container.add(Ti.UI.createLabel({
		text : 'Kategorie: ' + item.bestmatchingCategory.name,
		color : '#444',
		width : Ti.UI.FILL,
		textAlign : 'left',
		left : 0,
		top : 10,
		font : {
			fontSize : 16,
			fontFamily : 'DroidSans'
		}
	}));
	mainview.add(Ti.UI.createLabel({
		color : '#333',
		text : item.price,
		bottom : 5,
		right : 5,
		font : {
			fontSize : 24,
			fontFamily : 'SteelfishRG-Regular'
		}
	}));
	var darker = Ti.UI.createView({
		touchEnabled : false,
		backgroundColor : 'black',
		opacity : 0
	});
	mainview.add(darker);
	self.container = Ti.UI.createScrollableView({
		views : [handlerviewleft, mainview, handlerviewright],
		currentPage : 1
	});
	self.container.addEventListener('scroll', function(_e) {
		var diff = Math.abs(_e.currentPageAsFloat - 1);
		darker.setOpacity(diff);
	});
	self.add(self.container);
	return self;
};
