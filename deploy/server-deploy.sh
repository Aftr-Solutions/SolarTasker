#!/usr/bin/env bash
# Runs ON the EC2 as root via SSM Run Command (see .github/workflows/deploy.yml).
# Args: <api-image> <web-image>   Env: COMPOSE_B64 (docker-compose.prod.yml, base64)
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
for n,v in json.load(sys.stdin):
    v=v.replace("\\","\\\\").replace("\"","\\\"").replace("\n","\n")
    print("%s=\"%s\"" % (n.rsplit("/",1)[1], v))' > .env.new
[ -s .env.new ] || { echo "ERROR: no parameters under $PARAM_PATH in SSM"; exit 1; }
mv .env.new .env
umask 022
echo "env keys: $(cut -d= -f1 .env | tr '\n' ' ')"

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
