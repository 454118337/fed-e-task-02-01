// Grunt 的入口文件
// 用于定义协议需要 Grunt 自动执行的任务
// 需要导出一个函数
//接受一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

module.exports = grunt => {
    grunt.initConfig({
        build:{
            options:{
                foo:'bar',
            }, //会以配置选项呈现
            css:{
                options:{
                    foo:'baz',
                }
            },
            js:'2'
        }
    })
    grunt.registerMultiTask('build',function () {
        console.log(this.options())
        console.log(`target ${this.target},data: ${this.data}`)
    })
}