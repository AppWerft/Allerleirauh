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
	    spinner,
	    brands = [];
	var brandfilter = false;
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : title,
		backgroundColor : 'white',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	if (Ti.Android) {
		spinner = Ti.UI.createActivityIndicator({
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
			var slider = require('ui/priceslider.widget')(minprice, maxprice, function() {
			});
			self.add(slider);
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
			// more category:
			var container = Ti.UI.createTableView();
			self.add(container);
			var rows = [];
			Ti.Android && abx.setSubtitle(res.children.length + ' Kategorien');
			spinner.hide();
			res.children.forEach(function(subcategory) {
				var row = require('ui/categoryrow.widget')(subcategory);
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
							selected : brands,
							okButtonTitle : "Yep"
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
				activity.invalidateOptionsMenu();
			}
		});
	};
	return self;
};

module.exports = Module;

