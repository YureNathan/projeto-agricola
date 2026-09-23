#!/usr/bin/env bash
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BRUTOS="$RAIZ/videos-output"
FINAL="$RAIZ/videos-final"

mkdir -p "$FINAL"

for webm in "$BRUTOS"/*/*.webm; do
    [ -e "$webm" ] || continue

    nome="$(basename "$webm" .webm)"
    echo "▶ Convertendo $nome"

    ffmpeg -y -i "$webm" \
        -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow \
        -movflags +faststart \
        "$FINAL/$nome.mp4"
done

echo "✔ Vídeos finais em $FINAL"
