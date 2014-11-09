// https://bankauswahl.giropay.de/widget/v1/autocomplete.php?term=Has&return=bic&kind=0&_=1415553552599
Module = function() {
	require('ui/billing.chooser')(function(kind) {
		var Basket = new (require('adapter/basket'))();
		var basket = Basket.getAllArticles();

		var self = Ti.UI.createWindow({
			fullscreen : true,
		});
		self.open();
		self.addEventListener("open", function() {
			if (Ti.Android) {
				var activity = self.getActivity();
				if (activity && activity.actionBar) {
					actionbar = activity.actionBar;
					actionbar.setTitle('Ausschecken');
					actionbar.setIcon('/assets/girosolution.png');
					actionbar.setSubtitle(kind);
					actionbar.setDisplayHomeAsUp(true);
					actionbar.onHomeIconItemSelected = function() {
						self.close();
					};
					activity.onCreateOptionsMenu = function(e) {
					};
				}
			}
		});
	});

};

module.exports = Module;
