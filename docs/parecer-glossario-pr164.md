# Parecer intelectual e bibliográfico — PR #164

**Recomendação: solicitar mudanças antes do merge.** Auditoria em 06/10/2026 do head `877bf4dac98a20d73aeb0cb14386f4c220f6b50b`, branch `codex/glossario-expandido`. O PR estava aberto, em draft e mergeable. A revisão cobre os 65 verbetes, incluindo PT/EN, metadados e apresentação sem JavaScript.

## Escopo e padrão de evidência

Documentação da tese consultada no commit `5839bd057d1f27c75be2a70d90362bd0794a51a8` de `anavvanzin/iconocracy-corpus`: Glossario.md integral; Capitulo3_colonialidade.md; Capitulo4_metodologia.md; CLAUDE.md; vault/tese/capitulo-1.md; vault/tese/references.bib; concepts/economia-iconica.md; concepts/iconometria.md; decisões de 29/07 e 24/09, inclusive atualização operacional de 29/09.

Esses arquivos são testemunhos da formulação da tese. Não são confirmação independente de que um autor externo escreveu determinada definição. Foram distinguidos: (P) formulação primária com texto cotejado; (S) síntese interpretativa/editorial; (A) conceito autoral declarado pela tese. **Nenhum dos 65 verbetes inteiros recebe P. Quatro recebem A; 61 recebem S**, incluindo operacionalizações e descrições de figuras. Identificar o referente histórico de um conceito não converte a definição pública inteira em definição primária.

A leitura do artigo de Drucker está limitada ao resumo e aos trechos recuperados do periódico; eles sustentam a distinção entre dado e capta, mas não todas as ressalvas acrescentadas pelo glossário. Cornell/Warburg sustenta a história do atlas e seus metadados editoriais; é documentação institucional, não substituto para cotejar todas as formulações de Warburg. O periódico Critical Inquiry confirma título, ano e extensão do artigo de Goodrich, e disponibiliza um excerto relevante. A tentativa de abrir o texto primário de Panofsky em csus.edu retornou 404; portanto não se certificou sua paráfrase.

## Achados e consequências

### 1. Atribuição pública excessiva — corrigida

“Fonte: Panofsky (1939)” e “Fonte: Warburg” permitiam ler uma glosa editorial como definição diretamente extraída do autor. A ressalva no corpo do PR ou ao fim do documento não acompanhava cada leitura pública. Substituído por **Proveniência editorial / Editorial provenance**, com indicação individual de síntese ou autoria, documento de origem e interlocução bibliográfica onde identificada. O índice público explica o estatuto editorial. A correção vale para os dados PT/EN e os 65 cartões pré-renderizados.

As definições foram preservadas: esta revisão não usa metadados bibliográficos para fabricar validação de conteúdo.

### 2. Os quatro conceitos autorais — autoria confirmada na documentação

- **Contrato Sexual Visual**: Glossario §1, CLAUDE e capítulo 1 §1.5 convergem: extensão visual autoral; Pateman é interlocutora do contrato sexual não visual. A cautela “podem permanecer excluídas” é uma síntese pública mais delimitada que a formulação categórica do manuscrito. Não altera a autoria.
- **Feminilidade de Estado**: documentação converge na formulação de Vanzin, com raízes em Legendre e Carson. O verbete resume a função totêmica/normativa e a dissociação entre figura e mulher histórica; não é definição de Mondzain. A glosa sobre reciprocidade pertence à tese.
- **Contrato Racial Visual**: Glossario §1 e capítulo 3 §3.2 declaram autoria. A exigência de interpretação histórica impede confundir mármore claro ou reprodução monocromática com prova de racialização. O capítulo tem IDs, descrições e perfis empíricos marcados para verificar: o glossário não os deve promover a demonstração.
- **Purificação Clássica**: Glossario §1 e CLAUDE distinguem matriz jurídica (Kantorowicz, Legendre, Hespanha) e ferramentas (Latour, Haraway, Descola). O conceito não deve ser cedido a esses autores nem reduzido a estilo neoclássico. A definição pública é compatível com o núcleo autoral; a operacionalização vigente não soma indicadores.

Essas constatações reconhecem a declaração de autoria da tese; não são certificação de prioridade mundial por pesquisa exaustiva. Endurecimento, regime e acoplamento também aparecem como autorais em trechos do Glossario: o selo público dos quatro conceitos **centrais** não decide a originalidade dos demais. Não se ampliou nem retirou o selo sem decisão da autora.

