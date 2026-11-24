@echo off
setlocal
pushd "%~dp0" || exit /b 1

if not exist "drafts\yandik-backend-contract\local_server.py" (
    echo Ekstrak seluruh ZIP YANDIK+ terlebih dahulu.
    echo Buka Mulai-YANDIK.cmd dari folder hasil ekstraksi.
    pause
    popd
    exit /b 1
)

set "YANDIK_PYTHON="
py -3 -c "import sys; sys.exit(sys.version_info < (3, 10))" >nul 2>&1
if not errorlevel 1 (
    set "YANDIK_PYTHON=py -3"
) else (
    python -c "import sys; sys.exit(sys.version_info < (3, 10))" >nul 2>&1
    if not errorlevel 1 set "YANDIK_PYTHON=python"
)

if not defined YANDIK_PYTHON (
    echo Demo memerlukan Python 3.10 atau lebih baru.
    echo Unduh Python dari https://www.python.org/downloads/windows/
    echo Pada installer, centang Add python.exe to PATH.
    echo Setelah instalasi, klik dua kali Mulai-YANDIK.cmd lagi.
    pause
    popd
    exit /b 1
)

echo Biarkan terminal ini terbuka selama menggunakan YANDIK+ DEMO.
echo Salin kode sesi DEMO ALPHA untuk masuk.
echo.
%YANDIK_PYTHON% -B "drafts\yandik-backend-contract\local_server.py" --port 0 --allow-demo-commands --open-browser
set "YANDIK_EXIT=%errorlevel%"
if not "%YANDIK_EXIT%"=="0" (
    echo.
    echo Server DEMO berhenti dengan kesalahan. Lihat pesan di atas.
    pause
)
popd
exit /b %YANDIK_EXIT%
