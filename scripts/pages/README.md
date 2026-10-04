# Preparação para Cloudflare Pages

## Estado da migração em 04/10/2026, 08:35 UTC

O projeto existente foi relido antes da tentativa de publicação autorizada.
Produção está habilitada para `main`, o apex está associado ao Pages e ainda
não existe deployment canônico de produção. Esses valores substituem o snapshot
histórico abaixo, que mostrava produção pausada e somente domínios `pages.dev`.

A correção local `50d4757b422ca88a85e5f3387276956fb06c299a` preserva MESAS de
produção `f68b5eef312746c794e86c37be7bf7e1`, mantém preview separado em
`6ea9865c03d640e1846cabda3d2194ec` e conserva o binding D1 `corpus` existente
somente em produção. O config remoto de produção ainda precisa ser reconciliado.
Veja o [procedimento de rollback](ROLLBACK.md).

O plano autorizado isola os dois Workers Builds legados por filtros de branch
para `main` e `codex/pages-preflight` e pausa previews do vínculo órfão. Ele
substitui a proposta histórica de desconexão abaixo. Preservar os Workers,
deployments e a conexão GitHub compartilhada.

A primeira tentativa de PATCH retornou `10000: Authentication error`; GETs
posteriores confirmaram que os três campos permanecem inalterados. Push, merge
e publicação continuam suspensos até o isolamento ser aplicado e comprovado.
A API Builds exige token de usuário com `Workers Builds Configuration: Edit`;
o token usado para chamar a API é diferente do token usado pelo build para deploy.
[Referência oficial](https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/).

O restante deste documento registra a auditoria anterior. Os filtros, domínios
e condições de autorização descritos nela são históricos; releia o estado
remoto antes de retomar. O helper antigo que exige produção pausada não deve
ser usado nem ter suas verificações removidas para contornar esse pré-requisito.

## Registro histórico da auditoria anterior

A preparação original de Pages, até o head `bb32f831effd3fd0f9c603b630dfcec0bd8bc7b2`, adaptou a publicação existente sem alterar suas páginas. A base é `5252587455443c8433cd82d391f0c30bd1a59cbe`. Durante esta auditoria o branch recebeu também `26799abb7cfc5a3f0ef8a9fc17c1f149c7b83541`, com alterações de homepage preservadas por esta revisão documental. Manter o PR #151 em draft. O preview remoto observado está descrito abaixo; produção continua fora desta etapa.

## Artefato

`npm run build:pages` reaproveita `scripts/stage-worker-assets.sh`, que publica arquivos rastreados de HEAD respeitando `.gitattributes` e remove os quatro vídeos acima de 25 MiB. Alterações em conteúdo não commitadas não entram no artefato. O comando gera `.worker-assets/_worker.js` a partir de `worker.js`; este continua sendo a fonte da lógica de mesa e das URLs históricas `.html` do corpus. `_routes.json` invoca a Function somente em `/_state`, `/iconocracia/corpus/*` e `/corpus/*`.

O adaptador aplica à resposta da Function os três headers globais de `_headers`, pois Pages não os aplica automaticamente a Functions. Hosts `pages.dev` recebem `X-Robots-Tag: noindex`, tanto no adaptador como nas regras de assets geradas. Os redirects, o 404 e os assets existentes permanecem no artefato.

## Configuração proposta

O `wrangler.jsonc` usa a configuração Pages, com output `.worker-assets` e Node 22 selecionado por `.node-version`. Na revalidação de 04/10/2026, o projeto Pages `anavanzin` já existe na conta `06e1749b0b658c7dd17dd9807bbd5b97`: foi criado às 05:35:24 UTC, depois dos dois builds Workers citados no PR. Não criar outro projeto para corrigir aqueles checks.

Produção propõe reutilizar MESAS `f68b5eef312746c794e86c37be7bf7e1`. Desde o commit `bb32f831effd3fd0f9c603b630dfcec0bd8bc7b2`, `env.preview.kv_namespaces` aponta exclusivamente para o namespace isolado `6ea9865c03d640e1846cabda3d2194ec`. A API do projeto e a do deployment confirmam esse mesmo ID no preview remoto. A mesa faz PUT automático durante uso normal, portanto preview e produção devem continuar separados. Esta auditoria não leu valores nem escreveu no KV.

