const fs = require('fs-extra');
const path = require('path');

describe('Permission Templates', () => {
  const templatesDir = path.join(__dirname, '../../../src/templates/settings');

  test('conservative template should have minimal permissions', async () => {
    const template = await fs.readJson(path.join(templatesDir, 'conservative.json'));

    expect(template.dangerouslyAllowAllPermissions).toBe(false);
    expect(template.allowedTools).toContain('Read');
    expect(template.allowedTools).toContain('Write');
    expect(template.allowedTools).not.toContain('Task');
    expect(template.alwaysAllowBash).toBe(false);
    expect(template.maxNumberOfToolUseIterationsPerTurn).toBe(20);
  });

  test('balanced template should have moderate permissions', async () => {
    const template = await fs.readJson(path.join(templatesDir, 'balanced.json'));

    expect(template.dangerouslyAllowAllPermissions).toBe(false);
    expect(template.allowedTools).toContain('Task');
    expect(template.allowedTools).toContain('Skill');
    expect(template.allowedPrompts).toContain('superpowers:*');
    expect(template.alwaysAllowWrite).toBe(true);
    expect(template.maxNumberOfToolUseIterationsPerTurn).toBe(50);
  });

  test('permissive template should have all permissions', async () => {
    const template = await fs.readJson(path.join(templatesDir, 'permissive.json'));

    expect(template.dangerouslyAllowAllPermissions).toBe(true);
    expect(template.alwaysAllowBash).toBe(true);
    expect(template.alwaysAllowWriteFromFileUpload).toBe(true);
  });

  test('all templates should be valid JSON', async () => {
    const files = await fs.readdir(templatesDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readJson(path.join(templatesDir, file));
        expect(content).toBeDefined();
        expect(typeof content).toBe('object');
      }
    }
  });
});
