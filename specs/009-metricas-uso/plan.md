# Plan: Métricas de uso e painel
- Constituição 1.0.0 → 1.1.0: princípio III ganha a exceção da medição opcional no site.
- `template.html`: `track(nome,dados)` com fila; só ativa se existir `script[data-website-id]` na página. Chamadas em `start`, `submit` (nível, pangrama, completa), `endLightning`, `revealHint`, ação `reveal`, `share`, ação `suggest` e no `load` (carregamento).
- `ferramentas/site.sh` (só no repositório): variável `UMAMI_ID`; se preenchida, põe `<script defer src="https://cloud.umami.is/script.js" data-website-id=… data-domains="yago-ananias.github.io" data-do-not-track="true">` no `<head>`.
- `test.js`: página com script falso e `window.umami` de mentira registra os eventos; página normal não registra nada.
- `REGRAS.md`: seção de privacidade/medição. Guia do painel em `specs/009-metricas-uso/painel.md`.
