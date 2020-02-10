const {dest, gulp, src, series, watch} = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const order = require('gulp-order');

//清除dist目录下的文件
function cleanJS(cb) {
    return src('./dist/js/')
        .pipe(clean())
}

//构建js,将项目下的js文件按照指定顺序打包成一个main.js，然后进行babel转化，最终输出到dist/js/main.js
function buildJS() {
    return src('./src/js/**/*.js')
        .pipe(order([
            'utils/**/*.js',
            'directives/**/*.js',
            'filter/**/*.js',
            'mixins/**/*.js',
            'svg/*.js',
            'compoment/**/*.js',
            'compoment/*.js',
            'router/**/*.js',
            'router/*.js',
            'index.js',
        ]))
        .pipe(concat("main.js"))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('./dist/js/'))
}

//构建scss,将main.scss文件转化成css代码,然后为css代码添加浏览器前缀，最终输出到/dist/css/main.css
function buildSCSS() {
    return src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            overrideBrowserslist: [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 8"
            ], grid: true
        }))
        .pipe(dest('./dist/css/'));
}
//导出任务，这个任务都是公开的，可直接用命令行执行
exports.cleanJS = cleanJS;
exports.buildJS = buildJS;
exports.buildSCSS = buildSCSS;

//监听特定目录下的js和scss文件，发生改动以后立即执行对应的构建任务
exports.default = function () {
    watch('./src/sass/**/*.scss', series('buildSCSS'));
    watch('./src/js/**/*.js', series('buildJS'));
}
