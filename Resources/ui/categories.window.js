Module = function(title, catalogtree, genderage) {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : title
	});
	var container = Ti.UI.createListView({
		templates : {
			'template' : require('templates/categories')
		},
		defaultItemTemplate : 'template',
		sections : [Ti.UI.createListSection()]
	});
	var dataitems = [];
	catalogtree.response.children.forEach(function(category) {
		var subs = [];
		category.children.forEach(function(child) {
			subs.push(child.name);
		});
		var payload = {
			children : category.children,
			name : category.name,
			genderage : genderage
		};
		var item = {
			properties : {
				itemId : JSON.stringify(payload),
				accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
			},
			thumbnail : {
				image : 'https:' + category.thumbnail.replace('small2', 'small1')
			},
			title : {
				text : category.name
			},
			categories : {
				text : subs.join(', ')
			}
		};
		dataitems.push(item);
	});
	container.sections[0].setItems(dataitems);
	self.add(container);
	container.addEventListener('itemclick', function(_e) {
		var payload = JSON.parse(_e.itemId);
		var win = require('ui/subcategories.window')(payload.name, payload.children, payload.genderage);
		if (Ti.Android)
			win.open();
		else
			self.tab.open(win);
	});
	return self;
};

module.exports = Module;
