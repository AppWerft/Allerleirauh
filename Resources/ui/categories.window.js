Module = function(title, catalogtree, genderage) {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : title
	});
	var container = Ti.UI.createTableView();
	var rows = [];
	catalogtree.response.children.forEach(function(category) {
		var row = Ti.UI.createTableViewRow({
			hasChild : true,
			backgroundColor : 'white',
			height : 105,
			titletext : category.name,
			itemId : JSON.stringify(category.children),
			genderage : genderage
		});
		row.add(Ti.UI.createLabel({
			text : category.name,
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			top : 5,
			color : '#555',
			height : 25,
			left : 100,
			font : {
				fontSize : 20,
				fontFamily : 'Georgia'
			}
		}));
		var subs = [];
		category.children.forEach(function(child) {
			subs.push(child.name);
		});
		row.add(Ti.UI.createLabel({
			text : subs.join(', '),
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			top : 30,
			height : 66,
			left : 100,
			font : {
				fontSize : 14,
				fontFamily : 'Georgia'
			}
		}));
		row.add(Ti.UI.createImageView({
			image : 'https:' + category.thumbnail,
			left : 0,
			top : 0,
			top : 2,
			bottom : 2,
			width : 80,
			height : 100
		}));
		rows.push(row);
	});
	container.setData(rows);
	self.add(container);
	container.addEventListener('click', function(_e) {
		var win = require('ui/subcategories.window')(_e.row.titletext, JSON.parse(_e.row.itemId), _e.row.genderage);
		if (Ti.Android)
			win.open();
		else
			self.tab.open(win);
	});
	

	return self;
};

module.exports = Module;
