import { assetPath } from '../lib/paths';

// Conteúdo integral dos nove documentos da Biblioteca, transcritos para leitura no site.
// Apenas material pronto e de estudo — nenhum rascunho de trabalho publicado.

export type DocBlock =
  | { kind: 'para'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; caption?: string; head: string[]; rows: string[][] }
  | { kind: 'quote'; text: string; source?: string }

export type InstrumentId =
  | 'theme-tester'
  | 'savigny-interpreter'
  | 'coherence-builder'
  | 'herbarium-explorer'

export interface LibraryDocSection {
  id: string
  title: string
  blocks: DocBlock[]
  instrument?: InstrumentId
}

export interface LibraryDoc {
  slug: string
  model: 'flow' | 'explainer'
  title: string
  eyebrow: string
  year: string
  intro: string
  image: string
  meta: string
  sourceNote: string
  sections: LibraryDocSection[]
}

const p = (text: string): DocBlock => ({ kind: 'para', text })
const list = (items: string[]): DocBlock => ({ kind: 'list', items })
const table = (head: string[], rows: string[][], caption?: string): DocBlock => ({
  kind: 'table',
  head,
  rows,
  caption,
})
const quote = (text: string, source?: string): DocBlock => ({ kind: 'quote', text, source })

export const libraryDocs: LibraryDoc[] = [
  // ------------------------------------------------------------------ 01
  {
    slug: 'guia-mitologias',
    model: 'flow',
    title: 'Guia de Estudos — Mitologias Jurídicas da Modernidade',
    eyebrow: 'guia de revisão · paolo grossi',
    year: 'recordação ativa · 10 questões',
    intro:
      'Um questionário de dez questões de resposta curta sobre Mitologias jurídicas da modernidade, com chave de respostas comentadas, cinco frentes de dissertação e um glossário mínimo de treze termos — um exemplo pronto de recordação ativa aplicada à leitura densa.',
    image: assetPath('/images/bib-mitologia.jpg'),
    meta: 'questões comentadas · chave de respostas · glossário',
    sourceNote:
      'Material de estudo do acervo pessoal: questionário com chave de respostas, sugestões de dissertação e glossário mínimo.',
    sections: [
      {
        id: 'I',
        title: 'Como usar este guia',
        blocks: [
          p(
            'O guia cobre o arco central do livro de Grossi: a função crítica do historiador, as duas concepções de lei (lex e loy), a mitificação do direito, o poder político medieval, o imperativismo e suas perdas, o mito do código, o jacobinismo jurídico, a distinção entre comando e ordenamento, a Carta de Nice e a dissolução da pessoa no indivíduo. Cada questão abaixo traz a resposta comentada logo em seguida — tente responder por escrito antes de conferir: a dificuldade de recuperar a resposta é exatamente o exercício.'
          ),
          p(
            'Ao final, cinco frentes de dissertação para treinar escrita e o glossário mínimo com os treze termos sem os quais o livro não pode ser discutido.'
          ),
        ],
      },
      {
        id: 'II',
        title: 'O historiador como consciência crítica',
        blocks: [
          p(
            'Questão — Qual a diferença entre o historiador erudito e o historiador como consciência crítica, na acepção de Grossi?'
          ),
          p(
            'Resposta comentada — O historiador erudito acumula factos, datas e textos; o historiador como consciência crítica interroga as estruturas que produziram esses factos. A erudição registra o passado; a consciência crítica revela como o presente escolheu — e escolhe — lembrá-lo. Para Grossi, estudar a história do direito sem essa segunda função é apenas antiquarianismo: útil, mas cego às mitologias que sustentam o direito atual.'
          ),
        ],
      },
      {
        id: 'III',
        title: 'Lex e Loy — duas concepções de lei',
        blocks: [
          p(
            'Questão — Explique as duas concepções de lei que Grossi contrapõe: a lex tomásica e a loy montaigniana.'
          ),
          p(
            'Resposta comentada — A lex de Tomás de Aquino é a ordinatio rationis: a lei como ordenação da razão, racional, articulada, própria da tradição jurídica que culmina na modernidade. A loy que Montaigne observa nas montanhas da França é algo bem diferente: o direito como fundamento místico, como prática encantada da comunidade, que se cumpre sem que se saiba bem por quê. O livro inteiro pode ser lido como a expulsão da loy pelo domínio absoluto da lex — e como a tentativa de recolocar a experiência viva de volta no direito.'
          ),
        ],
      },
      {
        id: 'IV',
        title: 'A mitificação do direito',
        blocks: [
          p('Questão — O que é a mitificação do direito?'),
          p(
            'Resposta comentada — É a transformação do conhecimento crítico em crença acrítica. Quando estruturas históricas determinadas — o código, o Estado, a norma — são tomadas como natureza do direito, o mito está instalado: aquilo que foi feito passa a ser inquestionável. As "mitologias jurídicas da modernidade" são essas crenças estruturantes: o monismo jurídico, o estatismo, o legalismo, a constituição material burguesa.'
          ),
        ],
      },
      {
        id: 'V',
        title: 'O poder político não consumado',
        blocks: [
          p('Questão — O que Grossi entende por "poder político não consumado" na experiência medieval?'),
          p(
            'Resposta comentada — No medievo, o poder nunca se dava como totalidade: era parcelado entre muitas instâncias — igreja, império, comunas, corporações, universidades, senhorios — e sempre precisava de mediações para produzir efeitos. O poder era real, mas incompleto, sempre negociado. A modernidade o "consuma": concentra-o no Estado e o faz aparecer como fonte única e onipotente. Recuperar a experiência do poder não consumado serve de contrapeso analítico à imagem estatal absoluta.'
          ),
        ],
      },
      {
        id: 'VI',
        title: 'O custo do imperativismo',
        blocks: [
          p('Questão — Qual o custo da visão potestativa (imperativista) do direito?'),
          p(
            'Resposta comentada — A perda da acepção sapiencial do direito. Se o direito é apenas comando do soberano, ele deixa de ser sabedoria e prática de vida em comunidade para se tornar instrumento de poder: uma técnica de gestão. O custo é epistêmico e civil: empobrece o jurista, que vira técnico da norma, e empobrece a sociedade, que perde o direito como linguagem de sentido.'
          ),
        ],
      },
      {
        id: 'VII',
        title: 'O Código de 1804 como mito',
        blocks: [
          p('Questão — Por que o Código Napoleônico é um mito, e não apenas uma lei?'),
          p(
            'Resposta comentada — Porque ele condensa e inaugura a tríplice promessa da modernidade codificada: unidade (uma só lei para todo o território), completude (a lei responde a tudo) e exclusividade (não há direito fora dela). Nenhuma das três se sustenta na experiência, mas as três estruturam o imaginário jurídico até hoje. O código é mito no sentido estrito: uma narrativa fundadora que organiza a crença dos juristas.'
          ),
        ],
      },
      {
        id: 'VIII',
        title: 'Jacobinismo jurídico',
        blocks: [
          p('Questão — O que é o jacobinismo jurídico?'),
          p(
            'Resposta comentada — É a tendência à centralização absoluta da produção jurídica no Estado, herdeira do impulso jacobino: uma só nação, uma só lei, uma só vontade. No plano jurídico, traduz-se na identificação direito = lei estatal, com a consequente desconfiança ou proibição de qualquer fonte intermediária — costumes, corporações, autonomias. É a expressão política do monismo jurídico.'
          ),
        ],
      },
      {
        id: 'IX',
        title: 'Comando e ordenamento — Santi Romano',
        blocks: [
          p('Questão — Diferencie comando e ordenamento segundo a tradição que Grossi recupera (Santi Romano).'),
          p(
            'Resposta comentada — A norma potestativa é o comando: uma vontade que se impõe. O ordenamento é bem mais: a estrutura social efetivamente institucionalizada, a sociabilidade organizada que existe antes e além de qualquer comando. Santi Romano, com sua teoria da instituição, mostra que o direito não está nas normas abstratas, mas nas ordenações concretas — corporações, sindicatos, associações, a própria sociedade. Direito é mais aplicação do que norma.'
          ),
        ],
      },
      {
        id: 'X',
        title: 'A Carta de Nice e a pessoa dissolvida',
        blocks: [
          p('Questão — Qual a crítica de Grossi à Carta dos Direitos Fundamentais da União Europeia (Nice)? E o que distingue pessoa de indivíduo?'),
          p(
            'Resposta comentada — A Carta de Nice é, para Grossi, um "pedaço de papel": uma constituição formal que se impõe de cima para baixo, sem a constituição material — a organização viva da sociedade — que lhe daria raiz. Constituição de verdade (Verfassung) é o processo vivido, não o texto proclamado. Quanto à segunda parte: a pessoa é realidade relacional, definida pelos vínculos e papéis que desempenha na comunidade; o indivíduo é a abstração moderna — o sujeito insular, sem mediações, que a modernidade colocou no centro do direito e que, paradoxalmente, deixou mais desprotegido, pois o direito deixou de vê-lo como pessoa inserida.'
          ),
        ],
      },
      {
        id: 'XI',
        title: 'Frentes de dissertação',
        blocks: [
          p(
            'Cinco frentes para treinar escrita a partir do livro — escolha uma e sustente uma tese em quatro a seis laudas:'
          ),
          list([
            'A expulsão da loy pela lex é um progresso ou uma perda? Discuta com base na distinção entre direito posto e direito vivido.',
            'O código civil permanece um mito na prática jurídica brasileira contemporânea? Exemplifique com a atuação de um tribunal.',
            'Recupere um caso concreto e analise-o sob a dicotomia comando/ordenamento, em diálogo com Santi Romano.',
            'A centralização da produção jurídica no Estado fortaleceu ou enfraqueceu a proteção dos sujeitos? Argumente com a categoria pessoa/indivíduo.',
            'A constituição material da sociedade brasileira corresponde à constituição formal de 1988? Identifique uma distância e proponha um remédio institucional.',
          ]),
        ],
      },
      {
        id: 'XII',
        title: 'Glossário mínimo',
        blocks: [
          p('Treze termos sem os quais o livro não pode ser discutido:'),
          table(
            ['Termo', 'Sentido no livro'],
            [
              ['Absolutismo jurídico', 'Concentração de toda produção e validade do direito no Estado, como fonte única.'],
              ['Aceção sapiencial', 'O direito como sabedoria e prática de vida — não mero comando ou técnica.'],
              ['Common law', 'Direito comum inglês, formado pela jurisprudência, contraposto ao direito continental codificado.'],
              ['Constituição material', 'A ordem socioeconômica real que sustenta o direito, para além do texto formal.'],
              ['Descodificação', 'Movimento pós-moderno que desfaz a pretensão de unidade, completude e exclusividade do código.'],
              ['Direito vivo', 'O direito efetivamente praticado pelas comunidades, distinto do direito posto no papel.'],
              ['Estatismo', 'A identificação entre direito e lei do Estado — uma das mitologias centrais.'],
              ['Ius commune', 'O direito comum europeu medieval, corpus civilístico compartilhado antes dos códigos.'],
              ['Legalismo', 'A confusão entre direito e lei: tudo o que é lei é bom, e só lei é direito.'],
              ['Monismo jurídico', 'A crença em fonte única e sistema fechado de direito — o código como todo.'],
              ['Onticidade do direito', 'O direito como ente real, socialmente vivido — não como mero texto normativo.'],
              ['Pessoa / indivíduo', 'Pessoa: realidade relacional e de vínculos. Indivíduo: abstração moderna, sujeito insular.'],
              ['Visão potestativa', 'O direito reduzido a poder-comando, com a perda de sua dimensão sapiencial.'],
            ]
          ),
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 02
  {
    slug: 'estudo-grossi',
    model: 'flow',
    title: 'Estudo Crítico e Analítico — Paolo Grossi',
    eyebrow: 'fichamento analítico · seção a seção',
    year: 'leitura ativa · 5 seções',
    intro:
      'Fichamento analítico completo de Mitologias jurídicas da modernidade: cada seção do livro é reconstruída com perguntas de compreensão, conclusões próprias e um quadro comparativo final — o modelo de como transformar leitura densa em estudo ativo.',
    image: assetPath('/images/bib-mitologia.jpg'),
    meta: 'perguntas de compreensão · conclusões por seção',
    sourceNote:
      'Material de estudo do acervo pessoal: fichamento analítico seção a seção, com conclusões e cinco insights estratégicos finais.',
    sections: [
      {
        id: 'I',
        title: 'O historiador: erudição ou consciência crítica?',
        blocks: [
          p(
            'A primeira seção do fichamento estabelece o método: Grossi não propõe uma história do direito como acervo, e sim como desmascaramento. O historiador erudito cataloga; o historiador crítico pergunta por que certas estruturas passaram a parecer naturais. A pergunta que estrutura a seção: para que serve a história do direito, se não for para desnaturalizar o presente?'
          ),
          quote(
            'A historiografia jurídica séria não é memória do passado: é um ato de vigilância sobre o presente.',
            'síntese do fichamento, § 1'
          ),
          p(
            'Conclusão da seção — a erudição sem consciência crítica reproduz o mito; a crítica sem erudição vira opinião. O fichamento adota como regra de ouro: nenhum conceito jurídico entra no caderno sem sua genealogia.'
          ),
        ],
      },
      {
        id: 'II',
        title: 'Medievo e modernidade: o poder não consumado',
        blocks: [
          p(
            'A segunda seção contrapõe as duas experiências históricas. No medievo, o poder é parcelado e precisa de mediações para produzir efeitos — é "não consumado". A modernidade consome o poder: concentra-o no Estado e o apresenta como fonte única. O fichamento registra a oposição entre a "ossada secreta" do direito medieval — suas estruturas vivas, muitas vezes não escritas — e a "voz do poder" moderna, que tudo proclama e tudo codifica.'
          ),
          p(
            'Aqui entram a distinção lex/loy, o custo do simplismo iluminista — que leu o medievo como pura escuridão a ser superada — e a contraposição entre a razoabilidade viva do direito comum e a forma vazia do direito posto. Leitura-chave: o medievo não é um atraso, é um aviso.'
          ),
          p(
            'Conclusão da seção — medir o presente pela categoria de "poder consumado" revela o que a doutrina contemporânea tende a ocultar: que a concentração estatal é escolha histórica, não necessidade.'
          ),
        ],
      },
      {
        id: 'III',
        title: 'O antinormativismo e a gaiola kelseniana',
        blocks: [
          p(
            'A terceira seção expõe a crítica ao normativismo: a norma potestativa, isolada, não explica o direito — explica-o o ordenamento, a sociabilidade institucionalizada. O fichamento trabalha a metáfora da "gaiola kelseniana": a norma pura enclausurada em si mesma, alimentada apenas por outra norma, sem contato com a vida social.'
          ),
          p(
            'Daí a importância das cláusulas gerais e da elasticidade normativa — o direito real sempre escapa à gaiola — e das sociedades intermediárias, que produzem ordenamentos próprios. A fórmula que fecha a seção: o direito é mais aplicação do que norma.'
          ),
          p(
            'Conclusão da seção — perguntar "qual ordenamento social esta norma pressupõe?" é o antídoto prático contra o formalismo vazio.'
          ),
        ],
      },
      {
        id: 'IV',
        title: 'O mito do código',
        blocks: [
          p(
            'A quarta seção é o núcleo do livro. O código nasce da tríplice tensão: unidade (uma lei para todo o território), completude (a lei responde a tudo) e exclusividade (não há direito fora dela). Nenhuma se sustenta na experiência — e as três compõem a constituição material da burguesia, que precisava de um direito uniforme, previsto e estatal para o mercado. A incomunicabilidade do código com o direito vivido e a persistência da lex mercatoria mostram que o mito nunca venceu de fato.'
          ),
          table(
            ['Dimensão', 'Código Napoleônico (1804)', 'Direito pós-moderno'],
            [
              ['Unidade', 'Uma só lei para todo o território', 'Pluralidade de fontes e ordenamentos'],
              ['Completude', 'A lei prevê todos os casos', 'Abertura a princípios, costumes, cláusulas gerais'],
              ['Exclusividade', 'Não há direito fora da lei', 'Direito vivido, comunitário, supraestatal convive com o posto'],
              ['Sujeito', 'Indivíduo abstrato e igual', 'Pessoa concreta, inserida em relações'],
              ['Fonte', 'Estado, como vontade única', 'Sociedade intermediária, comunidade, prática'],
            ],
            'Quadro comparativo do fichamento — Código Napoleônico × Direito Pós-Moderno'
          ),
          p(
            'Conclusão da seção — descodificar não é desrespeitar o código; é devolvê-lo ao seu tamanho real: um instrumento entre outros.'
          ),
        ],
      },
      {
        id: 'V',
        title: 'Jacobinismo e Carta de Nice',
        blocks: [
          p(
            'A quinta seção politiza a análise. O jacobinismo jurídico é a vontade de uma só nação, uma só lei, uma só vontade — o Estado como produtor exclusivo. Contra ele, a Carta de Nice aparece como paradoxo: um catálogo de direitos fundamentais proclamado de cima, um "pedaço de papel" sem constituição material que o sustente, eco da subsidiariedade que a própria Europa teimava em esvaziar.'
          ),
          p(
            'A distinção constituição formal/constituição material (Verfassung) organiza a crítica: proclamar sem viver é o vício central da modernidade jurídica. E a oposição indivíduo insular/pessoa relacional mostra o preço humano do mito: direitos para um sujeito que o direito mesmo desconstituiu.'
          ),
          p(
            'Conclusão da seção — a crítica de Grossi à Carta não é eurocética nem formalista: é a recusa de confundir proclamação com constituição.'
          ),
        ],
      },
      {
        id: 'VI',
        title: 'Síntese — cinco insights estratégicos',
        blocks: [
          p('O fichamento fecha com cinco insights transferíveis para qualquer trabalho jurídico:'),
          list([
            'Todo conceito jurídico tem genealogia — perguntar "de onde veio?" antes de "o que é".',
            'A forma vazia é sempre suspeita: procurar a constituição material por trás de toda proclamação formal.',
            'O direito se acha na aplicação, não na norma — observar práticas, não apenas textos.',
            'Pluralismo de fontes não é bagunça: é a condição histórica normal do direito.',
            'Escrever direito com consciência crítica é escolher, a cada parágrafo, entre reproduzir o mito e descrevê-lo.',
          ]),
        ],
      },
    ],
  },
]

// ------------------------------------------------------------------ 03
libraryDocs.push(
  {
    slug: 'feferbaum-queiroz',
    model: 'explainer',
    title: 'Metodologia da Pesquisa em Direito — Feferbaum & Queiroz',
    eyebrow: 'manual de referência · 2ª ed. Saraiva, 2019',
    year: '27 capítulos · 5 partes',
    intro:
      'O manual de referência para monografias, dissertações e teses. Esta página condensa a arquitetura do livro — do tema como fronteira à escrita em camadas — e acompanha um instrumento para testar um tema real contra os critérios dos autores.',
    image: assetPath('/images/bib-metodo.jpg'),
    meta: 'coluna de leitura · instrumento sincronizado',
    sourceNote:
      'Leitura estruturada do acervo pessoal: síntese fiel dos capítulos 1 a 4 e 24, com o sumário completo das cinco partes.',
    sections: [
      {
        id: '1',
        title: 'A monografia não é um manual',
        blocks: [
          p(
            'Feferbaum e Queiroz abrem o livro com uma advertência de método: a monografia não é um resumo de manual, e o tema não é um "assunto" — é uma fronteira. Um assunto é território conhecido (a responsabilidade civil, o direito penal econômico); um tema é a borda onde esse território deixa de responder.'
          ),
          p(
            'Os autores distinguem a pesquisa vertical — aprofundar-se em um recorte estreito — da pesquisa horizontal — percorrer amplamente um campo. A tese exige verticalidade: um corte fundo em vez de uma varredura ampla. O exemplo trabalhado no livro é a responsabilidade civil em decisões do STF: o tema não é "responsabilidade civil" nem "STF", mas a operação concreta de um sobre o outro.'
          ),
          p(
            'E registram a dica que abre o capítulo sobre o tema: escolha um tema com afinidade — a monografia convive com o pesquisador por meses, e afinidade é o que resta quando a novidade passa.'
          ),
        ],
      },
      {
        id: '2',
        title: 'O mestrado profissional',
        blocks: [
          p(
            'Para o mestrado profissional, os autores propõem um percurso em quatro etapas: (1) apreensão e contextualização fática — compreender o fenômeno no mundo; (2) reflexão jurídica — trazer o fenômeno para as categorias do direito; (3) análise crítica — confrontar a resposta do direito com o problema real; (4) recomendações — propor soluções, seja de lege lata seja de lege ferenda.'
          ),
          p(
            'As questões principais do mestrado profissional são práticas: como agir, quais os riscos da atuação, o que funciona e o que não funciona. As questões secundárias dão suporte doutrinário e legislativo: o que diz a legislação, qual o conceito, qual o fundamento. Confundir as duas camadas — responder à secundária como se fosse a principal — é o erro típico que transforma dissertação profissional em revisão de literatura.'
          ),
          p(
            'O rigor acadêmico é definido por atributos enumerados pelos autores: pertinência, precisão conceitual, fundamentação, coerência interna, uso crítico das fontes e clareza. E o texto é avaliado em duas colunas — o desejável e a inadequação correspondente: argumento sustentado × opinião sem fonte; citação verificada × referência de segunda mão; delimitação explícita × promessa de tudo cobrir.'
          ),
        ],
      },
      {
        id: '3',
        title: 'As três modalidades de pesquisa',
        blocks: [
          p(
            'O livro organiza o trabalho em três modalidades. O estudo exploratório percorre o território para mapeá-lo — serve quando o recorte ainda é nebuloso. A pesquisa de resolução de problema segue o percurso clínico: sintomas → reflexão → diagnóstico → prescrição — serve quando há uma prática que falha. O estudo de caso aprofunda um objeto delimitado e admite dez perspectivas de análise: histórica, comparada, funcional, institucional, sociológica, econômica, entre outras.'
          ),
          p(
            'A escolha da modalidade não é retórica: ela decide o desenho inteiro — fontes, método, estrutura do texto. Um problema de prática pede resolução de problema; um fenômeno novo, exploração; um objeto rico e delimitado, estudo de caso.'
          ),
        ],
        instrument: 'theme-tester',
      },
      {
        id: '4',
        title: 'O tema: do assunto à pergunta',
        blocks: [
          p(
            'O capítulo dedicado ao tema é o coração prático do livro. O tema é objeto de dúvida: o caminho é transformar assunto em pergunta. E há uma armadilha nomeada pelos autores: o essencialismo — perguntar "O que são os contratos inteligentes?" convida a respostas enciclopédicas e incomprováveis. A pergunta de pesquisa deve ser específica, delimitada, respondivel.'
          ),
          p(
            'Quatro filtros seleccionam o tema: a dúvida real (o pesquisador precisa querer a resposta), a relevância (teste de Booth e colaboradores: quem se importa com esta resposta, e por quê?), a originalidade (o que se acrescenta ao que já está escrito?) e as limitações (familiaridade com o idioma das fontes, acesso a dados, tempo disponível).'
          ),
          p(
            'Os problemas de pesquisa dividem-se em descritivos — como algo é — e prescritivos — como algo deveria ser. A oposição lege lata (direito que está na lei) e lege ferenda (direito que deveria estar) organiza os prescritivos. Para os de lege lata, os autores recuperam o procedimento de Christian Courtis em cinco etapas: identificar o problema interpretativo; selecionar o conteúdo normativo relevante; mapear as respostas rivais e buscar a questão de fundo — a ponta do iceberg por baixo das posições declaradas; e fixar o critério para eleger a resposta vencedora.'
          ),
        ],
      },
      {
        id: '5',
        title: 'Escrever em camadas',
        blocks: [
          p(
            'O capítulo da escrita inverte a ordem espontânea. Não se escreve da introdução à conclusão: escreve-se em camadas, da espinha dorsal para a pele. O esqueleto de cinco páginas vem primeiro — tese, capítulos, conclusões, em prosa crua. Depois o sumário descritivo, as referências, os casos e exemplos, e só então introdução e conclusões, que são escritas por último e leem-se por primeiro.'
          ),
          p(
            'As duas últimas camadas são de ofício: reler em voz alta — o ouvido pega o que o olho perdoa — e submeter a uma revisão externa, de preferência de quem não conhece o tema e apontará o que não se entende.'
          ),
          p(
            'Instrumento ao lado — teste um tema real contra os quatro filtros do capítulo 4 e veja o veredito que o manual daria a ele.'
          ),
        ],
        instrument: 'theme-tester',
      },
    ],
  } as LibraryDoc,
  // ------------------------------------------------------------------ 04
  {
    slug: 'capes-metodologia',
    model: 'flow',
    title: 'Projeto de Tese e Metodologia sob a Ótica da CAPES',
    eyebrow: 'aula inaugural · PPGD/UFSC · avaliação 2025–2028',
    year: '15 páginas · critérios de qualificação',
    intro:
      'A aula inaugural sobre rigor metodológico na perspectiva da avaliação CAPES: o projeto de tese como mapa intelectual, a metodologia como condição de validade e os critérios que reprovam projetos em qualificação.',
    image: assetPath('/images/bib-capes.jpg'),
    meta: 'ficha CAPES · pesos · percurso quadrienal',
    sourceNote:
      'Material de estudo do acervo pessoal: síntese da aula inaugural do PPGD/UFSC sobre o ciclo de avaliação CAPES 2025–2028.',
    sections: [
      {
        id: 'I',
        title: 'O projeto de tese como mapa intelectual',
        blocks: [
          p(
            'A aula abre com uma definição-operário: o projeto de tese é um mapa intelectual. Nele cabem, no mínimo, quatro coordenadas — o problema, a hipótese, os objetivos e o marco teórico — e a metodologia é o que permite passar de uma coordenada a outra. Um projeto sem metodologia não é um projeto humilde: é um mapa sem escala.'
          ),
        ],
      },
      {
        id: 'II',
        title: 'Metodologia: a condição de validade',
        blocks: [
          p(
            'Metodologia não é um capítulo burocrático: é a condição de validade da tese — o que garante que as conclusões decorrem do caminho percorrido e não de convicção. A aula sistematiza quatro escolhas que precisam estar coerentes entre si:'
          ),
          table(
            ['Escolha', 'Opções'],
            [
              ['Abordagem', 'dedutiva · indutiva · dialética · hipotético-dedutiva'],
              ['Procedimento', 'monográfico · comparativo · histórico · funcionalista'],
              ['Técnicas', 'documental · bibliográfica · jurisprudencial · empírica'],
              ['Postura', 'dogmática · crítica · interdisciplinar'],
            ]
          ),
          p(
            'A regra de coerência: cada escolha precisa ser justificável a partir do problema. Técnica empírica para problema dogmático, ou postura crítica sem marco crítico, são as incoerências mais comuns — e as mais fatais.'
          ),
        ],
      },
      {
        id: 'III',
        title: 'A ficha CAPES — itens e pesos',
        blocks: [
          p(
            'A avaliação dos programas segue uma ficha de itens, cada qual com peso. O quadro abaixo reproduz a estrutura apresentada na aula:'
          ),
          table(
            ['Item', 'Conteúdo avaliado', 'Peso'],
            [
              ['1.1', 'Proposta do programa (projeto político-pedagógico)', 'Alta'],
              ['2.1.1', 'Rigor metodológico do projeto de tese', 'Muito Alta — impacto direto'],
              ['2.2.1', 'Titulação do corpo docente', 'Alta'],
              ['2.3.1', 'Produção intelectual em periódicos Qualis A', 'Muito Alta'],
              ['2.3.2', 'Coautoria docente–discente', 'Alta'],
              ['3.1', 'Inserção internacional', 'Alta'],
              ['3.2', 'Grupos de pesquisa (multiníveis)', 'Média-Alta'],
            ]
          ),
          p(
            'Dois itens concentram a atenção de quem projeta uma tese: o 2.1.1, de rigor metodológico, e o 2.3.1, de produção Qualis A. São eles que a banca de qualificação lê primeiro — e reprova primeiro.'
          ),
        ],
      },
      {
        id: 'IV',
        title: 'As implicações do item 2.1.1',
        blocks: [
          p('A aula dedica um bloco específico ao item 2.1.1 e registra cinco implicações práticas:'),
          list([
            'A inconsistência metodológica é a causa mais frequente de reprovação em exame de qualificação.',
            'O projeto precisa declarar e justificar abordagem, procedimento, técnicas e postura — não apenas citá-los.',
            'A coerência interna entre problema, hipótese e método é verificada item a item pela banca.',
            'O cronograma deve corresponder ao método declarado: pesquisa empírica com cronograma exclusivamente bibliográfico é incoerência visível.',
            'A revisão bibliográfica precisa demonstrar domínio do estado da arte, não apenas presença de citações.',
          ]),
        ],
      },
      {
        id: 'V',
        title: 'Produção Qualis: prioridades e distribuição',
        blocks: [
          p(
            'No item 2.3.1, a aula fixa quatro prioridades: (1) periódicos Qualis A1–A2; (2) coautoria docente–discente; (3) diversificação dos veículos; (4) internacionalização da produção. E apresenta a distribuição da produção brasileira em direito por estrato, com a distribuição ideal ao lado:'
          ),
          table(
            ['Estrato', 'Distribuição observada', 'Distribuição ideal'],
            [
              ['A1', '32,79%', '≈ 40% no conjunto A'],
              ['A2', '26,23%', ''],
              ['A3', '19,67%', '≈ 35% no conjunto B'],
              ['A4', '13,11%', ''],
              ['B1', '6,56%', ''],
              ['B2/C', '1,64%', '≈ 25% capítulos e livros'],
            ]
          ),
          p(
            'A leitura estratégica: o peso do estrato A é esmagador na contagem — mas capítulos e livros somam o quarto ideal da produção, e é ali que a tese em direito costuma encontrar seu formato natural.'
          ),
        ],
      },
      {
        id: 'VI',
        title: 'Grupos de pesquisa multiníveis',
        blocks: [
          p(
            'O item 3.2 valoriza grupos de pesquisa com estrutura multinível — aqueles que articulam linhas de pesquisa, projetos e produção em cadeia, como os grupos de direito antidiscriminatório e áreas afins. Para o doutorando, a lição prática: inserir-se em grupo ativo é ativo metodológico, não apenas currículo — é onde projeto, orientação e produção se encontram.'
          ),
        ],
      },
      {
        id: 'VII',
        title: 'O percurso 2025 → 2028',
        blocks: [
          p(
            'O ciclo quadrienal organiza o tempo do programa — e, por dentro dele, o da tese. No primeiro ano, consolidação do projeto e do exame de qualificação; nos anos centrais, produção e coautoria; no fecho, síntese, defesa e avaliação. O calendário CAPES deve estar espelhado no cronograma pessoal: quem não data a própria tese pelo ciclo descobre, tarde demais, que a janela do estrato já fechou.'
          ),
        ],
      },
      {
        id: 'VIII',
        title: 'Os quatro compromissos finais',
        blocks: [
          p('A aula fecha com quatro compromissos, que valem como rubrica de qualificação:'),
          list([
            'Projeto com coordenadas completas — problema, hipótese, objetivos, marco teórico e método declarado.',
            'Coerência verificável entre todas as escolhas metodológicas.',
            'Produção planejada por estratos, com coautoria docente–discente.',
            'Cronograma datado pelo ciclo de avaliação — a tese dentro do tempo da CAPES, não ao lado dele.',
          ]),
        ],
      },
    ],
  } as LibraryDoc
)

// ------------------------------------------------------------------ 05
libraryDocs.push(
  {
    slug: 'savigny-metodologia',
    model: 'explainer',
    title: 'Metodologia Jurídica — Friedrich Carl von Savigny',
    eyebrow: 'clássico de 1840 · trad. Hebe Caletti Marenco, Edicamp',
    year: '3 partes · 5 períodos da interpretação',
    intro:
      'O clássico que fundou a metodologia do direito moderno: a interpretação como reconstrução do pensamento posto na lei, as técnicas hermenêuticas e a história delas em cinco períodos. A página acompanha um instrumento para classificar fragmentos segundo as quatro técnicas savignyanas.',
    image: assetPath('/images/bib-metodo.jpg'),
    meta: 'coluna de leitura · classificador de técnicas',
    sourceNote:
      'Leitura estruturada do acervo pessoal: síntese fiel da Vorlesung über juristische Methodologie, com o prefácio e as três partes.',
    sections: [
      {
        id: '1',
        title: 'A jurisprudência como filologia',
        blocks: [
          p(
            'Savigny abre com a afirmação que organiza todo o livro: a jurisprudência é uma ciência puramente filológica. O jurista é, por ofício, um intérprete de textos — e a interpretação é a reconstrução do pensamento que a lei expressa. Daí decorre a tese provocativa: a intenção do legislador só importa quando aparece na lei; o que está fora do texto, por mais sincero que seja, não é matéria do juízo.'
          ),
          p(
            'O juiz, nesse desenho, é o intérprete por excelência — e sua operação deve ser puramente lógica, no sentido savignyano de reconstrução disciplinada, não de silogismo vazio. Completam o horizonte a ciência legislativa histórica e a filosófica: sem elas, o jurista tem técnica sem rumo.'
          ),
        ],
      },
      {
        id: '2',
        title: 'A constituição tríplice da interpretação',
        blocks: [
          p(
            'Todo ato de interpretar possui, para Savigny, três elementos inseparáveis — lógico, gramatical e histórico —, e o prefácio firma o rol definitivo de quatro técnicas: gramatical, lógica, sistemática e histórica. A gramatical fixa o sentido das palavras no uso vívido da língua jurídica; a lógica articula o pensamento posto no enunciado; a sistemática situa o preceito na arquitetura do direito; a histórica o reconecta à corrente do desenvolvimento jurídico.'
          ),
          p(
            'Antes de qualquer uma delas, porém, vem a crítica diplomática: estabelecer o texto autêntico, comparando edições e eliminando corrupções. Interpretar sobre texto corrompido é edificar sobre areia — por isso a crítica diplomática precede toda interpretação.'
          ),
        ],
      },
      {
        id: '3',
        title: 'Os dois princípios',
        blocks: [
          p(
            'Dois princípios regem a reconstrução: o da individualidade — cada pensamento é único e pede apreensão concreta, não aplicação mecânica de esquema — e o da universalidade — nenhum pensamento existe isolado; cada um se liga à totalidade da ciência e da vida jurídica. A boa interpretação é sempre das duas coisas: atenta ao caso singular e consciente do sistema.'
          ),
        ],
        instrument: 'savigny-interpreter',
      },
      {
        id: '4',
        title: 'A história da interpretação em cinco períodos',
        blocks: [
          p(
            'Savigny reconstrói a hermenêutica jurídica como história: os glosadores, de Irineu a Accursio, colaram-se à letra; os comentadores, Bartolo e Baldo, articularam o texto à prática; os humanistas franceses, com Cujácio, restauraram o texto romano; a escola holandesa, com Schulting, aprofundou a filologia; e a escola alemã, herdeira de tudo isso, leva a interpretação à sua forma mais consciente. Nessa série, Savigny destaca a interpretação de Gothofred como a única perfeita — o ponto onde técnica e história se encontram sem resíduo.'
          ),
        ],
      },
      {
        id: '5',
        title: 'A elaboração histórica',
        blocks: [
          p(
            'A elaboração histórica distingue vinculação e separação históricas: saber quando o direito romano vive ainda no direito atual e quando é apenas passado. Savigny censura dois erros simétricos: o dos penalistas, que misturam indistintamente romano e alemão — transportando para o presente o que era outro —, e o dos civilistas seguidores de Hufeland, que rompem a continuidade histórica sem necessidade — tratando como morto o que ainda vive.'
          ),
        ],
      },
      {
        id: '6',
        title: 'A elaboração sistemática',
        blocks: [
          p(
            'A elaboração sistemática tem dois alvos de crítica: os que ficam "por baixo", compilando sem conceito — compilações e manuais do tipo de Hofacker —, e os que ficam "por cima", filosofando sem contato com o direito positivo. Entre os dois, o trabalho real do jurista: construir a unidade interna do direito a partir dele mesmo.'
          ),
          p(
            'E aqui está a regra mais citada do livro: a interpretatio extensiva e restritiva é rejeitada — não se deve fazer uso prático da pesquisa da razão da lei. Conhecer a ratio é luz para a compreensão, não autorização para alongar ou encurtar o texto. Daí o regime diverso da analogia: admitida no direito civil, onde os preceitos são regras de conduta amplas, e proibida no direito penal, onde cada extensão agride a liberdade — e, regra geral, a exceção não se estende por analogia.'
          ),
        ],
        instrument: 'savigny-interpreter',
      },
      {
        id: '7',
        title: 'Leitura, biblioteca, estudo',
        blocks: [
          p(
            'O livro termina no ofício do estudar: a leitura crítica formula juízo concomitante — anotar enquanto se lê, não depois; a leitura histórica acompanha séries sincrônicas e cronológicas, vendo cada instituição no seu tempo e no seu fluxo; a biblioteca jurídica é descrita com minúcia, separando civil e penal. E a palavra final é pedagógica: a palestra transmite o método diretamente — daí o próprio formato do livro, nascido de curso — e o plano savignyano vai das fontes e da história ao sistema, com as dissertações de Hugo sobre as Pandectas como modelo de exercício.'
          ),
          p(
            'Instrumento ao lado — classifique fragmentos de argumentação jurídica segundo as quatro técnicas savignyanas e confira o regime do feedback.'
          ),
        ],
        instrument: 'savigny-interpreter',
      },
    ],
  } as LibraryDoc,
  // ------------------------------------------------------------------ 06
  {
    slug: 'metodos-metodologias',
    model: 'explainer',
    title: 'Métodos e Metodologias Aplicados ao Projeto de Tese',
    eyebrow: 'caderno do curso · PPGD/UFSC · 2026.1',
    year: '15 encontros · 2 momentos',
    intro:
      'O caderno do curso de métodos e metodologias: a arquitetura do projeto de pesquisa, as tradições de pesquisa em direito, os métodos e técnicas explicados passo a passo, e os instrumentos de trabalho — matriz de leitura, plano de revisão e cronograma.',
    image: assetPath('/images/bib-metodo.jpg'),
    meta: 'arquitetura da tese · instrumentos de trabalho',
    sourceNote:
      'Material de estudo do acervo pessoal: síntese do caderno do curso (encontros 1–15), com a arquitetura do projeto, as tradições de pesquisa e os instrumentos de trabalho. Exemplos de projeto em andamento foram propositalmente omitidos — aqui entra apenas o método transferível.',
    sections: [
      {
        id: '1',
        title: 'Dois momentos do curso',
        blocks: [
          p(
            'O curso se organiza em dois momentos e quinze encontros, de março a junho. O primeiro momento é a caixa de ferramentas: cada encontro apresenta um instrumento — da arquitetura do projeto ao quadro de categorias. O segundo momento é a clínica de projetos: os instrumentos são aplicados a projetos reais, debatidos coletivamente. A lógica é a do ofício: primeiro as ferramentas, depois a bancada.'
          ),
        ],
      },
      {
        id: '2',
        title: 'A arquitetura do projeto',
        blocks: [
          p(
            'A espinha dorsal do curso — e da tese — é uma cadeia de sete elos, cada qual dependentes do anterior: tema → problema → pergunta → hipótese → objetivos → abordagem e método → justificativa. O teste de coerência percorre a cadeia nos dois sentidos: o problema decorre do tema? a pergunta é respondível? a hipótese é testável? os objetivos alcançam a hipótese? o método alcança os objetivos? a justificativa sustenta a relevância?'
          ),
          p(
            'Um elo fraco contamina os vizinhos: pergunta mal formulada torna a hipótese inatingível; método mal escolhido torna os objetivos retórica. A revisão de projeto é, antes de tudo, a auditoria dessa cadeia.'
          ),
        ],
        instrument: 'coherence-builder',
      },
      {
        id: '3',
        title: 'Tradições de pesquisa em direito',
        blocks: [
          p(
            'O curso mapeia cinco tradições de pesquisa em direito, cada uma com seu tipo de evidência e seus riscos característicos. A pergunta disciplinar não é "qual é a melhor?", e sim "qual responde à minha pergunta?":'
          ),
          table(
            ['Tradição', 'Evidência', 'Riscos', 'Pergunta-guia'],
            [
              ['Dogmática / jurisprudencial', 'Normas e decisões', 'Formalismo, aparente neutralidade', 'O que o direito posto diz?'],
              ['Crítica', 'Texto, contexto, poder', 'Ideologização, distância do caso concreto', 'O que o direito esconde?'],
              ['Empírica', 'Dados, observação, entrevistas', 'Amostragem, generalização indevida', 'O que o direito faz?'],
              ['Comparada', 'Ordenamentos estrangeiros', 'Comparação superficial, descontextualização', 'O que muda de ordenamento?'],
              ['Interdisciplinar', 'Contribuições de outras ciências', 'Diletantismo, perda de rigor jurídico', 'O que as ciências vizinhas revelam?'],
            ]
          ),
        ],
        instrument: 'coherence-builder',
      },
      {
        id: '4',
        title: 'Métodos e técnicas',
        blocks: [
          p(
            'Abaixo dos procedimentos, as técnicas de coleta e análise, com suas condições de validade, vieses e limites — o mapa que evita a citação decorativa de método:'
          ),
          table(
            ['Técnica', 'Validade', 'Vieses / limites'],
            [
              ['Documental', 'Rastreabilidade das fontes', 'Silêncio dos arquivos; seleção anterior'],
              ['Jurisprudencial', 'Corpus definido por critérios explícitos', 'Tribunais como amostra enviesada'],
              ['Comparada', 'Função equivalente real entre ordenamentos', 'Comparar o incomparável; tradução de conceitos'],
              ['Análise de conteúdo', 'Categorias definidas antes da leitura', 'Categorias que impõem o que deveriam encontrar'],
              ['Entrevistas', 'Acesso à experiência dos atores', 'Respostas de desejo; efeito entrevistador'],
              ['Survey', 'Generalização estatística', 'Baixa taxa de resposta; autorrelato'],
              ['Mistas', 'Triangulação de evidências', 'Custo; exigência de competências duplas'],
            ]
          ),
        ],
      },
      {
        id: '5',
        title: 'Instrumentos de trabalho',
        blocks: [
          p('Três ferramentas de bancada acompanham todo o percurso:'),
          list([
            'Matriz de leitura — autor, problema, tese, método, achados, lacunas: a ficha que transforma leitura em acervo.',
            'Plano de revisão — campos para registrar o que será reescrito, por que, e com qual prioridade: a memória da própria reescrita.',
            'Quadro de categorias — as categorias de análise definidas antes da leitura do corpus, com regras de aplicação e exemplos-limite.',
          ]),
        ],
      },
      {
        id: '6',
        title: 'Do sumário ao cronograma',
        blocks: [
          p(
            'O sumário provisório é o projeto visto de cima: capítulos como promessas, cada qual com pergunta e entrega próprias. O cronograma macro distribui o trabalho em quarenta e oito meses — a duração típica do doutorado — em blocos de leitura, qualificação, pesquisa, escrita e revisão, com folga declarada. A regra do curso: cronograma sem folga é propaganda, não planejamento.'
          ),
        ],
      },
      {
        id: '7',
        title: 'Ementa e bibliografia',
        blocks: [
          p(
            'A ementa do curso cumpre o que a página descreveu: fundamentos epistemológicos da pesquisa jurídica, arquitetura do projeto, tradições de pesquisa, métodos e técnicas, instrumentos de trabalho e escrita. A bibliografia básica e complementar orienta a leitura de fundo:'
          ),
          list([
            'Básica — Ahmed (2024); Araújo (2003; 2012); Barros (2008; 2016; 2017); Butler (2022); Eco (2016); Gil (2008); Creswell (2014); Ribeiro & Moreira Jr. (2019); Yin (2015); Oliveira (2015).',
            'Complementar — Bourdieu (2024); Foucault (1996); Grubba (2023); Lima; Machado (2006).',
          ]),
          p(
            'Instrumento ao lado — monte a cadeia tema → justificativa do seu próprio projeto e faça o teste de coerência nos dois sentidos.'
          ),
        ],
        instrument: 'coherence-builder',
      },
    ],
  } as LibraryDoc
)

// ------------------------------------------------------------------ 07
libraryDocs.push(
  {
    slug: 'aulas-metodologia',
    model: 'flow',
    title: 'Aulas de Metodologia — Projeto de Tese',
    eyebrow: 'série de aulas · do projeto de pesquisa à coerência do texto',
    year: 'aulas 1, 4 e 6 · slides',
    intro:
      'A série do curso de metodologia em três movimentos: da ideia à hipótese (tema, delimitação, problematização), o embasamento teórico (tripé, revisão sistemática, termos-chave) e a revisão integrativa (tipos de revisão, PRISMA, inclusão e exclusão).',
    image: assetPath('/images/bib-metodo.jpg'),
    meta: 'tema → hipótese · teoria · revisão',
    sourceNote:
      'Material de estudo do acervo pessoal: síntese das aulas 1, 4 e 6 da série de metodologia do projeto de tese.',
    sections: [
      {
        id: 'I',
        title: 'O mapa da mina',
        blocks: [
          p(
            'A aula 1 abre com um mapa: o projeto de pesquisa como mina, com entrada, galerias e saída. Quem entra sem mapa — tema vago, pergunta improvisada, hipótese decorativa — não sai: o texto desmancha na escrita. As três aulas desta página cobrem o trajeto inteiro: encontrar a hipótese (aula 1), construir o embasamento teórico (aula 4) e revisar o estado da arte (aula 6).'
          ),
        ],
      },
      {
        id: 'II',
        title: 'Aula 1 — Da ideia à hipótese',
        blocks: [
          p(
            'A primeira etapa é o tema, filtrado por três critérios: viabilidade (dá para fazer com o tempo e o acesso que tenho?), relevância (importa para alguém além de mim?) e originalidade (o que eu acrescento?). A aula exemplifica com inteligência artificial e direito: o assunto é imenso; o tema surge quando ele se cruza com um problema jurídico concreto — o uso de sistemas de IA generativa na fundamentação de decisões judiciais e os limites do art. 489, § 1º, do CPC.'
          ),
          p(
            'A segunda etapa delimita o assunto em funil, pelos quatro eixos: temporal (qual período?), espacial (qual tribunal, qual país?), temático (qual recorte?) e metodológico (que fontes?). A terceira etapa é a problematização: a dúvida metódica substitui a curiosidade. A aula contrapõe o mal e o bem formulados: "A IA é boa para o direito?" é uma pergunta retórica, sem resposta encontrável; "Em que medida a fundamentação por IA generativa atende ao dever de exposição das razões de decidir do art. 93, IX, da CF/88?" é dúvida de trabalho.'
          ),
          p(
            'A quarta etapa é a hipótese — provisória, testável, coerente com o problema e relevante. A aula oferece o exemplo afirmativo em paralelo: o uso de IA generativa na fundamentação, na forma atual, compromete a motivação das decisões e atrai nulidade. A hipótese não é certeza: é a aposta que a pesquisa vai examinar.'
          ),
          p('A atividade da aula propõe três casos para treinar o funil:'),
          list([
            'Mata v. Avianca (2023, S.D.N.Y.): petições com citações inventadas pelo ChatGPT — qual o problema jurídico exato, e para quem?',
            'A decisão algorítmica de um tribunal espanhol: onde começa o dever de motivação quando quem decide é um sistema?',
            'O deepfake como causa de dano moral: qual eixo metodológico permite aferir o dano sem cair no essencialismo?',
          ]),
          p('A leitura obrigatória que segue é o capítulo 2 do manual — a construção do problema de pesquisa.')
        ],
      },
      {
        id: 'III',
        title: 'Aula 4 — Embasamento teórico',
        blocks: [
          p(
            'O embasamento teórico é um tripé: teoria de base — o arcabouço que sustenta a hipótese —, revisão sistemática — o mapa do que já foi dito — e termos-chave — o vocabulário que garante que se fala da mesma coisa que a literatura. Sem os três, a tese flutua: argumenta sem chão, cita sem mapa, nomeia sem precisão.'
          ),
          p(
            'A revisão sistemática segue cinco etapas (Creswell; Gil): protocolo e descritores; busca nas bases; triagem dos resultados; análise e fichamento; e síntese transformada em marco teórico. Os termos-chave são fixados em quatro passos: identificação dos candidatos; fundamentação doutrinária — quais conceitos a doutrina usa para o fenômeno; ancoragem normativa — como a lei o nomeia; e consistência interna — o mesmo termo, com o mesmo sentido, do início ao fim do texto.'
          ),
          p(
            'A aula exemplifica com garantismo penal — a teoria de base de Ferrajoli organiza todo o resto — e com a autodeterminação informativa na LGPD, ancorada no paradigma do BVerfGE 65, 1 (censo de 1983): ali está o termo-chave com sua fundamentação doutrinária, sua âncora e sua precisão.'
          ),
        ],
      },
      {
        id: 'IV',
        title: 'Aula 6 — Revisão integrativa',
        blocks: [
          p(
            'A revisão integrativa busca quatro objetivos: mapear o que existe, identificar lacunas, evitar redundância e fundamentar a escolha metodológica. A aula compara os cinco tipos de revisão e situa cada um no trabalho jurídico:'
          ),
          table(
            ['Tipo', 'Objetivo', 'Abrangência', 'Adequação ao direito'],
            [
              ['Sistemática', 'Responder a pergunta precisa', 'Estreita e rigorosa', 'Média — exige dados homogêneos'],
              ['Integrativa', 'Síntese ampla do estado da arte', 'Ampla, pluralismo metodológico', 'Alta — comporta doutrina e decisões'],
              ['Scoping', 'Mapear o campo', 'Ampla, exploratória', 'Alta — territórios novos'],
              ['Narrativa', 'Síntese descritiva', 'Variável, sem protocolo fixo', 'Média — risco de impressionismo'],
              ['Meta-análise', 'Efeito quantitativo combinado', 'Estudos empíricos homogêneos', 'Baixa — rara em direito'],
            ]
          ),
          p(
            'O protocolo segue o PRISMA-ScR em quatro etapas — protocolo, busca, seleção, síntese — sobre bases como Scopus, Web of Science, SciELO, LexML e Vlex, BDTD/CAPES e Google Scholar. A estratégia usa PICO ou PEOS para estruturar a pergunta, booleanos (AND, OR, NOT), truncamento e tesauros, registrada como equação de busca reproduzível.'
          ),
          p(
            'Os critérios de inclusão — revisão por pares, recorte temporal justificado, idiomas declarados, aderência à pergunta, texto completo acessível — e de exclusão — editoriais, textos sem revisão por pares, duplicatas, sem relação com a pergunta, sem método identificável — são fixados antes da leitura, e o fluxo é registrado no fluxograma PRISMA em quatro fases. A análise temática fecha o circuito em três etapas: codificação, agrupamento em temas e síntese interpretativa.'
          ),
        ],
      },
      {
        id: 'V',
        title: 'Como usar estas três aulas',
        blocks: [
          p(
            'A sequência é um funil de mão dupla: a aula 1 gera a hipótese; a aula 4 constrói o chão teórico que a sustenta; a aula 6 verifica que a hipótese ainda é necessária — que a lacuna que ela promete preencher continua aberta após a revisão. Se a revisão fechou a lacuna, a hipótese muda: melhor descobrir isso na aula 6 do que na banca de qualificação.'
          ),
        ],
      },
    ],
  } as LibraryDoc,
  // ------------------------------------------------------------------ 08
  {
    slug: 'malleus-maleficarum',
    model: 'flow',
    title: 'Estudo de Caso — Malleus Maleficarum',
    eyebrow: 'estudo de caso historiográfico · DIR410346 · PPGD/UFSC',
    year: 'séc. XII–XV · 14 lâminas',
    intro:
      'Apresentação completa de um estudo de caso historiográfico: o contexto medieval da perseguição, a obra de 1486, sua recepção pela Inquisição e pelos tribunais seculares, e o diálogo com a historiografia processual italiana.',
    image: assetPath('/images/bib-malleus.jpg'),
    meta: 'fonte primária · historiografia · debate',
    sourceNote:
      'Material de estudo do acervo pessoal: síntese da apresentação do estudo de caso nº 5, com a cronologia, a análise da Pars III e a bibliografia.',
    sections: [
      {
        id: 'I',
        title: 'Contexto: da accusatio à inquisitio',
        blocks: [
          p('A cronologia que sustenta o caso:'),
          list([
            'Sécs. XI–XII — a transição da accusatio (particular) para a inquisitio (ofício): o processo passa a ser conduzido pela autoridade.',
            '1199 — a decretalis de Inocêncio III consagra a confissão como regina probationum, a rainha das provas.',
            '1252 — a bula Ad extirpanda autoriza a tortura judicial no processo inquisitorial.',
            'Sécs. XIII–XIV — as cidades italianas operam sistemas híbridos, negociados entre justiça hegemônica e justiça de barganha.',
            '1484 — a bula Summis desiderantes, de Inocêncio VIII, abre o ciclo da caça formal às bruxas.',
            '1486/87 — o Malleus Maleficarum é impresso em Speyer, manualizando a perseguição.',
          ]),
        ],
      },
      {
        id: 'II',
        title: 'A obra e a autoria',
        blocks: [
          p(
            'O Malleus Maleficarum ("Martelo das Feiticeiras") é atribuído a Heinrich Kramer (Institoris), dominicano e inquisidor, como autor principal; a coautoria de Jacob Sprenger é controversa — a historiografia o considera, na melhor hipótese, emprestado. O fracasso de Kramer em Innsbruck, em 1485 — onde o bispo recusou seus procedimentos e o descreveu como senil e louco — precede o livro: o Malleus é, em parte, a vingatura teórica de um inquisidor repudiado. A Inquisição oficial rejeitou seus procedimentos e chegou a censurá-lo; foram os tribunais seculares que o adotaram como manual.'
          ),
          p(
            'Os números da recepção: vinte e oito edições até 1600; cerca de 110 mil julgamentos no período, com estimativas de 40 a 60 mil execuções — e 85% das vítimas mulheres. O sucesso editorial do livro e o desastre humano que ele organizou são o mesmo fenômeno visto de lados opostos.'
          ),
        ],
      },
      {
        id: 'III',
        title: 'Estrutura tripartite',
        blocks: [
          p(
            'A obra divide-se em três partes: a Pars I é demonologia — a teoria do pacto, da metamorfose e do sabá; a Pars II trata dos malefícios — os danos atribuídos às bruxas e suas causas; a Pars III é processo — a parte que interessa ao direito: como se instrói, prova e pune a bruxaria.'
          ),
        ],
      },
      {
        id: 'IV',
        title: 'Pars III — o processo',
        blocks: [
          p(
            'A terceira parte é a engrenagem: tortura admitida como meio de prova, acompanhada de engano — falsas promessas de clemência para arrancar confissões; a continuação da tortura formalmente distinta de sua repetição, o que permitia prolongá-la indefinidamente; a heresia como crime para o qual a pena de morte era o "único remédio"; e a flexibilização probatória por excelência — a mulher que não chorava durante o interrogatório era, por isso mesmo, declarada bruxa.'
          ),
          quote(
            'A rigidez probatória cede onde a pressão de condenar vence: o processo inquisitorial não relaxa as regras — ele as converte em instrumento.',
            'síntese da Pars III, q. XIV'
          ),
          p(
            'A leitura jurídica do caso está nessa conversão: cada garantia formal preservada em aparência é esvaziada em operação. É um manual de como a forma pode sobreviver à justiça.'
          ),
        ],
      },
      {
        id: 'V',
        title: 'Meccarelli: tortura e prova plena',
        blocks: [
          p(
            'Massimo Meccarelli situa a tortura dentro da lógica da prova plena romano-canônica: não é exceção ao sistema, é sua engrenagem interna — o meio de converter suspeita em confissão, coroando a rainha das provas. Daí os conceitos operatórios: o arbitrium procedendi, a discricionariedade do juiz fundamentada na conscientia publica iurium; a fronteira entre ordinarium e extraordinarium; e a poena extraordinaria, a pena extraordinária que escapa à tarifação comum.'
          ),
          table(
            ['Categoria', 'Conteúdo'],
            [
              ['Transactio in criminalibus', 'A transação penal: a composição substitui a punição plena.'],
              ['Pax', 'A paz processual: o litígio encerrado por acordo entre as partes.'],
              ['Absolutio condizionata', 'A absolvição condicional: liberdade sob condições declaradas.'],
              ['Modulabilità dell’iter', 'A modularidade do iter: o percurso processual ajustado ao caso.'],
              ['Poena extraordinaria', 'A pena extraordinária: fora da tarifa comum, fixada discricionariamente.'],
            ],
            'As cinco categorias da justiça negociada (Meccarelli)'
          ),
        ],
      },
      {
        id: 'VI',
        title: 'A historiografia processual',
        blocks: [
          p(
            'Mario Sbriccoli contrapõe justiça hegemônica e justiça negociada: a primeira impõe a norma como vontade única; a segunda administra conflitos por barganha. Andrea Zorzi e Giuseppe Alessi refinam o quadro — retribuição versus reconciliação como finalidades alternativas do processo — e John Martyn acompanha a passagem do arbitrium à legality: a discricionariedade do juiz medieval não era arbítrio, mas discricionariedade estruturada, cerceada por práticas, prazos e expectativas do ofício.'
          ),
        ],
      },
      {
        id: 'VII',
        title: 'O Nome da Rosa e a síntese',
        blocks: [
          p(
            'O romance de Umberto Eco (1986) dá ao caso sua formulação literária: Bernardo Gui é o arbitrium sem freios — a discricionariedade que perdeu a estrutura que a sustentava e virou vontade pura. A síntese do estudo: o Malleus Maleficarum é o ponto onde a prova plena, a tortura e o arbitrium se encontram com a imprensa — e o resultado é a industrialização da perseguição.'
          ),
        ],
      },
      {
        id: 'VIII',
        title: 'Questões para debate',
        blocks: [
          p('O estudo de caso fecha com duas questões:'),
          list([
            'O Malleus é causa da perseguição ou seu sintoma? Isto é: um manual manualiza o que já existia, ou inaugura o que só depois existiria?',
            'A distinção entre arbitrium estruturado (Martyn) e arbitrium sem freios (Eco) sobrevive à leitura da Pars III? Onde, exatamente, a estrutura cede?',
          ]),
        ],
      },
    ],
  } as LibraryDoc
)

// ------------------------------------------------------------------ 09
libraryDocs.push({
  slug: 'dicionario-analogico',
  model: 'flow',
  title: 'Dicionário Analógico da Língua Portuguesa — F. F. S. Azevedo',
  eyebrow: 'dicionário de ideias afins · edição de bolso de 45 MB',
  year: 'consulta permanente · estante do Herbário',
  intro:
    'O dicionário de ideias afins de Fernando de Fonseca e Sousa Azevedo: palavras agrupadas por conceito, com remissivas etimológicas — a estante de consulta do Herbário e o instrumento de precisão lexical da escrita jurídica.',
  image: assetPath('/images/bib-dicionario.jpg'),
  meta: 'ideias afins · remissivas etimológicas',
  sourceNote:
    'Obra de referência do acervo pessoal. O índice interativo abaixo é construído sobre as famílias do próprio Herbário do site — o dicionário em si permanece na estante física.',
  sections: [
    {
      id: 'I',
      title: 'A obra',
      blocks: [
        p(
          'O Dicionário Analógico da Língua Portuguesa organiza o vocabulário por ideias afins: em vez de listar palavras em ordem alfabética pura, agrupa-as por campos de sentido, de modo que quem busca um termo encontra também os seus vizinhos — sinônimos, termos correlatos, nuances. As remissivas etimológicas ligam cada família às suas raízes, devolvendo à palavra sua genealogia.'
        ),
        p(
          'Para a escrita jurídica, é um instrumento de precisão: a escolha entre dois sinônimos quase iguais é, muitas vezes, a escolha entre duas teses. O dicionário é a edição de bolso — quarenta e cinco megabytes que cabem no bolso do casaco e abrem qualquer discussão de redação.'
        ),
      ],
    },
    {
      id: 'II',
      title: 'Ideias afins — como usar',
      blocks: [
        p(
          'O método de consulta é o do Herbário: comece pela família — o campo de sentido — e desça até o espécime exato. Antes de fixar um termo no texto, pergunte: qual família ele pertence? Há um espécime mais preciso? Um mais simples? A consulta de trinta segundos evita a imprecisão que a revisão de viva voz teria de apanhar depois.'
        ),
        p(
          'Na escrita da tese, o dicionário cumpre a mesma função dos termos-chave da aula 4 de metodologia: garantir que o texto inteiro fala a mesma língua — o mesmo conceito, com o mesmo nome, do início ao fim.'
        ),
      ],
    },
    {
      id: 'III',
      title: 'O dicionário e o Herbário',
      blocks: [
        p(
          'O Herbário deste site é, deliberadamente, o espelho do dicionário: famílias etimológicas com espécimes prensados e notas de campo. O índice interativo abaixo percorre essas famílias — oito raízes, cinquenta e cinco espécimes — como a mostra de trabalho que a estante física não pode abrir sozinha. Para a consulta plena, com todas as ideias afins de cada entrada, o livro continua sendo o instrumento definitivo.'
        ),
      ],
      instrument: 'herbarium-explorer',
    },
  ],
})

export function getLibraryDocBySlug(slug: string): LibraryDoc | null {
  return libraryDocs.find((doc) => doc.slug === slug) ?? null
}
