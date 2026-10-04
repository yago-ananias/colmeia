# Checklist de qualidade: specs 009 a 015

Feito na spec 016, a partir da auditoria de 04/10/2026, com o estado depois das correções.

| Spec | Requisitos claros e mensuráveis? | Observação |
|------|----------------------------------|------------|
| 009 | Sim | Eventos e limites definidos. SC-003 e SC-004 cobrem as histórias 2 e 4; SC-002 e a medição pelo painel são conferidas à mão |
| 010 | Sim | Limites numéricos claros. SC-002 (a verificação falha num site quebrado) é manual, com o motivo escrito na spec |
| 011 | Sim | Limites de fonte claros (20+ e 5+). FR-005 registra que as extras contam para o nível de propósito; a sequência de dias não conta extras |
| 012 | Sim | 16 casos testados. O texto "toda leitura" tem uma exceção sem efeito (o contador de erros, protegido por `try/catch`): achado baixo B2, fora desta spec |
| 013 | Sim | Casos de aceite objetivos |
| 014 | Em parte | SC-002 agora é uma meta (toque até a letra em no máximo 50 ms com CPU 4x; medido ~18 ms), mas é manual (`ferramentas/medicoes/toque.js`). O gesto de toque duplo do Safari no iPhone não se verifica aqui |
| 015 | Sim | Contraste e 44 px com números; o axe-core está em `ferramentas/medicoes/axe.js` (manual). Sem teste com leitor de tela de verdade, declarado na spec |

## Itens conferidos em todas
- [X] Plano com Constitution Check (006 a 011 e 014 ganharam na spec 016; 012, 013 e 015 já tinham)
- [X] Spec aponta a spec mais nova quando foi substituída em parte (002 por 011, 007 por 013)
- [X] Regras base (níveis, Relâmpago, conquistas, sequência) escritas na spec 001
