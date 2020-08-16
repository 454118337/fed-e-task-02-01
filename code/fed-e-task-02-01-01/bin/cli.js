#!/usr/bin/env node


/*
* 需求说明：
* 创建一个简易的 node 脚手架实现类似 plop 的文件快捷创建
* 1.基于 react dva 项目下的要求
* 2.页面文件需要支持创建 index.js style.scss model.js
* 3.组件文件需要支持创建 index.js style.scss
* 4.工具类文件需要支持创建 {{name}}.js
* */


/*
* 实现思路
* 1.创建模板文件，根据不同的文件类型使用不同的模板文件
*   components(index.js、style.scss)
*   pages(index.js、style.scss、model.js)
*   utils(index.js)
* 2.创建命令行交互时需要询问的内容
*   ⑴.询问填写文件名称 默认为 pageName
*   ⑵.询问填写文件路径 默认路径为 src/components
*   ⑶.询问选择文件类型 默认为组件文件
* 3.判断文件路径是否存在，不存在则创建文件路径
* 4.获取模板目录
* 5.获取命令行交互信息，解构信息内容获取文件类型
* 6.根据不同类型获取模板目录不同文件
* 7.生成文件到指定目录
* */


const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')


inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: '文件名称',
        default: 'pageName'
    },
    {
        type: 'input',
        name: 'targetPath',
        message: '文件路径',
        default: 'src/components'
    },
    {
        type: 'list',
        name: 'type',
        message: '请选择文件类型',
        choices: [
            {name: '组件文件', value: 'components'},
            {name: '页面文件', value: 'pages'},
            {name: '工具文件', value: 'utils'},
        ],
        default: 'components'
    }
])
    .then(anwsers => {
        // console.log(anwsers)
        //解构命令行交互信息内容获取文件类型
        let {name, targetPath, type} = anwsers;
        //判断目标路径是否含有 src
        targetPath = targetPath.includes('src/') ? `${targetPath}/${name}` : `src/${targetPath}/${name}`

        //获取模板目录
        const tmplDir = path.join(process.cwd(), 'templates', type)

        //判断文件夹是否存在，不存在则创建文件夹
        if (!fs.existsSync(path.dirname(targetPath))) {
            try {
                fs.mkdirSync(targetPath, {recursive: true});
            } catch (e) {
                throw e
            }
        }

        //读取文件
        fs.readdir(tmplDir, (err, files) => {
            if (err) throw err

            files.forEach(file => {
                //写入的文件路径
                const writePath = path.join(targetPath, file);
                //通过模板引擎渲染文件
                ejs.renderFile(path.join(tmplDir, file), {name}, (err, result) => {
                    if (err) throw err
                    //将结果写入文件
                    try {
                        fs.writeFileSync(writePath, result)
                    } catch (e) {
                        throw e
                    }
                })
            })
        })
    })