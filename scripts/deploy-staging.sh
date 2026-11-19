#!/usr/bin/env bash
set -euo pipefail

: "${SFTP_HOST:?Set the Hostinger SSH hostname}"
: "${SFTP_PORT:?Set the Hostinger SSH port}"
: "${SFTP_USER:?Set the Hostinger SSH username}"
: "${STAGING_ROOT:?Set the absolute staging document root}"
: "${SFTP_KEY:?Configure the staging SSH key in GitHub}"
: "${SFTP_KNOWN_HOSTS:?Configure the verified Hostinger host key in GitHub}"

if [[ ! "$SFTP_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ||
      ! "$SFTP_PORT" =~ ^[0-9]{1,5}$ ||
      ! "$SFTP_USER" =~ ^[a-zA-Z0-9_][a-zA-Z0-9_-]*$ ||
      ! "$STAGING_ROOT" =~ ^(/[a-zA-Z0-9._-]+)+$ ]]; then
  echo 'Invalid Hostinger SFTP settings.' >&2
  exit 1
fi

test -f dist/en/index.html
test -f dist/ar/index.html
grep -q '^Disallow: /$' dist/robots.txt

protection=$(curl --silent --show-error --max-time 15 --output /dev/null \
  --write-out '%{http_code}' 'https://staging.rysetup.com/')
if [[ "$protection" != 401 ]]; then
  echo 'Enable password protection for staging.rysetup.com before uploading.' >&2
  exit 1
fi

umask 077
credentials=$(mktemp -d)
trap 'rm -rf -- "$credentials"' EXIT
printf '%s\n' "$SFTP_KEY" > "$credentials/key"
printf '%s\n' "$SFTP_KNOWN_HOSTS" > "$credentials/known_hosts"
connect=(
  -b - -P "$SFTP_PORT" -i "$credentials/key"
  -o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=15
  -o StrictHostKeyChecking=yes
  -o "UserKnownHostsFile=$credentials/known_hosts"
  "$SFTP_USER@$SFTP_HOST"
)

# Require two independent checks before writing to the remote directory.
sftp "${connect[@]}" <<SFTP
cd "$STAGING_ROOT"
get .rysetup-staging "$credentials/marker"
SFTP
if [[ $(cat "$credentials/marker") != staging.rysetup.com ]]; then
  echo 'The configured document root is missing the staging marker.' >&2
  exit 1
fi

sftp "${connect[@]}" <<SFTP
cd "$STAGING_ROOT"
lcd dist
put -r *
SFTP