### 3. Mondzain: edição declarada não confirmada — pendência material

A tese e sua errata mandam usar `mondzain2002` para *Image, icône, économie: les sources byzantines de l’imaginaire contemporain*, Paris: Seuil. O registro institucional do Collège de France lista essa obra em **1996** e *L’Image peut-elle tuer?* em **2002**. Isso não prova inexistência de uma reimpressão de 2002, mas impede chamar a edição usada de verificada.

A correção mantém o vínculo documental e marca explicitamente a edição de 2002 como **não verificada**. Não mudou a bibliografia canônica da tese nem transplantou páginas de outra edição. Antes de certificação bibliográfica, conferir folha de rosto/colofão do exemplar e a passagem que sustenta “iconocracia”. Para economia icônica, a rejeição da glosa monetária está sustentada pela errata; a definição pública continua síntese da tese.

### 4. Panofsky: três níveis e aplicação jurídica

A documentação identifica *Studies in Iconology* (1939) e *Meaning in the Visual Arts* (1955), distinguindo assunto primário/natural, secundário/convencional e significado intrínseco. Os verbetes públicos são compatíveis como síntese, mas não reproduzem a formulação completa: pré-iconografia envolve também conteúdo expressional e controle pela história do estilo; iconografia identifica temas e conceitos convencionais; iconologia interpreta significado intrínseco.

Não se introduziu essa expansão como nova definição certificada sem cotejo primário. A regra sobre espada/balança e Justitia é aplicação jurídico-iconográfica da tese, não enunciado atribuído diretamente a Panofsky. “Atributo” combina objeto, gesto e convenção em uma definição editorial. A formulação de “iconologia” não deve apagar o terceiro nível ao reduzi-lo a identificação de motivos.

### 5. Warburg, atlas e recepção interpretativa

*Bilderatlas Mnemosyne* é obra histórica de Warburg; **2000 é a publicação editorial posterior**, por Martin Warnke com colaboração de Claudia Brink, não a data de elaboração. A referência foi identificada pelo título e a bibliografia abaixo explicita a mediação editorial.

Pathosformel e Nachleben têm filiação warburguiana na tese, mas o glossário generaliza sua aplicação a gesto, autoridade e transmissão. Denkraum não pode ser apresentado como efeito psicológico comprovado de qualquer atlas. Zwischenraum como intervalo entre imagens e “montagem” como procedimento discutível/revisável são glosas metodológicas da tese em interlocução com a recepção de Warburg, incluindo Didi-Huberman (2002), já citado no capítulo metodológico. Não se afirmou que os dois autores formulam as mesmas definições, nem se usou o atlas de 2000 como prova automática de todos os termos.

A epígrafe de §2.5 não fornece confirmação: o próprio manuscrito marca a suposta reconstrução de uma frase de Warburg por Didi-Huberman como [VERIFICAR]. Não foi reaproveitada como citação.

### 6. Ginzburg, operadores e prova

“Paradigma indiciário” passou a identificar o ensaio **Sinais: raízes de um paradigma indiciário**, em *Mitos, emblemas, sinais: morfologia e história* (Companhia das Letras, 1989), conforme a bibliografia e §2.5.2. Não se acrescentaram páginas. A aplicação à postura, às inscrições e às alegorias é da tese. Recorrência formal permite hipótese; não demonstra transmissão, intenção ou eficácia jurídica.

Suporte, proveniência, prancha, corpus, sentido e ausência são sínteses metodológicas. Recepção exige fontes próprias. A ausência de uma figura precisa de expectativa documentada; a ausência de registro no corpus não prova ausência histórica.

### 7. Indicadores e conflitos documentais

Os dez indicadores e a leitura ordinal separada são sustentados pelo Glossario §2 e decisão de 24/09, com a ressalva operacional de 29/09. Zero válido não é dado faltante. Inventário verbal é exigência, não cobertura já atingida. Não há composto nem hierarquia global.

Há trechos anteriores em Glossario e capítulos que narram progressão dos regimes e usam médias legadas. Eles não devem prevalecer sobre decisões metodológicas posteriores. A redação pública cautelosa foi preservada. Para regime iconocrático, “não constitui etapas obrigatórias” é uma limitação editorial defensável, não uma reprodução literal do diagrama antigo.

