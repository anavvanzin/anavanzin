# Publicação Pages e rollback

O domínio canônico é anavanzin.com; produção Pages usa main. As prévias permitidas
são fix/*, feat/* e codex/*. O PR precisa passar pages-release-check e Cloudflare
Pages antes do merge. Sempre conferir os filtros e a revisão remota antes de
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

O corte de 27/10 retira somente anavanzin.com/* do Worker antigo. A rota exata
anavanzin.com já está com script null e permanece assim, como as exceções de
assets existentes. Os padrões de subdomínios, Trabalhos, Iconocracia, Arno e
Mentoria permanecem. Guardar a configuração anterior em operations/ antes do corte.

## Reversão de uma publicação

1. Conferir o incidente e preservar o deployment/revisão que o causou.
2. Se houver versão Pages de produção anterior validada, usar o rollback Pages
   dessa versão, mantendo os namespaces de dados existentes.
3. Se for necessário voltar ao Worker preservado, recriar somente o catch-all
   anavanzin.com/* com o serviço anavanzin, conforme snapshot, preservando a rota
   exata e as exceções que já existiam antes do corte. O DNS apex permanece proxied para
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
