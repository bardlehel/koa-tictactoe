import 'babel-core/register';
import gulp from 'gulp';
import gutil from 'gulp-util';
import { spawn } from 'child_process';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';

var node;

gulp.task('transpile', ()=>
         gulp.src('src/**/*.js')
        .pipe(babel({presets: ['es2015-node5']}))
        .pipe(gulp.dest('dist')));

gulp.task('unit-tests', ()=>
        gulp.src('test/unit/**/*.js')
        .pipe(mocha({compilers: 'js:babel-core/register'})));

gulp.task('integration-tests', ()=>
        gulp.src('test/integration/**/*.js')
        .pipe(mocha({compilers: 'js:babel-core/register'})));

function startServer(cb)  {
    if (node) node.kill();
    node = spawn('node', ['dist/index.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    cb();
}

gulp.task('server-start',
    gulp.series('transpile', startServer)
);

gulp.task('start-with-tests',
    gulp.series(
        'unit-tests',
        'integration-tests',
        'server-start'
    ));

gulp.task('default', gulp.series('start-with-tests'));

process.on('exit', function() {
    if (node) node.kill();
});
