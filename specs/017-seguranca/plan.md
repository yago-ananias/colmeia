# Plano: Correções da avaliação de segurança

## Abordagem
- `site.sh` calcula com Node os hashes dos blocos `<script>` de `colmeia.html` e escreve a CSP no `<head>`, antes do script do Umami. Assim, nenhuma mudança no jogo exige editar a política à mão.
- O Pages não aceita cabeçalhos próprios, então a CSP vai por `<meta>`. Por isso `frame-ancestors` não vale (o navegador ignora essa diretiva em meta).
- `metricas.yml` passa a ter dois jobs ligados por um artifact de 1 dia: quem fala com o Umami nunca tem token com escrita.

## Constitution Check
- I e II (regra e palavras): não muda.
- III (página única e autocontida): o jogo continua um HTML só; a CSP fica só no site, como a medição.
- IV (responsivo, escuro, acessível): não muda; as 13 verificações passam.
- V (testado antes de publicar): `site.yml` já roda `verificar-site.mjs` no site montado, agora com a CSP, antes de publicar.
