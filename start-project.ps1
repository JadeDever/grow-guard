# 长盈智投项目启动脚本
# 适用于 Windows PowerShell

Write-Host "🚀 长盈智投项目启动脚本" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# 检查Git状态
Write-Host "📋 检查Git状态..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  发现未提交的更改，建议先提交代码" -ForegroundColor Yellow
    Write-Host "   运行: git add . && git commit -m '更新代码'" -ForegroundColor White
} else {
    Write-Host "✅ Git工作区干净" -ForegroundColor Green
}

# 检查远程仓库
Write-Host "🌐 检查远程仓库..." -ForegroundColor Yellow
$remotes = git remote -v
if ($remotes -match "JadeDever/grow-guard") {
    Write-Host "✅ 远程仓库配置正确: https://github.com/JadeDever/grow-guard.git" -ForegroundColor Green
} else {
    Write-Host "❌ 远程仓库配置不正确" -ForegroundColor Red
    exit 1
}

# 检查Node.js环境
Write-Host "📋 检查Node.js环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到Node.js，请先安装Node.js 18+版本" -ForegroundColor Red
    exit 1
}

# 检查依赖是否已安装
Write-Host "📦 检查项目依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ 依赖已安装" -ForegroundColor Green
} else {
    Write-Host "📦 安装项目依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
}

# 构建共享包
Write-Host "🔨 构建共享包..." -ForegroundColor Yellow
Set-Location packages/shared
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 共享包构建失败" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ 共享包构建完成" -ForegroundColor Green
Set-Location ../..

# 检查环境变量文件
Write-Host "⚙️ 检查环境变量..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ 已创建.env文件，请根据需要修改配置" -ForegroundColor Green
    } else {
        Write-Host "⚠️  未找到env.example文件" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  .env文件已存在" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 项目初始化完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Yellow
Write-Host "1. 修改 .env 文件中的配置（如需要）" -ForegroundColor White
Write-Host "2. 运行以下命令启动项目：" -ForegroundColor White
Write-Host ""
Write-Host "   # 同时启动前后端" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   # 或分别启动" -ForegroundColor Cyan
Write-Host "   npm run dev:frontend    # 前端 (http://localhost:3000)" -ForegroundColor White
Write-Host "   npm run dev:backend     # 后端 (http://localhost:3001)" -ForegroundColor White
Write-Host ""
Write-Host "3. 访问地址：" -ForegroundColor White
Write-Host "   - 前端: http://localhost:3000" -ForegroundColor White
Write-Host "   - 后端: http://localhost:3001" -ForegroundColor White
Write-Host "   - 健康检查: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "💡 提示：如果遇到网络问题，可以稍后运行 'git push -u origin main' 推送到GitHub" -ForegroundColor Cyan

# 询问是否立即启动项目
Write-Host ""
$startNow = Read-Host "是否立即启动项目？(y/N)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host "🚀 启动项目..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "⏸️  项目准备就绪，请手动启动" -ForegroundColor Blue
}
