const fs = require('fs-extra');
const path = require('path');

describe('Claude.md Templates', () => {
  const templatesDir = path.join(__dirname, '../../../src/templates/claude-md');

  test('default template should contain project overview section', async () => {
    const content = await fs.readFile(path.join(templatesDir, 'default.md'), 'utf-8');
    expect(content).toContain('# 项目配置');
    expect(content).toContain('## 项目概述');
    expect(content).toContain('## 开发规范');
  });

  test('minimal template should be concise', async () => {
    const content = await fs.readFile(path.join(templatesDir, 'minimal.md'), 'utf-8');
    expect(content.length).toBeLessThan(500);
    expect(content).toContain('#');
  });

  test('full-featured template should contain all sections', async () => {
    const content = await fs.readFile(path.join(templatesDir, 'full-featured.md'), 'utf-8');
    expect(content).toContain('项目概述');
    expect(content).toContain('开发规范');
    expect(content.length).toBeGreaterThan(1000);
  });

  test('all templates should be markdown files', async () => {
    const files = await fs.readdir(templatesDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    expect(mdFiles.length).toBeGreaterThan(0);
  });
});
