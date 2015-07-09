'use strict';

var gulp         = require('gulp')
  , less         = require('gulp-less')
  , autoprefixer = require('gulp-autoprefixer')
  , rename       = require('gulp-rename')
  , notify       = require('gulp-notify')
  , gulpPlugins  = require('gulp-load-plugins')()
;

var config = {
    styles: 'src/styles',
    panel: ['src/CSXS/**/*', 'src/images/*', 'src/js/**/*.js', 'src/Icon.png', 'src/index.html', 'src/.debug'],
};

gulp.task('dist', [], function() {

	gulp.src('bower_components/adobe-cep/CEP_6.x/CSInterface.js')
		.pipe(rename('CSInterface6.js'))
		.pipe(gulp.dest('dist/js'))
	;

	gulp.src('bower_components/adobe-cep/CEP_5.x/CSInterface.js')
		.pipe(rename('CSInterface5.js'))
		.pipe(gulp.dest('dist/js'))
	;

	return gulp.src(config.panel, { base: 'src' })
		.pipe(gulpPlugins.filter(['**/*', '!js/app.js']))
		.pipe(gulp.dest('dist'))
	;
});

gulp.task('concat', function() {
    return gulp.src([
			'bower_components/jquery/jquery.min.js',
			'src/js/app.js'
		])
		.pipe(gulpPlugins.concat('all.js'))
		.pipe(gulp.dest('dist/js'))
	;
});

gulp.task('styles', function() {
    return gulp.src(config.styles + '/savepanel.less')
				.pipe(less({paths: config.styles}))
				.pipe(autoprefixer('last 2 version'))
				.pipe(rename({ basename: 'app' }))
				.pipe(gulp.dest('dist/styles'))
				.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('watch', [], function() {

	gulp.watch(['./src/styles/**/*.less'], ['styles']);
	gulp.watch(['./src/js/**/*.js'], ['concat']);
	gulp.watch([
			'./src/images/*',
			'./src/*.html',
		], ['dist']);
});

gulp.task('default', ['styles', 'concat', 'dist'], function() {
	// place code for your default task here
});
