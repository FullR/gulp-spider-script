"use strict";

var through = require("through2"),
	gutil = require("gulp-util"),
	spider = require("spider-script"),
	PluginError = gutil.PluginError,
	PLUGIN_NAME = "gulp-spider-script";

function compileStream(options) {
	return through(function(chunk, enc, cb) {
		cb(null, spider.compile(chunk, !!options.verbose));
	});
}

function formatError(error) {
	return ["type: " + error.type, error.message, "line " + error.loc.start.line + " column " + error.loc.start.column].join("\n");
}

// plugin level function (dealing with files)
function gulpSpiderScript(options) {
	var errors = [];
	options = options || {};

	function checkErrors() {
		if(errors.length) {
			throw new PluginError(PLUGIN_NAME, {
				message: errors.map(formatError).join("\n\n")
			});
		}
	}

	// creating a stream through which each file will pass
	var stream = through.obj(function(file, enc, cb) {
		var compiled;

		if(file.isBuffer()) {
			compiled = spider.compile(file.contents.toString(), !!options.verbose, errors);
			checkErrors();
			file.contents = new Buffer(compiled);
		}

		if(file.isStream()) {
			file.contents = file.contents.pipe(compileStream(options));
		}
		this.push(file);

		return cb();
	});

	// returning the file stream
	return stream;
};

// exporting the plugin main function
module.exports = gulpSpiderScript;