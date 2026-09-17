@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo Renaming directories...
ren "魔塔游戏" "magic-tower" 2>nul
ren "记忆翻牌游戏" "memory-cards" 2>nul
ren "连线小游戏" "line-connect" 2>nul
ren "推箱子游戏" "push-box" 2>nul
ren "九格人格" "enneagram-test" 2>nul
ren "拼图" "jigsaw-puzzle" 2>nul
ren "schoolRankingsShJshan" "school-rankings" 2>nul
ren "动感小球游戏" "maze-ball" 2>nul
echo Done!
pause
