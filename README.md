# @betterai.group/claude-starter

> 快速初始化 Claude Code 配置的脚手架工具

## 特性

- 🚀 3秒完成配置，无需手动创建文件
- 🎯 三种权限模板，适配不同安全需求
- 📝 多种 claude.md 模板，开箱即用
- 🔄 支持新建文件夹或在当前目录初始化
- ⚙️ 高度可定制，支持命令行参数和交互式配置

## 安装

```bash
# 使用 npx（推荐）
npx @betterai.group/claude-starter my-project

# 全局安装
npm install -g @betterai.group/claude-starter
claude-starter my-project
```

## 快速开始

```bash
# 在新文件夹中创建项目
npx @betterai.group/claude-starter my-project

# 在当前目录生成配置
npx @betterai.group/claude-starter --mode current
```

## 使用示例

```bash
# 使用激进权限模板
npx @betterai.group/claude-starter my-project -p permissive

# 自定义 claude.md 内容
npx @betterai.group/claude-starter my-project -c "我的项目规范"

# 使用完整功能模板
npx @betterai.group/claude-starter my-project -t full-featured

# 跳过交互式确认
npx @betterai.group/claude-starter my-project --yes
```

## 配置说明

### 权限模板

- **conservative** - 保守模式：最小权限，适合敏感项目
- **balanced** - 平衡模式：平衡安全性和便利性（默认）
- **permissive** - 激进模式：最大权限，适合个人项目

### claude.md 模板

- **default** - 默认模板：通用开发规范
- **full-featured** - 完整功能：包含所有功能说明
- **minimal** - 极简模板：最小化配置

## 命令行选项

```
Usage: claude-starter [options] [project-name]

Arguments:
  project-name          项目名称（在 --mode=new 时必需）

Options:
  -m, --mode <mode>        创建模式: new | current (默认: new)
  -p, --permission <type>  权限模板: permissive | balanced | conservative
  -c, --claude-md <text>   自定义 claude.md 内容
  -f, --claude-md-file <path>  从文件读取 claude.md
  -t, --template <name>    claude.md 模板: default | full-featured | minimal
  -y, --yes                跳过交互式确认
  -h, --help               显示帮助信息
```

## License

MIT
