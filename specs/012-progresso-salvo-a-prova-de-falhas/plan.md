# Plan: Progresso salvo à prova de falhas

Tudo em `template.html`, sem mudar dados nem lista de palavras.

- `store.get(k, padrão, formato)`: lê e faz o `JSON.parse` em separado. JSON quebrado ou `formato` que devolve `undefined` → `descarte(k)` e `store.del(k)`, volta o padrão. `formato(v, ruim)` limpa o que dá para aproveitar e chama `ruim()`; nesse caso `descarte(k)` e salva o dado limpo. `store.del` é novo.
- `FORMATO` com `sim`, `tema`, `vistos`, `sugeridas`, `stats`, `progresso`, montados com `natural`, `lista`, `objeto`, `palavra` (`^[a-z]{4,19}$`) e `letras` (7 letras diferentes). As 11 leituras do jogo passam o formato.
- `descarte(k)`: avisa `COLMEIA_ERRO.avisar("armazenamento","DadoInvalido",<dado>)` quando o monitoramento existe (só no site) e mostra o aviso uma vez por carregamento, 1,2 s depois.
- `start()`: guarda a chave do progresso; se as letras salvas não formam nenhuma palavra, descarta e usa as letras do dia (Diário) ou sorteia (Livre). `markSeen` passa a ser chamado depois disso. Palavras salvas que não valem no desafio saem de `found` e `clues`; extras só ficam se forem extras e couberem nas letras.
- `renderDailies()`: usa o formato e conta só palavras que valem no desafio.
- Testes: seção "Progresso salvo à prova de falhas (spec 012)" dentro do bloco de erros (mesmo `abre()`, que agora também junta os erros de script). Testes da spec 010 que dependiam de progresso corrompido passam a usar `matchMedia` nulo (erro ao abrir), `String.prototype.normalize` quebrado (erro jogando) e um clique no tema com a gravação bloqueada (quarto aviso do limite por carregamento).

## Constitution Check
- I. Regra do jogo: nada muda no que vale como palavra.
- III. Um arquivo, zero servidor: só código na própria página; +3,4 KB.
- IV. Acessível: o aviso usa a área de avisos com `role="status"`.
- V. Testado: 16 testes novos (um deles joga de verdade, recarrega e confere que não há aviso); testes da spec 010 adaptados.
