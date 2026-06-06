# 一键创建 GitHub 仓库并推送（需先登录 gh）
# 首次使用请运行: D:\solidworks\Tools\gh\gh.exe auth login

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Gh = Join-Path $Root "Tools\gh\gh.exe"
$RepoName = "solidworks-obsidian-knowledge"

if (-not (Test-Path $Gh)) {
    Write-Error "未找到 gh.exe，请先安装 GitHub CLI 到 Tools\gh\"
}

Set-Location $Root

& $Gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "尚未登录 GitHub。请执行：" -ForegroundColor Yellow
    Write-Host "  & `"$Gh`" auth login" -ForegroundColor Cyan
    exit 1
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "正在创建远程仓库 $RepoName 并推送..." -ForegroundColor Green
    & $Gh repo create $RepoName --public --source=. --remote=origin `
        --description "SolidWorks learning notes and Obsidian vault (Bilibili BV1Yo5D6TEVk)" --push
} else {
    Write-Host "远程已存在: $remote" -ForegroundColor Green
    git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n完成！仓库地址：" -ForegroundColor Green
    & $Gh repo view --json url -q .url
}
