# How to Replace Your GitHub Project with Your Firebase Studio Project

**⚠️ Warning: The following steps are destructive. They will permanently delete the existing code and history in your GitHub repository and replace it with the project you have in Firebase Studio. Please be certain you want to do this.**

If you're sure you want to replace your GitHub project, follow these simple steps.

---

### Step 1: Open a Terminal

Open a command-line terminal in your project's main folder (the same place where you run `npm run dev`).

---

### Step 2: Connect Your Local Project to GitHub

First, you need to tell your local project where your GitHub repository is. Copy the following command, but **replace `<YOUR_GITHUB_REPO_URL>`** with your actual repository URL (e.g., `https://github.com/your-username/your-project.git`).

```bash
git remote set-url origin <YOUR_GITHUB_REPO_URL>
```
*You can find your repository URL on your GitHub project page by clicking the green "Code" button.*

---

### Step 3: Force Push to Replace the Project

This is the final step. It will "force" your local project to become the new main version on GitHub, overwriting everything.

Copy and paste this command exactly as it is:

```bash
git push -u origin main --force
```

---

### You're Done!

After the command finishes, go to your GitHub repository in your web browser. You should see that it now perfectly matches your project from Firebase Studio.

If you have any questions or get an error, feel free to ask!