Os verbetes dos indicadores são glosas orientadoras, não substituem critérios de codificação completos. Por exemplo, serialidade no manuscrito envolve escala de reprodução, enquanto o glossário fala em padrão; desincorporação resume perda de particularidade e não lista todos os graus. Não se declarou que a página permite, sozinha, reproduzir uma codificação.

### 8. Figuras e tradução

As oito figuras evitam genealogia linear de Justitia, identificação por atributo isolado e equivalência Columbia/Liberty. Isso é intelectualmente adequado. As funções políticas são condicionadas ao objeto. Os repertórios nacionais ainda dependem de catálogos e documentação por item; um nome abreviado de Agulhon ou Resnik/Curtis não sustenta cada detalhe.

As antigas proveniências EN continham misturas como “glossary da thesis”, “chapter about colonialidade” e “Vanzin · thesis”. A substituição por proveniência explícita em inglês elimina esses problemas sem retraduzir definições nem mudar endurecimento.

## Matriz individual dos 65 verbetes

S = síntese interpretativa (inclusive operacional); A = conceito autoral. Em todos os casos, a redação pública é editorial. “Manter” indica que não se encontrou incompatibilidade suficiente para reescrever a definição; não certifica cada afirmação em fonte primária.

| # | Verbete | Estatuto | Documento cotejado | Avaliação / limite |
|---|---|---|---|---|
| 1 | iconocracia | S | `tese/manuscrito/Glossario.md` | Deslocamento da tese; edição Mondzain 2002 e atribuição primária pendentes. |
| 2 | regime iconocrático | S | `tese/manuscrito/Glossario.md` | Tipologia sem evolução obrigatória; diagrama antigo é divergente. |
| 3 | Contrato Sexual Visual | A | `vault/tese/capitulo-1.md; tese/manuscrito/Glossario.md §1` | Autoria confirmada em §1.5; Pateman não é autora da extensão visual. |
| 4 | Feminilidade de Estado | A | `tese/manuscrito/Glossario.md §1` | Autoria confirmada; Legendre/Carson são raízes, sem atribuição a Mondzain. |
| 5 | Contrato Racial Visual | A | `tese/manuscrito/Glossario.md §1` | Autoria confirmada em §3.2; material claro não prova racialização. |
| 6 | Purificação Clássica | A | `tese/manuscrito/Glossario.md §1` | Autoria confirmada; matriz jurídica distinta das ferramentas; não equivale a estilo clássico. |
| 7 | iconologia | S | `tese/manuscrito/Glossario.md` | Síntese do terceiro nível; significado intrínseco distinto da identificação de motivos. |
| 8 | iconometria | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Aparato abrangente compatível com decisão vigente; sem composto. |
| 9 | atlas iconográfico | S | `tese/manuscrito/Capitulo4_metodologia.md §2.5` | Aplicação metodológica da tese, não definição literal de Warburg. |
| 10 | descrição pré-iconográfica | S | `tese/manuscrito/Glossario.md` | Primeiro nível compatível; conteúdo expressional e controle histórico não detalhados. |
| 11 | análise iconográfica | S | `tese/manuscrito/Glossario.md` | Segundo nível compatível; exemplo de Justitia é aplicação da tese. |
| 12 | atributo iconográfico | S | `tese/manuscrito/Glossario.md` | Glosa combinando objetos, gestos e convenções; não atribuir frase inteira a Panofsky. |
| 13 | corpus | S | `tese/manuscrito/Glossario.md` | Catálogo situado e exemplar, sem pretensão de universo histórico. |
| 14 | suporte | S | `tese/manuscrito/Glossario.md` | Definição operacional de meio/circulação; não taxonomia primária certificada. |
| 15 | proveniência | S | `tese/manuscrito/Capitulo4_metodologia.md §2.5` | Exigência de rastreabilidade, não afirmação de completude. |
| 16 | inventário verbal de atributos | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Requisito, não cobertura atingida; compatível com nota de 29/09. |
| 17 | indicadores ordinais | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Ordem sem intervalos iguais; distinguir zero observado e dado faltante. |
| 18 | capta | S | `tese/manuscrito/Glossario.md` | Núcleo corroborado em Drucker; aplicação ao corpus e ressalvas são editoriais. |
| 19 | paradigma indiciário | S | `tese/manuscrito/Capitulo4_metodologia.md §2.5` | Ensaio e coletânea identificados; aplicação visual em §2.5.2. |
| 20 | Pathosformel | S | `tese/manuscrito/Glossario.md §3` | Filiação warburguiana; generalização ao jurídico exige mediações. |
| 21 | Nachleben | S | `tese/manuscrito/Glossario.md §3` | Sobrevivência transformada; não transmissão intacta. |
| 22 | Zwischenraum | S | `tese/manuscrito/Glossario.md §3` | Glosa comparativa; epígrafe marcada [VERIFICAR] não serve de prova. |
| 23 | Denkraum | S | `tese/manuscrito/Glossario.md §3` | Leitura da tese; não certificar efeito psicológico do atlas. |
| 24 | Bilderatlas Mnemosyne | S | `tese/manuscrito/Glossario.md §3` | Referente corroborado institucionalmente; 2000 é edição posterior. |
| 25 | montagem | S | `tese/manuscrito/Capitulo4_metodologia.md §2.5` | Procedimento editorial; não reivindicar definição exclusiva de Warburg. |
| 26 | prancha comparativa | S | `tese/manuscrito/Capitulo4_metodologia.md §2.5` | Unidade operacional; montagem não prova genealogia sozinha. |
| 27 | visiocracia | S | `vault/tese/capitulo-1.md; tese/manuscrito/Glossario.md §1` | Artigo de 2013 confirmado; definição ampla é síntese. |
| 28 | economia icônica | S | `concepts/economia-iconica.md` | Compatível com errata não monetária; edição 2002 não confirmada. |
| 29 | contrato sexual | S | `tese/manuscrito/Glossario.md` | Conceito de Pateman distinto da extensão visual; paráfrase primária não cotejada. |
| 30 | dois corpos do rei | S | `tese/manuscrito/Glossario.md` | Distinção recebida; aplicação feminina pertence à tese. |
| 31 | instituição das imagens | S | `tese/manuscrito/Glossario.md` | Síntese de leitura de Legendre, não enunciado literal. |
| 32 | cultura jurídica | S | `tese/manuscrito/Glossario.md` | Definição ampla em diálogo com Hespanha; enumeração não certificada. |
| 33 | colonialidade do ver | S | `tese/manuscrito/Capitulo3_colonialidade.md §§3.1–3.3; tese/manuscrito/Glossario.md` | Vocabulário mobilizado; autoria externa específica não estabelecida. |
| 34 | branquitude alegórica | S | `tese/manuscrito/Capitulo3_colonialidade.md §§3.1–3.3; tese/manuscrito/Glossario.md` | Operador da tese; classicização isolada não comprova branquitude. |
| 35 | transferência visual transatlântica | S | `tese/manuscrito/Capitulo3_colonialidade.md §§3.1–3.3; tese/manuscrito/Glossario.md` | Compatível com capítulo 3; semelhança requer circuitos documentados. |
| 36 | reconhecimento sem reciprocidade | S | `docs/decisions/2026-07-29-aparato-minimo-suficiente.md` | Imagem sozinha não demonstra condições jurídicas. |
| 37 | alegoria | S | `tese/manuscrito/Glossario.md` | Glosa mais ampla que personificação; fonte primária específica pendente. |
| 38 | personificação | S | `tese/manuscrito/Glossario.md` | Procedimento formal distinto de diagnóstico político. |
| 39 | endurecimento | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Eixo qualitativo vigente, sem intensidade global; prioridade não decidida pelo selo. |
| 40 | acoplamento imagem-norma | S | `tese/manuscrito/Glossario.md` | Operador; Glossario também o chama autoral. Selo não decide originalidade. |
| 41 | sentido produzido e sentido recebido | S | `docs/decisions/2026-07-29-aparato-minimo-suficiente.md` | Produção institucional distinta da recepção efetiva. |
| 42 | regime fundacional | S | `tese/manuscrito/Glossario.md` | Uso contextual; gesto/sacrifício não são critérios necessários. |
| 43 | regime normativo | S | `tese/manuscrito/Glossario.md` | Uso contextual; serenidade isolada não determina regime. |
| 44 | regime militar | S | `tese/manuscrito/Glossario.md` | Uso contextual; arma isolada insuficiente. |
| 45 | contra-alegoria | S | `tese/manuscrito/Glossario.md` | Contestação exige contexto; não pressupor emancipação. |
| 46 | iconoclasmo | S | `tese/manuscrito/Glossario.md` | Síntese operacional; ausência e destruição distintas. |
| 47 | ausência alegórica | S | `tese/manuscrito/Capitulo4_metodologia.md §2.5` | Expectativa documentada necessária; falta no catálogo não prova inexistência. |
| 48 | desincorporação | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Glosa da perda de particularidade; não substitui graus do codebook. |
| 49 | rigidez postural | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Leitura contextual da pose; indicador separado. |
| 50 | dessexualização | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Corpo coberto não equivale à ausência de sexualidade. |
| 51 | uniformização facial | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Reprodução ilegível não prova padronização facial. |
| 52 | heraldicização | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Integração emblemática; escudo isolado insuficiente. |
| 53 | enquadramento arquitetônico | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Distinguir efeito observado de enquadramento inerente ao suporte. |
| 54 | apagamento narrativo | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Supressão exige comparação; cenário ausente não prova apagamento. |
| 55 | monocromatização | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Distinguir objeto/reprodução; suporte não prova racialização. |
| 56 | serialidade | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Glosa de padrão; não esgota escala de reprodução do protocolo. |
| 57 | inscrição estatal | S | `tese/manuscrito/Glossario.md §2; docs/decisions/2026-09-24-remocao-definitiva-do-campo.md` | Transcrever/localizar; ilegibilidade não é ausência. |
| 58 | Justitia | S | `tese/manuscrito/Glossario.md §5` | Repertório variável; recusa de genealogia linear adequada. |
| 59 | Marianne / La République | S | `tese/manuscrito/Glossario.md §5` | Repertório plural; obras identificadas, passagens não cotejadas. |
| 60 | Britannia | S | `tese/manuscrito/Glossario.md §5` | Repertório britânico; confirmar objetos em catálogo. |
| 61 | Germania | S | `tese/manuscrito/Glossario.md §5` | Repertório alemão; armas/coroa não determinam função militar. |
| 62 | Columbia | S | `tese/manuscrito/Glossario.md §5` | Repertório dos EUA; não substituir por Liberty. |
| 63 | Liberdade / Liberty | S | `tese/manuscrito/Glossario.md §5` | Personificação transnacional; não prova direitos universais. |
| 64 | La Belgique | S | `tese/manuscrito/Glossario.md §5` | Função colonial é hipótese situada, não atributo universal. |
| 65 | A República (Brasil) | S | `tese/manuscrito/Glossario.md §5` | Carvalho identificado; transferência exige documentação por objeto. |

