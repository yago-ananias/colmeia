# Painel de uso da Colmeia (Umami)

## Ligar (uma vez, YAGO)
1. Criar conta grátis em https://cloud.umami.is/signup (plano Hobby: 100 mil eventos/mês, 6 meses de histórico).
2. Settings → Websites → Add website: nome `Colmeia`, domínio `yago-ananias.github.io`.
3. Copiar o **Website ID** (formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) e mandar na conversa.
4. Claude põe o ID em `UMAMI_ID` no `ferramentas/site.sh` do repositório e envia; o site passa a medir em poucos minutos.
5. Para não contar suas próprias partidas: no navegador que você usa, abra o console do site e rode `localStorage.setItem("umami.disabled", 1)`.

## O que ver
- **Visão geral:** visitantes (pessoas), visitas (sessões), páginas vistas, tempo médio, origem, país, aparelho.
- **Eventos:** quantas vezes cada evento saiu; clique num evento para ver as propriedades.
  - Partidas por modo: evento `partida`, propriedade `modo` (e `desafio` para Manhã/Tarde/Noite).
  - Até onde chegam: `nivel` por `nivel`; `pangrama` e `completa` por `modo`.
  - Relâmpago: `relampago-fim` por `pontos`.
  - Viralidade: `partida` com `origem = link`, e `compartilhar` por `via`.
  - Desempenho do site: `carregamento` por `ms`.
- **Relatórios** sugeridos (Reports → Create): Funil `partida → nivel → pangrama → completa`; Retenção (quantos voltam nos dias seguintes); Metas para `compartilhar`.
- **Link público do painel:** Settings → Websites → Colmeia → Share URL, se quiser mostrar para alguém.

## Orçamento de eventos
Uma partida comum gera de 3 a 10 eventos. 100 mil por mês dão para uns 10 mil a 30 mil partidas. Se encostar no limite, o primeiro corte é `nivel`.
