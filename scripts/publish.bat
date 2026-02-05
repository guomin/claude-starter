@echo off
setlocal enabledelayedexpansion

REM npm 发布脚本 (Windows)
REM 使用方法: scripts\publish.bat

echo ======================================
echo   @betterai.group/claude-starter 发布脚本
echo ======================================
echo.

REM 1. 检查当前登录状态
echo 步骤 1/5: 检查 npm 登录状态...
for /f "tokens=*" %%i in ('npm whoami 2^>nul') do set CURRENT_USER=%%i
if "!CURRENT_USER!"=="" (
    echo ❌ 未登录 npm
    echo 请先运行: npm login --auth-only
    pause
    exit /b 1
)
echo ✅ 当前登录用户: !CURRENT_USER!
echo.

REM 2. 确认包名和版本
echo 步骤 2/5: 确认包信息...
for /f "tokens=*" %%i in ('node -p "require('./package.json').name"') do set PACKAGE_NAME=%%i
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set VERSION=%%i
echo 包名: !PACKAGE_NAME!
echo 版本: !VERSION!
echo.

REM 3. 运行测试
echo 步骤 3/5: 运行测试...
echo 运行 npm test...
call npm test
if errorlevel 1 (
    echo ❌ 测试失败
    pause
    exit /b 1
)
echo ✅ 测试通过
echo.

REM 4. 打包预览
echo 步骤 4/5: 打包预览...
echo 运行 npm pack...
call npm pack
if errorlevel 1 (
    echo ❌ 打包失败
    pause
    exit /b 1
)
echo ✅ 打包完成
echo.

REM 5. 发布到 npm
echo 步骤 5/5: 发布到 npm...
echo 即将发布 !PACKAGE_NAME!@!VERSION!
echo.
set /p CONFIRM="确认发布? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ 已取消发布
    pause
    exit /b 0
)

echo 正在发布...
call npm publish
if errorlevel 1 (
    echo.
    echo ❌ 发布失败
    pause
    exit /b 1
)

echo.
echo ======================================
echo   ✅ 发布成功!
echo ======================================
echo.
echo 📦 包地址: https://www.npmjs.com/package/@betterai.group%%2Fclaude-starter
echo.
echo 🧪 测试安装:
echo    npx @betterai.group/claude-starter my-test-project
echo.

REM 清理打包文件
echo 清理打包文件...
del /q *.tgz 2>nul
echo ✅ 清理完成

pause
