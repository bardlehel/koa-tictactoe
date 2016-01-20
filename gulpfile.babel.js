import gulp from 'gulp';
import gutil from 'gulp-util';
import { spawn } from 'child_process';
var node;


gulp.task('default', function(){
    // Default task code
});

gulp.task('server', function() {
    if (node) node.kill()
    node = spawn('node', ['index.js'], {stdio: 'inherit'})
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

process.on('exit', function() {
    if (node) node.kill()
});
