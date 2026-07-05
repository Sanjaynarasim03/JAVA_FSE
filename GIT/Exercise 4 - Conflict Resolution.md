# Exercise 4 - Conflict Resolution

## Objectives
- Simulate a merge conflict between master and a branch
- Understand Git conflict markers
- Resolve the conflict using a 3-way merge approach

---

## Step 1: Verify Master is Clean

```bash
cd GitDemo
git status
git log --oneline --graph --decorate --all
```

---

## Step 2: Create Branch "GitWork" and Add hello.xml

```bash
# Create and switch to GitWork branch
git checkout -b GitWork

# Create hello.xml in the branch with content
cat > hello.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<greeting>
    <message>Hello from GitWork Branch</message>
    <author>Developer A</author>
</greeting>
EOF

# Stage and commit
git add hello.xml
git commit -m "Add hello.xml in GitWork branch"

# Check status
git status
```

---

## Step 3: Switch to Master and Add a Different hello.xml

```bash
# Switch back to master
git checkout master

# Create hello.xml in master with DIFFERENT content
cat > hello.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<greeting>
    <message>Hello from Master Branch</message>
    <author>Developer B</author>
</greeting>
EOF

# Stage and commit to master
git add hello.xml
git commit -m "Add hello.xml in master with different content"
```

---

## Step 4: View the Diverged Log

```bash
git log --oneline --graph --decorate --all
```

Expected output:
```
* a1b2c3d (HEAD -> master) Add hello.xml in master with different content
| * d4e5f6g (GitWork) Add hello.xml in GitWork branch
|/
* h7i8j9k Merge branch 'GitNewBranch'
```

---

## Step 5: Check Diff Between Master and GitWork

```bash
git diff master GitWork
```

---

## Step 6: Attempt the Merge (Triggers Conflict)

```bash
# Merge GitWork into master — this will fail with conflict
git merge GitWork
```

Expected output:
```
Auto-merging hello.xml
CONFLICT (add/add): Merge conflict in hello.xml
Automatic merge failed; fix conflicts and then commit the result.
```

---

## Step 7: View the Conflict Markers

```bash
cat hello.xml
```

Git marks the conflicting sections:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<greeting>
<<<<<<< HEAD
    <message>Hello from Master Branch</message>
    <author>Developer B</author>
=======
    <message>Hello from GitWork Branch</message>
    <author>Developer A</author>
>>>>>>> GitWork
</greeting>
```

---

## Step 8: Resolve the Conflict Manually

Edit `hello.xml` to combine or choose the correct content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<greeting>
    <message>Hello from Both Master and GitWork Branch</message>
    <author>Developer A and Developer B</author>
</greeting>
```

> Remove `<<<<<<<`, `=======`, and `>>>>>>>` markers after resolving.

---

## Step 9: Stage and Commit the Resolution

```bash
# Stage the resolved file
git add hello.xml

# Commit the merge resolution
git commit -m "Resolved merge conflict in hello.xml"

# View the final log
git log --oneline --graph --decorate
```

---

## Step 10: Update .gitignore and Clean Up

```bash
# Add any backup files created during merge to .gitignore
echo "*.orig" >> .gitignore
git add .gitignore
git commit -m "Add *.orig to .gitignore after merge cleanup"

# List all branches
git branch

# Delete GitWork branch
git branch -d GitWork

# Final log
git log --oneline --graph --decorate
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| `<<<<<<< HEAD` | Start of your current branch content |
| `=======` | Divider between conflicting versions |
| `>>>>>>> branch` | End of incoming branch content |
| 3-way merge | Git uses common ancestor + both branches to resolve |
| `git merge --abort` | Abort an in-progress merge to restore clean state |
