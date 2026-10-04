# Plan: Monitoramento de erros

## Jogo (`template.html`)
- Novo `<script>` ES5 antes do script principal: `window.COLMEIA_ERRO = {fase, modo, avisar}`; fila própria com nova tentativa a cada 1 s (até 20) só depois do primeiro erro, porque se o jogo quebrar ao abrir a fila do jogo (`TQ`) nunca é enviada.
- Ganchos no jogo: `store.get/set` avisam `armazenamento` (só `e.name` e ler|salvar); `start()` atualiza `modo`; fim do código marca `fase="jogo"`.
- Ruídos: `matches(":focus-visible")` dentro de try, `(e.key||"")`, montagem do som dentro do try.

## Site
- `ferramentas/verificar-site.mjs` (13 verificações, rodado com Playwright) e `.github/workflows/verificar-site.yml` (diário, issue de aviso, publica `verificacao.json` na branch `verificacao`).
- `ferramentas/metricas.mjs`: busca o site (status e ms) e o `verificacao.json` da branch.

## Painel
- Cartão "Saúde do jogo" logo abaixo do resumo: site no ar, verificação diária, erros dos jogadores no período (e por carregamento), erros mais frequentes com fase e modo.

## Testes
- Bloco "Erros (spec 010)" em `test.js`, em contexto próprio, disparando erros por caminhos reais do jogo (armazenamento corrompido, compartilhar com data quebrada, gravação bloqueada). Desde a spec 012, progresso corrompido não gera mais erro (é descartado com aviso), e os testes provocam o erro quebrando `matchMedia` e `normalize`.

## Constitution Check

> Verificação feita depois, na spec 016 (auditoria do Spec Kit de 04/10/2026), contra a constituição v1.2.1.

| Princípio | Status |
|-----------|--------|
| I. Regra do jogo: nenhuma mudança | ✅ |
| II. Português: textos do painel em português | ✅ |
| III. Um arquivo, zero servidor: o envio de erros usa o mesmo script opcional do site e só leva tipo, local no código, fase e modo, com limites. A exceção do princípio III cobre isso desde a v1.2.0 | ✅ (com a exceção) |
| IV. Dinâmico e acessível: sem mudança de tela no jogo | n/a |
| V. Testado: bloco "Erros (spec 010)" em `test.js`; a verificação diária do site (SC-002) foi provada à mão | ✅ |
