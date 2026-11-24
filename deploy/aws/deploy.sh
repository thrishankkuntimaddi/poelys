#!/usr/bin/env bash
# Build poelys.com and put it live on the AWS Lightsail server `lvn-prod` (16.4.70.135, ap-south-1).
#
#   ./deploy/aws/deploy.sh            # build, back up the live site, upload, switch over
#   ./deploy/aws/deploy.sh rollback   # put the most recent backup back
#
# Needs the AWS CLI signed in to the account that owns lvn-prod (`aws login`). SSH uses a short-lived
# certificate from `aws lightsail get-instance-access-details`, so no key files are kept anywhere.
#
# On the server, Caddy (the `lvn-caddy-1` container of the LearnViaNotes stack in /opt/lvn) serves
# /home/deploy/poelys-site as /srv/poelys. This script only touches that folder and its backups:
# no Caddy reload, so LearnViaNotes and expensetracker.poelys.com are never interrupted.
set -euo pipefail

INSTANCE=lvn-prod
REGION=ap-south-1
SITE=/home/deploy/poelys-site
cd "$(dirname "$0")/../.."

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
aws lightsail get-instance-access-details --region "$REGION" --instance-name "$INSTANCE" --protocol ssh --output json > "$TMP/access.json"
python3 -I - "$TMP" <<'PY'
import json, os, sys
d = json.load(open(os.path.join(sys.argv[1], 'access.json')))['accessDetails']
t = sys.argv[1]
open(f'{t}/key', 'w').write(d['privateKey']); os.chmod(f'{t}/key', 0o600)
open(f'{t}/key-cert.pub', 'w').write(d['certKey'])
open(f'{t}/known_hosts', 'w').write(''.join(f"{d['ipAddress']} {h['algorithm']} {h['publicKey']}\n" for h in d['hostKeys']))
open(f'{t}/host', 'w').write(f"{d['username']}@{d['ipAddress']}")
PY
rm "$TMP/access.json"
HOST="$(cat "$TMP/host")"
SSH=(ssh -i "$TMP/key" -o CertificateFile="$TMP/key-cert.pub" -o UserKnownHostsFile="$TMP/known_hosts" -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes)

if [[ "${1:-}" == "rollback" ]]; then
  "${SSH[@]}" "$HOST" "set -e; last=\$(sudo sh -c 'ls -1d $SITE.prev-*' | sort | tail -1); sudo rsync -a --delete \$last/ $SITE/; echo restored \$last"
  exit 0
fi

npm ci
npm run build

TS="$(date +%Y%m%dT%H%M)"
"${SSH[@]}" "$HOST" "set -e; sudo cp -a $SITE $SITE.prev-$TS; rm -rf ~/poelys-upload; mkdir -p ~/poelys-upload
  sudo sh -c 'ls -1d $SITE.prev-*' | sort | head -n -5 | xargs -r sudo rm -rf"
rsync -az --delete -e "${SSH[*]}" dist/ "$HOST:poelys-upload/"
"${SSH[@]}" "$HOST" "set -e; test -f ~/poelys-upload/index.html
  sudo rsync -a --chown=deploy:deploy --delay-updates --delete-after ~/poelys-upload/ $SITE/
  sudo chmod -R a+rX $SITE; rm -rf ~/poelys-upload"

for u in https://poelys.com/ https://app.learnvianotes.in/ https://expensetracker.poelys.com/; do
  printf '%-40s %s\n' "$u" "$(curl -s -o /dev/null -L --max-time 15 -w '%{http_code}' "$u")"
done
echo "Live. Backup of the previous site: $SITE.prev-$TS"
