import 'babel-core/register';
import gulp from 'gulp';
import gutil from 'gulp-util';
import { spawn } from 'child_process';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';

var node;

gulp.task('transpile', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015-node5']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('run-tests', () => {
    return gulp.src('test/**/*.js')
        .pipe(mocha({
            compilers: 'js:babel-core/register'
        }))
        .once('error', () => {
            process.exit(1);
        });
});


gulp.task('server-start', ['transpile'], function() {
    if (node) node.kill();
    node = spawn('node', ['dist/index.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task('start-with-tests', ['run-tests', 'server-start']);

gulp.task('default', ['start-with-tests']);

process.on('exit', function() {
    if (node) node.kill();
});
