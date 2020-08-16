// gulp 的入口文件
// 需要是异步任务

const {series, parallel} = require('gulp')

const task1 = done => {
    setTimeout(() => {
        console.log('task1 working~')
        done()
    }, 1000)
}
const task2 = done => {
    setTimeout(() => {
        console.log('task2 working~')
        done()
    }, 1000)
}
const task3 = done => {
    setTimeout(() => {
        console.log('task3 working~')
        done()
    }, 1000)
}

exports.foo = series(task1,task2,task3) // 串行模式  适合需要顺序的任务执行 如编译打包
exports.bar = parallel(task1,task2,task3) //并行模式 适合互不影响的任务执行 如编译js、编译scss