Não executar `npm run deploy:worker` com o config desta proposta: o comando histórico é incompatível com Pages. O config Worker original está preservado byte a byte em `scripts/pages/rollback/wrangler.worker.jsonc`. Sua recuperação é parte de um rollback aprovado, não um comando de publicação automática. A migração não requer reativar integração Workers nem adicionar `previews` ao config Pages.

## Validação local

Depois do build, usar o Wrangler instalado no projeto:

```sh
WRANGLER_SEND_METRICS=false npx wrangler pages dev .worker-assets --kv MESAS --port 8101 --ip 127.0.0.1 --persist-to /caminho/fora-do-repo/pages-local-state --show-interactive-dev-session=false
npm run test:pages
```

Não usar `--remote`. Os testes de estado rejeitam hosts que não sejam localhost ou 127.0.0.1. O KV local recebe fixtures, sem acesso ao namespace remoto. Na revisão de 04/10/2026, build, seis testes de runtime e nove testes acadêmicos passaram com Wrangler 4.146.0 e Node 26.8.2; esses resultados locais são históricos e não foram reexecutados nesta auditoria documental. O build Pages remoto posterior validou Node 22.22.0, conforme a evidência abaixo; isso não equivale à suíte funcional remota.

`npm run test:pages:ui` usa um config separado e inicia ou reutiliza o Pages dev local na porta 8101. Com Chrome já instalado, usar `PAGES_BROWSER_CHANNEL=chrome npm run test:pages:ui`; sem essa variável, usa o Chromium instalado pelo Playwright. Não exige download de browser nesta proposta. Tanto o config como os testes rejeitam hosts remotos; requests externos do navegador são bloqueados. O config está excluído dos assets públicos. A suíte estática existente não executa estes testes KV sem a configuração explícita Pages.

Três testes novos passaram: no desktop, criação do cookie, GET inicial, gravação por mudança de idioma/janelas, posições movidas e restauração após reload, com idioma local prevalecendo; no mobile 390/320 px, menu, modal, imagem, idioma e reload, sem GET/PUT pelo cliente e sem alterar a mesa desktop salva. Não foi necessário modificar `desktop-app.js`. O PUT retorna texto `ok`; a UI não consome seu corpo, e o teste verifica status mais o estado realmente salvo, evitando uma espera do Playwright por esse corpo.

O emulador local não reproduz integralmente o tratamento remoto dos arquivos reservados de Pages. Conferir `_worker.js`, `_headers` e `_routes.json` no preview remoto, além das rotas, headers, assets e KV. O build não cria projeto, namespace, deploy, associação de domínio ou registros DNS.

## Diagnóstico remoto de 04/10/2026

A revalidação tomou como referência o head `bb32f831effd3fd0f9c603b630dfcec0bd8bc7b2`, branch `codex/pages-preflight`, base/main `5252587455443c8433cd82d391f0c30bd1a59cbe`. O PR estava aberto, draft e mergeable, sem reviews ou threads. Não havia Actions runs nem combined-status contexts; havia **cinco check runs**, incluindo Pages com sucesso e dois Workers com falha. Actions, commit statuses e check runs são registros distintos. O workflow `.github/workflows/deploy-pages.yml` publica **GitHub Pages**, roda somente em push de `main` ou dispatch e não explica os checks Cloudflare deste branch. Main não tinha proteção ativa nem rulesets na consulta.