## Referências identificadas na tese

Metadados abaixo são interlocuções, não passagens cotejadas. Nenhuma paginação de definição é certificada.

- `mondzain2002`: Mondzain, Marie-José. *Image, icône, économie: les sources byzantines de l'imaginaire contemporain*. Seuil, 2002. **Edição não confirmada externamente.**
- `panofsky1939`: Panofsky, Erwin. *Studies in Iconology: Humanistic Themes in the Art of the Renaissance*. Oxford University Press, 1939.
- `panofsky1955`: Panofsky, Erwin. *Meaning in the Visual Arts*. Doubleday Anchor, 1955.
- `warburg2000`: Warburg, Aby. *Der Bilderatlas Mnemosyne*. Akademie Verlag, 2000.
- `didihuberman2002`: Didi-Huberman, Georges. *L'image survivante: histoire de l'art et temps des fantômes selon Aby Warburg*. Les Éditions de Minuit, 2002.
- `goodrich2013a`: Goodrich, Peter. *Visiocracy: On the Futures of the Fingerpost*. Critical Inquiry, 2013.
- `pateman1988`: Pateman, Carole. *The Sexual Contract*. Stanford University Press, 1988.
- `kantorowicz1957`: Kantorowicz, Ernst H.. *The King's Two Bodies: A Study in Mediaeval Political Theology*. Princeton University Press, 1957.
- `legendre1994`: Legendre, Pierre. *Dieu au miroir: étude sur l'institution des images*. Fayard, 1994.
- `hespanha2005`: Hespanha, António Manuel. *Cultura Jurídica Europeia: síntese de um milénio*. Almedina, 2005.
- `resnikcurtis2011`: Resnik, Judith and Curtis, Dennis E.. *Representing Justice: Invention, Controversy, and Rights in City-States and Democratic Courtrooms*. Yale University Press, 2011.
- `agulhon1979`: Agulhon, Maurice. *Marianne au combat: l'imagerie et la symbolique républicaines de 1789 à 1880*. Flammarion, 1979.
- `agulhon1989`: Agulhon, Maurice. *Marianne au pouvoir: l'imagerie et la symbolique républicaines de 1880 à 1914*. Flammarion, 1989.
- `carvalho1990`: Carvalho, José Murilo de. *A formação das almas: o imaginário da República no Brasil*. Companhia das Letras, 1990.
- `carson2000`: Carson, Anne. *Dirt and Desire: The Phenomenology of Female Pollution in Antiquity*. Men in the Off Hours, 2000.
- `latour1991`: Latour, Bruno. *Nous n'avons jamais été modernes: essai d'anthropologie symétrique*. La Découverte, 1991.
- `haraway1985`: Haraway, Donna. *A Manifesto for Cyborgs: Science, Technology, and Socialist Feminism in the 1980s*. Socialist Review, 1985.
- `descola2021`: Descola, Philippe. *Les Formes du visible: une anthropologie de la figuration*. Seuil, 2021.
- `ginzburg1989`: Ginzburg, Carlo. *Mitos, emblemas, sinais: morfologia e história*. Companhia das Letras, 1989.

