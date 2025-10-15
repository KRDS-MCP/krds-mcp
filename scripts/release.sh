#!/bin/bash
# scripts/release.sh - Manual release script

set -e

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Ask for new version
echo "Enter new version (current: $CURRENT_VERSION):"
read NEW_VERSION

if [[ -z "$NEW_VERSION" ]]; then
    echo "Version cannot be empty"
    exit 1
fi

# Validate version format
if [[ ! $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Invalid version format. Please use semantic versioning (e.g., 1.0.8)"
    exit 1
fi

echo "Creating release for version $NEW_VERSION..."

# Run quality checks
echo "Running quality checks..."
npm run quality

# Update package.json version
npm version $NEW_VERSION --no-git-tag-version

# Commit changes
git add package.json
git commit -m "chore(release): bump version to $NEW_VERSION"

# Create and push tag
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo "✅ Release v$NEW_VERSION created successfully!"
echo "GitHub Actions will now handle the release process."