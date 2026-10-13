import { assetPath, getExhibitionPath } from './lib/paths';

export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  href: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  titleLines: string[]
  italicLines: number[]
  subtitle: string
  kicker: string
  lede: string
  cue: string
  stats: string
}

export interface ManifestoConfig {
  headingText: string
  bodyText: string
  imagePath: string
}

export interface ExhibitionArticleSection {
  heading: string
  body: string
  items?: string[]
  links?: { label: string; href: string }[]
}

export interface ExhibitionItem {
  slug: string
  title: string
  image: string
  year: string
  eyebrow: string
  intro: string
  sections: ExhibitionArticleSection[]
}

export interface ExhibitionsConfig {
  sectionLabel: string
  countLabel: string
  detailBackText: string
  items: ExhibitionItem[]
}

export interface PavilionPlateItem {
  image: string
  caption: string
}

export interface PavilionsConfig {
  sectionLabel: string
  plates: PavilionPlateItem[]
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterConfig {
  visitLabel: string
  visitLines: string[]
  connectLabel: string
  connectLinks: FooterLink[]
  brandName: string
  rightsText: string
  coordinatesText: string
}

export interface DailyQuote {
  text: string
  author: string
}

export interface DailyWord {
  word: string
  origin: string
  meaning: string
}

export interface DailyConfig {
  sectionLabel: string
  quoteLabel: string
  wordLabel: string
  quotes: DailyQuote[]
  words: DailyWord[]
}

export interface LibraryItem {
  slug: string
  model: 'flow' | 'explainer'
  title: string
  category: string
  format: string
  description: string
}

export interface LibraryConfig {
  sectionLabel: string
  intro: string
  linkLabel: string
  items: LibraryItem[]
}

export interface CompanionGame {
  name: string
  platform: string
  image: string
  description: string
  note: string
  url: string
}

export interface CompanionsConfig {
  sectionLabel: string
  heading: string
  intro: string
  visitLabel: string
  games: CompanionGame[]
  timekeeperHeading: string
  timekeeperParagraphs: string[]
  timekeeperAppName: string
  timekeeperAppNote: string
  timekeeperAppUrl: string
}

export interface HerbariumSpecimen {
  word: string
  gloss: string
}

export interface HerbariumFamily {
  id: string
  root: string
  rootLang: string
  rootMeaning: string
  note: string
  specimens: HerbariumSpecimen[]
}

export interface HerbariumConfig {
  sectionLabel: string
  heading: string
  intro: string
  families: HerbariumFamily[]
}

export const siteConfig: SiteConfig = {
  language: "pt-BR",
  siteTitle: "Estudar — Método · Ana Vanzin",
  siteDescription:
    "Um acervo técnico de metodologia de estudo: ciência cognitiva, gramática e etimologia. Sem coach, sem fórmula mágica.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "MÉTODO.",
  links: [
    { label: "Hoje", href: "#hoje" },
    { label: "Acervo", href: "#exhibitions" },
    { label: "Biblioteca", href: "#biblioteca" },
    { label: "Companhia", href: "#companhia" },
    { label: "Herbário", href: "#herbario" },
    { label: "Sala de leitura", href: "#pavilions" },
    { label: "Sobre", href: "#contact" },
  ],
}

export const heroConfig: HeroConfig = {
  titleLines: ["Estudar", "é técnica,", "não é dom."],
  italicLines: [1],
  subtitle: "e as coisas que a técnica abre",
  kicker: "Um manual de metodologia de estudo · medido uma vez, praticado todo dia",
  lede:
    "Nada nesta página foi terceirizado à motivação. Cada verbete é um procedimento, cada citação um instrumento — memória, gramática e etimologia tratadas como ofício.",
  cue: "Role para começar",
  stats: "13 verbetes · 2 livros citados · 8 famílias de palavras",
}

export const manifestoConfig: ManifestoConfig = {
  headingText: "Nada aqui é motivação. É método.",
  bodyText:
    "Este site existe porque aprender é um ofício, não um estado de espírito. Cada verbete do acervo parte da ciência cognitiva — memória, atenção, recuperação — e não de promessas de produtividade. A gramática é tratada como instrumento de precisão, e a etimologia como o mapa que revela de onde as palavras vieram e por que significam o que significam. Não há coach, não há gatilhos mentais, não há milagre de sete dias. Há técnica, prática deliberada e o prazer silencioso de entender como as coisas funcionam.",
  imagePath: assetPath('/images/bib-capes.jpg'),
}

export const exhibitionsConfig: ExhibitionsConfig = {
  sectionLabel: "02 · Acervo — Técnicas, Gramática & Etimologia",
  countLabel: "13 verbetes · leitura de 4 a 6 min",
  detailBackText: "← Voltar ao acervo",
  items: [
    {
      slug: "repeticao-espacada",
      title: "Repetição Espaçada",
      image: assetPath('/images/repeticao-espacada.jpg'),
      year: "Técnica",
      eyebrow: "Técnica de estudo · Memória",
      intro:
        "A memória não se fortalece pela quantidade de revisões, mas pelo espaçamento entre elas. Revisar no momento certo — quando o conteúdo começa a escapar — é o que fixa o conhecimento por anos, e não por dias.",
      sections: [
        {
          heading: "A curva do esquecimento",
          body:
            "No fim do século XIX, o psicólogo Hermann Ebbinghaus mediu em si mesmo quanto tempo levava para esquecer listas de sílabas sem sentido. O resultado virou a chamada curva do esquecimento: nas primeiras horas, perdemos a maior parte do que aprendemos; depois, a perda desacelera. A conclusão prática é direta — uma única sessão de estudo, por mais intensa que seja, evapora em poucos dias se não houver revisão.",
        },
        {
          heading: "Revisar na hora de quase esquecer",
          body:
            "A repetição espaçada inverte a lógica da revisão imediata. Em vez de reler o conteúdo no dia seguinte várias vezes seguidas, você o revisita em intervalos crescentes: 1 dia, 3 dias, 7 dias, 14 dias, 30 dias. Cada revisão acontece quando a lembrança já está um pouco enfraquecida — e é exatamente esse esforço de resgate que reconsolida a memória e a torna mais duradoura.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "O caminho mais simples é um baralho de flashcards com sistema de caixas (o método Leitner) ou um aplicativo de repetição espaçada, como o Anki, que calcula os intervalos automaticamente. Para quem prefere papel, basta marcar no calendário as datas de revisão de cada matéria no momento do estudo. O essencial não é a ferramenta: é nunca revisar tudo de uma vez e nunca abandonar um conteúdo depois da primeira leitura.",
        },
        {
          heading: "Por que funciona",
          body:
            "A pesquisa em ciência cognitiva chama isso de dificuldade desejável: quanto maior o esforço para recuperar uma informação — dentro do limite em que ela ainda pode ser recuperada —, mais forte fica o traço de memória. Revisar fácil demais é inútil; revisar difícil demais é impossível. A repetição espaçada calibra esse ponto com precisão, transformando o esquecimento de inimigo em instrumento.",
        },
      ],
    },
    {
      slug: "recordacao-ativa",
      title: "Recordação Ativa",
      image: assetPath('/images/recordacao-ativa.jpg'),
      year: "Técnica",
      eyebrow: "Técnica de estudo · Recuperação",
      intro:
        "Reler e grifar dão a sensação de progresso, mas quase não constroem memória. O que constrói é o oposto: fechar o livro e tentar lembrar. A recordação ativa é a técnica com melhor evidência científica acumulada — e a menos praticada.",
      sections: [
        {
          heading: "Testar-se é estudar",
          body:
            "Em 2008, os pesquisadores Jeffrey Karpicke e Henry Roediger publicaram um experimento que virou referência: estudantes que apenas releram um texto foram superados, uma semana depois, por estudantes que o leram uma vez e depois se testaram. A diferença não foi pequena — a prática de recuperação produziu retenção muito superior. Testar não é medir o aprendizado; testar é o próprio aprendizado.",
        },
        {
          heading: "A ilusão de competência",
          body:
            "A releitura cria fluência: o texto vai ficando familiar, e o cérebro confunde familiaridade com domínio. É por isso que tantos estudantes 'sabem' a matéria em casa e travam na prova — na prova não existe o texto diante dos olhos. A recordação ativa elimina a ilusão porque simula a situação real: a informação precisa sair de dentro da memória, sem apoio externo.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Depois de estudar um capítulo, feche-o e escreva tudo o que lembrar em uma folha em branco — só então confira o que ficou de fora. Transforme títulos de seções em perguntas e responda sem consultar o material. Use flashcards, simulados e questões de provas anteriores. A regra de ouro: a maior parte do seu tempo de estudo deve ser gasta tentando lembrar, não tentando absorver.",
        },
        {
          heading: "Errar durante a prática é parte do método",
          body:
            "Esquecer uma resposta no meio do auto-teste não é falha — é o mecanismo. O esforço de buscar a informação, mesmo sem sucesso, prepara a memória para fixá-la quando a resposta é revelada. Por isso a recordação ativa parece mais cansativa do que reler: ela é. E é justamente esse custo que produz resultado duradouro.",
        },
      ],
    },
    {
      slug: "metodo-feynman",
      title: "Método Feynman",
      image: assetPath('/images/metodo-feynman.jpg'),
      year: "Técnica",
      eyebrow: "Técnica de estudo · Compreensão",
      intro:
        "Você só entendeu de verdade o que consegue explicar com palavras simples. O método atribuído ao físico Richard Feynman transforma essa ideia em um procedimento de quatro passos que expõe — e corrige — lacunas de compreensão.",
      sections: [
        {
          heading: "Os quatro passos",
          body:
            "Primeiro: escolha um conceito e escreva seu nome no topo de uma folha. Segundo: explique-o por escrito como se ensinasse uma criança de doze anos — frases curtas, exemplos concretos, nada de jargão. Terceiro: identifique os pontos em que a explicação travou ou ficou vaga e volte ao material original até entendê-los. Quarto: revise a explicação, simplifique ainda mais e crie analogias.",
        },
        {
          heading: "Por que a simplicidade é o teste",
          body:
            "O jargão técnico permite esconder a não-compreensão atrás de palavras difíceis — é possível repetir uma definição decorada sem entendê-la. Quando a exigência é a linguagem simples, esse disfarce desaparece: ou você sabe o que cada parte significa e como se conecta às outras, ou a explicação desmorona. Feynman, prêmio Nobel de Física, era famoso justamente por desconfiar de quem não conseguia explicar sem decoração.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Reserve os últimos dez minutos de cada sessão de estudo para uma 'aula de papel': pegue o conceito principal do dia e explique-o por escrito sem consultar anotações. Depois, compare com o material e marque em vermelho tudo o que ficou impreciso. Esses pontos marcados são o seu próximo plano de estudo — gerado por você, com precisão cirúrgica.",
        },
        {
          heading: "Escrever para entender, à mão ou na tela",
          body:
            "Reserve um momento para explicar o conceito à mão, num caderno ou bloco de papel, quando isso funcionar para você. Desenhe as relações, registre suas dúvidas e confira a explicação com a fonte. Depois, você pode guardar uma síntese no Bloco de Notas, no Notion, no Obsidian ou no Craft. Experimente os suportes e observe qual ajuda a compreender e a revisar com mais constância. O verbete de anotações traz um roteiro comum para papel e digital.",
          links: [{ label: "Ver o método de anotações no papel e no digital", href: getExhibitionPath('fichamento-e-cornell') }],
        },
      ],
    },
    {
      slug: "pratica-intercalada",
      title: "Prática Intercalada",
      image: assetPath('/images/pratica-intercalada.jpg'),
      year: "Técnica",
      eyebrow: "Técnica de estudo · Variação",
      intro:
        "Estudar um único tipo de problema até dominar — e só então passar ao próximo — parece organizado, mas produz aprendizado frágil. Misturar tipos diferentes de questões na mesma sessão rende mais, embora pareça mais difícil. É a prática intercalada.",
      sections: [
        {
          heading: "Bloqueado versus intercalado",
          body:
            "Na prática em blocos, você resolve vinte exercícios do mesmo tipo seguidos; na intercalada, mistura tipos diferentes embaralhados. Os estudos de laboratório são consistentes: durante a sessão, quem pratica em blocos se sai melhor; no teste dias depois, quem intercalou vence com folga. O desempenho imediato engana — é a retenção tardia que importa.",
        },
        {
          heading: "Por que misturar funciona",
          body:
            "Quando os exercícios são todos iguais, o cérebro resolve cada um no piloto automático, repetindo o mesmo procedimento. Quando estão misturados, cada questão exige duas decisões: primeiro identificar de que tipo ela é, depois escolher a estratégia adequada. É exatamente isso que uma prova cobra — nenhuma questão de exame vem com o rótulo do capítulo anunciando a solução.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Em matemática, física e outras matérias de exercício, monte listas que misturem assuntos do capítulo atual com os anteriores. Em línguas, alterne na mesma sessão leitura, vocabulário e gramática, em vez de semanas inteiras de um só foco. E aceite o desconforto: a sensação de estar 'indo pior' durante a sessão intercalada é o sinal de que o método está trabalhando.",
        },
      ],
    },
    {
      slug: "persistencia",
      title: "Persistência",
      image: assetPath('/images/persistencia.jpg'),
      year: "Técnica",
      eyebrow: "Técnica de estudo · Constância",
      intro:
        "Persistir não é repetir com força bruta — é continuar com método quando a motivação, que é volátil, já foi embora. A pesquisa sobre hábito e autorregulação mostra que a constância é uma habilidade treinável, não um traço de personalidade.",
      sections: [
        {
          heading: "Motivação não é estratégia",
          body:
            "A motivação funciona como o clima: varia por razões que você não controla. Quem depende dela estuda em rajadas — três dias intensos seguidos de duas semanas de abandono. O estudante constante opera com outro mecanismo: o hábito. Quando a sessão de estudo vira comportamento automático, disparado por um horário e um lugar fixos, ela deixa de depender de vontade — e a vontade, sabemos há décadas de psicologia experimental, é um recurso que se esgota ao longo do dia.",
        },
        {
          heading: "O pedreiro de Jacob Riis",
          body:
            "O jornalista Jacob Riis escreveu uma imagem que virou clássica: quando nada parece funcionar, ele pensava no pedreiro que golpeia a rocha cem vezes sem que uma rachadura apareça. Na centésima primeira pancada, a pedra se parte em duas — e não foi aquele golpe que a partiu, mas todos os anteriores. A aprendizagem se comporta exatamente assim: os ganhos são invisíveis por semanas e depois aparecem de uma vez, porque a consolidação da memória é silenciosa e cumulativa.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Escolha um horário fixo e um gatilho concreto ('depois do café, abro o caderno na página X') — a pesquisa de implementação de intenções mostra que planos nesse formato 'quando-então' quase triplicam a chance de execução. Use a regra de nunca falhar dois dias seguidos: um dia perdido é acidente; dois são o início de um novo hábito. E meça o processo (sessões cumpridas), não o resultado — o resultado é consequência tardia do processo.",
        },
        {
          heading: "O platô não é o fim",
          body:
            "Todo aprendizado passa por platôs — fases em que o esforço continua e o progresso aparente some. A curva real de aprendizagem é uma escada, não uma rampa: períodos planos seguidos de saltos. Desistir no platô é abandonar a rocha na nonagésima pancada. A função da persistência técnica é justamente atravessar o trecho plano com a rotina intacta, até o próximo salto.",
        },
      ],
    },
    {
      slug: "excelencia",
      title: "Excelência",
      image: assetPath('/images/excelencia.jpg'),
      year: "Técnica",
      eyebrow: "Técnica de estudo · Prática deliberada",
      intro:
        "Dez mil horas de repetição distraída produzem um amador experiente. A pesquisa de Anders Ericsson sobre violinistas, enxadristas e atletas de elite identificou o que realmente diferencia os melhores: a prática deliberada — um tipo muito específico de esforço.",
      sections: [
        {
          heading: "O que a prática deliberada não é",
          body:
            "Não é repetir o que você já sabe fazer. Ericsson estudou o Conservatório de Berlim e descobriu que os violinistas destinados ao topo acumulavam muito mais horas de prática solitária focada do que os medianos — mas a quantidade só importava porque vinha acompanhada de uma qualidade específica: sessões desconfortáveis, mirando exatamente os pontos fracos, com feedback imediato. Repetir o confortável é o oposto da prática deliberada; é apenas passar o tempo com o instrumento na mão.",
        },
        {
          heading: "As três condições da excelência",
          body:
            "Primeira: alvo específico e mensurável — não 'estudar matemática', mas 'resolver cinco questões de probabilidade condicional sem consultar o resumo'. Segunda: operar no limite da capacidade, naquela zona em que você erra com frequência — o erro é o sinal de que o treino está no lugar certo. Terceira: feedback rápido e honesto, que pode ser um gabarito, um professor, um simulado cronometrado ou a tentativa de explicar o tema em voz alta.",
        },
        {
          heading: "Talento pesa menos do que parece",
          body:
            "A pesquisa sobre expertise encontrou um padrão incômodo para o senso comum: medidas de talento bruto preveem muito mal quem chegará ao topo em domínios complexos. O que predomina é a quantidade acumulada de prática deliberada — treino estruturado, com alvo, limite e feedback. Isso não nega diferenças individuais; apenas mostra que, no estudo, o método de prática é a variável que você controla — e é a que mais pesa.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Pegue a matéria em que você quer excelência e faça um diagnóstico brutal: liste os três pontos em que você mais erra. Sua próxima semana de estudo deve ser construída inteiramente sobre eles — questões, explicações em voz alta, simulados cronometrados só daquele tema. Registre os erros em um caderno de falhas e revise-o semanalmente. A excelência, na prática, é a disciplina de atacar sistematicamente o que você faz de pior, em vez de polir o que já faz bem.",
        },
      ],
    },
    {
      slug: "pomodoro",
      title: "Pomodoro",
      image: assetPath('/images/pomodoro.jpg'),
      year: "Ferramenta",
      eyebrow: "Ferramenta · Gestão de atenção",
      intro:
        "Um timer de cozinha em forma de tomate, vinte e cinco minutos de foco total, cinco de pausa. Criada por Francesco Cirillo no fim dos anos 1980, a técnica Pomodoro é a ferramenta mais simples — e mais subestimada — para vencer a procrastinação e proteger a atenção.",
      sections: [
        {
          heading: "O protocolo",
          body:
            "Escolha uma única tarefa. Programe o timer para 25 minutos e trabalhe nela sem qualquer interrupção — se um pensamento alheio aparecer ('preciso responder aquela mensagem'), anote-o em uma folha ao lado e volte ao trabalho. Quando o timer tocar, faça uma pausa real de 5 minutos, longe da tela. A cada quatro ciclos, uma pausa longa de 20 a 30 minutos. É só isso — e é exatamente por ser só isso que funciona.",
        },
        {
          heading: "Por que a pausa é parte da técnica",
          body:
            "A atenção sustentada degrada com o tempo — a pesquisa sobre vigilância mostra queda mensurável de desempenho após períodos prolongados de foco contínuo. As pausas curtas e regulares restauram o recurso antes do colapso, mantendo a qualidade do foco alta ao longo de horas. Pular a pausa 'porque está fluindo' é o erro clássico: o custo aparece duas horas depois, na forma de fadiga e releituras improdutivas.",
        },
        {
          heading: "A interrupção anotada",
          body:
            "O detalhe mais engenhoso da técnica é a folha de interrupções. A procrastinação raramente é preguiça — é fuga de uma tarefa que parece grande demais ou difusa demais. O pomodoro reduz o compromisso a 25 minutos ('qualquer coisa por 25 minutos') e oferece uma válvula de escape legítima: anotar a urgência imaginária em vez de executá-la. A maioria das 'urgências' anotadas se revela dispensável no fim do ciclo.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Comece o dia de estudo estimando a matéria em pomodoros ('revista de gramática: 2 pomodoros') — isso converte uma obrigação vaga em unidades concretas e acabáveis. Registre quantos ciclos completos você fez por dia; o número em si já é um medidor honesto de trabalho profundo. E combine as ferramentas: pomodoro para garantir o tempo, recordação ativa para o que fazer dentro dele, repetição espaçada para quando revisitá-lo.",
        },
      ],
    },
    {
      "slug": "fichamento-e-cornell",
      "title": "Notas & Fichamento",
      "image": assetPath('/images/fichamento.jpg'),
      "year": "Ferramenta",
      "eyebrow": "Ferramenta · Anotações no papel e no digital",
      "intro": "Anote para pensar e voltar ao que aprendeu. Escrever à mão merece espaço no estudo; caderno e ferramentas digitais podem trabalhar juntos. Um roteiro de registro, perguntas e revisão cabe no bloco de papel, no Bloco de Notas, no Notion, no Obsidian ou no Craft.",
      "sections": [
        {
          "heading": "Um método, no papel e na tela",
          "body": "Uma anotação útil ajuda você a compreender durante o estudo e a recuperar depois. Experimente um roteiro simples: registre as ideias essenciais com suas palavras, transforme os pontos principais em perguntas, responda sem consultar e volte a essas perguntas em outros dias. Use o mesmo roteiro no caderno, num bloco de papel ou em um aplicativo. A escolha do suporte pode variar com a matéria, a tarefa, o conforto e a acessibilidade."
        },
        {
          "heading": "Escrever à mão merece espaço",
          "body": "Reserve momentos para anotar à mão: explicar um conceito, desenhar relações, resolver uma questão ou escrever o que você lembra depois de fechar o livro. Caderno, bloco de papel e caneta digital são possibilidades. Estudos com universitários sugerem uma pequena vantagem média das notas manuscritas no desempenho, mas os resultados variam; uma replicação não encontrou vantagem robusta na aprendizagem imediata. Vale experimentar a escrita manual e observar o que você consegue explicar e recuperar depois.",
          "links": [
            {
              "label": "Flanigan et al. (2024) · meta-análise",
              "href": "https://link.springer.com/article/10.1007/s10648-024-09914-w"
            },
            {
              "label": "Urry et al. (2021) · replicação",
              "href": "https://journals.sagepub.com/doi/10.1177/0956797620965541"
            }
          ]
        },
        {
          "heading": "O layout Cornell",
          "body": "Divida a folha em três zonas: uma coluna estreita à esquerda para perguntas e pistas, uma área principal à direita para as notas e uma faixa na base para o resumo. Durante a aula ou leitura, registre ideias essenciais e exemplos à direita. Depois, formule perguntas à esquerda e faça uma síntese curta ao final. No digital, você pode usar uma tabela ou apenas três títulos: Notas, Perguntas e Resumo.",
          "links": [
            {
              "label": "Cornell · orientação e modelo oficiais",
              "href": "https://lsc.cornell.edu/notes.html"
            }
          ]
        },
        {
          "heading": "Um modelo mínimo para cada nota",
          "body": "O formato pode ser simples. Estes campos cabem em uma página de caderno ou em qualquer editor; escolha os que fazem sentido para aquela leitura:",
          "items": [
            "Tema e data — o que estou estudando e quando.",
            "Fonte — autor, título, página ou link; diferencie citações literais das suas próprias palavras.",
            "Ideias centrais — uma síntese curta, acompanhada de um exemplo.",
            "Perguntas e dúvidas — o que preciso conseguir explicar e o que ainda ficou em aberto.",
            "Resumo e próxima revisão — o que ficou da leitura e quando voltar às perguntas."
          ]
        },
        {
          "heading": "A nota que se testa sozinha",
          "body": "Cubra ou esconda a área de notas e responda às perguntas olhando apenas para as pistas. Você também pode explicar em voz alta ou escrever a resposta numa folha separada. Depois, confira, corrija e marque o que precisa retomar. Volte a essas perguntas em outros dias, ajustando os intervalos à dificuldade: uma resposta que ainda exige esforço merece outra revisão."
        },
        {
          "heading": "Escolha um suporte que funcione para você",
          "body": "Experimente formatos e observe em qual deles você consegue pensar, encontrar suas notas e revisar com constância. Uma ferramenta simples pode ser suficiente. Estas opções acomodam o mesmo método:",
          "items": [
            "Caderno ou bloco de papel — para anotar à mão, fazer esquemas e trabalhar longe da tela. Use datas, títulos e um índice para reencontrar o conteúdo.",
            "Bloco de Notas — para um arquivo de texto direto. Separe as notas por títulos e mantenha fonte, perguntas e resumo no próprio arquivo.",
            "Notion — para organizar anotações em páginas e blocos, com listas ou tabelas quando forem úteis.",
            "Obsidian — para quem prefere notas em arquivos Markdown salvos localmente.",
            "Craft — para organizar documentos em blocos e páginas. Atualmente, uso o Craft; você pode adaptar o roteiro ao suporte que funciona na sua rotina."
          ],
          "links": [
            {
              "label": "Bloco de Notas · Microsoft",
              "href": "https://support.microsoft.com/en-us/windows/apps/help-in-notepad"
            },
            {
              "label": "Notion · escrita e edição",
              "href": "https://www.notion.com/help/writing-and-editing-basics"
            },
            {
              "label": "Obsidian · armazenamento das notas",
              "href": "https://help.obsidian.md/Files+and+folders/How+Obsidian+stores+data"
            },
            {
              "label": "Craft · organização de notas",
              "href": "https://www.craft.do/organize"
            }
          ]
        },
        {
          "heading": "Um fluxo híbrido possível",
          "body": "Comece uma leitura com papel e caneta para rascunhar, perguntar e desenhar relações. Ao terminar, leve para o digital uma síntese selecionada, as referências e as dúvidas que quer retomar. Se a folha contém um esquema útil, guarde uma foto junto da nota e registre onde está o original. A passagem para o digital é uma oportunidade de reorganizar e explicar a ideia, sem a obrigação de transcrever cada linha."
        },
        {
          "heading": "O fichamento acadêmico",
          "body": "Para uma leitura acadêmica, mantenha uma nota por fonte, com a referência completa, as ideias centrais nas suas palavras, as citações literais entre aspas com a página e os seus comentários críticos. Separe a posição do autor da sua interpretação. Ao revisar, tente explicar o argumento e relacione a leitura à pergunta da sua pesquisa."
        },
        {
          "heading": "Como aplicar hoje",
          "body": "Escolha uma leitura curta e um suporte que você já tenha. Registre a fonte, anote três ideias com suas palavras e formule duas perguntas. Feche o material e tente respondê-las; só então confira e corrija. Em outro dia, volte às perguntas. Para comparar papel e digital, observe o que você consegue explicar e recuperar em cada situação, além da facilidade de manter a rotina."
        }
      ]
    },
    {
      slug: "no-lugar-do-legislador",
      title: "No Lugar do Legislador",
      image: assetPath('/images/metodo-interpretacao.jpg'),
      year: "Método",
      eyebrow: "Do acervo · Savigny, 1802/1840",
      intro:
        "Interpretar um texto difícil não é adivinhar nem opinar: é reconstruir, com método, o pensamento que nele ficou gravado. Savigny transformou essa ideia na disciplina de leitura mais influente do direito moderno — e ela serve para qualquer livro denso da sua estante.",
      sections: [
        {
          heading: "Interpretar é reconstruir um pensamento",
          body:
            "A definição de Savigny é exigente: interpretar é reconstruir o pensamento expresso no texto, na medida em que ele seja cognoscível a partir do próprio texto. Para isso, o intérprete precisa se colocar na posição do autor — deixar que o texto brote de novo dentro do seu pensamento, em vez de projetar nele as próprias ideias. Interpretar é, portanto, um exercício de desaparecimento: quanto menos de você sobrar na leitura, mais do autor aparece.",
        },
        {
          heading: "Três elementos que viraram quatro",
          body:
            "Nas lições de 1802-1803, Savigny falava de uma constituição tríplice da interpretação: elemento lógico, gramatical e histórico. Décadas depois, no Sistema de 1840, acrescentou o elemento sistemático — e fez uma correção sutil: não se trata de quatro espécies de interpretação entre as quais se escolhe, mas de atividades que precisam proceder em conjunto para que a interpretação chegue a termo. A gramática dá as palavras, a lógica a articulação, a história as circunstâncias, o sistema o lugar de cada regra no todo.",
        },
        {
          heading: "A crítica superior: quando o texto está corrompido",
          body:
            "Há um degrau acima da leitura comum. Savigny chama de crítica superior a restituição de sentido a um texto corrompido: tudo o que nos é dado chega indiretamente — por cópias, traduções, edições — e pode ter sido falsificado no caminho. Como as partes pertencem a um todo orgânico, as partes autênticas e certas servem de base para reconstruir as perdidas. É a lição mais útil para quem estuda por PDFs e traduções: quando um trecho não faz sentido nenhum, suspeite primeiro da transmissão, não do autor.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Leia qualquer capítulo difícil em quatro passadas rápidas, anotando em colunas separadas: as palavras-chave e o que significam ali (gramática); o encadeamento do raciocínio (lógica); o contexto em que o texto foi escrito e para quem (história); e o lugar daquele trecho na arquitetura do livro (sistema). A quarta coluna é a mais negligenciada — e é a que transforma anotação solta em compreensão.",
        },
        {
          heading: "A fonte na estante",
          body:
            "SAVIGNY, Friedrich Karl von. Metodologia Jurídica. Tradução de Hebe A. M. Caletti Marenco. Campinas: Edicamp, 2001 — Primeira Parte, 'Elaboração filológica da jurisprudência', especialmente pp. 8-12. O volume está na Biblioteca deste site, na edição que você subiu ao Drive.",
        },
      ],
    },
    {
      slug: "um-tema-e-uma-duvida-verdadeira",
      title: "Um Tema é uma Dúvida Verdadeira",
      image: assetPath('/images/metodo-tema.jpg'),
      year: "Método",
      eyebrow: "Do acervo · Feferbaum & Queiroz, cap. 4",
      intro:
        "Todo trabalho longo morre ou nasce na escolha do tema. No capítulo 4 do manual de metodologia da sua estante, o tema deixa de ser uma área vaga — 'quero estudar direito penal' — e vira o que sempre deveria ter sido: uma dúvida de verdade, formulável em uma pergunta.",
      sections: [
        {
          heading: "Os quatro testes do tema",
          body:
            "O capítulo propõe um funil de quatro provas. O tema deve ser um verdadeiro objeto de dúvida — se a resposta já é pacífica, não há pesquisa, há resumo. Deve ser relevante — alguém precisa da resposta. Deve ter alguma originalidade — ao menos de recorte, de fontes ou de método. E deve caber nas limitações do pesquisador — de tempo, de acesso a fontes, de repertório. Um tema que falha em qualquer um dos quatro testes cobra o preço no meio do caminho.",
        },
        {
          heading: "Descritivo ou prescritivo?",
          body:
            "O manual divide os problemas em duas grandes famílias. Os descritivos apresentam fatos juridicamente relevantes — como um tribunal decide, como uma prática funciona. Os prescritivos oferecem respostas para dúvidas difíceis: dentro destes, pesquisas de lege lata (qual a melhor resposta segundo a lei existente) e de lege ferenda (qual resposta a lei deveria passar a dar). Saber de que família é a sua dúvida decide o método inteiro — quem confunde as duas escreve um texto que não é nem um retrato nem uma proposta.",
        },
        {
          heading: "A questão de fundo, não a de frente",
          body:
            "Na etapa decisiva do roteiro que o capítulo adapta de Christian Courtis para pesquisas de lege lata, o trabalho é esmiuçar as respostas rivais já publicadas e descobrir sobre o que, exatamente, elas discordam. Não vale a questão de frente ('vigora ou não vigora?'); vale a questão de fundo — a divergência substantiva que as posições escondem. Divergências pontuais são pontas de iceberg. E é por isso que 'há quem diga A, porém há quem diga B' não é análise: é índice remissivo.",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "Pegue o tema do seu próximo trabalho e faça o ritual completo: escreva a dúvida como uma pergunta gramaticalmente acabada; liste as respostas rivais que já existem; formule a questão de fundo em uma frase; então passe o resultado pelos quatro testes. Se em alguma etapa você travar, ótimo — é ali que estava o problema, e ele apareceu na semana um, não no mês dez.",
        },
        {
          heading: "A fonte na estante",
          body:
            "QUEIROZ, Rafael Mafei Rabelo. 'Como encontrar um tema dentro de minha área de interesse?' In: FEFERBAUM, Marina; QUEIROZ, Rafael Mafei Rabelo (coords.). Metodologia da Pesquisa em Direito. 2. ed. São Paulo: Saraiva, 2019, cap. 4 — o roteiro de cinco etapas é adaptado de Christian Courtis (2006, p. 120). O volume está na Biblioteca deste site.",
        },
      ],
    },
    {
      slug: "escrever-em-camadas",
      title: "Escrever em Camadas",
      image: assetPath('/images/metodo-camadas.jpg'),
      year: "Método",
      eyebrow: "Do acervo · Feferbaum & Queiroz, cap. 24",
      intro:
        "O texto acadêmico não se escreve do início ao fim — constrói-se em camadas, como uma impressão. No capítulo final do manual, a página em branco vira uma sequência de seis passos, e a introdução, contraintuitivamente, é a penúltima coisa a ser escrita.",
      sections: [
        {
          heading: "É preciso saber aonde se quer chegar",
          body:
            "O primeiro apontamento do capítulo é de rumo, não de estilo: antes de escrever, é preciso saber aonde se quer chegar. A página em branco não é o lugar de descobrir o tema — quem tenta descobrir o destino enquanto redige escreve três introduções, nenhuma conclusão e uma tese que muda a cada capítulo. O mapa vem antes da estrada.",
        },
        {
          heading: "O esqueleto de cinco páginas",
          body:
            "A construção começa magra. Primeiro passo: um esqueleto de cinco páginas, com a espinha dorsal do argumento e nada mais. Segundo: o sumário descritivo — cada seção nomeada não por um tópico ('da interpretação'), mas pelo que ela prova. Terceiro: encaixar as principais referências nos lugares onde cada uma trabalha. Neste ponto, o texto ainda não existe — mas já não há nenhuma decisão importante por tomar.",
        },
        {
          heading: "A introdução é a penúltima coisa",
          body:
            "Quarto passo: adicionar casos, exemplos, refutações e as referências que faltavam — a carne sobre o esqueleto. Quinto: escrever a introdução e as conclusões, agora sim, quando já se sabe o que o texto de fato diz. Último: reler o texto inteiro para dar-lhe forma final — e, depois dele, a revisão externa, por olhos que não são os seus. A ordem de leitura (introdução primeiro) é o inverso da ordem de escrita (introdução quase por último).",
        },
        {
          heading: "Como aplicar hoje",
          body:
            "No próximo texto longo, resista à ordem de leitura e escreva na ordem de construção: esqueleto → mapa de seções → referências → evidências e refutações → abertura e fecho → releitura. O método funciona para qualquer texto com tese — artigo, parecer, relatório — porque resolve o verdadeiro bloqueio da página em branco: não a falta de palavras, mas a falta de decisões tomadas.",
        },
        {
          heading: "A fonte na estante",
          body:
            "QUEIROZ, Rafael Mafei Rabelo; FEFERBAUM, Marina. 'Apontamentos sobre a redação e o texto do trabalho acadêmico'. In: FEFERBAUM, Marina; QUEIROZ, Rafael Mafei Rabelo (coords.). Metodologia da Pesquisa em Direito. 2. ed. São Paulo: Saraiva, 2019, cap. 24. O volume está na Biblioteca deste site.",
        },
      ],
    },
    {
      slug: "a-virgula",
      title: "A Vírgula",
      image: assetPath('/images/virgula.jpg'),
      year: "Gramática",
      eyebrow: "Gramática · Pontuação",
      intro:
        "Nenhum sinal de pontuação gera tanta insegurança quanto a vírgula — e nenhum é tão decisivo para o sentido de uma frase. A boa notícia: o uso da vírgula não é intuição nem pausa para respirar. É regra, e as regras cabem em uma página.",
      sections: [
        {
          heading: "A regra de ouro: nunca separe sujeito de verbo",
          body:
            "O erro mais grave e mais comum é isolar o sujeito do seu predicado: 'Os alunos dedicados, passaram no exame' está errado. Sujeito e verbo formam a espinha dorsal da oração e não admitem vírgula entre si, por mais longo que o sujeito seja. O mesmo vale para a separação entre verbo e complemento: 'Ele entregou, o relatório' está igualmente errado.",
        },
        {
          heading: "Quando a vírgula é obrigatória",
          body:
            "Use vírgula para isolar o aposto ('Machado de Assis, o maior romancista brasileiro, nasceu no Rio'), o vocativo ('Amigos, a reunião começou') e os adjuntos adverbiais deslocados ou longos ('No fim da tarde, a correspondência finalmente chegou'). Use-a também antes das orações adverbiais antepostas ('Embora estivesse cansado, continuou') e para separar elementos enumerados em uma lista.",
        },
        {
          heading: "O caso das orações adjetivas",
          body:
            "A vírgula distingue explicação de restrição — e muda o sentido. 'Os alunos, que estudaram, foram aprovados' sugere que todos estudaram e todos passaram. Sem vírgulas, 'Os alunos que estudaram foram aprovados' restringe: só passaram os que estudaram. Um par de vírgulas separa, portanto, uma afirmação sobre o grupo inteiro de uma seleção dentro dele. Poucos traços de tinta carregam tanta responsabilidade.",
        },
        {
          heading: "Como treinar",
          body:
            "Pontuação se aprende como sintaxe: analisando a estrutura, não ouvindo a pausa. Pegue um parágrafo de boa prosa, retire todas as vírgulas e tente recolocá-las justificando cada uma pela função sintática — aposto, adjunto, oração anteposta. Depois compare com o original. Em poucas semanas, o olhar passa a enxergar a estrutura da frase antes da pontuação.",
        },
      ],
    },
    {
      slug: "como-as-palavras-nascem",
      title: "Como as Palavras Nascem",
      image: assetPath('/images/etimologia.jpg'),
      year: "Etimologia",
      eyebrow: "Etimologia · Origem das palavras",
      intro:
        "Cada palavra do português é um fóssil: carrega, comprimida na sua forma, uma história de conquistas, comércio, religião e ciência. Estudar etimologia não é decorar origens — é ganhar uma chave mestra que destrava o significado de milhares de palavras.",
      sections: [
        {
          heading: "Do latim ao português",
          body:
            "O português nasceu do latim falado na Península Ibérica, e cerca de 80% do nosso vocabulário vem dele — mas por dois caminhos. As palavras patrimoniais evoluíram pela boca do povo ao longo de séculos: 'aurum' virou 'ouro', 'octo' virou 'oito'. As palavras de empréstimo culto entraram depois, quase intactas, pelos textos escritos: 'aureo' (áureo), 'octeto'. Por isso temos pares como 'ouro/áureo' e 'oito/octeto' — a mesma raiz, duas viagens diferentes.",
        },
        {
          heading: "Raízes gregas, o idioma da ciência",
          body:
            "Quando a ciência precisou nomear o mundo novo que descobria, recorreu ao grego. 'Termômetro' junta 'thermé' (calor) e 'métron' (medida); 'psicologia' une 'psyche' (alma) e 'logos' (estudo); 'fotografia' significa, literalmente, 'escrever com a luz'. Quem conhece uma dúzia de raízes gregas lê termos técnicos pela primeira vez como se já os conhecesse — porque, em certo sentido, conhece.",
        },
        {
          heading: "Palavras que viajaram",
          body:
            "Nosso vocabulário guarda também as rotas da história: 'álgebra', 'álcool' e 'almofada' vieram do árabe (repare no 'al-'); 'jabuticaba' e 'pipoca', do tupi; 'dendê' e 'cafuné', de línguas africanas; 'chá', do mandarim. Cada camada de empréstimos é uma camada de contato entre povos — a etimologia é, nesse sentido, uma arqueologia da língua.",
        },
        {
          heading: "Por que isso melhora seu estudo",
          body:
            "Palavras não se memorizam melhor por repetição, mas por significado — e a etimologia é significado concentrado. Saber que 'arduo' vem do latim 'arduus' (íngreme, difícil de escalar) cria uma imagem que fixa a palavra sem esforço. Estudar a origem das palavras é aplicar a recordação ativa ao vocabulário: cada raiz aprendida vira uma pista de recuperação para dezenas de palavras.",
        },
      ],
    },
  ],
}

export const pavilionsConfig: PavilionsConfig = {
  sectionLabel: "05 · Sala de leitura — lâminas em contemplação",
  plates: [
    { image: assetPath('/images/bib-mitologia.jpg'), caption: "I. A biblioteca à noite — o silêncio como instrumento de trabalho." },
    { image: assetPath('/images/bib-metodo.jpg'), caption: "II. O caderno aberto — toda técnica termina em papel e repetição." },
  ],
}

export const footerConfig: FooterConfig = {
  visitLabel: "Sobre",
  visitLines: [
    "Um acervo independente de metodologia de estudo,",
    "gramática normativa e etimologia.",
    "Sem coach, sem gatilhos, sem fórmula mágica.",
    "Apenas técnica, evidência e palavras.",
  ],
  connectLabel: "Navegue",
  connectLinks: [
    { label: "Hoje", href: "#hoje" },
    { label: "Acervo", href: "#exhibitions" },
    { label: "Sala de leitura", href: "#pavilions" },
  ],
  brandName: "MÉTODO",
  rightsText: "© 2026 Método — conteúdo técnico de estudo.",
  coordinatesText: "Feito de papel, tinta e evidência.",
}

export const companionsConfig: CompanionsConfig = {
  sectionLabel: "04 · Companhia — jogos de fundo & o administrador do tempo",
  heading: "Estudar acompanhado",
  intro:
    "Existe um gênero novo de jogo feito para ficar aberto na segunda metade da tela enquanto você trabalha: o companion game. Não compete pela sua atenção — oferece presença, trilha sonora e um pequeno senso de progresso. É a versão digital de estudar numa biblioteca movimentada: alguém está ali com você, mas ninguém interrompe.",
  visitLabel: "Ver na Steam ↗",
  games: [
    {
      name: "Spirit City: Lofi Sessions",
      platform: "Steam · PC/Mac",
      image: assetPath('/images/jogo-spirit-city.png'),
      description:
        "O clássico do gênero. Você monta seu avatar, escolhe um quarto aconchegante, liga a playlist lofi e trabalha — com to-do list, timer pomodoro, diário e rastreador de hábitos embutidos. Enquanto isso, espíritos curiosos aparecem conforme as combinações de ambiente que você monta.",
      note: "A gamificação é propositalmente leve: existe para você voltar amanhã, não para roubar a sessão de hoje.",
      url: "https://store.steampowered.com/app/2113850/Spirit_City_Lofi_Sessions/",
    },
    {
      name: "Ithya: Magic Studies",
      platform: "Steam · PC",
      image: assetPath('/images/jogo-ithya.png'),
      description:
        "Uma torre de magia à beira de um lago, entre montanhas nevadas. Você é o aprendiz que estuda à escrivaninha — com lista de tarefas e pomodoro integrados, trilhas lofi e fantasiosas, e um cenário que pode ficar recolhido na borda da tela enquanto você escreve ou lê.",
      note: "A opção mais discreta: funciona como janela fina lateral, quase um widget vivo de companhia.",
      url: "https://store.steampowered.com/app/3330250/Ithya_Magic_Studies/",
    },
    {
      name: "Focus Grove",
      platform: "Steam · PC/Mac",
      image: assetPath('/images/jogo-focus-grove.png'),
      description:
        "Uma fazendinha florestal que cresce quando você trabalha. Os Woodlings cuidam da horta durante seus pomodoros e descansam nos seus intervalos — tarefas reais concluídas viram árvores, construções e bichos novos. Inclui timer, tarefas, hábitos, bloco de notas e sons de natureza.",
      note: "O progresso da fazenda é um espelho suave do seu progresso real: a floresta só cresce se você trabalhar.",
      url: "https://store.steampowered.com/app/4030830/Focus_Grove/",
    },
  ],
  timekeeperHeading: "O administrador do tempo — e a medida certa das métricas",
  timekeeperParagraphs: [
    "Todo bom método de estudo precisa de alguém cuidando do relógio — e a melhor decisão é terceirizar esse cargo para um aplicativo. O Forest é o exemplo canônico: você planta uma semente, define o tempo de foco e a árvore cresce enquanto o celular fica em paz; saia do app para checar uma rede social e a árvore murcha. É o pomodoro com uma consequência visível, e a floresta acumulada forma um registro gentil das suas sessões.",
    "Mas aqui vale a advertência técnica: métrica é instrumento de navegação, não o destino. Apegar-se demais aos números corrompe o método — horas de 'foco' registradas enquanto se relê distraído, sequências mantidas por puro medo de quebrar a corrente, sessões iniciadas só para não zerar o dia. Quando a métrica vira a meta, deixa de medir o que importava: é a velha lei de Goodhart aplicada ao caderno de estudos.",
    "Apegar-se de menos é o erro simétrico: sem nenhum registro, a autopercepção engana — quase todo mundo superestima o quanto estudou e subestima quanto se dispersou. O ponto de equilíbrio é usar os números como um amigo honesto: olhe-os uma vez por semana, pergunte 'o que eles dizem sobre o meu processo?', ajuste o plano — e volte a ignorá-los no dia a dia. A floresta é o mapa; o aprendizado é o território.",
  ],
  timekeeperAppName: "Forest",
  timekeeperAppNote: "iOS, Android e extensão para navegador — o timer que planta árvores de verdade em parceria com o Trees for the Future.",
  timekeeperAppUrl: "https://www.forestapp.cc",
}

export const libraryConfig: LibraryConfig = {
  sectionLabel: "03 · Biblioteca — materiais de estudo",
  intro:
    "Livros, guias e estudos do acervo, transcritos em páginas de leitura próprias — apenas material pronto para estudo e revisão. Rascunhos de trabalho e material em andamento ficam de fora, propositalmente.",
  linkLabel: "Ler no site →",
  items: [
    {
      slug: "guia-mitologias",
      model: "flow",
      title: "Guia de Estudos — Mitologias Jurídicas da Modernidade",
      category: "Guia de revisão",
      format: "Documento",
      description:
        "Questionário de resposta curta com chave de respostas sobre Paolo Grossi — um exemplo pronto de recordação ativa aplicada à leitura densa.",
    },
    {
      slug: "estudo-grossi",
      model: "flow",
      title: "Estudo Crítico e Analítico — Paolo Grossi",
      category: "Guia de revisão",
      format: "Documento",
      description:
        "Fichamento analítico completo, seção a seção, com perguntas de compreensão e conclusões — modelo de como transformar leitura em estudo ativo.",
    },
    {
      slug: "feferbaum-queiroz",
      model: "explainer",
      title: "Metodologia da Pesquisa em Direito — Feferbaum & Queiroz",
      category: "Referência",
      format: "PDF · Livro",
      description:
        "O manual de referência para monografias, dissertações e teses: como encontrar um tema, formular o problema e trabalhar com jurisprudência — com instrumento para testar um tema real.",
    },
    {
      slug: "capes-metodologia",
      model: "flow",
      title: "Projeto de Tese e Metodologia sob a Ótica da CAPES",
      category: "Referência",
      format: "PDF · Aula",
      description:
        "Aula inaugural sobre rigor metodológico: problema, hipótese, objetivos, método de abordagem e os critérios que reprovam projetos em qualificação.",
    },
    {
      slug: "savigny-metodologia",
      model: "explainer",
      title: "Metodologia Jurídica — Savigny",
      category: "Referência",
      format: "PDF · Livro",
      description:
        "O clássico de 1840: interpretação, sistema e construção jurídica na origem da metodologia do direito moderno — com classificador das quatro técnicas.",
    },
    {
      slug: "metodos-metodologias",
      model: "explainer",
      title: "Métodos e Metodologias Aplicados ao Projeto de Tese",
      category: "Referência",
      format: "PDF · Livro",
      description:
        "Manual de apoio à elaboração do projeto de tese: do tema ao desenho da pesquisa — com construtor da cadeia de coerência do projeto.",
    },
    {
      slug: "aulas-metodologia",
      model: "flow",
      title: "Aulas de Metodologia — Projeto de Tese",
      category: "Referência",
      format: "Pasta · Slides",
      description:
        "A série do curso de metodologia em três movimentos: da ideia à hipótese, o embasamento teórico e a revisão integrativa.",
    },
    {
      slug: "malleus-maleficarum",
      model: "flow",
      title: "Estudo de Caso — Malleus Maleficarum",
      category: "Estudo de caso",
      format: "Slides",
      description:
        "Apresentação completa de um estudo de caso historiográfico: contexto, fonte primária, diálogo com a historiografia e questões para debate.",
    },
    {
      slug: "dicionario-analogico",
      model: "flow",
      title: "Dicionário Analógico da Língua Portuguesa — F. F. S. Azevedo",
      category: "Referência",
      format: "PDF · Dicionário",
      description:
        "O dicionário de ideias afins: palavras agrupadas por conceito, com remissivas etimológicas. É a estante de consulta do Herbário.",
    },
  ],
}

export const herbariumConfig: HerbariumConfig = {
  sectionLabel: "06 · Herbário — lâminas de palavras",
  heading: "Um herbário de palavras",
  intro:
    "O botânico prensa plantas em lâminas; o estudante prensa palavras em fichas. Cada lâmina deste herbário é uma família etimológica: uma raiz antiga no centro e, ao redor, as palavras que ela gerou. Ler etimologia não é decorar origens — é descobrir que dez palavras 'diferentes' são, no fundo, a mesma ideia trabalhando. Quem vê a raiz, aprende a família inteira de uma vez.",
  families: [
    {
      id: "scribe",
      root: "scrībere",
      rootLang: "latim",
      rootMeaning: "escrever, gravar",
      note: "A raiz mais produtiva do português escrito. Tudo que se inscreve, descreve ou prescreve nasce do mesmo gesto: marcar uma superfície para que o pensamento sobreviva ao tempo.",
      specimens: [
        { word: "escrito", gloss: "o que ficou gravado; particípio de escrever" },
        { word: "escritura", gloss: "o ato de escrever; o documento resultante" },
        { word: "inscrever", gloss: "gravar dentro — colocar o nome na lista" },
        { word: "descrever", gloss: "escrever por extenso, desdobrar em palavras" },
        { word: "prescrever", gloss: "escrever antes — ordenar por escrito" },
        { word: "transcrever", gloss: "escrever através — copiar de um lugar a outro" },
        { word: "manuscrito", gloss: "escrito à mão (manu + scriptum)" },
        { word: "escriba", gloss: "o profissional da escrita, na antiguidade" },
      ],
    },
    {
      id: "legein",
      root: "legere",
      rootLang: "latim",
      rootMeaning: "escolher, reunir, ler",
      note: "Antes de significar 'ler', legere significava 'escolher e juntar' — porque ler é exatamente isso: colher palavras uma a uma. Da mesma raiz nascem eleger, colecionar e intelecto.",
      specimens: [
        { word: "ler", gloss: "colher sentido num texto, palavra por palavra" },
        { word: "leitura", gloss: "a colheita feita com os olhos" },
        { word: "eleger", gloss: "escolher dentre muitos — como quem lê opções" },
        { word: "coletar", gloss: "juntar junto (cum + legere)" },
        { word: "intelecto", gloss: "ler por dentro (inter + legere): compreender" },
        { word: "inteligente", gloss: "o que sabe ler entre as coisas" },
        { word: "diligente", gloss: "o que escolhe com cuidado (dis + legere)" },
        { word: "lenda", gloss: "aquilo que deve ser lido (gerundivo: legenda)" },
      ],
    },
    {
      id: "docere",
      root: "docēre",
      rootLang: "latim",
      rootMeaning: "ensinar, mostrar",
      note: "Ensinar é, literalmente, mostrar. O doutor não é 'o que sabe muito': é o que foi habilitado a mostrar aos outros. Documento é a prova que mostra; dócil, o que se deixa mostrar.",
      specimens: [
        { word: "docente", gloss: "o que ensina, em exercício" },
        { word: "doutor", gloss: "o habilitado a ensinar (não: o decorado)" },
        { word: "doutrina", gloss: "o corpo do que se ensina" },
        { word: "documento", gloss: "aquilo que mostra, que prova" },
        { word: "dócil", gloss: "que se deixa ensinar — a primeira virtude do estudante" },
        { word: "disciplina", gloss: "o que se ensina ao discípulo (discere: aprender)" },
      ],
    },
    {
      id: "sistere",
      root: "sistere",
      rootLang: "latim",
      rootMeaning: "ficar de pé, firmar",
      note: "Persistir, resistir, insistir, existir, consistir: cinco palavras, um só verbo. Toda constância no estudo é, etimologicamente, uma maneira de ficar de pé.",
      specimens: [
        { word: "persistir", gloss: "ficar de pé através (per) do tempo" },
        { word: "resistir", gloss: "ficar de pé contra (re) a pressão" },
        { word: "insistir", gloss: "ficar de pé sobre (in) o mesmo ponto" },
        { word: "existir", gloss: "sair (ex) e ficar de pé — vir à luz" },
        { word: "consistir", gloss: "ficar de pé junto (cum) — ser feito de" },
        { word: "assistir", gloss: "ficar de pé ao lado (ad) — estar presente" },
        { word: "desistir", gloss: "des-fazer-se de pé — largar a posição" },
      ],
    },
    {
      id: "gradus",
      root: "gradus",
      rootLang: "latim",
      rootMeaning: "passo, degrau",
      note: "Aprender é caminhar: não há salto, há passo. Graduar é dar passos; progredir, passos adiante; retroceder, passos atrás. A gramática herdou a metáfora — grau é o degrau da comparação.",
      specimens: [
        { word: "grau", gloss: "o degrau; unidade de medida de uma escala" },
        { word: "gradual", gloss: "degrau a degrau, sem pressa" },
        { word: "graduar", gloss: "conferir os degraus; diplomar" },
        { word: "progredir", gloss: "passos para a frente (pro)" },
        { word: "regredir", gloss: "passos para trás (re)" },
        { word: "agredir", gloss: "passos contra (ad) alguém" },
        { word: "ingrediente", gloss: "o que entra (in) na receita, passo a passo" },
      ],
    },
    {
      id: "mneme",
      root: "mnēmē",
      rootLang: "grego",
      rootMeaning: "memória, lembrança",
      note: "Dos gregos herdamos a deusa Mnemosine, mãe das musas: toda arte nasce da memória. Mnemônico é o instrumento que a desperta; amnésia, a sua falta. Repetir espaçadamente é honrar a raiz.",
      specimens: [
        { word: "mnemônico", gloss: "o artifício que socorre a memória" },
        { word: "amnésia", gloss: "a (negação) + memória: o esquecimento" },
        { word: "anamnese", gloss: "trazer a memória de volta (ana) — a entrevista clínica" },
        { word: "memória", gloss: "do latim memoria, prima da mesma ideia" },
        { word: "rememorar", gloss: "memorizar de novo (re)" },
        { word: "imemorável", gloss: "que não cabe na memória de ninguém" },
      ],
    },
    {
      id: "hodos",
      root: "hodós",
      rootLang: "grego",
      rootMeaning: "caminho, via, jornada",
      note: "A raiz escondida na palavra favorita deste site: método é, ao pé da letra, 'o caminho através de' (metá + hodós) — a via que se segue com propósito, não o atalho. Quem tem método não anda mais rápido; anda por um caminho.",
      specimens: [
        { word: "método", gloss: "o caminho através de (metá): a via com propósito" },
        { word: "período", gloss: "o caminho ao redor (perí): o circuito completo" },
        { word: "êxodo", gloss: "o caminho para fora (ex): a partida coletiva" },
        { word: "episódio", gloss: "a entrada pelo caminho: o que surge entre dois trechos" },
        { word: "sínodo", gloss: "o caminho junto (syn): a assembleia que viaja reunida" },
        { word: "ânodo", gloss: "o caminho para cima (ana): termo da eletricidade" },
        { word: "cátodo", gloss: "o caminho para baixo (kata): o polo oposto" },
      ],
    },
    {
      id: "schole",
      root: "scholē",
      rootLang: "grego",
      rootMeaning: "ócio, tempo livre — dedicado ao estudo",
      note: "O paradoxo mais bonito da língua: escola vem de scholē, que significava lazer. Para os gregos, o tempo livre era o tempo do aprendizado — estudar não era o oposto do descanso, era o seu melhor uso. O trabalho é que era ascholía: a falta de tempo para pensar.",
      specimens: [
        { word: "escola", gloss: "o lugar onde o tempo livre vira aprendizado" },
        { word: "escolar", gloss: "quem vive no tempo do estudo" },
        { word: "escolástico", gloss: "o filósofo das escolas medievais; por extensão, o sutil demais" },
        { word: "escólio", gloss: "a nota à margem de um texto antigo; o comentário do copista" },
        { word: "escoliaste", gloss: "o autor de escólios; o comentador de clássicos" },
        { word: "escoliarca", gloss: "o diretor da escola; o que governa o tempo de estudo" },
      ],
    },
  ],
}

export const dailyConfig: DailyConfig = {
  sectionLabel: "01 · Hoje — o ritual diário",
  quoteLabel: "Citação do dia",
  wordLabel: "Palavra do dia · etimologia",
  quotes: [
    { text: "Não é que tenhamos pouco tempo; é que perdemos muito dele.", author: "Sêneca" },
    { text: "A sorte favorece a mente preparada.", author: "Louis Pasteur" },
    { text: "Somos aquilo que fazemos repetidamente. A excelência, portanto, não é um ato, mas um hábito.", author: "atribuída a Aristóteles" },
    { text: "Saber muito não é ser inteligente.", author: "Heráclito" },
    { text: "A leitura é provavelmente a maneira mais produtiva de passar o tempo.", author: "Machado de Assis" },
    { text: "Quem ensina aprende ao ensinar. E quem aprende ensina ao aprender.", author: "Paulo Freire" },
    { text: "Não posso mudar a direção do vento, mas posso ajustar minhas velas para sempre alcançar meu destino.", author: "atribuída a Jimmy Dean" },
    { text: "A repetição é a mãe do aprendizado.", author: "provérbio latino" },
    { text: "Ocupar-se de perguntas que não podem ser respondidas é a melhor maneira de se preparar para as que podem.", author: "James Angell" },
    { text: "O estudo é como a luz do céu: brilha sem esforço quando a janela está limpa.", author: "Zhu Xi" },
    { text: "Não há vento favorável para quem não sabe a que porto se dirige.", author: "Sêneca" },
    { text: "Tudo parece impossível até que seja feito.", author: "Nelson Mandela" },
    { text: "O conhecimento é a única riqueza que aumenta quando é dividida.", author: "Sócrates, na tradição" },
    { text: "Primeiro resolva o problema. Depois, escreva a solução de forma simples.", author: "John Johnson" },
    { text: "A memória é o tesouro da mente e nela estão guardados os seus monumentos.", author: "Cícero" },
    { text: "Não se aprende bem senão pela experiência.", author: "Denis Diderot" },
    { text: "Todas as coisas são difíceis antes de se tornarem fáceis.", author: "Thomas Fuller" },
    { text: "A dúvida é o princípio da sabedoria.", author: "Aristóteles" },
    { text: "Um leitor vive mil vidas antes de morrer. Quem nunca lê vive apenas uma.", author: "George R. R. Martin" },
    { text: "Diga-me e eu esquecerei; ensine-me e eu poderei lembrar; envolva-me e eu aprenderei.", author: "atribuída a Benjamin Franklin" },
    { text: "Quem pergunta é tolo por cinco minutos; quem não pergunta é tolo para sempre.", author: "provérbio chinês" },
    { text: "A capacidade de concentração é a raiz de todas as habilidades superiores do homem.", author: "Bruce Lee" },
    { text: "Saber não é suficiente; é preciso aplicar. A vontade não é suficiente; é preciso agir.", author: "Goethe" },
    { text: "O homem sábio aprende mais com seus inimigos do que o tolo com seus amigos.", author: "Baltasar Gracián" },
    { text: "Ler sem refletir é como comer sem digerir.", author: "Edmund Burke" },
    { text: "O verdadeiro conhecimento é conhecer a extensão da própria ignorância.", author: "Confúcio" },
    { text: "Perseverar é falhar dezenove vezes e ter sucesso na vigésima.", author: "Julie Andrews" },
    { text: "O estudo sem reflexão é uma ocupação inútil.", author: "Confúcio" },
    { text: "A imaginação é mais importante que o conhecimento, mas o conhecimento sustenta a imaginação.", author: "adaptado de Einstein" },
    { text: "Aquilo que se aprende na infância grava-se na alma como em cera mole.", author: "Quintiliano" },
    { text: "Muitos teriam sido sábios se não se tivessem imaginado sábios.", author: "Sêneca" },
    { text: "Gota a gota a água fura a pedra — não pela força, mas pela constância.", author: "Ovídio" },
    { text: "Nada no mundo pode tomar o lugar da persistência.", author: "Calvin Coolidge" },
    { text: "Apresse-se devagar.", author: "atribuída a Augusto (festina lente)" },
    { text: "A constância é o fundamento da virtude.", author: "Francis Bacon" },
    { text: "Quanto mais eu pratico, mais sorte eu tenho.", author: "atribuída a Gary Player" },
    { text: "A genialidade é um por cento de inspiração e noventa e nove por cento de transpiração.", author: "Thomas Edison" },
    { text: "Não se mede um homem pelas vitórias, mas pelas vezes que se levantou.", author: "adaptado de Nelson Mandela" },
    { text: "Grandes feitos são feitos de pequenos deveres cumpridos todos os dias.", author: "adaptado de Émile Zola" },
  ],
  words: [
    { word: "escola", origin: "gr. skholé", meaning: "Significava 'lazer, tempo livre' — o tempo livre dos gregos dedicado ao estudo e à discussão. Passou pelo latim schola antes de chegar ao português." },
    { word: "estudo", origin: "lat. studium", meaning: "Do verbo studere, 'aplicar-se com zelo, esforçar-se'. A raiz carrega a ideia de afinco — estudar já era, na origem, uma questão de dedicação deliberada." },
    { word: "método", origin: "gr. méthodos", meaning: "De meta ('através, segundo') + hodós ('caminho'): literalmente, 'o caminho a seguir'. Ter método é ter um caminho, não um atalho." },
    { word: "memória", origin: "lat. memoria", meaning: "De memor, 'que se lembra', da mesma raiz indo-europeia de 'mente'. Mnemosina, a deusa grega da memória, era a mãe das nove musas — toda a arte nasceria dela." },
    { word: "álgebra", origin: "ár. al-jabr", meaning: "De al-jabr, 'a restauração, a reunião de partes', título do tratado de Al-Khwarizmi (séc. IX). O 'al-' inicial entrega imediatamente a origem árabe da palavra." },
    { word: "curioso", origin: "lat. curiosus", meaning: "De cura, 'cuidado, atenção'. O curioso era originalmente aquele que cuida das coisas com atenção — o estudioso por excelência." },
    { word: "texto", origin: "lat. textus", meaning: "De texere, 'tecer'. Um texto é, literalmente, um tecido: fios de palavras trançados em trama — daí também 'tecido' e 'textura'." },
    { word: "sábio", origin: "lat. sapidus", meaning: "De sapere, 'ter sabor' e, por extensão, 'ter juízo'. Sabor e saber compartilham a raiz: conhecer era, metaforicamente, degustar a realidade." },
    { word: "idioma", origin: "gr. idioma", meaning: "De idios, 'próprio, particular'. O idioma é aquilo que é próprio de um povo — a mesma raiz de 'idiossincrasia' e de 'idiota' (originalmente, 'pessoa comum')." },
    { word: "verbo", origin: "lat. verbum", meaning: "Significava simplesmente 'palavra'. Que o verbo — o motor da frase — seja 'a palavra' por excelência diz muito sobre como os gramáticos antigos viam a ação." },
    { word: "exame", origin: "lat. examen", meaning: "Era o 'enxame de abelhas' e, também, a 'agulha da balança'. Da pesagem exata à prova escolar: o exame como instrumento de medida." },
    { word: "diligente", origin: "lat. diligens", meaning: "De diligere, 'amar, estimar', formado por dis- + legere, 'escolher'. Diligência é, na origem, escolher com cuidado — amar o que se faz." },
    { word: "livro", origin: "lat. liber", meaning: "Liber era a camada interna da casca das árvores, usada como suporte de escrita. O livro leva no nome a matéria vegetal de que um dia foi feito." },
    { word: "razão", origin: "lat. ratio", meaning: "De reri, 'calcular, pensar'. Ratio era conta, cálculo e motivo ao mesmo tempo — raciocinar e raciocinar números eram a mesma operação." },
    { word: "cultura", origin: "lat. cultura", meaning: "De colere, 'cultivar a terra'. A cultura começou como metáfora agrícola: o espírito, como o campo, precisa ser arado, semeado e cuidado para dar fruto." },
    { word: "aluno", origin: "lat. alumnus", meaning: "De alere, 'alimentar, nutrir'. O alumnus era o 'nutrido', o filho adotivo criado na casa — o discípulo como alguém alimentado pelo mestre." },
    { word: "leitura", origin: "lat. lectura", meaning: "De legere, que significava 'colher, apanhar' e depois 'ler'. Ler é colher: palavra a palavra, como quem cata grãos — a mesma raiz de 'eleger' e 'coletar'." },
    { word: "graúdo", origin: "gr. graús via lat.", meaning: "De graus ('velha'), atravessou séculos de significado até designar o graduado e, na gíria, a pessoa importante. As palavras também fazem carreira." },
    { word: "abecedário", origin: "lat. abecedarium", meaning: "Formado pelos nomes das quatro primeiras letras: A, Bê, Cê, Dê. Uma palavra-índice: seu conteúdo está literalmente escrito nela mesma." },
    { word: "ortografia", origin: "gr. orthographia", meaning: "De orthós ('correto, reto') + graphé ('escrita'): 'escrita correta'. A mesma raiz de 'ortodontia' (dentes retos) e 'ortodoxia' (opinião reta)." },
    { word: "sinônimo", origin: "gr. synonymos", meaning: "De syn ('junto, com') + onoma ('nome'): nomes que andam juntos. As raízes gregas são pistas de recuperação para dezenas de palavras técnicas." },
    { word: "preciso", origin: "lat. praecisus", meaning: "De praecidere, 'cortar na frente, encurtar'. O preciso é aquilo que foi aparado até não sobrar excesso — precisão como resultado de corte." },
    { word: "dúvida", origin: "lat. dubita", meaning: "De dubius, relacionado a duo ('dois'): duvidar é estar dividido entre dois caminhos. A incerteza tem o número dois gravado na raiz." },
    { word: "vocação", origin: "lat. vocatio", meaning: "De vocare, 'chamar'. A vocação é um chamado — originalmente religioso, depois profissional. Aquilo para que se é chamado." },
    { word: "atlas", origin: "gr. Atlas", meaning: "O titã condenado a sustentar o céu nos ombros. Mercator usou seu nome na capa de uma coletânea de mapas em 1595, e o gigante virou sinônimo de cartografia." },
    { word: "fóssil", origin: "lat. fossilis", meaning: "De fodere, 'cavar': fóssil é 'aquilo que se desenterra'. Cada palavra herdada do latim é, ela mesma, um pequeno fóssil linguístico." },
    { word: "quarentena", origin: "it. quarantina", meaning: "De quaranta ('quarenta'): os quarenta dias de isolamento impostos aos navios que chegavam a Veneza no século XIV. A medida ficou gravada no nome." },
    { word: "salário", origin: "lat. salarium", meaning: "De sal ('sal'): a ração de sal — ou o dinheiro para comprá-la — paga aos soldados romanos. Da mesma família vem 'salada' e 'salame'." },
    { word: "hábito", origin: "lat. habitus", meaning: "De habere, 'ter, manter': o hábito é aquilo que 'se tem' constantemente, a roupa que o comportamento veste todos os dias — daí também o hábito dos monges." },
    { word: "entusiasmo", origin: "gr. enthousiasmos", meaning: "De en theos, 'ter um deus dentro de si'. O entusiasmado era o possuído pelo divino — a palavra guarda a ideia de que o grande impulso vem de algo maior." },
    { word: "persistência", origin: "lat. persistentia", meaning: "De persistere — per ('através, até o fim') + sistere ('ficar de pé'). Persistir é, literalmente, permanecer de pé através do tempo — a mesma raiz de 'resistir', 'insistir' e 'existir'." },
    { word: "excelência", origin: "lat. excellentia", meaning: "De excellere — ex- ('para fora, acima') + cellere ('elevar-se'). Excelente é aquilo que se ergue acima do nível comum; a excelência nasceu como uma metáfora de altura." },
    { word: "pomodoro", origin: "it. pomodoro", meaning: "De pomo d'oro, 'maçã de ouro' — o tomate chegou da América à Itália amarelo-dourado. Séculos depois, um timer de cozinha em forma de tomate daria nome à técnica de foco de Francesco Cirillo." },
    { word: "talento", origin: "gr. tálanton", meaning: "Era uma unidade de peso e uma moeda. A parábola bíblica dos talentos — moedas confiadas para serem multiplicadas — transformou o peso em dom natural. O talento foi, antes de tudo, capital." },
    { word: "disciplina", origin: "lat. disciplina", meaning: "De discipulus ('aprendiz'), de discere ('aprender'). Originalmente era o saber transmitido ao discípulo; só depois virou ordem e obediência. A disciplina nasceu como sinônimo de aprendizado." },
    { word: "prática", origin: "gr. praktiké", meaning: "De prattein, 'fazer, agir'. Prática e teoria (theōria, 'contemplação') nasceram como irmãs gregas — ver e fazer. O português preserva a dupla: teoria é o que se contempla, prática é o que se executa." },
    { word: "sacrifício", origin: "lat. sacrificium", meaning: "De sacer ('sagrado') + facere ('fazer'): 'tornar sagrado'. O sacrifício não era perda, mas consagração — dedicar algo a um propósito maior. Estudar, nesse sentido, é um pequeno sacrificium diário." },
    { word: "compromisso", origin: "lat. compromissum", meaning: "De com ('junto') + promittere ('prometer'): uma promessa feita em conjunto. O compromisso nasce bilateral — inclusive o que você firma consigo mesmo na agenda de estudos." },
  ],
}
