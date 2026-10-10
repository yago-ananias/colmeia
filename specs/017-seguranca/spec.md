# Feature Specification: Correções da avaliação de segurança

**Feature Branch**: `017-seguranca`
**Created**: 2026-10-10
**Status**: Implemented (só no projeto; vai ao repositório quando YAGO disser "pode enviar")
**Input**: Avaliação `/mnt/project-files/revisoes/seguranca-colmeia-2026-10-10.md`. YAGO respondeu "corrigir" (10/10/2026).

O jogo não muda para quem joga: esta spec mexe só nos workflows, em `ferramentas/site.sh` (exclusivo do repositório) e em arquivos novos. `template.html` e `colmeia.html` não foram alterados.

## User Story 1 - O painel de uso não fica aberto ao público (P1)
O link de compartilhamento do Umami, que abre o painel inteiro, não aparece mais no repositório. O coletor lê o link só do secret `UMAMI_SHARE`.

## User Story 2 - Uma falha futura no jogo tem uma segunda barreira (P2)
O site publicado tem uma política de segurança de conteúdo: só rodam os scripts do próprio jogo e o do Umami.

## User Story 3 - Os workflows rodam só o que foi conferido, com o mínimo de permissão (P2)
As ações ficam fixadas por SHA, o Playwright fica numa versão exata e cada job recebe só a permissão de que precisa.

## Requirements
- **FR-001 (achado 1)**: `metricas.yml` lê `UMAMI_SHARE` só de `secrets`, sem valor padrão, e falha com uma mensagem clara quando o secret falta. O link antigo, que está no histórico do git, é trocado no Umami por YAGO.
- **FR-002 (achado 2)**: `site.sh` grava uma `<meta http-equiv="Content-Security-Policy">` com `script-src` limitado ao próprio site, aos hashes SHA-256 dos dois scripts embutidos (recalculados a cada montagem) e a `https://cloud.umami.is`; `connect-src` com `https://*.umami.is` (o script envia para `gateway.umami.is`); estilos e fontes do próprio site e do Google Fonts; `object-src`, `base-uri` e `form-action` fechados.
- **FR-003 (achado 4)**: todas as ações `actions/*` fixadas pelo SHA do commit da tag (com a tag em comentário); Playwright fixado em `1.63.0`.
- **FR-004 (achado 5)**: `metricas.yml` sem permissão no nível do workflow; o job `coletar` só lê (`contents: read`, `actions: read`, `persist-credentials: false`) e o job `gravar`, que só recebe o JSON, tem `contents: write`. `site.yml` dá `pages: write` e `id-token: write` só ao job `publicar`, e não ao job que roda o código dos PRs.
- **FR-005 (achado 6)**: `SECURITY.md` explica como avisar de falhas em privado, e `.github/dependabot.yml` avisa mensalmente de versões novas das ações.

## Fora desta spec
- **Achado 3 (Google Fonts)**: hospedar as fontes no próprio site muda `template.html`, que é do thread "Soletra mais dinâmico". Fica para uma etapa própria.
- **Achado 4, parte local**: fixar as versões do pip e os hashes dos downloads em `montar.sh`, que também é da cópia de trabalho do jogo.
- O que só o dono vê em Settings (proteção da `main`, secret scanning, aviso privado de vulnerabilidade, permissão padrão do token) fica com YAGO.

## Success Criteria
- **SC-001**: `git grep cloud.umami.is/share` não encontra nada na `main`.
- **SC-002**: o site montado passa nas 13 verificações de `verificar-site.mjs` com a CSP ativa, e um script injetado na página é bloqueado.
- **SC-003**: nenhum `uses:` sem SHA nos workflows.
