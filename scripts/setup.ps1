# 长盈智投项目设置脚本
# 适用于 Windows PowerShell

Write-Host "🚀 开始设置长盈智投项目..." -ForegroundColor Green

# 检查 Node.js 版本
Write-Host "📋 检查环境要求..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 未找到 Node.js，请先安装 Node.js 18+ 版本" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green

# 创建必要的目录
Write-Host "📁 创建项目目录..." -ForegroundColor Yellow
$directories = @(
    "data",
    "logs",
    "packages/backend/src/routes",
    "packages/backend/src/controllers",
    "packages/backend/src/services",
    "packages/backend/src/middleware",
    "packages/backend/src/database",
    "packages/frontend/src",
    "packages/frontend/src/components",
    "packages/frontend/src/pages",
    "packages/frontend/src/hooks",
    "packages/frontend/src/stores",
    "packages/frontend/src/utils"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ 创建目录: $dir" -ForegroundColor Green
    }
}

# 安装依赖
Write-Host "📦 安装项目依赖..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 依赖安装失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 依赖安装完成" -ForegroundColor Green

# 构建共享包
Write-Host "🔨 构建共享包..." -ForegroundColor Yellow
Set-Location packages/shared
npm run build
Set-Location ../..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 共享包构建失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 共享包构建完成" -ForegroundColor Green

# 复制环境变量文件
Write-Host "⚙️ 配置环境变量..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "✅ 环境变量文件已创建，请根据需要修改 .env 文件" -ForegroundColor Green
} else {
    Write-Host "ℹ️ 环境变量文件已存在" -ForegroundColor Blue
}

Write-Host "🎉 项目设置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Yellow
Write-Host "1. 修改 .env 文件中的配置" -ForegroundColor White
Write-Host "2. 运行 'npm run dev' 启动开发服务器" -ForegroundColor White
Write-Host "3. 前端访问: http://localhost:3000" -ForegroundColor White
Write-Host "4. 后端访问: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "💡 提示：可以使用 'npm run dev:frontend' 或 'npm run dev:backend' 分别启动" -ForegroundColor Cyan
