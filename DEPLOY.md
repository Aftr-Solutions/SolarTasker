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
MySQL previously lived on an external cPanel host (port 3306 was firewalled from EC2); see "Database (local container)" below.

## Database (local container)
MySQL now runs on the same EC2 as a MariaDB 11.4 container, managed separately from the app:
- Defined in `deploy/db-compose.yml`; every deploy (GitHub Actions, OIDC) copies it to `/opt/solartasker-db` and runs `docker compose up -d`. `.env` there (root/user passwords, mode 600) is created on the first deploy only
- Container `solartasker-db`, volume `solartasker-db_solartasker-mysql`, network `solartasker_solartasker-net`
- SSM `/solartasker/DB_HOST` = `solartasker-db`, `DB_PORT` = `3306` (port not published on the host)
- The DB is never recreated by app deploys and its data stays in the volume. Import a dump with:
  `docker exec -i solartasker-db sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"' < dump.sql`
- Tables are defined in `deploy/schema.sql` and created on every deploy with `CREATE TABLE IF NOT EXISTS`
  (existing tables and data are never altered). To add a column later, add an explicit `ALTER TABLE` step.
- First admin login is the `admin` user in `owners`; change its password from the Users page after logging in.