- Warburg 2000: edição por Martin Warnke com colaboração de Claudia Brink, corroborada por Cornell/Warburg; não data de elaboração.
- DRUCKER, Johanna. Humanities Approaches to Graphical Display. Digital Humanities Quarterly, 5(1), 2011. Núcleo capta corroborado no artigo; aplicação e ressalvas pertencem à síntese.

Fontes externas recuperadas em 06/10/2026:

- [Cornell / Warburg — About](https://warburg.library.cornell.edu/about/): história, arranjo e edição do atlas.
- [Critical Inquiry — Spring 2013](https://criticalinquiry.uchicago.edu/past_issues/issue/spring_2013_v39_n3/) e [sumário 39(3)](https://www.journals.uchicago.edu/toc/ci/2013/39/3): título, ano, extensão 498–531 e excerto do artigo de Goodrich. DOI: 10.1086/670043.
- [Drucker — DHQ](https://digitalhumanities.org/dhq/vol/5/1/000091/000091.html): resumo/trechos recuperados; abertura integral redirecionou para host inacessível.
- [Collège de France — Mondzain](https://www.college-de-france.fr/fr/agenda/colloque/la-solitude-dans-la-foule/architecture-de-accueil): distingue Image, icône, économie (1996) de L’Image peut-elle tuer? (2002).

## Correções e condição para merge

Aplicado apenas o sustentado: proveniência editorial individual nos 65 verbetes; preservação de autoria; referências identificáveis para interlocuções antes abreviadas; identificação do ensaio de Ginzburg; registro da mediação editorial do atlas; marcação da edição Mondzain como não verificada; coerência PT/EN e cartões estáticos. Nenhuma definição foi promovida a citação primária e nenhuma página foi acrescentada como localização de passagem.

Antes de aprovação bibliográfica, resolver a edição Mondzain e cotejar as passagens prioritárias de Panofsky e Warburg, separando recepção e formulação primária. Os conflitos empíricos dos capítulos exigem revisão própria e não foram sanados fora deste escopo. Se a opção for publicar assumidamente um léxico da tese, os rótulos corrigidos tornam seu estatuto explícito; isso não equivale à aprovação de definições primárias verificadas.

## Validação

Verificação estática local: sintaxe dos scripts inline; 65 fichas e quatro conceitos autorais; igualdade entre dados PT e cartões sem JavaScript; relações resolvíveis; matriz cobrindo todos os IDs; ausência de Fonte/Source como rótulo forte. Definições PT/EN preservadas em relação ao head auditado.

Não se executaram Playwright e build:pages nesta rodada: não há checkout integral; a clonagem pelo endpoint disponível exigiu autenticação indisponível. Os testes na descrição do PR são execução anterior, não desta auditoria. Verificações estáticas não foram apresentadas como validação renderizada.

