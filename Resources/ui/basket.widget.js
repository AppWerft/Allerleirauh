Module = function() {
	var Basket = new (require('adapter/basket'))();
	var basket = Basket.getAllArticles();
	if (basket.length == 0) {
		Ti.Android && Ti.UI.createNotification({
			message : 'Dein Wagen ist noch leer.',
			duration : 3000
		}).show();
	} else {
		console.log('Info: basket window will be open');
		var menu;
		var self = Ti.UI.createWindow({
			fullscreen : true,
		});
		var container = Ti.UI.createTableView({
			bottom : 50
		});
		var rows = [];
		self.add(container);
		basket.forEach(function(item) {
			rows.push(require('ui/basket.row')(item));
		});
		container.setData(rows);
		container.addEventListener('longpress', function(_e) {
			alert('Mächtest Du „' + basket[_e.index].name + '“ wirklich aus dem Warenkorb entfernen?');

		});
		if (Ti.Android) {
			Ti.UI.createNotification({
				message : 'Mit langem Drücken kansnt Du den Warenkorb bearbeiten'
			}).show();
			self.addEventListener("open", function() {
				var activity = self.getActivity();
				if (activity && activity.actionBar) {
					actionbar = activity.actionBar;
					actionbar.setTitle('Dein Warenkorb');
					actionbar.setSubtitle(basket.length + 'Teile');
					actionbar.setDisplayHomeAsUp(true);
					actionbar.onHomeIconItemSelected = function() {
						self.close();
					};
					activity.onCreateOptionsMenu = function(e) {
						e.menu.add({
							title : 'Wech!',
							showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
							icon : Ti.App.Android.R.drawable.ic_action_trash
						}).addEventListener("click", function() {

						});
						e.menu.add({
							title : 'Kasse',
							showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
							icon : Ti.App.Android.R.drawable.ic_action_pos
						}).addEventListener("click", function() {

						});
					};
				}
			});
		};

		self.open();

	}

};

module.exports = Module;
