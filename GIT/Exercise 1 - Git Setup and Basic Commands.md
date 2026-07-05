# Exercise 1 - Git Setup and Basic Commands

## Objectives
- Setup Git configuration (user name & email)
- Integrate a default editor
- Add a file to source code repository
- Push to remote (GitLab/GitHub)

---

## Step 1: Verify Git Installation

```bash
git --version
# Expected output: git version 2.x.x
```

---

## Step 2: Configure User Identity

```bash
# Set global username
git config --global user.name "YourName"

# Set global email
git config --global user.email "youremail@example.com"

# Verify the configuration
git config --list
```

---

## Step 3: Set Default Editor (VS Code / Nano)

```bash
# For VS Code
git config --global core.editor "code --wait"

# For Nano (lightweight alternative to Notepad++)
git config --global core.editor "nano"

# Verify editor setting
git config --global -e
```

---

## Step 4: Create a Local Repository

```bash
# Create and enter the project folder
mkdir GitDemo
cd GitDemo

# Initialize the Git repository
git init

# Verify hidden .git folder
ls -la
```

---

## Step 5: Create a File and Add to Repository

```bash
# Create a file with content
echo "Welcome to Git" > welcome.txt

# Verify file creation
ls -l

# Check file content
cat welcome.txt

# Check repository status (file is untracked)
git status
```

---

## Step 6: Stage and Commit the File

```bash
# Stage the file (add to index/staging area)
git add welcome.txt

# Commit with a single-line message
git commit -m "Initial commit: added welcome.txt"

# Check status - should show "nothing to commit"
git status
```

---

## Step 7: Connect to Remote Repository and Push

```bash
# Add remote origin (replace URL with your GitHub/GitLab repo URL)
git remote add origin https://github.com/YourUsername/GitDemo.git

# Pull remote changes first (if any)
git pull origin master --allow-unrelated-histories

# Push local commits to remote
git push -u origin master
```

---

## Expected Output Summary

| Command | Result |
|---------|--------|
| `git --version` | Displays installed Git version |
| `git config --list` | Shows user.name, user.email, core.editor |
| `git init` | Initialized empty Git repository in ./GitDemo/.git/ |
| `git status` | Shows untracked/tracked/committed state |
| `git log` | Shows commit history with hash, author, date |

---

## Key Concepts
- **Working Directory**: Where you edit files
- **Staging Area (Index)**: Files marked for the next commit (`git add`)
- **Local Repository**: Committed snapshots (`.git` folder)
- **Remote Repository**: GitHub/GitLab hosted repo
