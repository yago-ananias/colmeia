# Feature Specification: Métricas de uso e painel

**Feature Branch**: `009-metricas-uso`
**Created**: 2026-10-03
**Status**: Implemented
**Input**: YAGO: "Precisamos criar uma forma de acompanhar o uso do jogo? Quantas pessoas jogaram, quantas sessões? Quais tipos? Quero um painel analítico de uso/performance."

## User Story 1 - Saber quantas pessoas jogam (P1)
YAGO abre um painel e vê visitantes, visitas (sessões), páginas vistas, de onde vêm (link direto, redes, buscadores), país, aparelho e navegador, por dia, semana e mês.

## User Story 2 - Saber como jogam (P1)
No mesmo painel, YAGO vê quantas partidas começam em cada modo (Diário Manhã/Tarde/Noite, Livre, Relâmpago), até que nível os jogadores chegam, quantos pangramas e colmeias completas saem, pontos do Relâmpago, uso de dicas, desistências, compartilhamentos e sugestões de palavra.

## User Story 3 - Saber se o site carrega rápido (P2)
O painel mostra o tempo de carregamento da página.

## User Story 4 - Ver tudo no projeto (P1)
YAGO (2026-10-03): "tenho que montar isso lá no umami? queria ver tudo por aqui". O painel fica no próprio projeto, pronto, sem montar relatórios no Umami.

## Requirements
- **FR-001**: Ferramenta: Umami Cloud (plano Hobby, grátis: 100 mil eventos por mês, 6 meses de histórico). Não usa cookies nem guarda IP; respeita "Não rastrear" do navegador. Sem dado pessoal, não precisa de aviso de cookies (LGPD).
- **FR-002**: O script de medição entra só na versão do site (`ferramentas/site.sh`), e só quando o ID do site estiver preenchido. O Artifact e o `colmeia.html` não fazem nenhuma chamada externa nova.
- **FR-003**: O jogo funciona igual se o script não carregar (bloqueador, offline, erro). Eventos disparados antes do script carregar entram numa fila curta (até 30) e são enviados quando ele chega.
- **FR-004**: Eventos (nomes e propriedades, sem texto digitado nem palavras do jogador):
  - `partida` {modo, desafio (Manhã/Tarde/Noite no Diário), origem: link|normal, retomada: sim|não}
  - `nivel` {modo, nivel, palavras} quando sobe de nível (fora do Relâmpago)
  - `pangrama` {modo}; `completa` {modo, palavras}
  - `relampago-fim` {pontos, palavras, recorde: sim|não}
  - `dica` {modo}; `desistiu` {modo, palavras}
  - `compartilhar` {modo, via: menu|copia|janela}; `sugestao` {motivo}
  - `carregamento` {ms (arredondado a 100), tema: claro|escuro}
- **FR-005**: Nenhum evento por palavra digitada, para caber no plano grátis.

- **FR-006**: `ferramentas/metricas.mjs` roda uma vez por dia (08:17 de Brasília) no GitHub Actions (`.github/workflows/metricas.yml`, só no repositório), lê o Umami pelo link de compartilhamento e grava os totais em `metricas.json` na branch `metricas` (sempre um único commit). São só totais, sem dado pessoal.
- **FR-007**: O painel é um Artifact ("Painel da Colmeia") que lê esse arquivo pelo conector Firecrawl de quem abre (o Artifact não pode buscar endereços externos por conta própria). Mostra: pessoas, visitas, partidas e tempo por visita (Hoje, 7 dias, 30 dias), visitas por dia, partidas por modo e desafio, níveis alcançados, pangramas, colmeias completas, dicas, desistências, compartilhamentos, sugestões, Relâmpago, origem, aparelho, país, velocidade e tema.

## Success Criteria
- **SC-001**: `test.js` confere que, com o script presente, os eventos saem com as propriedades certas; e que, sem ele, nada é enviado e não há erro.
- **SC-002**: Depois de ligado, YAGO vê visitantes e eventos no painel do Umami no mesmo dia.

## Assumptions
- O painel do próprio Umami basta (Visão geral, Eventos com propriedades, Funil, Retenção). Painel próprio só se faltar algo.
- Criar a conta no Umami é com YAGO; o ID do site é público (aparece no HTML) e vai em `ferramentas/site.sh`.
