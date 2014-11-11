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
		if (res.products && res.products.length) {
			var section = Ti.UI.createListSection({
				headerTitle : null
			});
			var container = Ti.UI.createListView({
				defaultItemTemplate : 'template',
				templates : {
					'template' : require('templates/products')
				},
				top : 50,
				sections : [section]
			});
			function updateList(options) {
				var dataitems = [];
				res.products.forEach(function(product) {
					if (product.price.replace('€ ', '').replace(',', '.') <= options.maxprice)
						dataitems.push({
							properties : {
								itemId : JSON.stringify({
									id : product.productNumber,
									name : product.name
								})
							},
							thumbnail : {
								image : 'https:' + product.images[0]
							},
							title : {
								text : product.name
							},
							brand : {
								text : product.brand
							},
							price : {
								text : product.price
							}
						});
				});
				actionbar && actionbar.setSubtitle(dataitems.length + ' Teile');
				section.setItems(dataitems);
			}

			var maxprice,
			    minprice;
			res.products.sort(function(a, b) {
				var aval = parseFloat(a.price.replace('€ ', '').replace(',', '.'));
				var bval = parseFloat(b.price.replace('€ ', '').replace(',', '.'));
				return bval - aval;
			});
			console.log(res.products);
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
			var preisbremse;
			var slider = require('ui/priceslider.widget')(minprice, maxprice, {
				onstop : function(_e) {
					preisbremse = Math.round(_e.value);
					container.opacity = 1;
					updateList({
						maxprice : preisbremse
					});
					require('de.manumaticx.crouton').info("Preisbremse ist jetzt € " + preisbremse);
					setTimeout(function() {
						slider.animate({
							opacity : 1
						});
					}, 4000);
				},
				onstart : function() {
					slider.opacity = 0;
				}
			});
			self.add(slider);

			updateList({
				maxprice : maxprice
			});
			spinner && spinner.hide();
			self.add(container);
			container.addEventListener('itemclick', function(_e) {

				var win = require('ui/product.window')({
					id : JSON.parse(_e.itemId).id,
					name : JSON.parse(_e.itemId).name
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
				var row = require('ui/categoryrow.widget')(subcategory, genderage);
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

