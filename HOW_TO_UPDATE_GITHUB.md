# How to Update Your Files on GitHub

Once you've made changes to your project, you need to "upload" or "push" them to your GitHub repository so they are saved. This is a three-step process using the command line.

Follow these simple steps whenever you want to update your project on GitHub.

### Step 1: Stage Your Changes

First, you need to tell Git which files you want to save. You can add all the files you've changed with one simple command.

Open your terminal or command prompt, make sure you are in your project's directory, and type:

```bash
git add .
```

(Don't forget the period `.` at the end. It means "add all files in the current directory and subdirectories".)

### Step 2: Commit Your Changes

Next, you need to "commit" your changes. A commit is like a snapshot of your staged files at a specific point in time. Each commit has a message that briefly describes the changes you made.

This message is important for keeping track of your project's history.

Type the following command, replacing `"Your descriptive message"` with your own summary of the changes.

```bash
git commit -m "Your descriptive message"
```

**Examples of good commit messages:**
*   `git commit -m "Fix: Corrected the login button bug"`
*   `git commit -m "Feat: Added a new user profile page"`
*   `git commit -m "Docs: Updated the installation guide"`

### Step 3: Push Your Changes to GitHub

Finally, you need to "push" your committed changes from your local computer to your repository on GitHub. This is the step that actually "uploads" your files.

Type this command:

```bash
git push
```

---

### Full Workflow Example

Here's how it looks all together. Let's say you just changed the text on the homepage.

1.  **Stage the file:**
    ```bash
    git add .
    ```

2.  **Commit the change:**
    ```bash
    git commit -m "Update homepage welcome text"
    ```

3.  **Push to GitHub:**
    ```bash
    git push
    ```

And you're done! Your changes are now live on your GitHub repository.
