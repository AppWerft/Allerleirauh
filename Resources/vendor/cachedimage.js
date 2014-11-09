module.exports = function(options) {
	if (!options.folder)
		options.folder = 'Cache';
	if ( !options.url || options.view && options.view.apiName != 'Ti.UI.ImageView')
		return;
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, options.folder, Ti.Utils.md5HexDigest(options.url));
	var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, options.folder);
	if (!g.exists()) {
		g.createDirectory();
	};
	var xhr = Ti.Network.createHTTPClient();
	xhr.onload = function() {
		if (xhr.status == 200) {
			file.write(xhr.responseData);
			file.remoteBackup = false;
			options.view && (options.view = file.nativePath);
		};
	};
	xhr.open('GET', options.url);
	xhr.send();

};
