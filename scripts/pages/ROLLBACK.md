# Publicação Pages e rollback

O domínio canônico é anavanzin.com; produção Pages usa main. A prévia permitida
é codex/pages-preflight. Sempre conferir os filtros e a revisão remota antes de
publicar. Não fazer force-push nem alterar grants compartilhados.

## Dados e configuração

- MESAS produção: f68b5eef312746c794e86c37be7bf7e1.
- MESAS preview: 6ea9865c03d640e1846cabda3d2194ec.
- D1 corpus existente: 77c09df7-b510-48b3-8a39-94b39416aa2f, iconocracy-corpus.
- Wrangler é a fonte de configuração. Preservar os bindings ao trocar revisões.
- Não apagar namespaces, banco D1, mesas de usuários ou serviços para reverter o site.

## Worker preservado antes do corte

Serviço correto: anavanzin. Deployment preservado:
c9ad8658-8aee-4277-9afb-adbb0548171c, versão
09b41516-076d-40da-a626-910dba7f36aa a 100%.

O corte retira somente as rotas literais anavanzin.com e anavanzin.com/* desse
Worker. Os padrões de subdomínios, Arno e Mentoria permanecem. A configuração
anterior das duas rotas deve ficar no snapshot operacional para recriação por API.

## Reversão de uma publicação

1. Conferir o incidente e preservar o deployment/revisão que o causou.
2. Se houver versão Pages de produção anterior validada, usar o rollback Pages
   dessa versão, mantendo os namespaces de dados existentes.
3. Se for necessário voltar ao Worker preservado, recriar apenas suas duas
   rotas apex com o serviço anavanzin. O DNS apex deve permanecer proxied para
   que as rotas Workers possam ser aplicadas. Não alterar rotas wildcard,
   Arno, Mentoria, MX/TXT ou aplicações Access não relacionadas.
4. Conferir os bytes HTML/CSS, trabalhos e Functions no domínio anônimo;
   HTTP 200 sozinho não comprova a revisão correta.
5. Registrar a decisão e corrigir o código em feature branch. Um próximo push
   para main pode republicar Pages; não deixar o rollback depender de um estado
   remoto não documentado.

Os snapshots operacionais desta migração ficam no diretório remediation do
workspace task-2, sem tokens ou conteúdo KV/D1. Eles incluem filtros originais
dos triggers e payloads reversíveis; o rollback não exige revogar a conexão GitHub.
