module.exports = function () {
	$.gulp.task('html', function () {
		return $.gulp.src('src/*.html', {allowEmpty:true})
			.pipe($.gp.htmlmin({
				collapseWhitespace: true,
				removeComments: true,
				minifyCSS: true,
				minifyJS: true,
				minifyURLs: true,
				sortAttributes: true
			}))
			.pipe($.gulp.dest('../Nova Sandstone/'));
	});
}