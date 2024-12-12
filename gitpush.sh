#!/bin/bash

# Print the current working directory
echo "Current Directory: $(pwd)"

# Check if the user is inside a git repository
if [ ! -d ".git" ]; then
  echo "Not a git repository. Please run this script inside a git repository."
  exit 1
fi

# Stage all changes
git add --all

# Prompt for a commit message
read -p "Enter commit message: " commit_message

# Commit with the provided message
git commit -m "$commit_message"

# Push to the current branch
git push

echo "Changes have been committed and pushed!"
