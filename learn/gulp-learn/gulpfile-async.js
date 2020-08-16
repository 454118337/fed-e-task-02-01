// gulp 的入口文件
// 需要是异步任务

const fs = require('fs')


exports.callback = done => {
    console.log('callback task~')
    done();
}

exports.callback_error = done => { // 错误优先
    console.log('callback task~')
    done(new Error('task failed'));
}

exports.promise = () => {
    console.log('promise task~')
    return Promise.resolve()
}
exports.promise_error = () => {
    console.log('promise task~')
    return Promise.reject(new Error('task failed'))
}

const timeout = time => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}

exports.async = async () => {
    await timeout(1000)
    console.log(fs)
}

exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt');
    readStream.pipe(writeStream);
    return readStream
}
exports.stream_1 = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt');
    readStream.pipe(writeStream);
    readStream.on('end',()=>{
        done()
    })
}