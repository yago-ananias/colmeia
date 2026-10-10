# Tasks: Correções da avaliação de segurança

- [X] T001 [FR-001] `metricas.yml`: tirar o link do Umami e exigir o secret
- [X] T002 [FR-002] `site.sh`: CSP com hashes dos scripts embutidos
- [X] T003 [FR-003] Fixar as ações por SHA e o Playwright em 1.63.0
- [X] T004 [FR-004] Separar permissões em `metricas.yml` e `site.yml`
- [X] T005 [FR-005] `SECURITY.md` e `.github/dependabot.yml`
- [X] T006 Montar o site e rodar `verificar-site.mjs` com a CSP (13/13), e conferir que um script injetado é bloqueado
- [ ] T007 YAGO cria o secret `UMAMI_SHARE` com um link novo do Umami e desativa o antigo
- [ ] T008 YAGO dá o "pode enviar"; enviar ao repositório e conferir o CI
