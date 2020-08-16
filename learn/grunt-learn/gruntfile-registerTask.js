// Grunt 的入口文件
// 用于定义协议需要 Grunt 自动执行的任务
// 需要导出一个函数
//接受一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt')
    })

    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task')
    })
    /* grunt.registerTask('default','任务描述',()=>{
         console.log('other task')
     })*/




    // grunt.registerTask('async-task',()=>{
    //   setTimeout(()=>{
    //       console.log('async task workding~')
    //   },1000)
    // })
    /*
    * 默认执行同步操作
    * 如果需要异步操作的话，必须使用 this.async() 得到一个回调函数
    * 在异步代码执行完需要调用 this.async() 返回的回调函数，才会被认为该任务是异步的
    */
    grunt.registerTask('async-task', function () {
        const done = this.async();
        setTimeout(() => {
            console.log('async task workding~')
            done()
        }, 1000)
    })

    // 失败任务，在函数体中 return false
    // 在任务列表中，某个任务失败了，会导致后续任务都不会执行
    // 在异步函数中，需要返回任务失败，在 this.async() 中传递 false 的实参即可
    grunt.registerTask('bad', () => {
        console.log('bad ')
        return false

    })
    grunt.registerTask('default', ['foo','bad', 'bar'])
    grunt.registerTask('async-task-1', function () {
        const done = this.async();
        setTimeout(() => {
            console.log('async task workding~')
            done(false)
        }, 1000)
    })
}