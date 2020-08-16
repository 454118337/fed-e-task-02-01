const {src, dest, parallel, series, watch} = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
const bs = browserSync.create();

const data  = {...};

const clean = () => {
  return del(['dist', 'temp'])
}

const style = () => {
  return src(`src/assets/styles/*.scss`.styles, {
    base: 'src',
  })
    .pipe(plugins.sass({outputStyle: 'expanded'})/*忽略下划线开头的文件*/)
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

const script = () => {
  return src('src/assets/scripts/*.js'.scripts, {
    base: 'src',
  })
    .pipe(plugins.babel({presets: [require('@babel/preset-env')]}))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

const page = () => {
  return src('src/*.html'.pages, {
    base: src,
    cwd: src
  })
    .pipe(plugins.swig({data,cache:false}))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

const image = () => {
  return src('src/assets/images/**'.images, {
    base: 'src',
  })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**'.fonts, {
    base: src,
    cwd: src
  })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', {base: 'public'})
    .pipe(dest(dist))
}

const server = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html',  page)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**',
  ] ,bs.reload)
  bs.init({
    notify: false,
    port: 2080,
    // open:false,//打开浏览器
    // files: 'dist/**',//监听要改的文件
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src('temp/*.html', {base: 'temp'})
    .pipe(plugins.useref({searchPath: ['temp', '.']}))
    // html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    })))
    .pipe(dest('dist'))
}

const compile = parallel(style, script, page)


const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra)
)
const develop = series(compile, server,)
module.exports = {
  clean,
  build,
  develop,
}
