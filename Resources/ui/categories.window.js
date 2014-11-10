Module = function(title, catalogtree, genderage) {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : title
	});
	var container = Ti.UI.createTableView();
	var rows = [];
	catalogtree.response.children.forEach(function(category) {
		var row = Ti.UI.createTableViewRow({
			hasDetails : true,
			backgroundColor : 'white',
			height : Ti.UI.SIZE,
			titletext : category.name,
			itemId : JSON.stringify(category.children),
			genderage : genderage
		});
		var box = Ti.UI.createView({
			left : 100,
			top : 5,
			right : 10,
			layout : 'vertical'
		});
		row.add(box);
		box.add(Ti.UI.createLabel({
			text : category.name,
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			top : 0,
			bottom : 0,
			color : '#666',
			height : Ti.UI.SIZE,
			left : 0,
			right : 0,
			font : {
				fontSize : 22,
				fontFamily : 'DroidSans-Bold'
			}
		}));
		var subs = [];
		category.children.forEach(function(child) {
			subs.push(child.name);
		});
		box.add(Ti.UI.createLabel({
			text : subs.join(', '),
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			top : 0,
			height : Ti.UI.SIZE,
			left : 0,
			font : {
				fontSize : 14,
				fontFamily : 'DroidSans'
			}
		}));
		var thumbnail = Ti.UI.createImageView({
			image : 'https:' + category.thumbnail.replace('small2', 'small1'),
			left : 0,
			top : 0,
			top : 2,
			bottom : 2,
			defaultImage : '/assets/fls.png',
			width : 80,
			height : 100
		});
		row.add(thumbnail);
		require('vendor/cachedimage')({
			url : 'https:' + category.thumbnail.replace('small2', 'small1'),
			view : thumbnail
		});
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
