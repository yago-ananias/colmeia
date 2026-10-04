# Plan: Métricas de uso e painel
- Constituição 1.0.0 → 1.1.0: princípio III ganha a exceção da medição opcional no site.
- `template.html`: `track(nome,dados)` com fila; só ativa se existir `script[data-website-id]` na página. Chamadas em `start`, `submit` (nível, pangrama, completa), `endLightning`, `revealHint`, ação `reveal`, `share`, ação `suggest` e no `load` (carregamento).
- `ferramentas/site.sh` (só no repositório): variável `UMAMI_ID`; se preenchida, põe `<script defer src="https://cloud.umami.is/script.js" data-website-id=… data-domains="yago-ananias.github.io" data-do-not-track="true">` no `<head>`.
- `test.js`: página com script falso e `window.umami` de mentira registra os eventos; página normal não registra nada.
- `REGRAS.md`: seção de privacidade/medição. Guia do painel em `specs/009-metricas-uso/painel.md`.

## Constitution Check

> Verificação feita depois, na spec 016 (auditoria do Spec Kit de 04/10/2026), contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: nenhuma mudança | ✅ |
| II. Português: painel e textos em português | ✅ |
| III. Um arquivo, zero servidor: a medição só entra na versão do site, é opcional, sem cookies, sem dado pessoal e sem palavra digitada. É a exceção que a constituição v1.1.0 ganhou com esta spec | ✅ (com a exceção) |
| IV. Dinâmico e acessível: sem mudança de tela no jogo | n/a |
| V. Testado: bloco "Métricas de uso" em `test.js` | ✅ |
