#!/usr/bin/env bash
# Одноразовая подготовка VPS: ставит docker + docker compose и создаёт /opt/quiet-dialogue.
# Запускать на сервере под root ОДИН РАЗ:
#   bash server-bootstrap.sh
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "[+] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "[+] Installing docker compose plugin..."
  apt-get update
  apt-get install -y docker-compose-plugin || true
fi

systemctl enable --now docker

mkdir -p /opt/quiet-dialogue
cd /opt/quiet-dialogue
mkdir -p data public/uploads backups

echo "[OK] Сервер готов. Теперь запустите GitHub Actions (Run workflow) или сделайте push в main."
