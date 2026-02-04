const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const { validateProjectName, backupFile } = require('./utils/file-handler');
const { writeConfigFiles, readClaudeMdFromFile } = require('./generators/config-generator');
const { promptForMissingOptions, promptForConfirmation } = require('./prompts/interactive');

/**
 * 主函数
 * @param {string} projectName - 项目名称
 * @param {object} options - 命令行选项
 * @returns {Promise<void>}
 */
async function main(projectName, options) {
  try {
    // 1. 解析和验证选项
    let finalOptions = { projectName, ...options };

    // 2. 如果参数不足，启动交互式问答
    if (!options.yes) {
      finalOptions = await promptForMissingOptions(finalOptions);
    }

    // 3. 验证项目名称（如果提供）
    if (finalOptions.projectName) {
      const validation = validateProjectName(finalOptions.projectName);
      if (!validation.valid) {
        console.error(chalk.red(`错误: ${validation.error}`));
        process.exit(1);
      }
    }

    // 4. 确定目标路径
    const targetPath = resolveTargetPath(finalOptions.mode, finalOptions.projectName);

    // 5. 检查是否已存在配置
    const existingConfigPath = path.join(targetPath, '.claude', 'settings.local.json');
    const configExists = await fs.pathExists(existingConfigPath);

    if (configExists && !options.force) {
      if (!options.yes) {
        console.log(chalk.yellow('⚠️  检测到已存在的 .claude 配置'));

        const answers = await require('inquirer').prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: '是否覆盖现有配置？(会创建备份)',
            default: false
          }
        ]);

        if (!answers.overwrite) {
          console.log(chalk.gray('操作已取消'));
          return;
        }
      }

      // 备份现有配置
      const spinner = ora('正在备份现有配置...').start();
      await backupFile(existingConfigPath);
      spinner.succeed('已备份现有配置');
    }

    // 6. 处理自定义 claude.md 文件
    let customClaudeMdContent = null;
    if (finalOptions.claudeMdFile) {
      customClaudeMdContent = await readClaudeMdFromFile(finalOptions.claudeMdFile);
    } else if (finalOptions.claudeMd) {
      customClaudeMdContent = finalOptions.claudeMd;
    }

    // 7. 确认配置（如果不是 --yes 模式）
    if (!options.yes) {
      const confirmed = await promptForConfirmation({
        projectPath: targetPath,
        permission: finalOptions.permission,
        claudeMd: finalOptions.template || (customClaudeMdContent ? 'custom' : 'default')
      });

      if (!confirmed) {
        console.log(chalk.gray('操作已取消'));
        return;
      }
    }

    // 8. 生成配置文件
    const spinner = ora('正在生成配置文件...').start();
    await writeConfigFiles(targetPath, {
      settingsTemplate: finalOptions.permission,
      claudeMdTemplate: finalOptions.template,
      customClaudeMdContent
    });
    spinner.succeed('配置文件已生成');

    // 9. 显示成功信息
    printSuccessMessage(targetPath);
  } catch (error) {
    console.error(chalk.red('错误:'), error.message);
    throw error;
  }
}

/**
 * 解析目标路径
 * @param {string} mode - 创建模式
 * @param {string} projectName - 项目名称
 * @returns {string} 目标路径
 */
function resolveTargetPath(mode, projectName) {
  if (mode === 'current') {
    return process.cwd();
  } else if (mode === 'new' && projectName) {
    return path.resolve(process.cwd(), projectName);
  } else {
    throw new Error('无法确定目标路径');
  }
}

/**
 * 打印成功信息
 * @param {string} targetPath - 目标路径
 */
function printSuccessMessage(targetPath) {
  console.log('');
  console.log(chalk.green('✓ 配置创建成功!'));
  console.log('');
  console.log(chalk.gray('配置位置:'), chalk.cyan(targetPath));
  console.log('');
  console.log(chalk.gray('下一步:'));
  console.log(`  ${chalk.white('cd')} ${path.relative(process.cwd(), targetPath) || '.'}`);
  console.log(`  ${chalk.white('# 开始使用 Claude Code')}`);
  console.log('');
}

module.exports = { main };
