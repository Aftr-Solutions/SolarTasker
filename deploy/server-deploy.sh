#!/usr/bin/env bash
# Runs ON the EC2 as root via SSM Run Command (see .github/workflows/deploy.yml).
# Args: <api-image> <web-image>
# Env:  COMPOSE_B64    (docker-compose.prod.yml, base64)
#       DB_COMPOSE_B64 (deploy/db-compose.yml, base64)
#       SCHEMA_B64     (deploy/schema.sql, base64; idempotent, applied every deploy)
set -euo pipefail
API_IMAGE="$1"; WEB_IMAGE="$2"
APP_DIR=/opt/solartasker
REGION=ap-south-1
PARAM_PATH=/solartasker
REGISTRY="${API_IMAGE%%/*}"

mkdir -p "$APP_DIR/logs"
chown 1000:1000 "$APP_DIR/logs"   # 'node' user inside the api image
cd "$APP_DIR"
echo "$COMPOSE_B64" | base64 -d > docker-compose.prod.yml

command -v aws >/dev/null || snap install aws-cli --classic

# Secrets: SSM Parameter Store (SecureString) -> .env, read with the instance role.
umask 077
aws ssm get-parameters-by-path --region "$REGION" --path "$PARAM_PATH" --with-decryption \
  --query 'Parameters[].[Name,Value]' --output json \
  | python3 -c 'import json,sys
# Single-quoted values: docker compose keeps them literal (no $VAR interpolation),
# so secrets containing "$" reach the containers unchanged.
for n,v in json.load(sys.stdin):
    k=n.rsplit("/",1)[1]
    if "\x27" in v: sys.exit("ERROR: %s contains a single quote" % k)
    print("%s=\x27%s\x27" % (k, v))' > .env.new
[ -s .env.new ] || { echo "ERROR: no parameters under $PARAM_PATH in SSM"; exit 1; }
mv .env.new .env
umask 022
echo "env keys: $(cut -d= -f1 .env | tr '\n' ' ')"

# --- Database: MariaDB container in its own project (/opt/solartasker-db) ---
DB_DIR=/opt/solartasker-db
NET=solartasker_solartasker-net
docker network inspect "$NET" >/dev/null 2>&1 || \
  docker network create --label com.docker.compose.project=solartasker \
    --label com.docker.compose.network=solartasker-net "$NET" >/dev/null
mkdir -p "$DB_DIR/init"
echo "$DB_COMPOSE_B64" | base64 -d > "$DB_DIR/docker-compose.yml"
if [ ! -s "$DB_DIR/.env" ]; then
  # First run only: DB name/user/password come from SSM (same values the api uses),
  # root password is generated here and never leaves the server.
  umask 077
  aws ssm get-parameters-by-path --region "$REGION" --path "$PARAM_PATH" --with-decryption \
    --query 'Parameters[].[Name,Value]' --output json \
    | ROOT_PW="$(openssl rand -hex 24)" python3 -c 'import json,os,sys
p={n.rsplit("/",1)[1]:v for n,v in json.load(sys.stdin)}
vals={"MARIADB_ROOT_PASSWORD":os.environ["ROOT_PW"],"MARIADB_DATABASE":p["DB_NAME"],
      "MARIADB_USER":p["DB_USER"],"MARIADB_PASSWORD":p["DB_PASSWORD"]}
for k,v in vals.items():
    if "\x27" in v: sys.exit("ERROR: %s contains a single quote" % k)
    print("%s=\x27%s\x27" % (k, v))' > "$DB_DIR/.env"
  umask 022
fi
docker compose -f "$DB_DIR/docker-compose.yml" --project-directory "$DB_DIR" up -d
s=starting
for i in $(seq 1 30); do
  s=$(docker inspect -f '{{.State.Health.Status}}' solartasker-db 2>/dev/null || echo missing)
  [ "$s" = healthy ] && break; sleep 5
done
echo "db: $s"
[ "$s" = healthy ] || { docker logs --tail 30 solartasker-db 2>&1; exit 1; }
# Create any missing tables (CREATE TABLE IF NOT EXISTS; existing data untouched)
echo "$SCHEMA_B64" | base64 -d | docker exec -i solartasker-db \
  sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"'
echo "schema: $(docker exec solartasker-db sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\"$MARIADB_DATABASE\""') tables"

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"
export SOLARTASKER_API_IMAGE="$API_IMAGE" SOLARTASKER_WEB_IMAGE="$WEB_IMAGE"
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans
docker image prune -f >/dev/null

sleep 15
docker compose -f docker-compose.prod.yml ps
echo "--- api logs"; docker logs --tail 30 solartasker-api 2>&1
code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8095/ || true)
echo "web: HTTP $code"
api=$(curl -s http://127.0.0.1:8095/api/ || true)
echo "api: $api"
[ "$code" = "200" ] && [ "$api" = "Success" ]
