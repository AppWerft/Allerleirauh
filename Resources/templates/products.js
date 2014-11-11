module.exports = {
	properties : {
		height : Ti.UI.SIZE,
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'thumbnail',
		properties : {
			top : 0,
			left : 0,
			width : 80,
			height : 100,
			defaultImage : '/assets/fls.png'
		}
	}, {

		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#555',
			width : Ti.UI.FILL,
			top : 0,
			textAlign : 'left',
			height : Ti.UI.SIZE,
			font : {
				fontSize : 22,
				fontFamily : 'DroidSans-Bold'
			},
			left : 90,
			right : 0
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'brand',
		properties : {
			color : '#555',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			left : 90,
			textAlign : 'left',
			font : {
				fontSize : 14,
				fontFamily : 'DroidSans'
			},
			bottom : 5
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'price',
		properties : {
			color : '#555',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			textAlign : 'right',
			right : 10,
			font : {
				fontSize : 22,
				fontFamily : 'SteelfishRG-Regular'
			},
			bottom : 5
		}
	}]

};
