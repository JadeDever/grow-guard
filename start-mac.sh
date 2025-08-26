#!/bin/bash

# 长盈智投简化启动脚本
# 适用于 macOS/Linux

echo "🚀 长盈智投简化启动脚本"
echo "=================================="

# 检查Node.js环境
echo "📋 检查Node.js环境..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo "✅ Node.js 版本: $NODE_VERSION"
    echo "✅ npm 版本: $NPM_VERSION"
else
    echo "❌ 未找到Node.js，请先安装Node.js 18+版本"
    exit 1
fi

# 创建.env文件
echo "⚙️ 检查环境变量..."
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ 已创建.env文件，请根据需要修改配置"
    else
        echo "⚠️  未找到env.example文件"
    fi
else
    echo "ℹ️  .env文件已存在"
fi

# 分别安装各个包的依赖
echo "📦 安装共享包依赖..."
cd packages/shared
npm install
if [ $? -ne 0 ]; then
    echo "❌ 共享包依赖安装失败"
    cd ../..
    exit 1
fi
echo "✅ 共享包依赖安装完成"

echo "📦 安装后端包依赖..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 后端包依赖安装失败"
    cd ../..
    exit 1
fi
echo "✅ 后端包依赖安装完成"

echo "📦 安装前端包依赖..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 前端包依赖安装失败"
    cd ../..
    exit 1
fi
echo "✅ 前端包依赖安装完成"

# 返回根目录
cd ../..

# 构建共享包
echo "🔨 构建共享包..."
cd packages/shared
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 共享包构建失败"
    cd ../..
    exit 1
fi
echo "✅ 共享包构建完成"
cd ../..

echo ""
echo "🎉 项目依赖安装完成！"
echo ""
echo "📋 下一步操作："
echo "1. 修改 .env 文件中的配置（如需要）"
echo "2. 运行以下命令启动项目："
echo ""
echo "   # 分别启动（推荐）"
echo "   # 终端1 - 启动后端"
echo "   cd packages/backend && npm run dev"
echo ""
echo "   # 终端2 - 启动前端"
echo "   cd packages/frontend && npm run dev"
echo ""
echo "3. 访问地址："
echo "   - 前端: http://localhost:3000"
echo "   - 后端: http://localhost:3001"
echo "   - 健康检查: http://localhost:3001/health"

# 询问是否立即启动项目
echo ""
read -p "是否立即启动项目？(y/N): " start_now
if [[ $start_now =~ ^[Yy]$ ]]; then
    echo "🚀 启动项目..."
    echo "💡 提示：将打开两个终端窗口分别启动前后端"
    
    # 启动后端
    osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'/packages/backend\" && npm run dev"'
    
    # 启动前端
    osascript -e 'tell application "Terminal" to do script "cd \"'$(pwd)'/packages/frontend\" && npm run dev"'
    
    echo "✅ 已启动前后端服务"
else
    echo "⏸️  项目准备就绪，请手动启动"
fi
