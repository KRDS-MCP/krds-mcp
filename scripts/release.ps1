# scripts/release.ps1 - Manual release script for Windows

param(
    [string]$Version
)

# Get current version from package.json
$CurrentVersion = (Get-Content package.json | ConvertFrom-Json).version
Write-Host "Current version: $CurrentVersion" -ForegroundColor Green

# Ask for new version if not provided
if (-not $Version) {
    $Version = Read-Host "Enter new version (current: $CurrentVersion)"
}

if (-not $Version) {
    Write-Host "Version cannot be empty" -ForegroundColor Red
    exit 1
}

# Validate version format
if (-not ($Version -match "^\d+\.\d+\.\d+$")) {
    Write-Host "Invalid version format. Please use semantic versioning (e.g., 1.0.8)" -ForegroundColor Red
    exit 1
}

Write-Host "Creating release for version $Version..." -ForegroundColor Yellow

# Run quality checks
Write-Host "Running quality checks..." -ForegroundColor Blue
npm run quality

if ($LASTEXITCODE -ne 0) {
    Write-Host "Quality checks failed!" -ForegroundColor Red
    exit 1
}

# Update package.json version
npm version $Version --no-git-tag-version

# Commit changes
git add package.json
git commit -m "chore(release): bump version to $Version"

# Create and push tag
git tag "v$Version"
git push origin main
git push origin "v$Version"

Write-Host "✅ Release v$Version created successfully!" -ForegroundColor Green
Write-Host "GitHub Actions will now handle the release process." -ForegroundColor Cyan