// 实现这个项目的构建任务

/*
* 实现思路
* 1.根据 package.json ,需要导出的方法有 clean lint serve build start deploy
* 2.创建基础方法 styles scripts pages images fonts extra
* 3.lint 方法为校验方法 将对*.js *.scss 进行语法校验
*   gulp-sass-lint:https://www.npmjs.com/package/gulp-sass-lint
*   gulp-eslint:https://www.npmjs.com/package/gulp-eslint
* 4.实现 serve 方法，并对文件修改进行监听
* 5.实现  build 及 start 方法
* 6.deploy 方法可传参数，参数将作用于生产环境的配置并进行项目发布
* 7.扩展配置，使 serve 及 start 方法可配置端口号：port，是否自动打开浏览器：open
* */

const {src, dest, parallel, series, watch} = require('gulp')
const del = require('del')
const browserSync = require('browser-sync')
const bs = browserSync.create()
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const {sass, babel, swig, imagemin, ghPages, eslint, sassLint} = plugins
const config = {
  production: false,
  port: 7001,
  open: false,
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}
const isMini = () => config.production

const handleConfig = () => {
  const argv = process.argv
  const task = argv[2]
  if (task === 'serve') {
    // serve 为开发环境，所有 config.production 一定为false
    // 根据参数对端口号及是否自动打开浏览器进行配置
    config.production = false
    config.open = argv.includes('--open')
    config.port = argv.includes('--port') && parseInt(argv[argv.indexOf('--port') + 1], 10) || 7001
    config.root = config.build.temp
  } else if (task === 'build') {
    // build 为代码打包，如有 --production || --prod 则任务时生产环境的包
    config.production = argv.includes('--production') || argv.includes('--prod')
  } else if (task === 'start') {
    config.open = argv.includes('--open')
    config.port = argv.includes('--port') && parseInt(argv[argv.indexOf('--port') + 1], 10) || 7001
    config.root = config.build.dist
  } else if (task === 'deploy') {
    // deploy 为生产环境的包，并有自动发布
    config.production = true
    config.production = argv.includes('--production')
    config.branch = argv.includes('--branch') && argv[argv.indexOf('--branch') + 1] || 'gh-pages'
  }
}

handleConfig()

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

// 清除文件 可将需要清除的文件以数组的元素进行传递
const clean = () => {
  return del([config.build.dist, config.build.temp])
}
// 检查 js 语法
const myeslint = () => {
  return src([config.build.paths.scripts])
    .pipe(eslint({
      rules: {
        'strict': 2,
      },
      globals: [ //指定要声明的全局变量。
        "window",
        "document",
        'jQuery',
        '$'
      ],
      envs: [ // 指定要应用的环境列表 此处为浏览器。
        'browser'
      ],
      parser: "babel-eslint"
    }))
    .pipe(eslint.format())
}
// 检查 scss 语法
const mysasslint = () => {
  return src([config.build.paths.styles])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
}
// 创建 scss 编译方法
// sass() 方法默认不编译以 _ 开头的的scss文件
// { outputStyle: 'expanded' } 可将转换文件全部展开，个人不喜欢，所有不用
const styles = () => {
  return src(config.build.paths.styles, {base: config.build.src, cwd: config.build.src})
    .pipe(sass())
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({stream: true}))
}
// 创建 js 编译方法
const scripts = () => {
  return src(config.build.paths.scripts, {base: config.build.src, cwd: config.build.src})
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({stream: true}))
}
// 创建 HTML 编译方法
const pages = () => {
  return src(config.build.paths.pages, {base: config.build.src, cwd: config.build.src})
    .pipe(swig({data, defaults: {cache: false}})) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({stream: true}))
}
// 创建 image 文件压缩方法
const images = () => {
  return src(config.build.paths.images, {base: config.build.src, cwd: config.build.src})
    .pipe(imagemin())
    .pipe(dest(config.build.dist))
}
// 创建 font 文件压缩方法
const fonts = () => {
  return src(config.build.paths.fonts, {base: config.build.src, cwd: config.build.src})
    .pipe(imagemin())
    .pipe(dest(config.build.dist))
}
//导入其他文件
const extra = () => {
  return src('**', {base: config.build.public, cwd: config.build.public})
    .pipe(dest(config.build.dist))
}
// 创建开发服务器方法
const browser = () => {
  //使用 watch 监听文件变化，并相应的执行编译方法
  watch(config.build.paths.styles, styles)
  watch(config.build.paths.scripts, scripts)
  watch(config.build.paths.pages, pages)
  // 静态类文件开发环境不需要编译，直接 bs.reload 即可
  watch([
    config.build.paths.images,
    config.build.paths.fonts,
  ], {cwd: config.build.src},bs.reload)
  watch([
    '**',
  ], {cwd: config.build.public}, bs.reload)
  //初始化服务器
  bs.init({
    notify: false, //不显示在浏览器中的任何通知。
    port: config.port, //设置端口号
    open: config.open, // 是否打开浏览器
    server: {
      baseDir: [config.root, config.build.src, config.build.public], // 按顺序查找
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
// 对文件进行压缩
// 开发环境不对 html 进行压缩，开发环境需要对 html 进行压缩。
// isMini() 返回 config.production 进行判断
const useref = () => {
  return src(config.build.paths.pages, {base: config.build.temp, cwd: config.build.temp})
    .pipe(plugins.useref({searchPath: [config.build.temp, '.']}))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: isMini(),
      minifyCSS: isMini(),
      minifyJS: isMini()
    })))
    .pipe(dest(config.build.dist))
}
// 项目发布
const mydeploy = () => {
  return src('dist/**/*')
    .pipe(ghPages([{
      branch: config.branch
    }]))
}

const lint = parallel(myeslint, mysasslint)

const compile = parallel(styles, scripts, pages)

const serve = series(compile, browser)

const build = series(
  clean,
  parallel(
    series(compile, useref),
    images,
    fonts,
    extra
  )
)

const start = series(build, browser)

const deploy = series(build, mydeploy)

module.exports = {
  clean,
  compile,
  build,
  serve,
  start,
  deploy,
  lint,
}