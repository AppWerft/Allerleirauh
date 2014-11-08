if (Ti.Android)
	var abx = require('com.alcoapps.actionbarextras');

var getProduct = function(id, callback) {
	if (Ti.App.Properties.hasProperty('product_' + id)) {
		console.log('Info: product is in cache ' + id);
		try {
			setTimeout(function() {
				callback(JSON.parse(Ti.App.Properties.getString('product_' + id)));
			}, 700);
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

/*     */
Module = function(options) {
	var product;
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : options.name,
		backgroundImage : '/assets/default.png'
	});
	function updateGallery(images) {
		self.gallery.animate({
			opacity : 0,
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
				opacity : 1
			});
		});
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
	self.variantcontainer = Ti.UI.createView({
		top : 0,
		left : 10,
		right : 10,
		opacity : 0.8,
		layout : 'horizontal',
		height : 40
	});
	getProduct(options.id, function(_product) {
		console.log('Info: product found');
		console.log(product);
		product = _product;
		if (product.items) {
			console.log('Info: product has items');
			var sizes = [];
			product.items.forEach(function(item) {
				sizes.push(item.size.replace('*', '✴︎').replace('1/2', '½').replace('.5', '½'));
			});
			console.log('Info: product has items');

		}
		product.images.forEach(function(image) {
			self.gallery.add(Ti.UI.createImageView({
				left : 0,
				width : 300,
				height : 400,
				image : 'https:' + image.replace('small2', 'large'),
			}));
		});
		page.add(self.gallery);
		page.add(self.variantcontainer);
		
		self.variantcontainer.add(require('ui/variants.widget')(product));
		
		if (actionbar && product.brands) {
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
		var actionbar;
		self.addEventListener("open", function() {
			console.log('Info: window opened');
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				actionbar = activity.actionBar;
				actionbar.setDisplayHomeAsUp(true);
				abx.setDisableIcon(true);
				console.log('Info: Icon disabled');
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
						var Basket = new (require('adapter/basket'))();
						var basket = Basket.addArticle(options.id);
						Ti.Android && Ti.UI.createNotification({
							message : product.name + ' ist nun in Deinem Warenkorb.'
						}).show();
						setTimeout(require('ui/basket.widget'), 2000);
					});
				};
			}
		});
	};
	return self;
};

module.exports = Module;
