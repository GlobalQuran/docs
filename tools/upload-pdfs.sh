#!/usr/bin/env bash
# Uploads the PDFs from make-pdfs.mjs to cdn.globalquran.com/resources/pdf/ (R2 bucket globalquran-assets).
# Same credentials as the terraform folder (its .env): run it yourself.   tools/upload-pdfs.sh [folder with the PDFs]
set -euo pipefail
SRC="${1:-$(dirname "$0")/out}"
TF="${TF_DIR:-$(cd "$(dirname "$0")/../../../git-private-apps/microservices/terraform" && pwd)}"
set -a; . "$TF/.env"; set +a
export AWS_ENDPOINT_URL_S3="https://${TF_VAR_cloudflare_account_id}.r2.cloudflarestorage.com"
export AWS_ACCESS_KEY_ID="$(curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" https://api.cloudflare.com/client/v4/user/tokens/verify | python3 -c 'import sys,json;print(json.load(sys.stdin)["result"]["id"])')"
export AWS_SECRET_ACCESS_KEY="$(printf %s "$CLOUDFLARE_API_TOKEN" | shasum -a 256 | cut -d' ' -f1)"
export AWS_DEFAULT_REGION=auto AWS_PROFILE=
for f in "$SRC"/*.pdf; do
  echo "uploading $(basename "$f")"
  aws s3 cp "$f" "s3://globalquran-assets/resources/pdf/$(basename "$f")" --content-type application/pdf
done
echo "check: https://cdn.globalquran.com/resources/pdf/quran-arabic.pdf"
