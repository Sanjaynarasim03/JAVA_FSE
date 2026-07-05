# Exercise 3 - Branching and Merging

## Objectives
- Create and switch between branches
- Make changes in a branch
- Merge the branch back to master
- Use `git log` graph to visualize history

---

## Step 1: Verify Master is Clean

```bash
cd GitDemo
git status
# Should show: nothing to commit, working tree clean
git branch
# Shows: * master
```

---

## Step 2: Create a New Branch

```bash
# Create branch named GitNewBranch
git branch GitNewBranch

# List all local branches (* marks current branch)
git branch

# List all local AND remote branches
git branch -a
```

---

## Step 3: Switch to the New Branch

```bash
git checkout GitNewBranch
# OR (modern syntax)
git switch GitNewBranch

# Verify we are on GitNewBranch
git branch
```

---

## Step 4: Add Files in the Branch

```bash
# Create a new file in the branch
echo "Feature work in GitNewBranch" > feature.txt

# Stage and commit the new file
git add feature.txt
git commit -m "Add feature.txt in GitNewBranch"

# Check status
git status

# View log
git log --oneline
```

---

## Step 5: Switch Back to Master

```bash
git checkout master
# OR
git switch master

# Verify feature.txt is NOT in master
ls
# Only welcome.txt and .gitignore should appear
```

---

## Step 6: View Differences Between Master and Branch

```bash
# Command-line diff
git diff master GitNewBranch

# Summarized diff (which files changed)
git diff --stat master GitNewBranch
```

---

## Step 7: Merge GitNewBranch into Master

```bash
# Make sure you are on master
git branch

# Merge the branch
git merge GitNewBranch

# Verify feature.txt is now in master
ls
cat feature.txt
```

---

## Step 8: View Merge History (Graph)

```bash
git log --oneline --graph --decorate
```

Expected output:
```
*   abc1234 (HEAD -> master) Merge branch 'GitNewBranch'
|\
| * def5678 (GitNewBranch) Add feature.txt in GitNewBranch
|/
* ghi9012 Add .gitignore to exclude log files and folders
* jkl3456 Initial commit: added welcome.txt
```

---

## Step 9: Delete the Branch After Merging

```bash
# Delete the merged branch
git branch -d GitNewBranch

# Verify it is deleted
git branch
```

---

## Step 10: Push to Remote

```bash
git push origin master
```

---

## Key Concepts

| Command | Description |
|---------|-------------|
| `git branch <name>` | Create a new branch |
| `git checkout <name>` | Switch to a branch |
| `git merge <name>` | Merge named branch into current branch |
| `git branch -d <name>` | Delete a branch (safe — only if merged) |
| `git log --graph` | Visual ASCII graph of commit history |
