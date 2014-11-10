Module = function(title, subcatalogtree, genderage) {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : title,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	var container = Ti.UI.createTableView();
	self.add(container);
	var rows = [];
	subcatalogtree.forEach(function(subcategory) {
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
			color : '#666',
			width : Ti.UI.FILL,
			textAlign : 'left',
			left : 90,
			font : {
				fontSize : 22,
				fontFamily : 'DroidSans-Bold'
			}
		}));
		var thumbnail = Ti.UI.createImageView({
			image : 'https:' + subcategory.thumbnail,
			left : 0,
			top : 5,
			bottom : 5,
			defaultImage : '/assets/fls.png',
			width : 80,
			height : 100
		});
		require('vendor/cachedimage')({
			url : 'https:' + subcategory.thumbnail.replace('small1', 'large'),
			view : thumbnail
		});
		row.add(thumbnail);
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
	if (Ti.Android) {
		self.addEventListener("open", function(e) {
			var activity = self.getActivity();
			if (activity && activity.actionBar) {
				activity.actionBar.setDisplayHomeAsUp(true);
				activity.actionBar.setSubtitle(subcatalogtree.length + ' Kategorien');
				activity.actionBar.setIcon('/assets/' + genderage + 'icon.png');
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
				activity.onCreateOptionsMenu = function(e) {
					e.menu.add({
						title : 'Basket',
						showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
						icon : Ti.App.Android.R.drawable.ic_action_basket
					}).addEventListener("click", require('ui/basket.widget'));
				};
				activity.invalidateOptionsMenu();
			} else {
				console.log('Warning: windowactivity has no actionbar');
				console.log(activity);
			}
		});
	};
	return self;
};

module.exports = Module;
