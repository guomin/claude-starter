#!/bin/bash

# npm 发布脚本
# 使用方法: ./scripts/publish.sh

set -e  # 遇到错误立即退出

echo "======================================"
echo "  @betterai.group/claude-starter 发布脚本"
echo "======================================"
echo ""

# 1. 检查当前登录状态
echo "📋 步骤 1/5: 检查 npm 登录状态..."
CURRENT_USER=$(npm whoami 2>/dev/null || echo "")
if [ -z "$CURRENT_USER" ]; then
    echo "❌ 未登录 npm"
    echo "请先运行: npm login --auth-only"
    exit 1
fi
echo "✅ 当前登录用户: $CURRENT_USER"
echo ""

# 2. 确认包名和版本
echo "📋 步骤 2/5: 确认包信息..."
PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")
echo "包名: $PACKAGE_NAME"
echo "版本: $VERSION"
echo ""

# 3. 运行测试
echo "📋 步骤 3/5: 运行测试..."
echo "运行 npm test..."
npm test
echo "✅ 测试通过"
echo ""

# 4. 打包预览
echo "📋 步骤 4/5: 打包预览..."
echo "运行 npm pack..."
npm pack
echo "✅ 打包完成"
echo ""

# 5. 发布到 npm
echo "📋 步骤 5/5: 发布到 npm..."
echo "即将发布 $PACKAGE_NAME@$VERSION"
echo ""
read -p "确认发布? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在发布..."
    npm publish

    if [ $? -eq 0 ]; then
        echo ""
        echo "======================================"
        echo "  ✅ 发布成功!"
        echo "======================================"
        echo ""
        echo "📦 包地址: https://www.npmjs.com/package/@betterai.group%2Fclaude-starter"
        echo ""
        echo "🧪 测试安装:"
        echo "   npx @betterai.group/claude-starter my-test-project"
        echo ""
    else
        echo "❌ 发布失败"
        exit 1
    fi
else
    echo "❌ 已取消发布"
    exit 0
fi

# 清理打包文件
echo "清理打包文件..."
rm -f *.tgz
echo "✅ 清理完成"
