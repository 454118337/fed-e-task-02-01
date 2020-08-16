// gulp 的入口文件
// 需要是异步任务

const {src, dest} = require('gulp')
const cleanCss = require('gulp-clean-css')
const reName = require('gulp-rename')

exports.default = () => {
    //文件读取流
    return src('*.css').pipe(cleanCss()).pipe(reName({extname:'.min.css'})).pipe(dest('dist'))
}