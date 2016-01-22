import gulp from 'gulp';
import gutil from 'gulp-util';
import { spawn } from 'child_process';
import babel from 'gulp-babel';


var node;

gulp.task('transpile', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015-node5']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['transpile'], function() {
    if (node) node.kill();
    node = spawn('node', ['dist/index.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

process.on('exit', function() {
    if (node) node.kill();
});

