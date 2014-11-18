A simple gulp plugin for compiling Spiderscript files.

For more information about Spiderscript, see: https://github.com/alongubkin/spider

Example use:

	var gulp = require("gulp"),
		spider = require("gulp-spider-script");

	gulp.task("javascript", function() {
		return gulp.src("./my-file.spider")
			.pipe(spider())
			.pipe(gulp.dest("destination-dir"));
	});

TODO:

Add source map support