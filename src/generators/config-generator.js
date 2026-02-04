const fs = require('fs-extra');
const path = require('path');

/**
 * 生成 settings.local.json 配置
 * @param {string} templateName - 模板名称 (conservative, balanced, permissive)
 * @param {object} customOptions - 自定义配置选项
 * @returns {object} 配置对象
 */
function generateSettingsConfig(templateName = 'balanced', customOptions = {}) {
  const templatePath = path.join(__dirname, '../templates/settings', `${templateName}.json`);

  let config = fs.readJsonSync(templatePath);

  // 合并自定义选项
  config = { ...config, ...customOptions };

  return config;
}

/**
 * 生成 claude.md 内容
 * @param {string} templateName - 模板名称 (default, minimal, full-featured)
 * @param {string} customContent - 自定义内容
 * @returns {Promise<string>} claude.md 内容
 */
async function generateClaudeMd(templateName = 'default', customContent = null) {
  // 如果提供了自定义内容，直接返回
  if (customContent !== null) {
    return customContent;
  }

  const templatePath = path.join(__dirname, '../templates/claude-md', `${templateName}.md`);
  const content = await fs.readFile(templatePath, 'utf-8');

  return content;
}

/**
 * 从文件读取 claude.md 内容
 * @param {string} filePath - 文件路径
 * @returns {Promise<string>} 文件内容
 */
async function readClaudeMdFromFile(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * 写入配置文件
 * @param {string} targetPath - 目标路径
 * @param {object} options - 配置选项
 * @returns {Promise<void>}
 */
async function writeConfigFiles(targetPath, options) {
  const { settingsTemplate, claudeMdTemplate, customClaudeMdContent } = options;

  // 创建 .claude 目录
  const claudeDir = path.join(targetPath, '.claude');
  await fs.ensureDir(claudeDir);

  // 生成并写入 settings.local.json
  const settingsConfig = generateSettingsConfig(settingsTemplate, options.customSettingsOptions);
  const settingsPath = path.join(claudeDir, 'settings.local.json');
  await fs.writeJson(settingsPath, settingsConfig, { spaces: 2 });

  // 生成并写入 claude.md
  const claudeMdContent = customClaudeMdContent
    ? customClaudeMdContent
    : await generateClaudeMd(claudeMdTemplate);

  const claudeMdPath = path.join(claudeDir, 'claude.md');
  await fs.writeFile(claudeMdPath, claudeMdContent);
}

module.exports = {
  generateSettingsConfig,
  generateClaudeMd,
  readClaudeMdFromFile,
  writeConfigFiles
};
