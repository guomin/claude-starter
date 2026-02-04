const fs = require('fs-extra');
const path = require('path');

/**
 * 验证项目名称
 * @param {string} name - 项目名称
 * @returns {{valid: boolean, error?: string}}
 */
function validateProjectName(name) {
  // 检查是否为空
  if (!name || name.trim() === '') {
    return { valid: false, error: '项目名称不能为空' };
  }

  // 检查长度
  if (name.length > 255) {
    return { valid: false, error: '项目名称长度不能超过 255 个字符' };
  }

  // 检查特殊字符
  const invalidChars = /[\/\\:*?"<>|]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: '项目名称不能包含特殊字符: / \\ : * ? " < > |' };
  }

  // 检查系统保留名（Windows）
  const reservedNames = [
    'con', 'prn', 'aux', 'nul',
    'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
    'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
  ];

  if (reservedNames.includes(name.toLowerCase())) {
    return { valid: false, error: `'${name}' 是系统保留名称，请使用其他名称` };
  }

  return { valid: true };
}

/**
 * 备份文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<string|null>} 备份文件路径，如果文件不存在则返回 null
 */
async function backupFile(filePath) {
  const exists = await fs.pathExists(filePath);

  if (!exists) {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup.${timestamp}`;

  await fs.copy(filePath, backupPath);

  return backupPath;
}

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dirPath - 目录路径
 * @returns {Promise<void>}
 */
async function ensureDirectoryExists(dirPath) {
  await fs.ensureDir(dirPath);
}

module.exports = {
  validateProjectName,
  backupFile,
  ensureDirectoryExists
};
