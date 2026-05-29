# Security cleanup and secret-removal guide

This document explains how to safely purge secrets from the git history and rotate the exposed credentials. These steps rewrite Git history — follow carefully and coordinate with any collaborators.

Overview

- Create a mirror backup of the repo
- Use `git-filter-repo` (recommended) or BFG to remove secrets/files or replace secret strings
- Force-push cleaned history and notify collaborators to re-clone
- Rotate exposed secrets (DB user, JWT secret, Google API keys)

Important safety notes

- BACK UP the repository before doing any history rewrite. Consider cloning a mirror copy on another disk or directory.
- Do not paste secrets into a public place. Run the replacement commands locally.
- After force-pushing, every collaborator must re-clone (not pull) the repository.

1. Prepare a mirror backup (required)

Replace `<origin-url>` with your remote URL or work from the local path.

```powershell
# Make a bare mirror clone (creates a full mirror of refs and objects)
git clone --mirror "$(git remote get-url origin)" repo-mirror.git
cd repo-mirror.git
```

2. Remove files entirely from history (safe if you want to remove whole files like `.env`)

This removes files from all commits. Use with care.

```powershell
# Remove specific files from history (example removes Backend/.env and frontend/.env)
git filter-repo --path Backend/.env --path frontend/.env --invert-paths

# Push cleaned history back to the remote
git push --force --all
git push --force --tags
```

3. Replace specific secret strings (if you want to keep files but scrub secrets)

Create a `replacements.txt` with the secret(s) you want to redact.

Format examples (use the exact secret values; do not put this in a public place):

```
# replacements.txt format for git-filter-repo
OLD_SECRET_VALUE==>REDACTED
ANOTHER_SECRET==>REDACTED
```

Then run:

```powershell
git filter-repo --replace-text replacements.txt
git push --force --all
git push --force --tags
```

4. Alternative: BFG Repo Cleaner

If you prefer BFG (Java-based), you can remove files or replace text. BFG is simpler for file removal:

```powershell
# Remove files named .env from history
java -jar bfg.jar --delete-files ".env" repo-mirror.git
cd repo-mirror.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

5. After pushing cleaned history

- Notify all collaborators to delete their local clones and re-clone the repository. Example message:

  "We rewrote git history to remove exposed secrets. Please clone the repo afresh: `git clone <repo-url>` — do not pull into existing clones."

- Update your remote hosting service secrets and CI/CD secrets to the new values.

6. Rotate secrets (recommended order)

- MongoDB (Atlas)
  1. Create a new DB user with a strong password and limited privileges.
  2. Update your server `.env` with the new connection string (update `MONGODB_URI`).
  3. Test the connection locally and in a staging environment.
  4. Once verified, remove or disable the old DB user.

- JWT secret
  1. Generate a new secret (e.g., use a secure generator / `openssl rand -hex 32`).
  2. Replace `JWT_SECRET` in the server `.env` on all deployments and restart.
  3. Optionally invalidate existing tokens by using a token version or blacklist mechanism. If not using blacklists, rotating the secret will immediately invalidate all issued JWTs.

- MapTiler API key
  1. In the MapTiler dashboard, create a new API key.
  2. Restrict the key to the required app environments where possible.
  3. Replace client and server keys in `.env` files and deployments.
  4. Delete or restrict the old key.

- Other services / CI secrets
  1. Update secrets stored in your CI/CD provider (GitHub Actions, Azure DevOps, CircleCI, etc.).
  2. Replace the values in the hosting environment (Docker secrets, Kubernetes secrets, cloud env vars).

7. Post-clean checklist

- Confirm services start and environment variables are set correctly.
- Run integration tests and smoke tests on staging.
- Verify that old secrets are revoked and the application functions.
- Communicate to team about the rotation and re-cloning requirement.

If you want, I can prepare a small, non-destructive PowerShell helper script that prints the exact filter-repo or BFG commands for your repo and guides you interactively — run it locally on your machine (it will not run destructive commands unless you explicitly enable them).
