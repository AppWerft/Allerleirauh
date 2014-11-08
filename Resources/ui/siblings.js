var getProduct = function(id, callback) {
	var url = 'https://www.frontlineshop.com/api/product/' + id;
	console.log(url);
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var res = JSON.parse(this.responseText).response;
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

Module = function(options) {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : options.name,
		backgroundImage : '/assets/default.png'
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
	getProduct(options.id, function(product) {
		var views = [];
		product.siblings.forEach(function(sibling) {
			var page = Ti.UI.createView({
				hasChild : true,
				backgroundColor : 'white',
				titletext : product.name,
				layout : 'vertical'
			});
			var gallery = Ti.UI.createScrollView({
				top : 0,
				height : 300,
				width : Ti.UI.FILL,
				contentHeight : 300,
				horizontalWrap : false,
				bubbleParent : false,
				layout : 'horizontal',
				contentWidth : Ti.UI.SIZE
			});
			sibling.images.forEach(function(image) {
				gallery.add(Ti.UI.createImageView({
					left : 0,
					width : 240,
					height : 300,
					image : 'https:' + image.replace('small2','large'),
				}));
			});
			page.add(gallery);
			page.add(Ti.UI.createLabel({
				text : product.brand,
				color : '#444',
				width : Ti.UI.FILL,
				textAlign : 'left',
				top : 50,
				left : 10,
				font : {
					fontSize : 22,
					fontFamily : 'Georgia'
				}
			}));
			var priceview = Ti.UI.createView({
				backgroundImage : '/assets/price.png',
				width : 90,
				height : 45,
				right : 10,
				transform : Ti.UI.create2DMatrix({
					rotate : -5
				}),
				top : -40
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
			page.add(priceview);
			views.push(page);
		});

		if (Ti.Android) {
			var container = Ti.UI.createScrollableView({
				showPagingControl : true,
				views : views
			});
			spinner.hide();
		} else {
			var FlipView = require('org.bcbhh.IosFlipView');
			var container = FlipView.createView({
				top : 0,
				transitionDuration : 0.7,
				swipeThreshold : 40,
				transitionOrientation : 0,
				bounceRatio : 0.7,
				pages : views
			});
			setTimeout(function() {
				if (container.pageCount > 1) {
					container.changeCurrentPage(1, false);
					container.changeCurrentPage(0, true);
				}
			}, 500);
		}
		self.add(container);
	});
	if (Ti.Android) {
		self.addEventListener("open", function() {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				actionbar = activity.actionBar;
				actionbar.setDisplayHomeAsUp(true);
				actionbar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		});
	};
	return self;
};

module.exports = Module;

var exampleanswer = {
	"response" : {
		"productNumber" : "313992001",
		"name" : "Fonz Boot Suede",
		"brand" : "SOLES by ROSCOE",
		"color" : "grey",
		"price" : "€ 49,95",
		"oldPrice" : "€ 89,95",
		"items" : [{
			"sku" : "313992001_41",
			"size" : "41",
			"variantCode" : "41"
		}, {
			"sku" : "313992001_42",
			"size" : "42",
			"variantCode" : "42"
		}, {
			"sku" : "313992001_44",
			"size" : "44",
			"variantCode" : "44"
		}, {
			"sku" : "313992001_45",
			"size" : "45",
			"variantCode" : "45"
		}, {
			"sku" : "313992001_46",
			"size" : "46",
			"variantCode" : "46"
		}],
		"material" : "Obermaterial: Rauleder, Lederfutter, Kunststoffsohle",
		"longDescription" : "<span style=\"font-weight: bold;\">Nur bei frontlineshop erh&auml;ltlich: </span>Unser neues Exklusiv-Brand sorgt f&uuml;r die richtige Bodenhaftung. SOLES by ROSCOE steht f&uuml;r echte Schuhklassiker, handgefertigt in Portugal und mit viel Liebe zum Detail entworfen und angefertigt. Jeder Schuh von SOLES by ROSCOE kommt in einem fairen Preis-Leistungs-Verh&auml;ltnis und ist so angefertigt. dass er dir m&ouml;glichst lang die Treue halten m&ouml;chte.<br> Der <span style=\"font-style: italic;\">Fonz Boot</span> von SOLES by ROSCOE ist mit seiner typischen Chukka-Form ein echter Classic und mit der bequemen und inoovativ gestalteten Sohle ein Fashion-Statement f&uuml;r Individualisten. Bequem, komfortabel und begehrenswert sowie momentan in unterschiedlichen Farbvarianten zu haben. <br> <br> ",
		"images" : ["//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992001/zoom/large", "//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992001/seitenansicht/large", "//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992001/rueckenansicht/large", "//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992001/detail2/large", "//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992001/detail3/large"],
		"siblings" : [{
			"productNumber" : "313992001",
			"color" : "grey",
			"images" : ["//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992001/zoom/small2"],
			"urlInDesktopShop" : "/SOLES-BY-ROSCOE-Fonz-Boot-Suede-grey/313992001/",
			"isMinorSalePrice" : false,
			"isSalePrice" : false
		}, {
			"productNumber" : "313992002",
			"color" : "cognac",
			"images" : ["//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992002/zoom/small2"],
			"urlInDesktopShop" : "/SOLES-BY-ROSCOE-Fonz-Boot-Suede-cognac/313992002/",
			"isMinorSalePrice" : false,
			"isSalePrice" : false
		}, {
			"productNumber" : "313992003",
			"color" : "black",
			"images" : ["//media.frontlineshop.com/SOLES-BY-ROSCOE-Fonz-Boot-Suede/313992003/zoom/small2"],
			"urlInDesktopShop" : "/SOLES-BY-ROSCOE-Fonz-Boot-Suede-black/313992003/",
			"isMinorSalePrice" : false,
			"isSalePrice" : false
		}],
		"bestmatchingCategory" : {
			"name" : "Desert & Chukka",
			"parent" : {
				"name" : "Schuhe",
				"parent" : {
					"name" : "Men",
					"urlKey" : "men"
				},
				"urlKey" : "schuhe-sneaker-men"
			},
			"urlKey" : "schuhe-sneaker-desert-chukka-men"
		},
		"productDetails" : ["Stil: Chukka Boot", "Futter: Lederfutter", "vorgeformtes Fußbett", "Metallschnürösen", "2. Paar Schnürsenkel in anderer Farbe", "Logo-Emblem"],
		"isMinorSalePrice" : false,
		"isSalePrice" : true
	}
};
