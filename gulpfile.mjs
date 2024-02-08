// const gulp = require('gulp');
// const { dest, series, src } = require('gulp');
// const sass = require('gulp-sass');
// const cssnano = require('gulp-cssnano');
// const rev = require('gulp-rev');
import gulp from 'gulp';
// import { dest, series, src }  from 'gulp';
// import sass from 'gulp-sass' ;
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import {deleteAsync} from 'del';
// import {del} from 'del';
// var sass = require('gulp-sass')(require('sass'));
import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';

gulp.task('css',function(done){
    console.log('minifyying css .. ');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:"public",
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js',function(done){
    console.log('minifyying js .. ');
     return gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:"public",
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    
    
});

gulp.task('images',function(done){
    console.log('minifyying images .. ');
    return gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:"public",
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// empty the public/assets directory
 gulp.task('clean:assets',async function(done){
    await deleteAsync('./public/assets');
    done();
});

gulp.task('build',gulp.series('clean:assets','images','css','js'),function(done){
    console.log("Building assets");
    done();
});