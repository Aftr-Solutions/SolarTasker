# Deploying SolarTasker

Live: **http://13.233.73.99:8095** (shared EC2 `i-0fe1dd19adfb072d6`, ap-south-1)

## How it works
Push to `main` (or run the workflow manually) → `.github/workflows/deploy.yml`:
1. **build** – builds `server/` (Node API) and `client/` (React build + nginx) images and pushes them to ECR (`solartasker-api`, `solartasker-web`).
2. **deploy** – copies any GitHub secrets that are set into SSM Parameter Store (`/solartasker/*`), then runs `deploy/server-deploy.sh` on the EC2 via SSM Run Command. That script writes `/opt/solartasker/.env` from SSM and runs `docker compose up`.

Auth is keyless: GitHub OIDC → IAM role `github-actions-solartasker-deploy` (trusted only for this repo's `main`). No AWS keys or SSH keys in GitHub.

## Routing
`solartasker-web` (nginx, host port 8095) serves the React app and proxies
`/api/*` → `solartasker-api:5002` and `/ws` → `solartasker-api:8080` (notifications WebSocket).

## Secrets
Add them in GitHub → Settings → Secrets and variables → Actions (names as in `server/.env.example`),
or edit them directly in SSM Parameter Store under `/solartasker/`. Then re-run the workflow.

## Database
MySQL is external (cPanel host). Its "Remote MySQL" must allow `13.233.73.99`.
