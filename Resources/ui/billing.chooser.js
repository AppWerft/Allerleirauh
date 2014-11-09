module.exports = function(_cb) {
	var items = [{
		label : 'giropay',
		icon : 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTfMgcyob-Vi8MrVWTo--7LmT-3IMvwpbj0k-7p2A3U6fPPYbt6lvQA5PYA'
	}, {
		label : 'Lastschrift',
		icon : '/assets/ec.png',
	}, {
		label : 'PayPal',
		icon : '/assets/paypal.png',
	}, {
		label : 'Kreditkarte',
		icon : '/assets/card.png'
	}, {
		label : 'Nachnahme',
		icon : '/assets/nachnahme.png',
	}];
	var rows = [];
	items.forEach(function(item) {
		var row = Ti.UI.createTableViewRow({
			itemId : item.label
		});
		row.add(Ti.UI.createImageView({
			image : item.icon,
			left : 5,
			top : 5,
			bottom : 5,
			width : 80,
			height : 40
		}));
		row.add(Ti.UI.createLabel({
			text : item.label,
			left : 110,
			font : {
				fontFamily : 'DroidSans',
				fontSize : 20
			}
		}));
		rows.push(row);
	});
	var androidview = Ti.UI.createTableView({
		data : rows
	});
	androidview.addEventListener('click', function(_e) {
		_cb(_e.rowData.itemId);dialog.hide();
	});
	var dialog = Ti.UI.createOptionDialog({
		androidView : androidview,
		title : 'Wähle ein Zahlmittel'
	});
	dialog.show();

};
