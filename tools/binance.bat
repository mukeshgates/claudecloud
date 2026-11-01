@echo off
rem Run Claude on Console API credits in a project folder (default D:\binance-hack).
rem Usage:  binance.bat            or   binance.bat D:\some\other\folder
set PYTHONUTF8=1
set "DIR=D:\binance-hack"
if not "%~1"=="" set "DIR=%~1"

if "%ANTHROPIC_API_KEY%"=="" set /p "ANTHROPIC_API_KEY=Paste your API key and press Enter: "

curl -sL -o "%USERPROFILE%\credits_agent.py" https://raw.githubusercontent.com/mukeshgates/claudecloud/claude/zen-hamilton-a7alu0/tools/credits_agent.py
python -c "import claude_agent_sdk" 2>nul || python -m pip install -q claude-agent-sdk

echo.
set /p "TASK=What should Claude do next in %DIR%? "
python "%USERPROFILE%\credits_agent.py" resume --dir "%DIR%" --budget 2 --prompt "Read the files in this folder. We are making a YouTube video about the Binance hack. Summarise where the work is in five lines, then do this: %TASK%"
pause
