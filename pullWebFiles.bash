#!/bin/bash

# This Bash Script pulls all files from the Web Branch of the BAM repo so the server can add them in the route
# Its purpose is to get the latest version of the Front End "Files" into the folder defined in SERVER.JAVA
# NOTE: FRONT END FILES ARE NOT STORED ON THE SERVER BRANCH, clone and run this script to get them
#
# The React admin app (admin/ in the Web branch) is BUILT here (npm ci + npm run build, needs Node 18+)
# and only the build output is copied to public/admin. Its source is never served.

# Git Repo Information below (Stored in plain text?)
# WARNING: You will need to accept permission to allow your IDE to access git through HTTP Pull requests


REPO_URL=${1:-"https://github.com/niskyhilldev/NiskyhillWebApplication"}
BRANCH_NAME=${2:-"Web"}
TARGET_DIR="$(pwd)/src/main/resources/public"

TMP_DIR=$(mktemp -d)
git clone --branch "$BRANCH_NAME" --single-branch "$REPO_URL" "$TMP_DIR"
if [ $? -ne 0 ]; then
    echo "Failed to clone repository."
    exit 1
fi

# Build the React admin app BEFORE touching the target dir, so a failed build leaves the old files intact
if [ -f "$TMP_DIR/admin/package.json" ]; then
    echo "Building React admin app..."
    (cd "$TMP_DIR/admin" && npm ci && npm run build)
    if [ $? -ne 0 ] || [ ! -f "$TMP_DIR/admin/dist/index.html" ]; then
        echo "React admin build failed."
        rm -rf "$TMP_DIR"
        exit 1
    fi
fi

# Remove all files in the target directory before copying
rm -rf "$TARGET_DIR"/*

mkdir -p "$TARGET_DIR"
cp -r "$TMP_DIR"/* "$TARGET_DIR"/

# Replace the admin SOURCE with the BUILT app (served at /admin)
if [ -d "$TMP_DIR/admin/dist" ]; then
    rm -rf "$TARGET_DIR/admin"
    mkdir -p "$TARGET_DIR/admin"
    cp -r "$TMP_DIR/admin/dist"/* "$TARGET_DIR/admin"/
fi

find "$TARGET_DIR" -type f -name "*.md" -delete # Remove all .md files from the target directory

rm -rf "$TMP_DIR"

echo "Files from branch '$BRANCH_NAME' of repository '$REPO_URL' have been copied to '$TARGET_DIR'."
