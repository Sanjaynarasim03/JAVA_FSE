# Exercise 5 - Cleanup and Remote Push

## Objectives
- Verify master is in a clean state
- Pull latest changes from remote repository
- Push pending local changes to remote
- Verify the changes appear on the remote (GitHub/GitLab)

---

## Step 1: Verify Master is Clean

```bash
cd GitDemo

# Switch to master (if not already on it)
git checkout master

# Check for any uncommitted changes
git status
# Expected: nothing to commit, working tree clean
```

---

## Step 2: List All Branches

```bash
# List all local branches
git branch

# List all branches (local + remote)
git branch -a
```

---

## Step 3: Pull Latest Changes from Remote

```bash
# Pull from remote master to sync with the latest state
git pull origin master

# If there are divergent histories
git pull origin master --rebase
```

---

## Step 4: View Pending Commits to be Pushed

```bash
# Show commits in local that are NOT in remote
git log origin/master..HEAD --oneline

# Or view full push status
git status
```

---

## Step 5: Push All Pending Changes to Remote

```bash
# Push to origin master
git push origin master

# Verify push was successful
git status
# Expected: Your branch is up to date with 'origin/master'.
```

---

## Step 6: Verify on Remote Repository

1. Open **GitHub/GitLab** in your browser
2. Navigate to the **GitDemo** repository
3. Confirm these files are visible:
   - `welcome.txt`
   - `.gitignore`
   - `feature.txt`
   - `hello.xml`

---

## Step 7: Final Log Visualization

```bash
git log --oneline --graph --decorate --all
```

Expected final graph:
```
* f9g8h7i (HEAD -> master, origin/master) Resolved merge conflict in hello.xml
*\  
| * c6d5e4f (origin/GitWork) Add hello.xml in GitWork branch
|/
* b3c2d1e Add hello.xml in master with different content
* a0b9c8d Merge branch 'GitNewBranch'
* z1y2x3w Add .gitignore to exclude log files and folders
* m4n5o6p Initial commit: added welcome.txt
```

---

## Step 8: Best Practices for Cleanup

```bash
# Remove stale remote-tracking references
git remote prune origin

# Check remote URL
git remote -v

# See if local is fully synced with remote
git fetch origin
git status
```

---

## Summary of Complete Workflow

```bash
# Full cycle summary
git init                                   # Initialize repo
git add <file>                             # Stage file
git commit -m "message"                    # Commit locally
git remote add origin <url>               # Link remote
git pull origin master                     # Sync with remote
git push origin master                     # Upload to remote
git branch <name>                          # Create branch
git checkout <name>                        # Switch branch
git merge <name>                           # Merge branch
git branch -d <name>                       # Delete branch
git log --oneline --graph --decorate       # View history
```
