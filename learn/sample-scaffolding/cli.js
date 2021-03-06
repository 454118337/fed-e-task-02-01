#!/usr/bin/env node

// Node CLI 应用入口文件必须有这样的文件头

//脚手架的工作过程

// 1.通过命令行交互询问用户问题
// 2.根据用户回答的结果生成文件
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Project name'
}])
    .then(anwsers => {
        // console.log(anwsers)
        //模板目录
        const tmplDir = path.join(__dirname, 'templates')
        //目标目录
        const destDir = process.cwd()

        // 将模板下的文件全部输出到目标目录

        fs.readdir(tmplDir, (err, files) => {
            if (err) throw err
            files.forEach(file => {
                //t通过模板引擎渲染文件
                ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
                    if (err) throw err
                    //将结果写入文件
                    fs.writeFileSync(path.join(destDir,file),result)
                })
            })
        })
    })