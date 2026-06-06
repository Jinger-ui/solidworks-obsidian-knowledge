@echo off
chcp 65001 >nul
setlocal

set "ROOT=%~dp0"
set "PS1=%ROOT%Tools\transcribe\transcribe.ps1"

if "%~1"=="" goto interactive
if /i "%~1"=="check" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Check
  goto end
)
if /i "%~1"=="init" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -InitVault
  goto end
)
if /i "%~1"=="demo" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -DemoMerge -Bvid %~2 -Part %~3
  goto end
)

set "BVID=%~1"
set "PART=%~2"
set "ENGINE=%~3"
if "%PART%"=="" set "PART=1"
if "%ENGINE%"=="" set "ENGINE=auto"

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Bvid %BVID% -Part %PART% -Engine %ENGINE%
goto end

:interactive
echo === 逐字转写 ===
echo.
set /p BVID=请输入 BV 号（如 BV1ser5BDESU）: 
set /p PART=分 P 号（默认 1）: 
if "%PART%"=="" set "PART=1"
set /p ENGINE=引擎 auto/whisper/bilinote（默认 auto）: 
if "%ENGINE%"=="" set "ENGINE=auto"
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Bvid %BVID% -Part %PART% -Engine %ENGINE%

:end
pause
