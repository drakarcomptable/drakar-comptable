#!/usr/bin/env bash
# Verifie que les reperes rouges tombent bien ou on les a places.
#
# L'image d'etalonnage porte des pastilles vertes a des pourcentages connus,
# et son rapport (2,5) ne ressemble pas a celui du cadre de la page. Si le
# rendu recadrait l'image sans recaler les reperes, ils glisseraient : c'est
# exactement le defaut que cet essai attrape.
#
#   bash proposition/essais/lance.sh
set -euo pipefail

RACINE="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$RACINE"

echo "1. fabrication de la proposition d'etalonnage"
python3 proposition/gen.py proposition/essais/etalon.json >/dev/null

echo "2. rasterisation de la page de diagnostic"
rm -f proposition/sortie/etalon-page3-3.png
pdftoppm -png -r 150 -f 3 -l 3 proposition/sortie/etalon.pdf \
         proposition/sortie/etalon-page3

echo "3. mesure"
python3 -m http.server 8779 --directory proposition/sortie >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
node proposition/essais/mesure.cjs etalon-page3-3.png
