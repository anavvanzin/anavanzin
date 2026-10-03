# Conselho de Contestação Algorítmica — artefato estático integrado

Origem: https://github.com/anavvanzin/prot-tipo, commit
`5f92b056fca59b29a7f457e9a91978a40545a0bd`.
Créditos preservados: **Ana Vitória Vanzin & Vinícius Oliveira**,
Seminário VIII, PPGD/UFSC. A cópia de origem foi consultada sem alterações.

Este diretório contém as fontes da versão publicada em `/prot-tipo/`.
Os arquivos de `prot-tipo/` na raiz do site são derivados de build; altere
estas fontes e gere novamente. Este diretório de manutenção deve ficar fora
dos assets públicos. Não contém o servidor original, configurações de
Firebase, chaves, manuscritos ou arquivos de ambiente.

## Construir

```sh
cd scripts/work-demos/prot-tipo
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm run build
```

Vite usa base `/prot-tipo/` e gera `../../../prot-tipo/`. Esse diretório
de saída é exclusivamente o build desta demonstração. As fontes do site
continuam em `/fonts/fonts.css`; o protótipo usa DM Sans, Hanken Grotesk e
JetBrains Mono já hospedadas pelo projeto, sem Google Fonts em tempo de execução.
As abas secundárias e bibliotecas têm chunks separados.

## Revisão da integração (2026-10-03)

- `App.tsx` carrega `STANDARD_CASES` localmente. Removidos todos os pedidos
  `/api/cases`, `/api/key-status` e `/api/analyze-case`. Não há backend, chave
  Gemini, chamada de IA ou serviço pago no build.
- Apenas seis cenários fictícios predefinidos podem ser selecionados. O fluxo
  de envio de decisões pessoais foi retirado. Os pareceres/rankings são textos
  locais, identificados como ilustrações.
- O observatório aceita somente dois exemplos fictícios. A lista existe na
  memória React e desaparece ao recarregar. Retirados dados pessoais,
  anexos, hash aleatório e alegações de anonimização, blockchain ou banco público.
- O kit de requerimento usa três campos fictícios somente leitura, sem pedir
  nome, protocolo ou documentos do visitante. As minutas estão marcadas como
  didáticas e dependentes de revisão para uso concreto.
- Percentuais apresentados como risco/êxito foram convertidos em índices
  didáticos de 0–100. A série do gráfico é fictícia, sem atribuição a auditoria
  MDS/INSS. Valores monetários e AIA são exercícios sem certificação ou medição.
- Personas, selos, assinaturas e concordância são fictícios e não representam
  Defensoria, procuradorias ou órgãos públicos reais.
- Corrigido alcance do art. 20 da LGPD: pedido de revisão não exige
  literalmente pessoa natural; §1º trata informações e segredos; §2º prevê
  auditoria da ANPD em caso de recusa por segredo comercial/industrial.
  Intervenção humana permanece identificada como proposta do exercício.
- Corrigidos art. 6º, V da LGPD (qualidade), art. 18, III (retificação),
  exceção do art. 4º, III para segurança pública e os dispositivos da Lei
  14.129/2021 (art. 6º/parágrafo único, 14, 19 e 25). Retirado o inexistente
  art. 6º, §2º. Fontes oficiais ligadas na interface.
- Corrigidos título INSS “Indeferida”, aumento de IPTU triplicado (+200%),
  latim inventado e equivalência indevida entre acórdão e súmula. Retiradas
  causas técnicas e números empíricos sem fonte e garantias automáticas de
  nulidade, concessão, êxito, indenização ou autorização de deploy.
- As análises dos cenários são argumentos do exercício. Removidas atribuições
  indevidas de descobertas sobre reconhecimento facial, CNIS/BPC e custos
  judiciais às quatro leituras gerais do seminário. Seus eixos bibliográficos
  continuam apresentados como referências de discussão.
- Corrigida correspondência dos seis IDs no pipeline e captura do passo no
  intervalo da calculadora. Guia explica o percurso sem tentar focar elementos
  em abas desmontadas. Header abre efetivamente os fundamentos.
- Preservados o visual escuro/dourado, a navegação em quatro abas, os cenários
  e a intenção de explorar contestabilidade. Acrescentados retorno ao portfólio,
  links ao seminário e à adaptação jurídica do `llm-council`.
- HTML `pt-BR`, descrição/canonical/Open Graph e `noindex,follow` reproduzíveis.
  A política do site classifica a demonstração client-side como `utility`;
  descoberta pelos links no portfólio. Não foi adicionado manuscrito.

Na experiência original, **uma chamada Gemini simula quatro vozes**; isso não
equivale à execução de quatro modelos/agentes independentes. Esta versão nem
sequer faz essa chamada: oferece somente a leitura/interação com os exemplos.
As versões de `/seminario8-dever-poder/`, `/prot-tipo/` e
`/algoritmo-em-disputa/` pertencem ao mesmo percurso acadêmico.

## Verificação

```sh
PLAYWRIGHT_BROWSERS_PATH=/caminho/para/browsers node verify.mjs
```

O script usa o Playwright do site e `http://127.0.0.1:8097` por padrão.
`DEMO_BASE_URL` e `DEMO_EVIDENCE_DIR` podem ser sobrescritos. A saída padrão fica
em `validation/prot-tipo/` no diretório da tarefa, resolvido a partir deste script.
Verifica seis casos,
filtro, pipeline, observatório add/delete/reset, fases de deliberação,
concordância local, calculadora, campos fictícios readonly, fundamentos e guia;
ausência de overflow, erros JS/HTTP, chamadas API ou pedidos externos;
carregamento da imagem e capturas em 1440×1000 e 390×844.

Fontes consultadas: [Vite: build e base pública](https://vite.dev/guide/build.html),
[Playwright](https://playwright.dev/docs/library),
[LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm),
[Governo Digital](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm),
[Constituição](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm),
[PL 2338/2023](https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2487262),
[Robodebt](https://robodebt.royalcommission.gov.au/publications/report) e
[SyRI](https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:RBDHA:2020:1878).

Nenhum commit ou deploy é realizado por este diretório. A publicação acompanha
o mecanismo já usado pelo site e a revisão do conjunto pelo agente integrador.
