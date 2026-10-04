# Preparação local para Cloudflare Pages

Esta proposta adapta a publicação existente, sem modificar páginas, conteúdo ou o Worker já publicado. A base é `5252587455443c8433cd82d391f0c30bd1a59cbe`; trabalhos locais pendentes estão registrados no inventário fora do repositório. Não executar deploy antes de conferir o projeto e aprovar os bindings.

## Artefato

`npm run build:pages` reaproveita `scripts/stage-worker-assets.sh`, que publica arquivos rastreados de HEAD respeitando `.gitattributes` e remove os quatro vídeos acima de 25 MiB. Alterações em conteúdo não commitadas não entram no artefato. O comando gera `.worker-assets/_worker.js` a partir de `worker.js`; este continua sendo a fonte da lógica de mesa e das URLs históricas `.html` do corpus. `_routes.json` invoca a Function somente em `/_state`, `/iconocracia/corpus/*` e `/corpus/*`.

O adaptador aplica à resposta da Function os três headers globais de `_headers`, pois Pages não os aplica automaticamente a Functions. Hosts `pages.dev` recebem `X-Robots-Tag: noindex`, tanto no adaptador como nas regras de assets geradas. Os redirects, o 404 e os assets existentes permanecem no artefato.

## Configuração proposta

O `wrangler.jsonc` da proposta usa o schema Pages, com output `.worker-assets` e Node 22 fixado por `.node-version`. `anavanzin` é um nome de projeto proposto, cuja disponibilidade global precisa ser conferida; a lista de projetos da conta AVM não contém esse nome. Leitura pelo Wrangler confirmou conta `06e1749b0b658c7dd17dd9807bbd5b97` e namespace MESAS `f68b5eef312746c794e86c37be7bf7e1`, igual ao config antigo. Não foram lidos valores do KV nem conferidos os bindings do Worker em produção.

Produção propõe reutilizar o namespace MESAS existente. **Preview está intencionalmente sem KV**; antes de um preview remoto funcional, criar e aprovar um namespace separado, conferir seu ID e preencher apenas `env.preview.kv_namespaces`. A mesa faz PUT automático durante uso normal, portanto um preview não deve compartilhar MESAS de produção.

Não executar `npm run deploy:worker` com o config desta proposta: o comando histórico é incompatível com Pages. O config Worker original está preservado byte a byte em `scripts/pages/rollback/wrangler.worker.jsonc`. Sua recuperação é parte de um rollback aprovado, não um comando de publicação automática. Nenhuma integração Worker será reativada por este patch.

## Validação local

Depois do build, usar o Wrangler instalado no projeto:

```sh
WRANGLER_SEND_METRICS=false npx wrangler pages dev .worker-assets --kv MESAS --port 8101 --ip 127.0.0.1 --persist-to /caminho/fora-do-repo/pages-local-state --show-interactive-dev-session=false
npm run test:pages
```

Não usar `--remote`. Os testes de estado rejeitam hosts que não sejam localhost ou 127.0.0.1. O KV local recebe fixtures, sem acesso ao namespace remoto. Na revisão de 04/10/2026, build, seis testes de runtime e nove testes acadêmicos passaram com Wrangler 4.146.0 e Node 26.8.2; o ambiente de build remoto Node 22 ainda precisa ser validado.

`npm run test:pages:ui` usa um config separado e inicia ou reutiliza o Pages dev local na porta 8101. Com Chrome já instalado, usar `PAGES_BROWSER_CHANNEL=chrome npm run test:pages:ui`; sem essa variável, usa o Chromium instalado pelo Playwright. Não exige download de browser nesta proposta. Tanto o config como os testes rejeitam hosts remotos; requests externos do navegador são bloqueados. O config está excluído dos assets públicos. A suíte estática existente não executa estes testes KV sem a configuração explícita Pages.

Três testes novos passaram: no desktop, criação do cookie, GET inicial, gravação por mudança de idioma/janelas, posições movidas e restauração após reload, com idioma local prevalecendo; no mobile 390/320 px, menu, modal, imagem, idioma e reload, sem GET/PUT pelo cliente e sem alterar a mesa desktop salva. Não foi necessário modificar `desktop-app.js`. O PUT retorna texto `ok`; a UI não consome seu corpo, e o teste verifica status mais o estado realmente salvo, evitando uma espera do Playwright por esse corpo.

O emulador local não reproduz integralmente o tratamento remoto dos arquivos reservados de Pages. Conferir `_worker.js`, `_headers` e `_routes.json` no preview remoto, além das rotas, headers, assets e KV. O build não cria projeto, namespace, deploy, associação de domínio ou registros DNS.

## Próximas etapas

1. Conferir a conta, o projeto Pages, os routes/custom domains atuais e o binding MESAS. Conferir acesso da integração GitHub somente ao repositório privado renomeado `anavvanzin/anavanzin`.
2. Publicar a branch de revisão autorizada e abrir PR draft. Após aprovação dos recursos, configurar projeto Git integrado com deploy automático de produção desativado desde a criação e preview permitido somente para `codex/pages-preflight`, branch de produção `main`, framework nenhum, build `npm run build:pages`, output `.worker-assets`. O main ainda não contém esse comando/config Pages; não executar build de produção antes do merge aprovado. Preencher o KV isolado de preview após sua aprovação e gerar preview da branch de revisão, mantendo os domínios atuais fora dessa etapa.
3. Validar o preview em desktop e celular, dados fictícios de mesa, 60 URLs `.html` de corpus, os trabalhos, exports, redirects, headers e exclusões.
4. Com evidência e aprovação específica, associar o apex `anavanzin.com` ao Pages e ajustar somente records/routes conflitantes. Implementar www → apex preservando caminho e query. Registrar antes todos os valores necessários ao rollback. Não excluir o Worker.
5. Verificar HTTPS e revisão efetivamente servida nos dois hosts; tratar a desativação posterior de GitHub Pages como ação explícita após estabilização.

Referências: [modo avançado](https://developers.cloudflare.com/pages/functions/advanced-mode/), [configuração Wrangler](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [routing](https://developers.cloudflare.com/pages/functions/routing/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [domínios](https://developers.cloudflare.com/pages/configuration/custom-domains/).
