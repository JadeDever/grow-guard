# 长盈智投简化启动脚本
# 适用于 Windows PowerShell

Write-Host "🚀 长盈智投简化启动脚本" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

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

# 创建.env文件
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

# 分别安装各个包的依赖
Write-Host "📦 安装共享包依赖..." -ForegroundColor Yellow
Set-Location packages/shared
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 共享包依赖安装失败" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ 共享包依赖安装完成" -ForegroundColor Green

Write-Host "📦 安装后端包依赖..." -ForegroundColor Yellow
Set-Location ../backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 后端包依赖安装失败" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ 后端包依赖安装完成" -ForegroundColor Green

Write-Host "📦 安装前端包依赖..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 前端包依赖安装失败" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ 前端包依赖安装完成" -ForegroundColor Green

# 返回根目录
Set-Location ../..

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

Write-Host ""
Write-Host "🎉 项目依赖安装完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Yellow
Write-Host "1. 修改 .env 文件中的配置（如需要）" -ForegroundColor White
Write-Host "2. 运行以下命令启动项目：" -ForegroundColor White
Write-Host ""
Write-Host "   # 分别启动（推荐）" -ForegroundColor Cyan
Write-Host "   # 终端1 - 启动后端" -ForegroundColor White
Write-Host "   cd packages/backend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   # 终端2 - 启动前端" -ForegroundColor White
Write-Host "   cd packages/frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. 访问地址：" -ForegroundColor White
Write-Host "   - 前端: http://localhost:3000" -ForegroundColor White
Write-Host "   - 后端: http://localhost:3001" -ForegroundColor White
Write-Host "   - 健康检查: http://localhost:3001/health" -ForegroundColor White

# 询问是否立即启动项目
Write-Host ""
$startNow = Read-Host "是否立即启动项目？(y/N)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host "🚀 启动项目..." -ForegroundColor Green
    Write-Host "💡 提示：将打开两个终端窗口分别启动前后端" -ForegroundColor Cyan
    
    # 启动后端
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\packages\backend'; npm run dev"
    
    # 启动前端
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\packages\frontend'; npm run dev"
    
    Write-Host "✅ 已启动前后端服务" -ForegroundColor Green
} else {
    Write-Host "⏸️  项目准备就绪，请手动启动" -ForegroundColor Blue
}
