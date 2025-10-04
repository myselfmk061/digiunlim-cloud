#!/bin/bash

# Auto GitHub Push Script
echo "🚀 Auto pushing to GitHub..."

# Add all changes
git add .

# Commit with timestamp
git commit -m "Auto update: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
git push origin main --force

echo "✅ Successfully pushed to GitHub!"