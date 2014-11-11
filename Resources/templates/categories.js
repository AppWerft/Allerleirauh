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
		type : 'Ti.UI.View',
		properties : {
			layout : 'vertical',
			left : 100,
			top : 5,
			right : 25,
			height : Ti.UI.SIZE,
		},
		childTemplates : [{
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
				left : 0,
				right : 0
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'categories',
			properties : {
				color : '#555',
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				textAlign : 'left',
				font : {
					fontSize : 14,
					fontFamily : 'DroidSans'
				},
				top : 0,
				bottom : 5
			}
		}]
	}],
};
