#!/bin/bash

# This Bash Script pulls all files from the Web Branch of the BAM repo so the server can add them in the route
# Its purpose is to get the latest version of the Front End "Files" into the folder defined in SERVER.JAVA
# NOTE: FRONT END FILES ARE NOT STORED ON THE SERVER BRANCH, clone and run this script to get them

# Git Repo Information below (Stored in plain text?)
# WARNING: You will need to accept permission to allow your IDE to access git through HTTP Pull requests
REPO_URL=${1:-"https://github.com/tjs226/BAM_Niskey_Hill.git"}
BRANCH_NAME=${2:-"Web"}
TARGET_DIR="$(pwd)/src/main/resources/public"

TMP_DIR=$(mktemp -d)
git clone --branch "$BRANCH_NAME" --single-branch "$REPO_URL" "$TMP_DIR"
if [ $? -ne 0 ]; then
    echo "Failed to clone repository."
    exit 1
fi

# Remove all files in the target directory before copying
rm -rf "$TARGET_DIR"/*

mkdir -p "$TARGET_DIR"
cp -r "$TMP_DIR"/* "$TARGET_DIR"/
rm -rf "$TMP_DIR"

echo "Files from branch '$BRANCH_NAME' of repository '$REPO_URL' have been copied to '$TARGET_DIR'."
