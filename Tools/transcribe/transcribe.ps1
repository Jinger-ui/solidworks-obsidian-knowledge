#Requires -Version 5.1
<#
.SYNOPSIS
  B 站视频逐字转写一键入口

.EXAMPLE
  .\transcribe.ps1 -Bvid BV1ser5BDESU -Part 1 -Engine auto

.EXAMPLE
  .\transcribe.ps1 -Check

.EXAMPLE
  .\transcribe.ps1 -InitVault
#>
param(
    [string]$Bvid = "",
    [string]$Part = "1",
    [ValidateSet("auto", "whisper", "bilinote", "bilibili")]
    [string]$Engine = "auto",
    [string]$ImportPath = "",
    [switch]$Check,
    [switch]$InitVault,
    [switch]$DemoMerge
)

$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$Script = Join-Path $PSScriptRoot "transcribe.py"

function Resolve-Python {
    $candidates = @()
    $embedded = Join-Path $Root "Tools\python311\python.exe"
    if (Test-Path $embedded) { $candidates += $embedded }
    foreach ($name in @("python3", "python")) {
        $found = Get-Command $name -ErrorAction SilentlyContinue
        if ($found) { $candidates += $found.Source }
    }
    foreach ($c in $candidates | Select-Object -Unique) {
        $env:PYTHONHOME = $null
        $out = & $c -c "import sys; print(sys.version_info[:2])" 2>$null
        if ($LASTEXITCODE -eq 0 -and $out) { return $c }
    }
    throw "未找到可用的 Python（需 3.6+，Whisper 建议 3.10+）"
}

$py = Resolve-Python
$env:PYTHONHOME = $null

if ($Check) {
    & $py $Script check
    exit $LASTEXITCODE
}

if ($InitVault) {
    & $py $Script init-vault
    exit $LASTEXITCODE
}

if ($DemoMerge) {
    & $py $Script demo-merge --bvid $Bvid --part $Part
    exit $LASTEXITCODE
}

if (-not $Bvid) {
    Write-Host "用法: transcribe.ps1 -Bvid BV1ser5BDESU -Part 1 [-Engine auto|whisper|bilinote]"
    Write-Host "      transcribe.ps1 -Check"
    Write-Host "      transcribe.ps1 -InitVault"
    exit 1
}

$argsList = @("run", "--bvid", $Bvid, "--parts", $Part, "--engine", $Engine)
if ($ImportPath) {
    $argsList += @("--import-path", $ImportPath)
}

& $py $Script @argsList
exit $LASTEXITCODE
