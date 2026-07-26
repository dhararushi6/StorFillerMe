#!/usr/bin/env bash
# Generates an RS256 key pair for signing access JWTs.
# The PRIVATE key must NEVER be committed — it goes into Railway/GitHub secrets
# (or a gitignored apps/api/.env in dev). Prints \n-escaped one-liners for env vars.
set -euo pipefail

OUT="${1:-.}"
openssl genpkey -algorithm RSA -out "$OUT/jwt-private.pem" -pkeyopt rsa_keygen_bits:2048 2>/dev/null
openssl rsa -pubout -in "$OUT/jwt-private.pem" -out "$OUT/jwt-public.pem" 2>/dev/null

echo "JWT_PRIVATE_KEY=$(awk 'BEGIN{ORS="\\n"}1' "$OUT/jwt-private.pem")"
echo "JWT_PUBLIC_KEY=$(awk 'BEGIN{ORS="\\n"}1' "$OUT/jwt-public.pem")"
echo ""
echo "# Private key written to $OUT/jwt-private.pem — do NOT commit it." >&2
