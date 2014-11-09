if (Ti.Android) {
	var abx = require('com.alcoapps.actionbarextras');
	var TiDialogs = require("yy.tidialogs");
}

var getNextData = function(urlKey, callback) {
	var url = 'https://www.frontlineshop.com/api/categories/' + urlKey;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var res = JSON.parse(this.responseText).response;
			callback(res);
		},
		onerror : function() {
			alert('No internet – no fun!');
		}
	});
	xhr.open('GET', url, true);
	xhr.send(null);
};

Module = function(title, urlKey, genderage) {
	var actionbar,
	    menu,
	    brands = [];
	var brandfilter = false;
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : title,
		backgroundColor : 'white',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	if (Ti.Android) {
		var spinner = Ti.UI.createActivityIndicator({
			style : Ti.UI.ActivityIndicatorStyle.BIG,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});
		self.add(spinner);
		spinner.show();
	}
	getNextData(urlKey, function(res) {
		if (res.products) {
			var maxprice,
			    minprice;
			res.products.sort(function(a, b) {
				var aval = parseFloat(a.price.replace('€ ', '').replace(',', '.'));
				var bval = parseFloat(b.price.replace('€ ', '').replace(',', '.'));
				return bval - aval;
			});
			maxprice = parseFloat(res.products[0].price.replace('€ ', '').replace(',', '.'));
			minprice = parseFloat(res.products[res.products.length - 1].price.replace('€ ', '').replace(',', '.'));
			if (menu)
				menu.findItem('0').visible = true;
			Ti.Android && abx.setSubtitle(res.products.length + ' Produkte');
			var brandobj = {};
			res.products.forEach(function(product) {
				if (product.brand) {
					var brand = product.brand.toUpperCase();
					brandobj[product.brand] = true;
				}
			});
			for (var brand in brandobj)
			brands.push(brand);
			brandobj = null;
			var rows = [];
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
					fontFamily : 'Georgia'
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

			res.products.forEach(function(product) {
				var row = require('ui/product.row')(product);
				rows.push(row);
			});
			var container = Ti.UI.createTableView({
				data : rows,
				top : 60
			});
			spinner && spinner.hide();
			self.add(container);
			container.addEventListener('click', function(_e) {
				//console.log(_e.rowData);
				var win = require('ui/product.window')({
					id : _e.rowData.itemId,
					name : _e.rowData.itemName
				});
				if (Ti.Android)
					win.open();
				else
					self.tab.open(win);
			});
		} else {
			var container = Ti.UI.createTableView();
			self.add(container);
			var rows = [];
			Ti.Android && abx.setSubtitle(res.children.length + ' Kategorien');

			res.children.forEach(function(subcategory) {
				var row = Ti.UI.createTableViewRow({
					hasChild : true,
					backgroundColor : 'white',
					height : 100,
					titletext : subcategory.name,
					itemId : subcategory.urlKey,
					genderage : genderage
				});
				row.add(Ti.UI.createLabel({
					text : subcategory.name,
					color : '#444',
					width : Ti.UI.FILL,
					textAlign : 'left',
					left : 110,
					font : {
						fontSize : 22,
						fontFamily : 'Georgia'
					}
				}));
				
				row.add(Ti.UI.createImageView({
					image : 'https:' + subcategory.thumbnail.replace('small2', 'large').replace('small1', 'large'),
					left : 0,
					top : 5,
					bottom : 5,
					width : 90,
					height : 100
				}));
				rows.push(row);
			});
			container.setData(rows);

			container.addEventListener('click', function(_e) {
				var win = require('ui/products.window')(_e.row.titletext, _e.row.itemId, _e.row.genderage);
				if (Ti.Android)
					win.open();
				else
					self.tab.open(win);
			});

		}
	});
	if (Ti.Android) {
		self.addEventListener("open", function() {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				actionbar = activity.actionBar;
				actionbar.setTitle(title);
				actionbar.setDisplayHomeAsUp(true);
				console.log('/assets/' + genderage + 'icon.png');
				actionbar.setIcon('/assets/' + genderage + 'icon.png');
				actionbar.onHomeIconItemSelected = function() {
					self.close();
				};
				activity.onCreateOptionsMenu = function(e) {
					menu = e.menu;
					menu && menu.add({
						title : 'Marke',
						visible : false,
						itemId : '0',
						showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
						icon : Ti.App.Android.R.drawable.ic_action_brandfilter
					}).addEventListener("click", function() {
						var brandpicker = TiDialogs.createMultiPicker({
							title : "Wähle Deine Lieblingsmarken",
							options : brands,
							selected : brands, // <-- optional
							okButtonTitle : "Yep", // <-- optional
							cancelButtonTitle : "Nah" // <-- optional
						});
						brandpicker.show();
						brandpicker.addEventListener('click', function(_e) {
							var selections = _e.selections;
						});
					});

					menu.add({
						title : 'Basket',
						showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
						icon : Ti.App.Android.R.drawable.ic_action_basket
					}).addEventListener("click", require('ui/basket.widget'));
				};
			}
		});
	};
	return self;
};

module.exports = Module;

