Module = function(sex) {
	var self = Ti.UI.createTabGroup({
		fullscreen : true,
		exitOnClose : true,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	var tab1 = Ti.UI.createTab({
		window : require('ui/categories.window')('Women', require('model/catalogtrees').women, 'women'),
		title : '  Ladies',
		icon : (Ti.Android) ? Ti.App.Android.R.drawable.ic_women : 'assets/women.png'
	});
	var tab2 = Ti.UI.createTab({
		window : require('ui/categories.window')('Men', require('model/catalogtrees').men, 'men'),
		title : '  Gentlemen',
		icon : (Ti.Android) ? Ti.App.Android.R.drawable.ic_men : 'assets/men.png'
	});
	self.addTab(tab2);
	self.addTab(tab1);
	self.open();
	Ti.Android && self.addEventListener('open', function() {
		var activity = self.getActivity();
		if (!activity.actionBar)
			return;
		activity.onCreateOptionsMenu = function(e) {
			e.menu.add({
				title : 'Share',
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				icon : Ti.App.Android.R.drawable.ic_action_share
			}).addEventListener("click", function() {
				var img = self.toImage().media;
				var fileToShare = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'tempimage.jpg');
				fileToShare.write(img);
				require('vendor/socialshare').share({
					status : 'Finde ich gut: Frontlinestore',
					image : fileToShare.nativePath,
					androidDialogTitle : 'Sharing …'
				});
			});
			e.menu.add({
				title : 'Basket',
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
				icon : Ti.App.Android.R.drawable.ic_action_basket
			}).addEventListener("click", require('ui/basket.widget'));

		};
		activity.invalidateOptionsMenu();
	});

};

module.exports = Module;

