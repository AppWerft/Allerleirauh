module.exports = function(options) {
	if (!options.folder)
		options.folder = 'Cache';
	if (!options.url || options.view && options.view.apiName != 'Ti.UI.ImageView')
		return;
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, options.folder, Ti.Utils.md5HexDigest(options.url));
	if (file.exists()) {
		options.view && (options.view = file.nativePath);
		console.log('Info: image ' + options.url + ' comes from cache');
		return;
	}
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, options.folder);
	if (!g.exists())
		g.createDirectory();
	/* now we get file and will cache */
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			if (xhr.status == 200) {
				file.write(xhr.responseData);
				file.remoteBackup = false;
				// for iOS
				console.log('Info: image ' + options.url + ' cached');
				options.view && (options.view = file.nativePath);
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
