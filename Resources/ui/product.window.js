if (Ti.Android) {
	var abx = require('com.alcoapps.actionbarextras');
	var TouchGallery = require("com.gbaldera.titouchgallery");
}

Module = function(options) {
	var product,
	    actionbar;
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : options.name,
		backgroundImage : '/assets/default.png'
	});
	console.log('Info: window started');
	function updateGallery(images) {
		if (Ti.Android) {
			self.gallery.images = [];
			images.forEach(function(image) {
				self.gallery.addImage('https:' + image.replace('small2', 'largeRetina'));
			});
		} else {
			self.gallery.animate({
				transform : Ti.UI.create2DMatrix({
					scale : 0.7
				}),
				duration : 100
			}, function() {
				self.gallery.getChildren().forEach(function(child) {
					self.gallery.remove(child);
				});
				images.forEach(function(image) {
					self.gallery.add(Ti.UI.createImageView({
						left : 0,
						width : 300,
						height : 400,
						image : 'https:' + image.replace('small2', 'large'),
					}));
				});
				self.gallery.animate({
					transform : Ti.UI.create2DMatrix({
						scale : 1
					}),
					duration : 50
				});
			});
		}
	}

	if (Ti.Android) {
		var spinner = Ti.UI.createActivityIndicator({
			style : Ti.UI.ActivityIndicatorStyle.BIG,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});
		self.add(spinner);
		spinner.show();
	}
	var page = Ti.UI.createScrollView({
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.FILL,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'white',
		layout : 'vertical'
	});
	self.add(page);
	if (Ti.Android) {
		self.gallery = TouchGallery.createTouchGallery({
			top : 0,
			height : 400,
			width : Ti.UI.FILL,

			bubbleParent : false,
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
	require('adapter/product').get(options.id, function(_product) {
		console.log('Info: product found');
		product = _product;
		// import
		if (product.items) {
			console.log('Info: product has items');
			var sizes = [];
			product.items.forEach(function(item) {
				sizes.push(item.size.replace('*', '✴︎').replace('1/2', '½').replace('.5', '½'));
			});
			console.log('Info: product has items');

		}
		if (Ti.Android) {
			var bigimages = [];
			product.images.forEach(function(image) {
				bigimages.push('https:' + image.replace('small2', 'largeRetina'));
			});
			self.gallery.setImages(bigimages);
		} else {
			product.images.forEach(function(image) {
				self.gallery.add(Ti.UI.createImageView({
					left : 0,
					width : 300,
					height : 400,
					image : 'https:' + image.replace('small2', 'large'),
				}));
			});
		}
		page.add(self.gallery);
		page.add(require('ui/variants.widget')(product, updateGallery));

		if (actionbar && product.brand) {
			actionbar.setSubtitle(product.brand);
		} else {
			page.add(Ti.UI.createLabel({
				text : product.brand,
				color : '#444',
				width : Ti.UI.FILL,
				textAlign : 'left',
				top : 10,
				left : 10,
				font : {
					fontSize : 22,
					fontFamily : 'Georgia'
				}
			}));
		}

		var priceview = Ti.UI.createView({
			backgroundImage : '/assets/price.png',
			width : 90,
			height : 45,
			right : 10,
			transform : Ti.UI.create2DMatrix({
				rotate : -7
			}),
			top : 5
		});
		var price = Ti.UI.createLabel({
			color : '#333',
			text : product.price,
			font : {
				fontSize : '30dp',
				fontFamily : 'SteelfishRG-Regular'
			}
		});
		priceview.add(price);

		page.add(Ti.UI.createLabel({
			text : product.material,
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			top : 10,
			left : 10,
			font : {
				fontSize : 16,
				fontFamily : 'Georgia'
			}
		}));
		product.productDetails && product.productDetails.forEach(function(detail) {
			page.add(Ti.UI.createLabel({
				text : '➨ ' + detail,
				color : '#444',
				width : Ti.UI.FILL,
				textAlign : 'left',
				top : 2,
				height : 25,
				left : 30,
				font : {
					fontSize : 16,
					fontFamily : 'Georgia'
				}
			}));
		});
		product.longDescription && page.add(Ti.UI.createLabel({
			html : product.longDescription.replace(/<.*?>/gm, ''),
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			top : 10,
			left : 10,
			bottom : 50,
			right : 10,
			font : {
				fontSize : 16,
				fontFamily : 'Georgia'
			}
		}));
		self.add(page);
		self.add(priceview);
		console.log('Info: page added to window');
	});
	if (Ti.Android) {
		self.addEventListener("open", function() {
			console.log('Info: window opened');
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				actionbar = activity.actionBar;
				actionbar.setDisplayHomeAsUp(true);
				product && product.brand && actionbar.setSubtitle(product.brand);
				abx.setDisableIcon(true);
				actionbar.onHomeIconItemSelected = function() {
					self.close();
				};
				activity.onCreateOptionsMenu = function(e) {
					console.log('Info: onCreateOptionsMenu');
					e.menu && e.menu.add({
						title : 'Share',
						showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
						icon : Ti.App.Android.R.drawable.ic_action_share
					}).addEventListener("click", function() {
						var img = self.toImage().media;
						var fileToShare = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'tempimage.jpg');
						fileToShare.write(img);
						require('vendor/socialshare').share({
							status : 'Finde ich gut: Frontlinestore',
							image : fileToShare.nativePath,
							androidDialogTitle : 'Sharing …'
						});
					});
					e.menu && e.menu.add({
						title : 'Warenkorb',
						showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
						icon : Ti.App.Android.R.drawable.ic_action_basket
					}).addEventListener("click", function() {
						/* save to basket*/
						Ti.Android && Ti.UI.createNotification({
							message : product.name + ' ist nun in Deinem Warenkorb.'
						}).show();
						self.gallery.animate({
							top : -200,
							left : 300,
							opacity : 0.1,
							transform : Ti.UI.create2DMatrix({
								scale : 0.2,
								rotate : 20
							})
						}, function() {
							var Basket = new (require('adapter/basket'))();
							var basket = Basket.addArticle(product);

							self.close();
							setTimeout(require('ui/basket.widget'), 50);
						});

					});
				};
				activity.invalidateOptionsMenu();
			}
		});
	};
	return self;
};

module.exports = Module;
