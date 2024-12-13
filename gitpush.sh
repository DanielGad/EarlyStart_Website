#!/bin/bash
up
echo "Current Directory: $(pwd)"

if [ ! -d ".git" ]; then
  echo "Not a git repository. Please run this script inside a git repository."
  exit 1
fi

git add --all

read -p "Enter commit message: " commit_message

git commit -m "$commit_message"

git push

echo "Changes have been committed and pushed!"
