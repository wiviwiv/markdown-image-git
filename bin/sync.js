#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const minimist = require('minimist')

const md = require('../')

function help(error) {

  if (error) {
    console.error('\n\n参数错误：', error)
  }

  console.log(`
markdown-image-git 将你 markdown 中的图片上传至一个文件托管仓库

可用参数：

-c/--config   使用配置文件

-p/--path     markdown 目录，默认当前目录

-f/--file     markdown 文件，默认 README.md

-t/--token    github token 详见 https://github.com/settings/tokens

-r/--repos    静态图片用户/仓库名如 wiviwiv/raw_images

-b            仓库分支，默认 master 

-d            图片在仓库中的目录，如 /images/markdown， 默认 _images

-m/--message  提交的 git 消息

-H/--help     显示帮助
    `)
}

function start(args) {
  args = minimist(args, {
    string: ['path', 'doc', 'token', 'repos', 'branch', 'dir', 'message', 'config', 'c', 'p', 'f', 'file', 't', 'b', 'd', 'm', 'H'],
    boolean: ['help'],
    alias: {
      path: 'p',
      doc: ['f', 'file'],
      token: 't',
      repos: 'r',
      branch: 'b',
      dir: 'd',
      message: 'm',
      help: 'H',
      config: 'c'
    },
    default: {
      path: process.cwd(),
      doc: 'README.md',
      branch: 'master',
      dir: '_images',
      message: 'from markdown-image-git'
    }
  })

  if (args.help) {
    help()
    return
  }

  if (args.config) {
    try {
      const filePath = path.resolve(process.cwd(), args.config)
      if (!fs.existsSync(filePath)) {
        throw new Error('文件不存在')
      }
      const conf = require(filePath)
      Object.assign(args, conf)
    } catch (e) {
      return help(`${args.config} 加载失败: ${e.message}`)
    }
  }

  if (!args.token || !args.repos) {
    help(`请填写${args.token ? '仓库地址' : 'github token'}`)
    return
  }
  if (!args.repos.includes('/')) {
    return help('仓库地址不正确')
  }
  if (args.dir.startsWith('/')) {
    help('目录不能以 / 开头')
    return
  }
  args.basePath = args.path
  md(args)
}

start(process.argv.slice(2))