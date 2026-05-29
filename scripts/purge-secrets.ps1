<#
A helper PowerShell script that prints recommended commands to purge secrets from git history.
It does NOT run destructive commands unless you set $RunToExecute = $true below.

Run locally from the repository root:
  PowerShell -ExecutionPolicy Bypass -File .\scripts\purge-secrets.ps1

Edit the variables below before enabling execution.
#>

param()

$RunToExecute = $false  # Set to $true to execute the commands (dangerous). Default is $false.

Write-Host "Purge-secrets helper — will *print* commands. Set RunToExecute=`$true to actually run them.`n"

# detect origin
try{
    $origin = git remote get-url origin 2>$null
} catch {
    $origin = "<no origin detected>"
}
Write-Host "Detected origin: $origin`n"

Write-Host "=== Recommended (safe) steps to run manually ===`n"
Write-Host "1) Create a mirror backup"
Write-Host "   git clone --mirror $origin repo-mirror.git"
Write-Host "   cd repo-mirror.git`n"

Write-Host "2) Remove files entirely from history (example: Backend/.env and frontend/.env)"
Write-Host "   git filter-repo --path Backend/.env --path frontend/.env --invert-paths`n"

Write-Host "3) OR replace exact secret strings (create replacements.txt with lines like OLD==>REDACTED)"
Write-Host "   git filter-repo --replace-text replacements.txt`n"

Write-Host "4) Push cleaned history back to origin"
Write-Host "   git push --force --all && git push --force --tags`n"

Write-Host "5) If you prefer BFG: java -jar bfg.jar --delete-files \".env\" repo-mirror.git`n"

Write-Host "AFTER CLEANUP: notify collaborators to re-clone the repo and rotate all secrets (DB user, JWT secret, Google API keys).`n"

if ($RunToExecute) {
    Write-Host "Run mode enabled — executing the remove-files example now (BE CAREFUL)!" -ForegroundColor Yellow
    Write-Host "This will run: git filter-repo --path Backend/.env --path frontend/.env --invert-paths"
    $confirm = Read-Host "Type CONFIRM to proceed"
    if ($confirm -eq 'CONFIRM') {
        git clone --mirror $origin repo-mirror.git
        Push-Location repo-mirror.git
        git filter-repo --path Backend/.env --path frontend/.env --invert-paths
        git push --force --all
        git push --force --tags
        Pop-Location
        Write-Host "Completed — remember to inform collaborators to re-clone." -ForegroundColor Green
    } else {
        Write-Host "Aborted by user.`n"
    }
} else {
    Write-Host "Run mode is disabled. To execute destructive commands set `\$RunToExecute = $true` inside this script and re-run it locally.`n"
}