| Destino / evidência | Resultado observado |
| --- | --- |
| [Workers `ius-gentium`, `febd068`](https://dash.cloudflare.com/?to=/06e1749b0b658c7dd17dd9807bbd5b97/workers/services/view/ius-gentium/production/builds/6d5d1ce7-eb98-4466-8ca6-b50ad7928071) | Falhou às 04:06:09 UTC executando `npx wrangler preview`, Wrangler 4.146.0. |
| [Workers `ius-gentium`, `bb32f83`](https://dash.cloudflare.com/?to=/06e1749b0b658c7dd17dd9807bbd5b97/workers/services/view/ius-gentium/production/builds/d189d79f-9199-45ae-b4e7-9d83f5af57d1) | Mesma falha às 04:18:26 UTC. Build command vazio; `npm run build:pages` não foi executado. |
| [Workers `anavvanzin-github-io`, `bb32f83`](https://github.com/anavvanzin/anavanzin/runs/111360376754) | Falhou antes de inicializar: o check informa que o Worker não existe na conta. |
| [Pages `anavanzin`, `bb32f83`](https://dash.cloudflare.com/?to=/06e1749b0b658c7dd17dd9807bbd5b97/pages/view/anavanzin/6ae3eec9-14e1-4c16-9d69-6d3e026bac7e) | Preview concluído com sucesso às 05:37:40 UTC, criado às 05:36:09 UTC, sem mudar o head. |

Nos dois logs de `ius-gentium`, o erro é: **“Your Wrangler configuration is missing a `previews` block.”** Essa exigência vem de **Worker Previews**, acionado pelo comando externo errado para este projeto. Pages usa `pages_build_output_dir` e `env.preview`. Não adicionar `previews`, `main` ou `assets`, não renomear o projeto para `ius-gentium` e não redirecionar o rollback para satisfazer esse check.

As integrações Workers apontam ao mesmo repositório numérico `1221191459`, embora conservem o nome antigo `anavvanzin.github.io`. Portanto são destinos de deploy indevidos para a migração Pages, não builds de outro repositório. O trigger de `ius-gentium` foi criado em 04/10 às 04:05:08 UTC; não há evidência para atribuir sua criação ao código deste PR.

O GET de configuração Workers confirmou:

- `ius-gentium`: script tag `5bf704c00c9c4a3787f62911820c07cb`, trigger `dd404baa-cb0a-4bfd-87da-e53b09466c18`, branch configurado como produção **`codex/pages-preflight`**, build command vazio, deploy command `npx wrangler preview`, `previews_enabled=false`. Desabilitar apenas “Enable Preview Builds” não resolve este caso: já está desabilitado, e o trigger usa o branch principal dessa integração.
- `anavvanzin-github-io`: script tag `8a2e5c5b5be94f86ab7e2a5199e84cf4`, trigger `a3baf8b6-5813-4a41-9dbd-11671f31eccd`, produção em `main` com `npx wrangler deploy`, `previews_enabled=true` e preview command `npx wrangler preview`. O vínculo de Builds persiste apesar do erro de Worker inexistente.

O build Pages de sucesso leu a configuração, instalou Node **22.22.0** / npm **10.9.2**, executou `npm run build:pages`, encontrou `_worker.js` e `_routes.json`, compilou a Function e publicou 588 assets, com 11 regras de redirect e 7 de headers aceitas. O uploader interno do Pages registrou Wrangler 3.114.17; não confundir essa versão com o Wrangler 4.146.0 dos builds Workers. Isso comprova build/deploy Pages nesse head, sem demonstrar por si só a correção de todas as rotas e interações.

Preview observado: [deployment imutável](https://6ae3eec9.anavanzin.pages.dev) e [alias do branch](https://codex-pages-preflight.anavanzin.pages.dev). Nenhum deles foi criado por esta auditoria. O projeto tem `canonical_deployment=null` e somente `anavanzin.pages.dev` em `domains`; não havia deployment canônico de produção nem domínio personalizado associado a esse Pages na consulta.

Antes da gravação desta documentação, o head avançou para `26799abb7cfc5a3f0ef8a9fc17c1f149c7b83541` (`home.css`, `index.html` e `tests/home-refinement.spec.js`). O `wrangler.jsonc` continua com o mesmo blob `f3045c743fc8ff9cb35c067e2d0e2579a728de98`. Esse head teve outro [preview Pages bem-sucedido](https://862a8266.anavanzin.pages.dev) às 06:27:27 UTC, deployment `862a8266-fd48-4119-9738-68a105a74d1b`, com o mesmo KV isolado, e novamente dois checks Workers falhos. Esta auditoria não altera nem valida funcionalmente as mudanças de homepage. As comparações de identidade do conteúdo e os testes locais anteriores se referem ao head original, não devem ser estendidos ao novo head.

### Proposta histórica de desconexão — substituída pelo isolamento

1. Na conta `06e1749b0b658c7dd17dd9807bbd5b97`, abrir **Workers & Pages → ius-gentium → Settings → Builds → Disconnect** para remover o vínculo deste Worker com o repositório `1221191459`. Preservar o Worker, seus deployments, bindings, routes e domínios. Não substituir o comando por `wrangler deploy` ou por um deploy Pages dentro dessa integração.
2. Desconectar também o vínculo órfão de Builds de `anavvanzin-github-io`. Se o Worker ausente impedir o acesso pelo painel, a API documenta `DELETE /accounts/{account_id}/builds/workers/{script_tag}`, que remove configuração/triggers de Builds e cancela builds inacabados **sem excluir o Worker**. Os tags acima identificam os dois vínculos; qualquer execução fica para ação externa autorizada. Não apagar a conexão GitHub global/compartilhada nem revogar acesso do Pages.
3. Preservar o Pages existente com a configuração abaixo. Após corrigir os vínculos, observar um novo head: deve haver um check **Cloudflare Pages** com preview e nenhum novo check desses dois Workers. Checks históricos dos heads anteriores continuarão registrados.

| Campo Pages | Valor observado no snapshot histórico |
| --- | --- |
| Projeto / repositório | `anavanzin` / `anavvanzin/anavanzin` (`1221191459`) |
| Branch de produção | `main` |
| `production_deployments_enabled` | `false` |
| `deployments_enabled` | `true` |
| Preview | `custom`; includes apenas `codex/pages-preflight`; excludes vazio |
| Root / build / output | raiz do repositório / `npm run build:pages` / `.worker-assets` |
| Node | major 22 por `.node-version`; build observado com 22.22.0 |
| MESAS de preview | `6ea9865c03d640e1846cabda3d2194ec` via `env.preview.kv_namespaces` |
| Comentários automáticos Pages | `pr_comments_enabled=false`; a URL aparece no check run |
| Domínios | somente `anavanzin.pages.dev` |

Não é necessário criar projeto/namespace adicional nem alterar `wrangler.jsonc` para corrigir essas falhas Workers. Esta revisão altera apenas documentação excluída do artefato por `.gitattributes`. Não executa comandos de deploy, testes com escrita remota, merge, mudanças de DNS/domínio ou mudanças de configuração Cloudflare. Um push documental neste branch pode disparar as integrações automáticas já existentes; produção Pages permanece desativada.

## Plano histórico daquela auditoria

1. Aplicar e verificar a desconexão dos dois vínculos Workers descrita acima, em ação externa autorizada. Manter o PR draft e o deploy automático de produção Pages desativado.
2. Usar o preview Pages existente para a validação funcional remota pendente: desktop e celular, dados fictícios de mesa apenas no KV isolado, 60 URLs `.html` de corpus, trabalhos, exports, redirects, headers e exclusões. O build verde não substitui essa validação.
3. Antes de uma migração aprovada, conferir routes/custom domains atuais e bindings efetivos de produção, registrar rollback e revalidar o head. O main ainda não contém o comando/config Pages; não executar build de produção antes do merge aprovado.
4. Somente com evidência e aprovação específica, associar o apex `anavanzin.com` ao Pages e ajustar records/routes conflitantes. Implementar www → apex preservando caminho e query. Não excluir o Worker.
5. Verificar HTTPS e revisão efetivamente servida nos dois hosts; tratar a desativação posterior de GitHub Pages como ação explícita após estabilização.

Referências: [modo avançado](https://developers.cloudflare.com/pages/functions/advanced-mode/), [configuração Wrangler](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [routing](https://developers.cloudflare.com/pages/functions/routing/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [domínios](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Worker Previews](https://developers.cloudflare.com/workers/previews/get-started/), [desconexão de Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/#disconnecting-builds).
