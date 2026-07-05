# Exercise 2 - Git Ignore

## Objectives
- Understand `.gitignore` and its purpose
- Ignore specific file extensions (`.log`) and folders
- Verify that ignored files do not appear in `git status`

---

## Step 1: Navigate to GitDemo Repository

```bash
cd GitDemo
git status
# Should show: nothing to commit, working tree clean
```

---

## Step 2: Create a Log File and a Log Folder

```bash
# Create a .log file
echo "Application started at $(date)" > app.log

# Create a logs folder with a file inside
mkdir logs
echo "Debug log entry" > logs/debug.log

# Verify creation
ls -la
ls -la logs/
```

---

## Step 3: Check Git Status (Before .gitignore)

```bash
git status
# Output will show app.log and logs/ as untracked files
```

---

## Step 4: Create the `.gitignore` File

```bash
# Create .gitignore in the repository root
touch .gitignore
```

Open `.gitignore` and add the following content:

```
# Ignore all .log files
*.log

# Ignore the entire logs directory
logs/

# Ignore OS-generated files
.DS_Store
Thumbs.db

# Ignore IDE files
.idea/
*.iml
```

---

## Step 5: Verify That Files Are Ignored

```bash
git status
# Now app.log and logs/ should NOT appear in untracked files
# Only .gitignore itself should show as untracked
```

Expected output:
```
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore

nothing added to commit but untracked files present
```

---

## Step 6: Add and Commit `.gitignore`

```bash
git add .gitignore
git commit -m "Add .gitignore to exclude log files and folders"

# Final status check
git status
# Output: nothing to commit, working tree clean
```

---

## Step 7: Push to Remote Repository

```bash
git push origin master
```

---

## Verify on Remote

Open your GitLab/GitHub repo in browser:
- `app.log` and `logs/` folder should **not** be present
- Only `.gitignore` and `welcome.txt` should be visible

---

## Key `.gitignore` Patterns

| Pattern | Meaning |
|---------|---------|
| `*.log` | All files with `.log` extension |
| `logs/` | The entire `logs` directory |
| `!important.log` | Exception — do NOT ignore this file |
| `build/` | Ignore build output directory |
| `**/*.tmp` | All `.tmp` files in any subdirectory |
