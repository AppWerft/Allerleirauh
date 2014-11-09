var Module = function() {
	if (!Ti.App.Properties.hasProperty('MYBASKET'))
		Ti.App.Properties.setList('MYBASKET', []);
	var props = Ti.App.Properties.listProperties();
	return this;
};

Module.prototype = {
	addArticle : function(product) {
		var list = Ti.App.Properties.getList('MYBASKET');
		Ti.App.Properties.setString('product_'+product.productNumber,JSON.stringify(product));
		list.unshift({
			id : product.productNumber
		});
		Ti.App.Properties.setList('MYBASKET', list);
		return this.getAllArticles();
	},
	getAllArticles : function() {
		var items = [],
		    basket = [];
		basket = Ti.App.Properties.getList('MYBASKET');
		basket.forEach(function(item) {
			items.push(JSON.parse(Ti.App.Properties.getString('product_' + item.id)));
		});
		return items;
	},
	removeAllArticles : function() {
		Ti.App.Properties.setString('MYBASKET', JSON.stringify([]));

	}
};
module.exports = Module;
