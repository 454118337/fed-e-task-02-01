// Grunt 的入口文件
// 用于定义协议需要 Grunt 自动执行的任务
// 需要导出一个函数
//接受一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

module.exports = grunt => {
    grunt.initConfig({
        clean:{
            temp:'temp/**' //所有的子目录以及子目录的文件
        }
    })
    grunt.loadNpmTasks('grunt-contrib-clean')
    // grunt.registerMultiTask('build',function () {
    //
    // })
}