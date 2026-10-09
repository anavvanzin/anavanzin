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

