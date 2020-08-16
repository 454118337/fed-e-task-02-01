// gulp 的入口文件
// 需要是异步任务
exports.foo = done => {
    console.log('foo task working')
    done() // 标识任务完成
}

exports.default  = done =>{
    console.log('wyc')
    done()
}

const gulp = require('gulp');

gulp.task('bar',done=>{
    console.log('xxl')
    done();
})