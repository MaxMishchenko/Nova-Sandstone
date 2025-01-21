module.exports = function () {
	$.gulp.task('js', function () {
		return $.gulp.src('src/js/*.js', {allowEmpty:true})
				.pipe($.gp.terser())
				.pipe($.strip())
				.pipe($.gulp.dest('../Nova Sandstone/js/'));
	});
}