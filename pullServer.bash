#!/bin/bash

# This Bash Script moves all files from the Server Branch (Server/server.java) to the root of the Heroku-Deploy branch.
# Its purpose is to get the latest server files from 'Server/server.java' into the root directory of the Heroku-Deploy branch, 
# excluding certain important files (Deploy.sh, Procfile, .gitattributes, system.properties), 
# and excluding the pullWebFiles.bash file.

# Git Repo Information
REPO_URL=${1:-"https://github.com/tjs226/BAM_Niskey_Hill.git"}
SERVER_BRANCH_NAME=${2:-"Server"}
HEROKU_DEPLOY_BRANCH_NAME=${3:-"Heroku-Deployment"}
TARGET_DIR="$(pwd)"  # Root directory of the Heroku-Deploy branch

# Important files to exclude from deletion
EXCLUDE_FILES=("pullServer.bash" "Procfile" ".gitattributes" "system.properties" "pullWebFiles.bash" "Heroku.md")

# Temporary directory for fetching the files
TMP_DIR=$(mktemp -d)

# Clone the repository, but don't checkout the Server branch. Just fetch it.
git clone --depth 1 --branch "$SERVER_BRANCH_NAME" "$REPO_URL" "$TMP_DIR" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Failed to clone the repository."
    exit 1
fi

# Path to the directory in the Server branch that we want to copy files from
SERVER_FILES_DIR="$TMP_DIR/Server/server.java"
if [ ! -d "$SERVER_FILES_DIR" ]; then
    echo "No server files found in '$SERVER_FILES_DIR'."
    exit 1
fi

# Debugging: Print the contents of the Server/server.java directory
echo "Contents of '$SERVER_FILES_DIR':"
ls -l "$SERVER_FILES_DIR"

# Step 1: Delete all files in the current directory except the important ones
echo "Deleting unnecessary files in the current directory (except important ones)..."
for file in "$TARGET_DIR"/*; do
    FILENAME=$(basename "$file")
    
    # Check if the file is not in the exclusion list
    if [[ ! " ${EXCLUDE_FILES[@]} " =~ " $FILENAME " ]]; then
        echo "Deleting file: $FILENAME"
        rm -rf "$file"  # Remove the file or directory
    else
        echo "Preserving file: $FILENAME"
    fi
done

# Step 2: Copy the files from Server/server.java directly into the root of the Heroku-Deploy branch
for file in "$SERVER_FILES_DIR"/*; do
    FILENAME=$(basename "$file")
    
    # Skip unwanted files like 'pullWebFiles.bash' and others
    if [[ " ${EXCLUDE_FILES[@]} " =~ " $FILENAME " ]]; then
        echo "Skipping excluded file: $FILENAME"
        continue
    fi

    # Copy the file to the root directory
    TARGET_FILE="$TARGET_DIR/$FILENAME"
    
    # Check if the file already exists and if it's newer before copying
    if [ ! -e "$TARGET_FILE" ] || [ "$file" -nt "$TARGET_FILE" ]; then
        echo "Copying file to root directory: $FILENAME"
        cp -r "$file" "$TARGET_FILE"
    else
        echo "Skipping file (already exists and is not newer): $FILENAME"
    fi
done

# Clean up: Remove temporary clone directory
rm -rf "$TMP_DIR"

echo "Files from branch '$SERVER_BRANCH_NAME' of repository '$REPO_URL' have been copied to '$TARGET_DIR' (excluding pullWebFiles.bash and other important files)."