module.exports = function(options) {
	if (!options.folder)
		options.folder = 'Cache';
	if (!options.url || options.view && options.view.apiName != 'Ti.UI.ImageView') {
		console.log('Warning! cannot cache');
		return;
	}
	var depot = Ti.Filesystem.externalStorageDirectory;
	var folder = Ti.Filesystem.getFile(depot, options.folder);
	if (!folder.exists())
		folders.createDirectory();
	var file = Ti.Filesystem.getFile(depot, options.folder, Ti.Utils.md5HexDigest(options.url) + '.png');
	if (file.exists() && options.view) {
		options.view = file.nativePath;
		console.log('Info: image ' + options.url + ' comes from cache');
		return;
	}
	/* now we get file and will cache */
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			if (xhr.status == 200) {
				file.write(this.responseData);
				file.remoteBackup = false;
				// for iOS
				console.log('Info: image ' + options.url + ' cached');
				if (options.view) {
					options.view = file.nativePath;
				};
			} else {
				console.log('Warning: image caching unsuccessful ' + this.status);
			}
		},
		onerror : function() {
			console.log('Warning: image caching unsuccessful ' + this.error);
		}
	});
	xhr.open('GET', options.url, true);
	xhr.send(null);
};
