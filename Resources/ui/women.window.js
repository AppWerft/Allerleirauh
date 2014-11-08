Module = function() {
	var self = Ti.UI.createWindow({
		fullscreen : true,
	});
	var container = Ti.UI.createTableView();
	var rows = [];
	data.response.children.forEach(function(child) {
		console.log(child);
		var row = Ti.UI.createTableViewRow({
			hasChild : true,
			backgroundColor : 'white',
			height : 100,
			itemId : JSON.stringify(child.children)
		});
		row.add(Ti.UI.createLabel({
			text : child.name,
			color : '#444',
			width : Ti.UI.FILL,
			textAlign : 'left',
			left : 100,
			font : {
				fontSize : 22
			}
		}));
		row.add(Ti.UI.createImageView({
			image : 'https:'+child.children[0].thumbnail,
			left : 0,
			top : 0,
			width : 100,
			height : 100
		}));
		rows.push(row);
	});
	container.setData(rows);
	self.add(container);
	return self;
};

module.exports = Module;
