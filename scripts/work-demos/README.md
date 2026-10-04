# Restauração das peças acadêmicas

Integração revista em 03/10/2026, restrita à seção Trabalhos e aos três
artefatos relacionados do Conselho de Contestação Algorítmica.

- Seminário: `anavvanzin/seminario8-dever-poder`, origem
  `6e9f0255266cef291ab0e9e6d010846323a22892`. Créditos de Ana Vitória Vanzin
  e Vinícius Oliveira preservados. Foram restaurados índice, deck, guia,
  Conselho, flyer, arquitetura, assets e fontes locais.
- React/Gemini: `anavvanzin/prot-tipo`, origem
  `5f92b056fca59b29a7f457e9a91978a40545a0bd`. O original simula quatro
  perspectivas em uma chamada Gemini. Esta publicação usa apenas casos e
  pareceres locais; consulte `prot-tipo/README.md` para reconstrução.
- Adaptação: `anavvanzin/algoritmo-em-disputa`, origem `391a96d`.
  Página editorial e demonstração estática próprias, com crédito a
  `karpathy/llm-council`. Sem redistribuição do backend ou do frontend herdado;
  consulte `algoritmo-em-disputa/README.md`.

O histórico do site confirma links do seminário e do guia no commit
`20bb457c873ad02aad2e590d5f4c6116f7610f13`, removidos em
`0fd9ba8c4a54a3b3e2491af9e133acd3b37c6ad9`. Os arquivos do seminário
não estavam versionados no histórico examinado; vieram do repositório de
origem. Não foi encontrada rota antiga dos outros dois artefatos.

## Revisão e limites da publicação

Os cenários, personas, rankings, índices e pareceres são didáticos. A proposta
de supervisão humana prévia foi distinguida da literalidade do art. 20 da
LGPD. Foram corrigidos artigos da Lei 14.129/2021 e o princípio de qualidade
dos dados (LGPD art. 6, V), atribuições bibliográficas e o aumento ilustrativo
do IPTU. Pareceres preparados não são atribuídos como resultados empíricos
dos quatro artigos.

No deck, os municípios usam a mesma edição PNTP 2025: Recife 92,90%,
Florianópolis 87,51% e São Paulo 70,10%. A fonte é o arquivo oficial
`avaliacoes_pntp_2025.xlsx`, disponível em
<https://radardatransparencia.atricon.org.br/downloads.html>.
Contagens sem suporte de serviços, visitas e economias foram retiradas.
Não se infere transparência algorítmica da nota de transparência do portal.
TIC Domicílios 2024 foi identificado como nível mais alto de conectividade
significativa, sem transformar o indicador em presença/ausência de acesso.

Foram retirados números não sustentados sobre vazamento Gov.br, educação SC,
CNIS, custos e precisão biométrica, e a referência incorreta HC 568.693/SP.
INSS rural aparece como cenário didático; descontos associativos remetem à
fonte oficial sem misturar amostra, estimativas e notificados. A correição
TJ-MA de 07/04/2025 foi distinguida de uma conclusão definitiva e de uma
aplicação retroativa da Resolução CNJ 615/2025. O cronograma do AI Act remete
à Comissão Europeia, sem incidência direta afirmada sobre o INSS.

Os manuscritos `dever_poder_paper.*`, registros experimentais, manuscrito
dos 60 participantes, logs, planos internos e backend não integram o site.
Vídeo e Wireframes derivados antigos foram omitidos até regeneração;
os repositórios de origem permanecem intactos.

`Seminario8-print.html`, `seminario8-leitura.pdf`,
`seminario8-leitura.docx`, `colegas.pdf` e `flyer.pdf` são derivados do
HTML revisto. Para regenerar, sirva o site e execute:

```sh
node scripts/work-demos/seminario-export.mjs http://localhost:8080
node scripts/publication.mjs --write
```

O verificador global de publicação já registra páginas não classificadas e
drift fora deste escopo no baseline. Confira o diff ao regenerar metadata;
não aprove alterações alheias automaticamente.

## Validação e deploy

- Build/typecheck do React; demonstração editorial sem backend.
- Playwright `tests/academic-works.spec.js`: caminhos, créditos, 320/390/1440px,
  teclado e diálogo do deck, leitura sem JS e ausência de chamadas externas.
- `tests/publication.spec.js`: metadados e sitemap das páginas restauradas.
- Fontes, QR codes e assets locais; QR do índice aponta ao dossiê e o do guia
  e flyer aponta a `colegas.html`.
- `npm run stage:assets` após commit: usa `git archive HEAD` e exclusões
  existentes em `.gitattributes`, sem ferramentas/fontes internas ou backend.

Push/merge em main utiliza o workflow existente `deploy-pages.yml`.
Este diretório `scripts/work-demos` é excluído da árvore publicada.
