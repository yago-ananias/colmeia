#!/bin/sh
# Monta a versão do site (GitHub Pages) em _site/ a partir de colmeia.html + site/ (ícones e manifesto).
# Uso: sh ferramentas/site.sh   (de dentro da raiz do repositório). Rode montar.sh antes se mudou palavras ou template.
set -e
# Medição de uso (spec 009): ID do site no Umami Cloud. Vazio = o site não mede nada.
UMAMI_ID="f590aacb-f874-4d8c-b03c-2224e16169eb"
cd "$(dirname "$0")/.."
rm -rf _site && mkdir -p _site && cp site/* _site/
{
cat <<'HEAD'
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Jogo de palavras em português: forme palavras com 7 letras, sempre usando a do centro. Três desafios por dia, modo escuro e modo relâmpago.">
<meta name="theme-color" content="#EDF0E8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16151E" media="(prefers-color-scheme: dark)">
<meta property="og:title" content="Colmeia de Palavras">
<meta property="og:description" content="Forme palavras com 7 letras, sempre usando a do centro. Três desafios por dia.">
<meta property="og:url" content="https://yago-ananias.github.io/colmeia/">
<meta property="og:image" content="https://yago-ananias.github.io/colmeia/icone-512.png">
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" href="favicon.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">
<link rel="icon" href="favicon-escuro.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
HEAD
if [ -n "$UMAMI_ID" ]; then
  printf '<script defer src="https://cloud.umami.is/script.js" data-website-id="%s" data-domains="yago-ananias.github.io" data-do-not-track="true"></script>\n' "$UMAMI_ID"
fi
printf '</head>\n<body>\n'
cat colmeia.html
printf '\n</body>\n</html>\n'
} > _site/index.html
echo "_site/index.html gerado"
