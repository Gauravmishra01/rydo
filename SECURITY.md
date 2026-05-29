Security recommendations

- Do not commit secrets (API keys, DB credentials, JWT secrets) to the repository.
- Rotate any exposed keys immediately (Google API keys, DB credentials, JWT secret).
- Use `.env` locally and add `.env.example` with placeholders in the repo.
- Restrict API key scopes (e.g., MapTiler key: restrict by origin and deployment environment where possible).
- If secrets were committed, remove them from git history using `git filter-repo` or `git filter-branch` and force-push.
- Store production secrets in a secret manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, or CI/CD encrypted vars).

Quick steps to rotate keys:

1. Create new credentials in your cloud provider.
2. Replace values in local `.env` only.
3. Update any server-side deployments with new secrets.
4. Revoke the old keys.

If you want, I can:

- Replace any plaintext keys in tracked files with placeholders in this repo.
- Add steps to purge the git history of secrets.
