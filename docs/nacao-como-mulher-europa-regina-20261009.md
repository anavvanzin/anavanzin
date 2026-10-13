# Europa regina — cotejo documental da exposição (2026-10-09)

Base examinada: `anavvanzin/anavanzin@8c7a64032b8fda2a2874d70cb5bebde8cfbc002c`.
Escopo: ficha `europa-regina`, registro comparativo `EU-1628`, renderização React, HTML pré-renderizado e documentação de fontes. Não é atualização do corpus canônico.

## Materiais e datas

Materiais lidos no Drive, incorporados em 08/10/2026 às 23h06 de Brasília (09/10/2026 às 02h06 UTC):

- [Dossiê histórico](https://drive.google.com/file/d/1qBadVNikl4tvUNGYFZ6qZ9tvrMUUU1IY/view): *EUROPA REGINA: o corpo real do continente*, especialmente tabela 1, § 3, § 4 e legenda da figura 3.
- [Relatório de integridade citacional](https://drive.google.com/file/d/10PV0FNoC4t0diIhbQn09UjZdbo8IdwUh/view): datado internamente de **19/09/2026**, especialmente itens 1, 3–5, 7–10, 14 e ressalvas do § 5.
- [Textos revisados](https://drive.google.com/file/d/1lmYwIdzFAmRWXEN77NkH5wOY6sZ9BlXu/view): abertura de capítulo e nota de pesquisa.

A data de entrada no Drive não foi tratada como data de redação ou de verificação dos documentos. Estes são documentação de pesquisa, não substitutos do exame de um original.

## Matriz de decisão

| Campo/questão | Situação anterior | Decisão e fundamento |
|---|---|---|
| Criação do desenho | Putsch teria concebido o esquema em 1537 | Desenho de Putsch **já materializado em 1534**. Não se fixa uma data exata de concepção: 1534 data a xilogravura de Augsburgo, executada por Jobst Dennecker (Jost Denecker na fonte institucional). Dossiê § 3; Wawruschka 2019. |
| Impressão de 1537 | Confundida com a criação | Impressão parisiense de Christian Wechel retomando o desenho; dossiê § 3 e relatório, itens 1 e 3. Não se afirma uso do mesmo bloco de madeira. |
| Registro EU-1628 | Data pública «1537 / edições posteriores»; citação genérica de Putsch | Data pública «1628 (edição de referência)»; versão da *Cosmographia* de Münster, edição alemã, p. 54, «Das ander Buch», segundo tabela 1 e figura 3 do dossiê. Trata-se de edição póstuma, não de publicação pessoal de Münster em 1628. A identificação é documental e condicionada ao cotejo institucional. |
| Redescoberta | Não explicitada | Exemplar de Retz de 1534: achado relatado por Celine Wawruschka em 2018, divulgado em 2019; fonte institucional em primeira pessoa confirma o verão de 2018. Uzelac é autor da análise acadêmica posterior. |
| Fonte visual | Link Bavarikon sem vínculo resolvido com edição | Mantido como referência institucional pendente. Dossiê, figura 3, informa digitalização via archive.org; não fornece no trecho uma cadeia completa que ligue essa digitalização ao objeto Bavarikon. Nenhum vínculo novo foi inferido. |
| Descrição e interpretação | Campos `observed` e `interpretation` separados | Preservados literalmente; não se acrescentaram atributos do exemplar de Retz à descrição de EU-1628. Prancha derivada não é evidência visual do original. |
| Auditoria | `unavailable`, consulta de 04/10 | Nova tentativa em 09/10: «Access Denied», proteção Anubis. Mantido `unavailable`; atualizada a nota com o avanço bibliográfico e as pendências. `reviewedAt: 2026-09-25` é o histórico da revisão anterior, não certificação institucional atual. |

## Fontes públicas efetivamente consultadas

1. WAWRUSCHKA, Celine. **Die «Königin Europa» in Retz**. Museumsmanagement Niederösterreich, 14 maio 2019. [Página institucional](https://www.noemuseen.at/news-list/blog-detail/news/detail/News/die-koenigin-europa-in-retz/). Consulta: 09/10/2026. O relato da descobridora situa o achado no verão de 2018; a legenda e o texto atribuem desenho a Putsch e execução da xilogravura de Augsburgo de 1534 a Jost Denecker. A pesquisa é relatada junto de Helene Schrolmberger.
2. UZELAC, Aleksandar. **Some Notes on the Putsch Map (“Europa Regina”) and Its Depiction of Southeastern Europe**. *East Central Europe: Between the Baltic and the Adriatic*, v. 1, n. 1, 2025. DOI: [10.65006/eastcentraleurope/2025/16363](https://doi.org/10.65006/eastcentraleurope/2025/16363). [Registro e resumo do periódico](https://ojs.lib.unideb.hu/eastcentraleurope/article/view/16363). Consulta: 09/10/2026. O resumo confirma a precedência de 1534 sobre Paris 1537 e as versões de Bünting (1587) e Münster (1588). Seu resumo usa 2019 para a redescoberta; para distinguir achado e divulgação, preferiu-se o relato de Wawruschka. **O PDF integral não abriu nesta consulta**; não se apresenta leitura própria das páginas 213–214 citadas pelo dossiê.
3. [Bavarikon / Staatsbibliothek Regensburg](https://www.bavarikon.de/object/bav:SBR-HSS-00000BSB00113022?lang=en). Nova tentativa: 09/10/2026. Acesso negado; **sem verificação visual ou confirmação de metadados do exemplar**.

As duas primeiras referências passaram a aparecer na ficha, em React e no HTML sem JavaScript. Os documentos privados de trabalho permanecem referenciados nesta nota de auditoria, sem serem usados como links públicos de acesso presumidamente aberto.

## Controle das demais correções

Busca textual nos arquivos de conteúdo e renderização de `apps/nacao-como-mulher` e na página gerada `atlas/nacao-como-mulher/index.html`:

| Tema | Resultado na exposição examinada | Ação |
|---|---|---|
| Kloekhoff/Bohn, 1709 versus 1794, título *Europa deplorans* | Não há afirmação sobre esses autores/mapa | Nenhuma. Correção já consta dos textos revisados. |
| Michael Maier, *Atalanta fugiens*, Emblema I versus II | Não há afirmação sobre a obra/emblemas | Nenhuma. Não introduzir esse objeto na ficha de Europa. |
| Heitz/Lévy, inspiração mariana da bandeira europeia | Não há afirmação sobre essa origem | Nenhuma. Não converter hipótese controvertida em fato histórico da exposição. |
| Camões/Putsch, Bünting e filiação de Opicinus | Não há afirmação específica a corrigir | Nenhuma ampliação temática. |

Não é declaração de ausência em toda a tese ou em todo o repositório: o escopo é a exposição. Os textos revisados no Drive foram somente lidos.

## Ressalvas não incorporadas como fatos

- O dossiê menciona uma imagem datada de 1570, enquanto o relatório enfatiza a edição póstuma de 1588. Essa divergência de identificação editorial não foi resolvida por inferência e não foi transportada para EU-1628.
- O parentesco editorial atribuído no dossiê a Sebastian Petri e a cronologia de edições anteriores não são necessários à correção e não foram incorporados.
- A lista de idiomas das edições da *Cosmographia* não demonstra, por si, a presença da imagem em todas elas.
- O próprio relatório admite não ter localizado a passagem sobre a densidade de topônimos da Germânia em Meurer; ela não foi acrescentada.
- Não se importaram contagens antigas de corpus presentes no dossiê, nem se atribuiu automaticamente interpretação teológico-política às instituições.

## Pendências institucionais

- Abrir o exemplar de 1628, localizar folha/página, conferir frontispício, edição e atributos visuais.
- Resolver a correspondência entre a digitalização citada como archive.org no dossiê, o objeto Bavarikon e o registro de exposição EU-1628.
- Conferir os termos de uso da reprodução digital.
- Manter a identificação de edição como documental até essas verificações.

## Integridade da implementação

O JSON é a fonte das duas renderizações. A alteração acrescenta proveniência e referências opcionais ao tipo e ao painel de fontes de React e do pré-renderizador. Os nove IDs, o campo `scope`, as contagens e hashes dos levantamentos, os caminhos de imagens e as oito demais fichas permanecem intactos. Nenhuma imagem ou arquivo de corpus foi incluído no conjunto de alterações.

Validações concluídas:

- `npm run check:exhibition`: TypeScript, 6 testes Vitest, 9 fichas e os dois levantamentos documentais aprovados.
- `npm run build:exhibition`: bundle regenerado e 9 fichas pré-renderizadas. O CSS gerado permaneceu idêntico ao arquivo anterior.
- Cotejo por renderização estática dos componentes React (PT e EN) e do HTML pré-renderizado (PT): datas, três camadas de leitura, citações e auditoria das nove fichas correspondem ao JSON; proveniência e referências novas presentes.
- Comparação estrutural: metadados, oito demais fichas, descrição, interpretação, ID, escopo e caminhos de imagens de EU-1628 inalterados.
- As 18 imagens locais de origem e de saída coincidem com os hashes Git dos arquivos originais; não há mudança de imagem na PR.
- `git diff --check`: aprovado.

Limite da validação: não houve teste interativo em navegador real. Chromium estava ausente e sua instalação falhou por download inválido/truncado. O cotejo React foi feito por renderização estática, não por E2E. O build avisou sobre fontes globais ausentes no checkout parcial; os arquivos globais não foram alterados.

## Adendo — rastreamento material e digital (2026-10-13)

Reexame da PR #165 no head `0d4ea36bfee8c9aa6bc5fca1dd147762fb7268d5`. Este adendo supersede a associação de EU-1628 ao objeto Bavarikon tratada acima como apenas pendente. A cronologia 1534/1537/1628, a descrição e a interpretação histórica permanecem separadas.

### Correspondências e limites

| Elo | Evidência consultada | Resultado |
|---|---|---|
| Dossiê → edição | Tabela 1 nomeia `muenster_cosmographia_1628_0117.jpg`; figura 3 e referência identificam Münster, Basileia, 1628, p. 54 | Identificação bibliográfica documental. O relatório de 19/09 não fornece cota ou cadeia material que certifique este exemplar. |
| Dossiê → captura digital | Figura 3 extraída da versão DOCX do mesmo dossiê, [Drive](https://drive.google.com/file/d/1KTkEVvDoXIOyfx5UGKhvkUe9HSWwXylS/view), `word/media/rId30.jpg`, 1477 × 2186 px; [imagem n117 do Internet Archive](https://archive.org/download/muenster_cosmographia_1628/page/n117.jpg), 2953 × 4371 px | Correspondência visual forte: página 54, cabeçalho «Das ander Buch», mesmo enquadramento, manchas e interrupções do traço no cetro e na borda direita. As dimensões da imagem incorporada são aproximadamente metade da captura. São arquivos distintos; não se afirma igualdade binária. |
| Índice digital → página impressa | [Índice de páginas do Internet Archive](https://archive.org/download/muenster_cosmographia_1628/muenster_cosmographia_1628_page_numbers.json), `leafNum: 117`, `pageNumber: "54"`, conferido visualmente | `n117` não é a paginação impressa 117: a página traz 54. A sequência 116/117/118 é catalogada como 53/54/55. |
| Item digital → origem institucional | [Item IA](https://archive.org/details/muenster_cosmographia_1628) e [metadados](https://archive.org/metadata/muenster_cosmographia_1628): alemão, 1628, Basileia; origem declarada `http://bnm.bnrm.ma:86/pdf.aspx?IDc=4566`; depósito em 01/06/2021, perfil público Historiker | A origem é declaração do depositante, não certificação de custódia pelo Internet Archive. O domínio aponta para a Bibliothèque nationale du Royaume du Maroc; o endereço original e a tentativa HTTPS sem porta retornaram 502. Cota, titularidade do exemplar e cadeia de digitalização não foram confirmadas no catálogo institucional. |
| Antigo Bavarikon → objeto | [Manifest IIIF institucional](https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00113022/manifest), consultado diretamente: `Quad, Matthias: Evropae Descriptio`; [Köln]: Bussemacher; 1587; [1] Bl.; latim; Regensburg, Staatliche Bibliothek; `999 Gr/2Hist.pol.5,52a`; `BV013546107`; URN `urn:nbn:de:bvb:12-bsb00113022-1` | Outro objeto. O vínculo com o exemplar Münster de 1628 é rejeitado, não deixado como correspondência provável. O portal Bavarikon ainda respondeu «Access Denied»; o catálogo e a imagem puderam ser examinados pela API IIIF institucional. |
| Digitalização → arquivo nomeado no pacote IDEAS 18 | Busca por nome exato no Drive sem resultado; árvore da branch sem esse JPEG | Não recuperado o arquivo original `muenster_cosmographia_1628_0117.jpg`. A coincidência do nome com o índice IA e o cotejo da figura incorporada sustentam identificação digital, sem autenticar bytes do arquivo de trabalho. |
| Fonte histórica → imagens da exposição | `EU-1628-europa-regina-atlas.webp` examinado diretamente; créditos na própria prancha e aviso editorial; metadados `images` e textos PT/EN | Prancha e recorte são estudos interpretativos gerados por IA. Há relação formal com a versão de Münster, mas não foi localizado registro de geração que comprove qual JPEG foi usado. Não são fac-símiles, nem testemunhos da materialidade do exemplar. |

A imagem institucional de Quad foi examinada pelo [IIIF Image API](https://api.digitale-sammlungen.de/iiif/image/v2/bsb00113022_00001/full/1000,/0/default.jpg): cartucho «Evropae Descriptio», brasões e numerosos navios, ausentes da página 54 cotejada. O manifest institucional fornece identificação suficiente para excluir a antiga associação. Seu comentário histórico contém cronologia antiga de Putsch e não foi usado para desfazer as correções de 1534/1537.

### Direitos e evidência digital

O item IA declara **Public Domain Mark 1.0**. Isso foi transcrito como declaração do serviço, não convertido em autorização institucional do endereço de origem. O manifest de Quad também fornece PDM 1.0, mas seus termos não foram transferidos para Münster ou para as pranchas interpretativas.

SHA-256 dos arquivos efetivamente examinados (cópias de consulta, não arquivos novos do corpus):

- Figura 3 incorporada no DOCX, `rId30.jpg`: `bce6592fd8a884c11ba533a4321122cf339c982ea115b31bdd78548d99c984d0`.
- IA `page/n117.jpg`: `117b362158b51505c2d387c86bfb6e2e6d7c12cf7ef35bdf5f063f83ea0f4d6b`.
- Prancha existente `EU-1628-europa-regina-atlas.webp`: `fd631bcd93f478c3d4071b98646aed6d5c9f0a7eabf4c26f0f1a63fc4c434fa9`.

### Decisão sobre os metadados

- `source.institution/url` passa a identificar o item digital efetivamente cotejado no Internet Archive. Não se atribui a ele a custódia física.
- A antiga referência Bavarikon é retida como referência explicitamente de **outro objeto**, com identificação institucional demonstrada; deixa de ser a fonte principal de EU-1628.
- `source.citation/provenance/rights` explicita em PT/EN o alcance do cotejo, a origem declarada, a ausência de identificação material e o caráter interpretativo das imagens.
- `audit.status` passa de `unavailable` para **`partial`**: a captura e a exclusão do objeto errado estão verificadas; a cadeia material continua incompleta. Não passa a `confirmed`.
- `review.status: verified` e `reviewedAt: 2026-09-25` são preservados como registro anterior; não certificam os vínculos materiais deste adendo. IDs, nove fichas, imagens, cronologia e camadas `observed/context/interpretation` são preservados.

**Pendência decisiva:** obter registro institucional com cota do exemplar de 1628, cotejar sinais de posse, recuperar o JPEG original do pacote e o registro de geração das pranchas. A confirmação da edição não comprova, sozinha, o exemplar ou a derivação dos assets.

### Equivalência editorial PT/EN

As duas versões dizem a mesma coisa: correspondência visual da figura 3 com p. 54/n117; edição conferida no frontispício digital n14; origem marroquina declarada pelo IA, sem confirmação de exemplar/cota; Quad 1587 como outro objeto; arquivos da exposição como estudos interpretativos; auditoria parcial. Nenhuma tradução converte hipótese de derivação ou identificação do exemplar em fato.

Validação desta revisão registrada abaixo após o build e o cotejo das renderizações. Nenhum merge ou publicação foi realizado. O resultado técnico não certifica a proveniência.




**Cotejo do frontispício digital concluído:** [n14](https://archive.org/download/muenster_cosmographia_1628/page/n14.jpg) traz Cosmographia, texto alemão, Sebastian Münster, Basel e «Bey den Henricpetrinischen». O texto menciona 1628 e a data final aparece como «M. DC. XXIIX.» (1628). Confirma-se a edição na sequência digital, sem inferir a cota ou a custódia física. A identificação da oficina não é convertida em publicação pessoal de Münster nem em atribuição a Henricus Petri vivo em 1628.

### Validação do adendo de 13/10

- `npm run check` e `npm run build` em `apps/nacao-como-mulher`: TypeScript, 6 testes Vitest, validação de nove fichas e dois snapshots aprovados; bundle e HTML regenerados.
- Chromium real (`/tmp/chromium`), Playwright em checkout parcial: **14 verificações aprovadas e uma falha** no conjunto executado. As três verificações específicas de cotejo JSON/renderização (PT, EN e PT sem JavaScript) passaram; também passaram ausência de overflow em 320/390/768/1280 px, leitura, idioma, filtros e comparação.
- A falha `figure stays within narrow stage when moved and resized` exige altura <1500 px e recebe **1756 px**. Reexecutada contra o bundle e HTML do head original `0d4ea36`, apresentou **os mesmos 1756 px**; não foi corrigida nem ocultada por relaxamento do limite nesta revisão de proveniência.
- A expectativa antiga `later editions` no teste de Explore EN foi atualizada para `1628 (reference edition)`, já exibido pela PR original.
- Três testes de integração da homepage/Atlas foram excluídos por não fazerem parte do checkout parcial; não se declara execução integral do site.
- Os 18 arquivos de imagem de origem e os 18 de saída correspondem aos blobs originais da branch. CSS e componentes não foram alterados. As oito outras fichas, metadados gerais, cronologia, IDs e camadas de descrição/contexto/interpretação de EU-1628 foram preservados.
- Avisos do build sobre fontes globais decorrem do checkout parcial; os arquivos globais originais foram recuperados para o cotejo em navegador e não entram no commit.

As verificações específicas foram executadas como instrumentos locais de auditoria, sem acrescentar novos testes ao repositório. A suite da exposição permanece com uma falha reproduzida no head anterior; aprovação técnica e confirmação material são questões distintas.
