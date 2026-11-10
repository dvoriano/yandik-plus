# Import sanitized source from Windows, no VPS needed

**Import target:** `develop/yandik-foundation`. Keep `main` untouched. Source ZIP was created from an uploaded copy, not fetched from VPS by GitHub.

## Prerequisites
- Install Git for Windows and Python 3 if not already available.
- Sign into GitHub as a user with access to private `dvoriano/yandik-plus`. Do **not** paste PATs/passwords into chat.
- Download `YANDIK_PLUS_OFFLINE_SOURCE_2026-11-10.zip` from the ChatGPT artifact link to your Windows Downloads folder.
- This ZIP contains source but **does not contain production data or credentials**. Treat it as development-only.

## PowerShell: prepare offline working copy
```powershell
$zip = "$HOME\Downloads\YANDIK_PLUS_OFFLINE_SOURCE_2026-11-10.zip"
$work = "$HOME\Documents\yandik-offline"
New-Item -ItemType Directory -Force -Path $work | Out-Null
Set-Location $work

git clone --branch develop/yandik-foundation https://github.com/dvoriano/yandik-plus.git
Expand-Archive -LiteralPath $zip -DestinationPath "$work\snapshot" -Force
Get-ChildItem -LiteralPath "$work\snapshot" -Force |
  ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination "$work\yandik-plus" -Recurse -Force }

Set-Location "$work\yandik-plus"
python -m unittest discover -s tests -q
git status --short
```

## Review and commit only after source verification
```powershell
git add .gitignore .env.example README-OFFLINE-SNAPSHOT.md app.py core modules templates static tests
git diff --cached --stat
git diff --cached --name-only
# If these files are the expected 171-file offline snapshot:
git commit -m "chore: import sanitized offline YANDIK+ baseline"
git push origin develop/yandik-foundation
```
No VPS credentials or SSH are required. GitHub credentials are handled by Git's credential manager (or an existing sign-in session).

## Why this is not a deployment
- Current application imports depend on `data/config.json`, `data/puskeswan_list.json`, DB schema and packages not present in the ZIP. Python syntax smoke tests are not full functional tests.
- Do not connect real data or secrets. Do not run production migrations.
- This snapshot is a baseline for incremental work, not a verified secure release. PR #9 is draft and is not approved for merge or deployment.

## If Git is not available on Windows
Install Git for Windows and rerun the commands. Avoid uploading the ZIP itself to GitHub as a single file; it would not create source folders.
