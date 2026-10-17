#!/usr/bin/env bash
# Renders the photo-composite intro scenes. Opaque previews as mp4; clip-window scenes and lower thirds also as alpha mov.
set -e
cd "$(dirname "$0")"
mkdir -p out
R="node render.mjs photo/scene.html"
$R 5  out/03_35cents_0m10s            --query "scene=s03_35cents"
$R 9  out/04_news_0m15s_preview       --query "scene=s04_news"
$R 9  out/04_news_0m15s_ALPHA         --query "scene=s04_news" --alpha
$R 13 out/05_georgieva_0m24s_preview  --query "scene=s05_georgieva"
$R 13 out/05_georgieva_0m24s_ALPHA    --query "scene=s05_georgieva" --alpha
$R 5  out/06_outcomes_0m37s           --query "scene=s06_outcomes"
$R 6  out/08_owners                   --query "scene=s08_owners"
$R 5  out/LT_georgieva_ALPHA --alpha --query "scene=lt&name=Kristalina Georgieva&role=Managing Director, IMF&date=13 Oct 2026"
$R 4  out/LT_dimon_ALPHA     --alpha --query "scene=lt&name=Jamie Dimon&role=Chief Executive, JPMorgan Chase&dur=4"
$R 4  out/LT_musk_ALPHA      --alpha --query "scene=lt&name=Elon Musk&role=US-Saudi Investment Forum&date=19 Nov 2025&dur=4"
$R 4  out/LT_ellison_ALPHA   --alpha --query "scene=lt&name=Larry Ellison&role=Co-founder, Oracle&date=Sep 2024&dur=4"
echo ALL DONE
