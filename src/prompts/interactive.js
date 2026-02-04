const inquirer = require('inquirer');
const chalk = require('chalk').default;

/**
 * 提示用户输入缺失的选项
 * @param {object} options - 已提供的选项
 * @returns {Promise<object>} 完整的选项对象
 */
async function promptForMissingOptions(options) {
  const prompts = [];

  // 如果没有项目名称，提示输入
  if (!options.projectName) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称:',
      default: 'my-project',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return '项目名称不能为空';
        }
        return true;
      }
    });
  }

  // 如果没有模式，提示选择
  if (!options.mode) {
    prompts.push({
      type: 'list',
      name: 'mode',
      message: '在哪里创建?',
      choices: [
        { name: '新建文件夹 (推荐)', value: 'new' },
        { name: '当前目录', value: 'current' }
      ],
      default: 'new'
    });
  }

  // 如果没有权限模板，提示选择
  if (!options.permission) {
    prompts.push({
      type: 'list',
      name: 'permission',
      message: '选择权限模板:',
      choices: [
        { name: '平衡模式 - 平衡安全性和便利性 (推荐)', value: 'balanced' },
        { name: '保守模式 - 最小权限，适合敏感项目', value: 'conservative' },
        { name: '激进模式 - 最大权限，适合个人项目', value: 'permissive' }
      ],
      default: 'balanced'
    });
  }

  // 如果没有 claude.md 模板且没有自定义内容，提示选择
  if (!options.claudeMdTemplate && !options.claudeMdContent && !options.claudeMdFile) {
    prompts.push({
      type: 'list',
      name: 'claudeMdTemplate',
      message: '选择 claude.md 内容:',
      choices: [
        { name: '默认模板 - 通用开发规范', value: 'default' },
        { name: '完整功能 - 包含所有功能说明', value: 'full-featured' },
        { name: '极简模板 - 最小化配置', value: 'minimal' },
        { name: '自定义内容 - 手动输入', value: 'custom' }
      ],
      default: 'default'
    });
  }

  // 如果用户选择自定义，提示输入内容
  const existingAnswers = {};
  if (prompts.length > 0) {
    const answers = await inquirer.prompt(prompts);

    // 如果选择了自定义内容
    if (answers.claudeMdTemplate === 'custom') {
      const customAnswer = await inquirer.prompt([
        {
          type: 'editor',
          name: 'claudeMdContent',
          message: '请输入自定义 claude.md 内容:',
          default: '# 项目配置\n\n## 项目概述\n[描述项目]\n'
        }
      ]);
      existingAnswers.claudeMdContent = customAnswer.claudeMdContent;
    }

    return { ...options, ...answers, ...existingAnswers };
  }

  return options;
}

/**
 * 提示用户确认配置
 * @param {object} config - 配置对象
 * @returns {Promise<boolean>} 用户是否确认
 */
async function promptForConfirmation(config) {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `确认创建配置?\n  项目路径: ${chalk.green(config.projectPath)}\n  权限模板: ${chalk.yellow(config.permission)}\n  claude.md: ${chalk.yellow(config.claudeMdTemplate || 'custom')}`,
      default: true
    }
  ]);

  return answers.confirmed;
}

module.exports = {
  promptForMissingOptions,
  promptForConfirmation
};
