#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const { main } = require('../src/index');

// 设置命令行程序
program
  .name('claude-starter')
  .description('快速初始化 Claude Code 配置的脚手架工具')
  .version('1.0.0')
  .argument('[project-name]', '项目名称（在 --mode=new 时必需）')
  .option('-m, --mode <mode>', '创建模式: new | current', 'new')
  .option('-p, --permission <type>', '权限模板: permissive | balanced | conservative', 'balanced')
  .option('-c, --claude-md <text>', '自定义 claude.md 内容')
  .option('-f, --claude-md-file <path>', '从文件读取 claude.md')
  .option('-t, --template <name>', 'claude.md 模板: default | full-featured | minimal', 'default')
  .option('-y, --yes', '跳过交互式确认', false)
  .option('--force', '强制覆盖已存在的配置', false)
  .action((projectName, options) => {
    main(projectName, options).catch((error) => {
      console.error('错误:', error.message);
      process.exit(1);
    });
  });

program.parse();
