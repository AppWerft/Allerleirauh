if (Ti.Android) {
	var abx = require('com.alcoapps.actionbarextras');
	var TouchGallery = require("com.gbaldera.titouchgallery");
}

Module = function(images, title, subtitle) {
	var product,
	    actionbar;
	var self = Ti.UI.createWindow({
		fullscreen : true,

		backgroundColor : '#f8f8f8'
	});
	if (Ti.Android) {
		self.gallery = TouchGallery.createTouchGallery({
			top : 0,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
		});
	} else {
		self.gallery = Ti.UI.createScrollView({
			top : 0,
			height : 400,
			width : Ti.UI.FILL,
			horizontalWrap : false,
			bubbleParent : false,
			layout : 'horizontal',
			contentHeight : 400,
			contentWidth : Ti.UI.SIZE
		});
	}
	// import

	if (Ti.Android) {
		var bigimages = [];
		images.forEach(function(image) {
			console.log('https:' + image.replace('small2', 'largeRetina'));
			bigimages.push('https:' + image.replace('large', 'largeRetina'));
		});
		self.gallery.setImages(bigimages);
	} else {
		images.forEach(function(image) {
			self.gallery.add(Ti.UI.createImageView({
				left : 0,
				width : 300,
				height : 400,
				image : 'https:' + image.replace('small2', 'large'),
			}));
		});
	}
	self.add(self.gallery);

	console.log('Info: page added to window');

	if (Ti.Android) {
		self.addEventListener("open", function() {
			console.log('Info: window opened');
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				actionbar = activity.actionBar;
				actionbar.setDisplayHomeAsUp(true);
				//abx.setDisableIcon(true);
				abx.setTitle(title);
				abx.setSubtitle(subtitle || '');

				actionbar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		});
	};
	self.add(Ti.UI.createImageView({
		bottom : 5,
		left : 5,
		zIndex : 999,
		image : '/assets/lupe.png',
		width : 40,
		height : 40
	}));
	return self;
};

module.exports = Module;
