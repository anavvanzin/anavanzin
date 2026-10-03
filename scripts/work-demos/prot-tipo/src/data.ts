import { PersonaDetail, CaseAnalysis } from "./types";

export const BOARD_PERSONAS: PersonaDetail[] = [
  {
    id: "lucas_mendes",
    name: "Dr. Lucas Mendes",
    role: "Persona fictícia · Defesa de Direitos",
    avatar: "⚖️",
    reference: "Tavares, Bitencourt & Cristóvam",
    axis: "Contraditório Prévio Algorítmico, Devido Processo e Ampla Defesa",
    color: "emerald"
  },
  {
    id: "clara_santos",
    name: "Profª Clara Santos",
    role: "Persona fictícia · Ciência de Dados e Auditoria",
    avatar: "📊",
    reference: "Salgado & Saito",
    axis: "Transparência Estatística, Qualidade da Base de Dados e Discriminação Indireta",
    color: "blue"
  },
  {
    id: "ricardo_hahn",
    name: "Dr. Ricardo Hahn",
    role: "Persona fictícia · Gestão e Legalidade Administrativa",
    avatar: "🏢",
    reference: "Cristóvam & Hahn",
    axis: "Eficiência Administrativa Legal, Governança e Custos da Litigância Reversa",
    color: "amber"
  },
  {
    id: "arnaldo_rocha",
    name: "Sr. Arnaldo Rocha",
    role: "Persona fictícia · Cidadania e Sociedade Civil",
    avatar: "👤",
    reference: "Sarlet & Molinaro",
    axis: "Literacia Algorítmica, Inteligibilidade e Direito à 'Notícia Humana'",
    color: "rose"
  }
];

// Casos, personas, escores e votos são dados ilustrativos, sem origem em pesquisa empírica.
export const STANDARD_CASES: CaseAnalysis[] = [
  {
    id: "inss_rural",
    title: "INSS — Aposentadoria Rural Indeferida por 'Atividade Urbana'",
    desc: "Aposentadoria de segurada especial indeferida de forma puramente automatizada sem verificação presencial.",
    tag: "Previdenciário",
    context: "Caso fictício para discussão acadêmica. Uma trabalhadora rural idosa solicita aposentadoria. O sistema hipotético associa dados do proprietário da terra à atividade da segurada e indefere o pedido sem esclarecer a divergência. O exemplo discute pertinência da prova, motivação e possibilidade de manifestação; não descreve o funcionamento comprovado de um sistema do INSS.",
    dados: [
      { campo: "Autodeclaração de Segurado Especial", fonte: "Segurada (Meu INSS)", status: "ok", statusLabel: "Desconsiderada" },
      { campo: "Histórico Contributivo", fonte: "CNIS (cruzamento)", status: "warn", statusLabel: "Intermitente" },
      { campo: "Vínculo Patronal de Proprietário", fonte: "CAR / ITR", status: "bad", statusLabel: "Inferido como Urbano" },
      { campo: "Relação de Homonímia", fonte: "Receita Federal", status: "warn", statusLabel: "Conflito de Nomes" },
      { campo: "Rito de Justificação Manual", fonte: "IN 128/2022 (INSS)", status: "bad", statusLabel: "Ignorado pelo Robô" }
    ],
    vieses: [
      { label: "Informalidade no campo", valor: 92, nivel: "high" },
      { label: "Mulheres na agricultura", valor: 78, nivel: "high" },
      { label: "Idosos sem letramento digital", valor: 85, nivel: "high" },
      { label: "Controle de terras (Proxy)", valor: 64, nivel: "med" }
    ],
    personas: {
      defensoria: "Na hipótese didática, indeferir a aposentadoria rural sem esclarecer os dados divergentes compromete a defesa da interessada. A perspectiva de defesa de direitos propõe instrução individualizada, informação sobre o motivo da negativa e oportunidade de manifestação, à luz do art. 5º, LIV e LV, da Constituição e das regras previdenciárias aplicáveis. O caso não demonstra que toda decisão automatizada seja inválida ou que a IN INSS 128/2022 exija instrução humana antes de qualquer indeferimento.",
      cientista: "No cenário fictício, dados do proprietário da terra são indevidamente associados à trabalhadora. A perspectiva técnica propõe avaliar identificação, origem e significado dos registros, além de comparar a inferência com os documentos apresentados. Não há medição de precisão neste exemplo.",
      admin: "Discutindo governança, a automação sem canais de revisão pode transferir custos de triagem para recursos administrativos e ações judiciais. Esse risco de litigância reversa é uma hipótese acadêmica, sem medição de custos neste protótipo. O art. 20 da LGPD prevê solicitar revisão de decisões automatizadas que afetem interesses; a supervisão humana direta é uma salvaguarda defendida pelo seminário, não uma exigência literal do artigo vigente.",
      cidadao: "A perspectiva cidadã do exercício pergunta se a trabalhadora compreende a negativa e consegue contestar os dados associados ao seu pedido. A proposta autoral de notícia humana significa comunicar os motivos com clareza e oferecer apoio acessível, inclusive presencial quando necessário. O exemplo não atribui a uma obra específica a descrição desse sistema ou uma garantia automática de concessão."
    },
    rankings: [
      { pos: 1, name: "Dr. Lucas Mendes (Defensoria)", score: "1.12", votes: 4, comment: "Argumentação irrespondível quanto à preternaturalidade do contraditório prévio." },
      { pos: 2, name: "Sr. Arnaldo Rocha (Cidadão)", score: "1.95", votes: 4, comment: "Sensibilidade total ao peso da exclusão digital e ao direito à notícia humana." },
      { pos: 3, name: "Profª Clara Santos (Dados)", score: "2.80", votes: 4, comment: "Excelente demonstração da fragilidade estatística das proxies de agricultura." },
      { pos: 4, name: "Dr. Ricardo Hahn (Gestão)", score: "3.70", votes: 4, comment: "Focou lucidamente no custo operacional e na ruína da economicidade por litigância interna." }
    ],
    final: {
      sintese: "Cenário fictício de indeferimento rural apoiado em associação indireta de dados, para discutir prova, motivação e direito de contestação.",
      consenso: "Convergência didática sobre a importância de esclarecer divergências, avaliar a autodeclaração com outros elementos e comunicar os motivos de forma compreensível. O seminário propõe salvaguardas anteriores à decisão, sem afirmar nulidade automática.",
      dissenso: "Debate focado na justificativa de escala do INSS. O administrador pondera que o volume de pedidos motiva a escolha por triagem mecânica, enquanto a Defensoria e a representação dos cidadãos opõem que o direito fundamental ao sustento não se submete a métricas de throughput corporativo.",
      fundamentacao: "Hipótese acadêmica: a negativa deve ser examinada à luz do devido processo, do contraditório e da ampla defesa (CF, art. 5º, LIV e LV), além das regras previdenciárias aplicáveis. Quando incide a LGPD, o art. 20 permite solicitar revisão de decisão baseada unicamente em tratamento automatizado de dados pessoais; o §1º prevê informações claras sobre critérios e procedimentos, respeitados os segredos comercial e industrial. A redação vigente não exige expressamente pessoa natural. A mediação humana é proposta de salvaguarda deste trabalho. A Lei 14.129/2021 trata de atos eletrônicos no art. 6º e parágrafo único, atendimento presencial no art. 14 e transparência de dados no art. 25; seu art. 19 trata da Base Nacional de Serviços Públicos e não autoriza decisões algorítmicas.",
      recomendacao: "Propostas para o cenário fictício:\n1. Reexaminar os dados e a motivação do indeferimento, com oportunidade de apresentação de provas conforme o procedimento aplicável;\n2. Investigar a pertinência das associações cadastrais usadas na triagem;\n3. Oferecer comunicação compreensível e apoio humano para solicitar revisão. A nulidade e os efeitos financeiros dependem da análise jurídica do caso concreto.",
      alerta: "O exercício discute o risco de uma implementação tecnológica se afastar das regras e das garantias do procedimento que deveria apoiar. Não constitui constatação de infração cometida pelo INSS.",
      minutaRecurso: "MODELO DIDÁTICO — CASO FICTÍCIO\nPEDIDO DE REVISÃO DE INDEFERIMENTO DE APOSENTADORIA RURAL\n\nÀ autoridade administrativa competente\n\nO exemplo pressupõe divergência entre a atividade declarada e os dados usados na triagem. Solicita-se informação clara sobre a motivação, oportunidade de apresentar documentos e reexame dos dados e da decisão, conforme as normas previdenciárias aplicáveis. Quando aplicável, invoca-se o direito de solicitar revisão previsto no art. 20 da LGPD. A intervenção humana é uma salvaguarda proposta.\n\nEste texto exige adaptação ao procedimento, aos fatos e aos prazos de um caso real; não garante anulação, concessão ou pagamento retroativo.",
      pedidoLAI: "MODELO DIDÁTICO — CASO FICTÍCIO; requer adaptação jurídica e não garante resultado.\n\nSOLICITAÇÃO DE EXPLICABILIDADE ALGORÍTMICA (LAI)\n\nAO: SERVIÇO DE INFORMAÇÕES AO CIDADÃO do INSS / DATAPREV\n\nAssunto: Solicitação de relatórios sobre critérios, parâmetros e bases de dados do algoritmo de triagem de Segurado Especial\n\nCom amparo na Lei nº 12.527/2011 (LAI) e no Artigo 20 da LGPD, solicita-se:\n\n1. Cópia integral do código-fonte ou especificação de regras lógicas do algoritmo utilizado para avaliar a conformidade de autodeclarações de atividade rural.\n2. Listagem completa de todas as bases de dados governamentais e privadas cruzadas no respectivo processamento do requerimento.\n3. Indicação da taxa de erro e falsos positivos do referido modelo computacional para populações de baixa renda e atividade informal."
    }
  },
  {
    id: "bolsa_familia",
    title: "Bolsa Família — Cancelamento Automático por Inconsistência",
    desc: "Cancelamento de benefício sem contraditório prévio devido a descompasso em base fria da Receita.",
    tag: "Social",
    context: "Caso fictício para discussão acadêmica. Família composta por mãe solo e três filhos menores teve o benefício do Cadastro Único (Bolsa Família) subitamente cancelado por uma suposta inconsistência cadastral. O algoritmo cruzou a declaração da Receita Federal com bases da RAIS e detectou uma variação nominal temporária decorrente de divórcio, bloqueando o sustento sem direito a manifestação prévia.",
    dados: [
      { campo: "Cadastro Único", fonte: "MDS (CadÚnico)", status: "ok", statusLabel: "Verificado" },
      { campo: "Relação Nominal de CPF", fonte: "Receita Federal", status: "bad", statusLabel: "Conflito de Divórcio" },
      { campo: "Renda Declarada", fonte: "RAIS / eSocial", status: "ok", statusLabel: "Zero" },
      { campo: "Vínculo de Emprego", fonte: "CNIS", status: "ok", statusLabel: "Sem Registro Ativo" }
    ],
    vieses: [
      { label: "Mães solteiras divorciadas", valor: 84, nivel: "high" },
      { label: "Renda informal", valor: 75, nivel: "high" },
      { label: "Variação grafonímica", valor: 68, nivel: "high" }
    ],
    personas: {
      defensoria: "Na hipótese didática, bloquear o benefício alimentar por divergência nominal sem permitir esclarecimento pode comprometer a defesa da família. A perspectiva de defesa de direitos propõe verificar a motivação, comunicar a divergência e oferecer oportunidade de manifestação conforme o procedimento aplicável. A análise não estabelece proibição geral de automação nem resultado jurídico automático.",
      cientista: "O caso expõe a falácia metodológica do cruzamento frio de bases incompatíveis. A base da Receita Federal possui ritmo de atualização distinto da base do CadÚnico. Um desalinhamento no nome de casada/solteira após divórcio foi lido pelo algoritmo como uma fraude potencial ou omissão de dados. Trata-se de um 'overfitting' interpretativo, punindo a vítima por inconsistências sistêmicas do próprio Estado.",
      admin: "A gestão deve considerar se o bloqueio automático pode aumentar recursos e demandas judiciais. O seminário chama esse risco de litigância reversa: uma economia na triagem inicial pode transferir custos para outras instituições. O protótipo não mede esse efeito nem demonstra aumento exponencial de contestações.",
      cidadao: "No cenário, o aviso de inconsistência cadastral não esclarece qual informação precisa ser corrigida. A perspectiva cidadã propõe linguagem compreensível, indicação dos passos de contestação e atendimento acessível. Essa solução é um argumento autoral do exercício; não reproduz uma conclusão empírica dos textos do seminário.",
    },
    rankings: [
      { pos: 1, name: "Dr. Lucas Mendes (Defensoria)", score: "1.25", votes: 4, comment: "Foco humanitário e constitucional insuperável." },
      { pos: 2, name: "Sr. Arnaldo Rocha (Cidadão)", score: "1.80", votes: 4, comment: "Pôs o dedo na ferida da exclusão digital extrema das mães de periferia." },
      { pos: 3, name: "Profª Clara Santos (Dados)", score: "2.90", votes: 4, comment: "Análise crucial do delay e dessincronização de bancos de dados estatais." },
      { pos: 4, name: "Dr. Ricardo Hahn (Gestão)", score: "3.95", votes: 4, comment: "Identificou no avesso a ineficiência do corte automático 'grosso'." }
    ],
    final: {
      sintese: "Bloqueio automático de transferência de renda constitucionalmente informada, motivado por divergência grafonímica pós-divórcio apurada em cruzamento automatizado frio de bases governamentais.",
      consenso: "Convergência no exercício: uma divergência de sobrenome não demonstra, por si só, fraude. As personas propõem verificar os registros, explicar os critérios e oferecer oportunidade de esclarecimento e revisão, observadas as regras do benefício.",
      dissenso: "Incongruência pontual sobre a responsabilização individual: o conselheiro de gestão pondera que o cidadão também deve buscar manter cadastros uniformes, o que é rejeitado energicamente pela cidadania que acusa a desconexão estrutural das agências brasileiras de registro.",
      fundamentacao: "Hipótese acadêmica: discutir a dignidade humana (CF, art. 1º, III), a proteção social e as garantias de defesa (art. 5º, LIV e LV) diante de divergências cadastrais. Quando a decisão se baseia unicamente em tratamento automatizado de dados pessoais e afeta interesses, o art. 20 da LGPD prevê solicitar revisão e seu §1º prevê informação sobre critérios e procedimentos, respeitados segredos comercial e industrial. A validade do cancelamento e o direito ao restabelecimento dependem das regras e dos fatos do caso concreto; não são demonstrados por esta simulação.",
      recomendacao: "Propostas para o cenário fictício:\n1. Verificar a divergência cadastral e informar os motivos da decisão;\n2. Permitir apresentação de documentos e pedido de revisão conforme o procedimento aplicável;\n3. Oferecer apoio acessível, inclusive presencial, sem prometer concessão ou pagamento automático.",
      alerta: "Cruzar bases de dados da União sem chaves unificadas robustas agrava a exclusão de famílias matrifocais, onde os cartórios de registro civil falham sistematicamente em propagar averbações.",
      minutaRecurso: "MODELO DIDÁTICO — CASO FICTÍCIO\nPEDIDO DE REVISÃO DE CANCELAMENTO DE BENEFÍCIO\n\nÀ autoridade administrativa competente\n\nO exemplo pressupõe uma divergência de sobrenome entre cadastros. Solicita-se informação sobre o motivo do cancelamento, oportunidade de apresentar documentos, correção de dados inexatos e revisão da decisão conforme o procedimento aplicável. Eventual restabelecimento e efeitos financeiros dependem da análise do caso.\n\nO texto exige adaptação aos fatos, às regras e aos prazos de um procedimento real.",
      pedidoLAI: "MODELO DIDÁTICO — CASO FICTÍCIO; requer adaptação jurídica e não garante resultado.\n\nSERVIÇO DE INFORMAÇÃO AO CIDADÃO (LAI)\n\nAO: Ministério do Desenvolvimento Social / Gestão do Cadastro Único\n\nAssunto: Pedido de acesso a histórico e critérios do cruzamento de dados eSocial/Receita Federal\n\nCom fulcro na Lei de Acesso à Informação, requisita-se detalhamento técnico sob pena de descumprimento do artigo 20 da LGPD:\n\n1. Qual especificação técnica determina a divergência cadastral como trigger definitivo de corte em lote sem necessidade de análise manual.\n2. Estatísticas semestrais de benefícios cancelados cumulados com divórcios ou alterações de nome civil na base do CadÚnico."
    }
  },
  {
    id: "iptu_triplicado",
    title: "IPTU SP — Reclassificação Territorial Automatizada",
    desc: "Valor do IPTU triplicado (+200%) no cenário fictício por associação entre endereço de MEI e uso do imóvel.",
    tag: "Tributário",
    context: "Caso fictício para discussão acadêmica. Um contribuinte de classe média-baixa em bairro periférico teve o IPTU de sua residência triplicado após um algoritmo municipal reclassificar o uso de seu imóvel de 'residencial' para 'misto (comercial)'. O sistema cruzou dados de registro de Microempreendedor Individual (MEI) e matrículas escolares para inferir a existência de atividade comercial no endereço, sem qualquer vistoria presencial ou notificação fiscal prévia.",
    dados: [
      { campo: "Inscrição de Matrícula de IPTU", fonte: "Cadastro Imobiliário Municipal", status: "ok", statusLabel: "Residencial" },
      { campo: "Endereço Fiscal de MEI", fonte: "Receita Federal (CNPJ Cadastro)", status: "warn", statusLabel: "MEI no Mesmo Imóvel" },
      { campo: "Censo de Matrículas Escolares", fonte: "Secretaria de Educação", status: "ok", statusLabel: "Uso Familiar" },
      { campo: "Vistoria Fiscal Presencial", fonte: "Secretaria de Finanças", status: "bad", statusLabel: "Inexistente" }
    ],
    vieses: [
      { label: "Bairros de uso misto periférico", valor: 78, nivel: "high" },
      { label: "Uso residencial-comercial informal", valor: 85, nivel: "high" },
      { label: "Auto-emprego informal", valor: 62, nivel: "med" }
    ],
    personas: {
      defensoria: "No cenário fictício, a reclassificação baseada apenas no endereço de MEI suscita dúvidas sobre a prova do uso do imóvel e a motivação do lançamento. É necessário examinar a legislação municipal, o procedimento tributário, a notificação e as possibilidades de impugnação. Não se pode concluir que todo lançamento exige vistoria presencial ou contraditório anterior à sua constituição.",
      cientista: "Eis o caso de falácia de correlação vs causalidade. Ter o endereço residencial catalogado como o domicílio legal de um microempreendedor individual de serviços digitais ou de costura não significa que a estrutura física do prédio tenha sofrido alteração de destinação urbanística ou uso comercial. O algoritmo do município realizou inferências frias em dados inconclusivos para imputar ilegalmente obrigações fiscais exorbitantes.",
      admin: "A atualização cadastral pode apoiar a gestão tributária, mas inferências mal fundamentadas podem gerar contestações, custos e perda de confiança. O exercício propõe avaliar qualidade da prova e canais de impugnação; não mede despesas nem demonstra que a automação tenha anulado a eficiência administrativa.",
      cidadao: "O contribuinte periférico abre seu aplicativo fiscal e recebe o carnê três vezes mais caro sob a chancela 'Reclassificação por Robô'. Sequer se publicou em linguajar cidadão os parâmetros de peso dessa modificação unilateral. O direito à notícia inteligível e humana do ato administrativo de aumento tributário foi ceifado por trás de uma máquina arrecadatória inacessível e muda do município, gerando angústia de despejo fiscal.",
    },
    rankings: [
      { pos: 1, name: "Dr. Lucas Mendes (Defensoria)", score: "1.40", votes: 4, comment: "Excelente arrazoado sobre estrita legalidade e devido rito de lançamento fiscal." },
      { pos: 2, name: "Dr. Ricardo Hahn (Gestão)", score: "2.10", votes: 4, comment: "Ponto chave ao mostrar o desperdício em contestação administrativa para o fisco." },
      { pos: 3, name: "Profª Clara Santos (Dados)", score: "2.85", votes: 4, comment: "Precisão na demolição das falsas inferências de MEIs como endereços de comércio ativo." },
      { pos: 4, name: "Sr. Arnaldo Rocha (Cidadão)", score: "3.65", votes: 4, comment: "Bons insights sobre desumanização do IPTU em áreas comunitárias mista." }
    ],
    final: {
      sintese: "Lançamento de IPTU suplementar com reclassificação de uso residencial para comercial, fundamentado apenas em monitoramento estatístico cruzado de MEIs virtuais.",
      consenso: "Convergência didática: o endereço fiscal de um MEI, isoladamente, pode ser insuficiente para demonstrar alteração do uso do imóvel. A conclusão sobre o lançamento exige verificar provas, regras municipais e procedimento de impugnação.",
      dissenso: "A perspectiva de gestão valoriza a atualização célere do cadastro; a defesa de direitos enfatiza suficiência da prova e possibilidade de contestação. As personas divergem sobre o desenho do controle, sem emitir decisão jurídica real.",
      fundamentacao: "Hipótese acadêmica: examinar legalidade tributária, motivação do lançamento e garantias de defesa à luz da Constituição e da legislação tributária e municipal aplicável. Reclassificação cadastral não se confunde automaticamente com criação ou aumento de tributo, nem demonstra violação de anterioridade. A ausência de vistoria presencial não prova, por si só, nulidade. Quando aplicável, a LGPD, art. 20, permite solicitar revisão de decisão tomada unicamente com base em tratamento automatizado de dados pessoais; não exige expressamente revisão por pessoa natural.",
      recomendacao: "Propostas para o cenário fictício:\n1. Solicitar motivação, memória do lançamento e informação sobre critérios de reclassificação;\n2. Apresentar provas sobre o uso do imóvel e impugnar no procedimento municipal aplicável;\n3. Investigar a pertinência do endereço de MEI como indicador. O exercício não atesta nulidade nem fixa obrigação geral de vistoria presencial.",
      alerta: "A reclassificação apoiada em uma associação indireta pode gerar erro. É preciso distinguir alteração cadastral, lançamento e mudança legislativa, examinando cada regime jurídico.",
      minutaRecurso: "MODELO DIDÁTICO — CASO FICTÍCIO\nIMPUGNAÇÃO DE LANÇAMENTO DE IPTU\n\nÀ autoridade tributária municipal competente\n\nO exemplo pressupõe uso residencial do imóvel e reclassificação baseada no endereço de MEI. Solicita-se acesso à motivação e à memória do lançamento, exame das provas sobre o uso do imóvel e revisão conforme a legislação e o procedimento municipal aplicável. A necessidade de vistoria e os efeitos da impugnação dependem das regras e dos fatos.\n\nO texto exige adaptação aos documentos, à competência e aos prazos do caso concreto.",
      pedidoLAI: "MODELO DIDÁTICO — CASO FICTÍCIO; requer adaptação jurídica e não garante resultado.\n\nPEDIDO DE TRANSPARÊNCIA FISCAL (LAI)\n\nAO: CONTROLADORIA GERAL DO MUNICÍPIO e SECRETARIA DE FINANÇAS\n\nAssunto: Solicitação de relatórios sobre regras de reclassificação automática de IPTU por algoritmos de inteligência espacial\n\nNos termos da Lei 12.527/11, demanda-se a disponibilização de:\n\n1. Memória técnica do sistema de inteligência municipal que induz a reclassificação de imóveis residenciais baseada em MEIs e e-commerce.\n2. Relatório de margem de acerto e taxa de correlação em bairros periféricos vs bairros nobres territoriais."
    }
  },
  {
    id: "auxilio_negado",
    title: "Auxílio Emergencial — Negado por Registro Fantasma",
    desc: "Benefício indeferido de forma automatizada devido a dados de baixa qualidade do CNIS.",
    tag: "Social",
    context: "Caso fictício para discussão acadêmica. Um trabalhador informal em situação de extrema vulnerabilidade teve seu auxílio governamental de subsistência negado sob o escopo automatizado de possuir 'Vínculo Empregatício Ativo'. Trata-se, contudo, de um registro de emprego do passado que não foi devidamente baixado pelo empregador original no banco de dados do CNIS, gerando uma barreira digital incontornável.",
    dados: [
      { campo: "Status CadÚnico", fonte: "Cadastro Único do Governo Federal", status: "ok", statusLabel: "Elegível" },
      { campo: "Relação de Carteira Assinada", fonte: "CNIS (cruzamento do Dataprev)", status: "bad", statusLabel: "Registro Fantasma Ativo (2012)" },
      { campo: "Cruzamento Informatizado de CNPJ", fonte: "Dataprev", status: "warn", statusLabel: "Fuzzy Match de Homonímia" },
      { campo: "Canais Físicos de Apelação", fonte: "Ausentes no Aplicativo", status: "bad", statusLabel: "Bloqueio Total" }
    ],
    vieses: [
      { label: "Informalidade crônica de periferia", valor: 88, nivel: "high" },
      { label: "Trabalhadores em transição de emprego", valor: 72, nivel: "high" },
      { label: "Problemas de homonímia brasileira", valor: 58, nivel: "med" }
    ],
    personas: {
      defensoria: "O direito fundamental ao sustento (Art. 6º, CF/88) foi abruptamente retirado do cidadão a partir de dados reconhecidamente falhos sem direito a contraditório administrativo ou revisão humana. O indeferimento automatizado baseia-se em um 'estado de coisas ilegal' onde o Estado opera bancos de dados cronicamente desatualizados (CNIS) e os impõe de forma absoluta contra a pessoa, gerando miséria em lote e violência sistêmica.",
      cientista: "O cenário pressupõe um registro trabalhista desatualizado no CNIS. Usá-lo como referência inflexível pode produzir um falso positivo. A análise técnica deveria investigar origem, data de atualização, identificação e meios de correção; este protótipo não apresenta auditoria real do CNIS nem quantifica registros com erro.",
      admin: "Prender a pessoa a uma resposta sem explicação pode ampliar contestações. O exercício propõe comparar o custo de atendimento e revisão com o de recursos posteriores. Não há medição aqui que permita afirmar que um custo supera o outro.",
      cidadao: "O aplicativo indicava uma resposta insensível e genérica: 'Auxílio Negado - Possui Vínculo Empregatício'. O cidadão sequer dispunha de canais para carregar uma carteira de trabalho física para provar o desemprego perpétuo. Sem letramento e acesso adequado, a exclusão processual é plena. O Estado nega comida ao faminto através de uma mensagem de erro na tela de um celular desprovido de rede.",
    },
    rankings: [
      { pos: 1, name: "Dr. Lucas Mendes (Defensoria)", score: "1.15", votes: 4, comment: "Focou lucidamente no drama alimentar e na inversão do ônus da prova de desemprego." },
      { pos: 2, name: "Profª Clara Santos (Dados)", score: "2.15", votes: 4, comment: "Discussão didática sobre qualidade, atualização e contestação dos registros do CNIS." },
      { pos: 3, name: "Sr. Arnaldo Rocha (Cidadão)", score: "2.55", votes: 4, comment: "Descreveu perfeitamente a barreira intransponível do Meu INSS para os informais." },
      { pos: 4, name: "Dr. Ricardo Hahn (Gestão)", score: "3.95", votes: 4, comment: "Denunciou a paralisia e o estouro do contencioso judicial de assistência." }
    ],
    final: {
      sintese: "Negativa e bloqueio automático de benefício fundamental emergencial decorrente de incoerência na base de dados de vínculos trabalhistas ativos no CNIS (registro fantasma).",
      consenso: "Convergência integral sobre a ilegalidade de manter filtros automáticos de corte que empreguem bases reconhecidamente desatualizadas. O ônus de provar a inexistência de vínculo fantasma (fato negativo) não pode recair sobre o trabalhador informal desprovido de auxílio técnico.",
      dissenso: "Debate focado na responsabilização do empregador que não informou a baixa: o orientador em gestão aponta que o fisco depende das declarações privadas, enquanto a ciência de dados e a defensoria rebatem que o cidadão não pode sofrer a punição por omissões de terceiros na burocracia patronal.",
      fundamentacao: "Hipótese acadêmica: discutir proteção social, boa-fé e garantias de defesa diante de um registro supostamente desatualizado. Na LGPD, qualidade dos dados está no art. 6º, V; correção de dados incompletos, inexatos ou desatualizados está no art. 18, III. Quando aplicável, o art. 20 prevê solicitar revisão de decisões baseadas unicamente em tratamento automatizado de dados pessoais, sem exigir expressamente pessoa natural. A elegibilidade ao benefício e a suficiência das provas dependem da legislação vigente no período e do caso concreto.",
      recomendacao: "Propostas para o cenário fictício:\n1. Conferir origem e atualização do registro de emprego;\n2. Facilitar apresentação de provas e pedido de correção dos dados;\n3. Oferecer canal acessível de contestação. A revisão não pressupõe concessão automática do auxílio ou baixa indiscriminada de vínculos.",
      alerta: "Sistemas federais que gerenciam a fome não podem automatizar cortes baseados no CNIS sem previsão de rito simplificado de refutação.",
      minutaRecurso: "MODELO DIDÁTICO — CASO FICTÍCIO\nPEDIDO DE CORREÇÃO DE DADOS E REVISÃO DE INDEFERIMENTO\n\nÀ autoridade administrativa competente\n\nO exemplo pressupõe que um vínculo trabalhista sem baixa não corresponda à situação atual da pessoa. Solicita-se exame dos documentos, esclarecimento da origem do registro, correção dos dados inexatos e revisão da decisão, conforme as normas aplicáveis ao benefício e ao período. A LGPD prevê correção no art. 18, III, e solicitação de revisão no art. 20, quando aplicável.\n\nEste texto não prova elegibilidade nem garante concessão do auxílio.",
      pedidoLAI: "MODELO DIDÁTICO — CASO FICTÍCIO; requer adaptação jurídica e não garante resultado.\n\nREQUERIMENTO DE RETIFICAÇÃO DE REGISTRO E DADOS PESSOAIS\n\nAO: GERENTE EXECUTIVO DO INSS / MINISTÉRIO DO TRABALHO E EMPREGO\n\nAssunto: Pedido de retificação e baixa em banco de dados do CNIS / Dataprev - Artigo 18 e 19 da LGPD\n\nCom fulcro nos direitos do titular previstos na Lei Geral de Proteção de Dados (Lei 13.709/18), solicita-se a retificação e correção imediata com baixa do registro de trabalho cadastrado incorretamente com status ativo, anexando-se cópia em imagem da carteira de trabalho física do cidadão."
    }
  },
  {
    id: "reconhecimento_facial",
    title: "Segurança Pública — Falso Positivo em Reconhecimento Facial (caso fictício)",
    desc: "Cenário fictício de abordagem indevida após alerta de reconhecimento facial, para discutir erro e possível discriminação.",
    tag: "Segurança",
    context: "Caso fictício para discussão acadêmica. Um jovem trabalhador negro é abordado após alerta de similaridade facial com outra pessoa. A conferência de identidade não confirma o mandado indicado. O cenário permite discutir falsos positivos, possível discriminação e requisitos legais da atuação policial; não identifica um episódio real nem comprova a causa técnica da falha.",
    dados: [
      { campo: "Alerta de Semelhança Facial", fonte: "Câmera de Monitoramento Público (IA Privada)", status: "bad", statusLabel: "Match Forçado (90%)" },
      { campo: "Cadastro Biométrico Estadual", fonte: "Instituto de Identificação (SSP-BA)", status: "warn", statusLabel: "Qualidade de Imagem Baixa" },
      { campo: "Verificação de Prontuário de Mandado", fonte: "BNMP / CNJ (Base de Mandados)", status: "ok", statusLabel: "Sem Registro Válido" },
      { campo: "Saneamento Prévio de Identidade", fonte: "Delegacia de Polícia", status: "bad", statusLabel: "Ignorado na Abordagem" }
    ],
    vieses: [
      { label: "Viés fenotípico (pessoas negras)", valor: 94, nivel: "high" },
      { label: "Vulnerabilidade em locais públicos", valor: 85, nivel: "high" },
      { label: "Margem de erro tolerada na IA", valor: 75, nivel: "high" }
    ],
    personas: {
      defensoria: "A perspectiva de defesa de direitos questiona a restrição de liberdade fundada apenas no alerta de similaridade do cenário. Propõe verificar identidade, fundamentos legais e evidências independentes antes de atribuir consequências ao alerta, observando as garantias constitucionais aplicáveis. O exercício não atribui essa análise de reconhecimento facial às obras gerais de direito administrativo do seminário.",
      cientista: "O cenário propõe investigar um falso positivo e a possibilidade de discriminação racial. Para explicar a falha, seria preciso examinar imagens, limiar de alerta, representatividade dos dados e desempenho por grupo. Não é possível atribuir o erro a uma arquitetura, a um gradiente ou a uma base estrangeira sem evidências técnicas.",
      admin: "Alertas incorretos podem desviar recursos policiais e expor pessoas a danos, além de gerar riscos de responsabilização. A comparação entre custos de prevenção e reparação é uma questão de governança; este protótipo não mede custos de prevenção ou reparação.",
      cidadao: "A perspectiva cidadã do exercício destaca o constrangimento da abordagem fictícia e a dificuldade de contestar uma inferência apresentada como certeza. Propõe comunicar os fundamentos de forma compreensível e permitir esclarecimentos, sem tratar um alerta técnico como prova definitiva de identidade. Trata-se de uma proposta autoral aplicada ao cenário.",
    },
    rankings: [
      { pos: 1, name: "Dr. Lucas Mendes (Defensoria)", score: "1.08", votes: 4, comment: "Focou irrespondivelmente na violação da liberdade corporal e no devido processo penal." },
      { pos: 2, name: "Profª Clara Santos (Dados)", score: "2.12", votes: 4, comment: "Excelente arrazoado sobre viés algorítmico e sub-representação demográfica." },
      { pos: 3, name: "Sr. Arnaldo Rocha (Cidadão)", score: "2.65", votes: 4, comment: "Tratou com brilhantismo a desumanização e humilhação social da abordagem." },
      { pos: 4, name: "Dr. Ricardo Hahn (Gestão)", score: "3.90", votes: 4, comment: "Expôs o prejuízo pecuniário e o desperdício preventivo do erário com indenizações." }
    ],
    final: {
      sintese: "Restrição indevida do direito de ir e vir decorrente de cruzamento biométrico equivocado gerado por algoritmo de inteligência de videomonitoramento sem controle prévio de homônimos.",
      consenso: "Convergência integral de que: 1) Alarmes de similaridade facial de IA não produzem presunção fundada de culpa para busca policial; 2) Limiares matemáticos configurados por entes privados para monitoramento de segurança pública ferem a reserva jurídica de soberania; 3) O cidadão tem direito à retratação humana digna imediata.",
      dissenso: "Dissenso procedimental: o orientador em gestão julga que a câmera é insubstituível para localização de foragidos de extrema gravidade, embora reconheça de pronto que no presente caso a ausência do devido processo e a falha de triagem fulminaram o ato administrativo criminal.",
      fundamentacao: "Hipótese acadêmica: examinar dignidade, liberdade de locomoção, presunção de inocência e requisitos de privação de liberdade (CF, arts. 1º, III, e 5º, XV, LVII e LXI). Um alerta de similaridade não substitui a verificação de identidade e dos fundamentos legais da atuação policial. A LGPD, art. 4º, III, exclui de seu âmbito tratamento realizado exclusivamente para segurança pública e investigação ou repressão penal; o §1º prevê legislação específica com garantias de proporcionalidade e devido processo. Por isso, não se aplica automaticamente o art. 20 a este cenário. Regras do CNJ para o Judiciário também não são automaticamente regras de contratação policial.",
      recomendacao: "Propostas para o cenário fictício:\n1. Conferir identidade e fundamentos da abordagem por meios independentes do alerta;\n2. Investigar falsos positivos, desempenho por grupos e possíveis danos;\n3. Definir critérios de uso e validação com evidências. Um limiar isolado não garante legalidade ou precisão.",
      alerta: "Softwares de policiamento preditivo e repressão biométrica adquiridos sem homologação e auditoria prévia de impacto aos direitos fundamentais reproduzem a herança do racismo estrutural computorizado.",
      minutaRecurso: "MODELO DIDÁTICO — CASO FICTÍCIO; requer adaptação jurídica e não garante resultado.\n\nREQUERIMENTO DE RETRATAÇÃO E CANCELAMENTO DE ATALHO DE OCORRÊNCIA\n\nAO: CORREGEDOR-GERAL DA POLÍCIA MILITAR E COMANDO DE OPERAÇÕES METROPOLITANAS\n\nAssunto: Impugnação de Abordagem Policial e Autuação decorrente de Alerta Falso Positivo de Reconhecimento Facial\n\n1. DO ERRO DO ALGORITMO INTEGRADO DE SEGURANÇA\nO requerente restou indevidamente detido e sofrendo cerceamento do livre trânsito nas dependências do metrô por erro estatístico decorrente de semelhança biométrica de rosto captada em câmera municipal com mandado em aberto em nome de terceiro.\n\n2. DA RESPONSABILIDADE CIVIL E RETIRADA DE REGISTRO\nRequer-se a declaração imediata da inocência da conduta e exclusão do prontuário, com a anulação de eventuais relatórios digitais que imputem suspeição futura.\n\n3. DO PEDIDO\nAcolhimento para anular os efeitos do ato arbitrário assistido tecnologicamente.",
      pedidoLAI: "MODELO DIDÁTICO — CASO FICTÍCIO\nPEDIDO DE INFORMAÇÕES SOBRE RECONHECIMENTO FACIAL\n\nÀ Secretaria de Segurança Pública competente\n\nCom fundamento na LAI, solicitar informações públicas sobre finalidade, regras de validação dos alertas, avaliação de desempenho e controles contra discriminação, observadas as hipóteses legais de sigilo e proteção de dados.\n\nO art. 20 da LGPD não deve ser invocado automaticamente: o art. 4º, III, prevê exceções para tratamento realizado exclusivamente em segurança pública e investigação ou repressão penal. O enquadramento exige análise do tratamento concreto."
    }
  },
  {
    id: "pente_fino_bpc",
    title: "Pente-Fino em Lote do INSS — Suspensão de BPC sem Perícia",
    desc: "Corte automático de Benefício de Prestação Continuada (LOAS) de deficiente físico fundamentado em cruzamento de bases cadastrais frias.",
    tag: "Previdenciário",
    context: "Caso fictício para discussão acadêmica. Uma cidadã cadeirante de baixa renda teve o pagamento de seu Benefício de Prestação Continuada (BPC/LOAS) sumariamente cortado por um algoritmo do INSS que realizou análise de cruzamento em lote. O eSocial indicou que sua filha, habitante de uma moradia de quintal de fundos do terreno, obteve emprego temporário. O algoritmo procedeu ao cálculo de renda per capita em lote de forma seca, presumindo renda familiar unificada contra o cadastro de coabitação informal, cancelando o mantimento físico sem perícia social.",
    dados: [
      { campo: "Informação Tributária eSocial", fonte: "Ministério do Trabalho (eSocial)", status: "ok", statusLabel: "Renda Apurada de Terceiro" },
      { campo: "Localização Domiciliar de Terreno", fonte: "Geolocalização / Cadastro Único", status: "warn", statusLabel: "Coabitação Presumida" },
      { campo: "Histórico de Assistência e Saúde", fonte: "Perícias Médicas do INSS", status: "ok", statusLabel: "Deficiência Confirmada" },
      { campo: "Avaliação Social Humanizada", fonte: "Serviço Social do Município", status: "bad", statusLabel: "Sumariamente Omitida" }
    ],
    vieses: [
      { label: "Moradias complexas de fundo / cortiços", valor: 89, nivel: "high" },
      { label: "Agregados familiares vulneráveis", valor: 78, nivel: "high" },
      { label: "Necessidades materiais especiais", valor: 75, nivel: "high" }
    ],
    personas: {
      defensoria: "Na hipótese, a suspensão de um benefício assistencial exige examinar os dados, a motivação e as oportunidades de manifestação previstas no procedimento aplicável. A perspectiva de defesa de direitos propõe considerar as condições materiais da pessoa e assegurar contestação acessível. Não atribui às obras do seminário um estudo do sistema de BPC ou uma conclusão automática sobre o caso.",
      cientista: "O exercício apresenta uma inferência hipotética de renda compartilhada pela proximidade territorial. A perspectiva técnica propõe examinar se a regra representa adequadamente moradias e economias independentes, com verificação dos dados e possibilidade de correção. Não é um resultado empírico de Salgado e Saito nem uma descrição comprovada do sistema de BPC.",
      admin: "A suspensão em lote pode aumentar recursos administrativos, demandas judiciais e riscos de responsabilização. A perspectiva de gestão propõe avaliar esse efeito e a qualidade da triagem. O protótipo não apresenta estudo de custos que comprove economia ou prejuízo ao erário.",
      cidadao: "No cenário fictício, o aviso de renda acima do limite não esclarece a associação de moradores utilizada. A perspectiva cidadã propõe informar quais dados levaram à suspensão, oferecer canal acessível para correção e considerar as necessidades da pessoa com deficiência. Notícia humana é uma proposta do exercício, sem atribuição de descoberta ou formulação literal a outra obra.",
    },
    rankings: [
      { pos: 1, name: "Dr. Lucas Mendes (Defensoria)", score: "1.20", votes: 4, comment: "Excelente defesa da irreversibilidade alimentar do benefício de amparo social." },
      { pos: 2, name: "Sr. Arnaldo Rocha (Cidadão)", score: "1.92", votes: 4, comment: "Focou impecavelmente no desespero físico e na barreira de locomoção do cadeirante." },
      { pos: 3, name: "Profª Clara Santos (Dados)", score: "2.68", votes: 4, comment: "Perfeita refutação científica das premissas espaciais de moradia unificada." },
      { pos: 4, name: "Dr. Ricardo Hahn (Gestão)", score: "3.95", votes: 4, comment: "Mostrou com clareza o estoiro de custos operacionais com mandados de segurança." }
    ],
    final: {
      sintese: "Suspensão de benefício assistencial BPC motivada por inferência unilateral de renda familiar, suprimindo o rito do contraditório processual e laudo social biopsicossocial.",
      consenso: "Convergência integral estabelecida pelo tribunal de que: 1) O auxílio do BPC constitui mínimo de dignidade e não sofre cortes automáticos por cruzamento cego de bases cadastrais; 2) Núcleos habitacionais de fundo de terreno não presumem contabilidade unificada; 3) A perícia socioassistencial humana é etapa insubstituível do ato legal.",
      dissenso: "Incongruência mínima sobre as exigências de contrapartidas cadastrais do beneficiário, minorada pelo reconhecimento de todos de que a falência no fluxo de triagem e a falta de rito prévio inquinam o ato de impermanência constitucional.",
      fundamentacao: "Hipótese acadêmica: discutir a proteção assistencial da pessoa com deficiência (CF, art. 203, V) e o devido processo e a defesa (art. 5º, LIV e LV). A elegibilidade ao BPC depende da legislação assistencial e da avaliação dos fatos; a coabitação, a renda e a composição familiar não são resolvidas por este exemplo. Quando aplicável, o art. 20 da LGPD prevê solicitar revisão de decisões baseadas unicamente em tratamento automatizado de dados pessoais, sem exigir expressamente pessoa natural. A intervenção humana é a salvaguarda defendida pelo seminário.",
      recomendacao: "Propostas para o cenário fictício:\n1. Informar as razões da suspensão e os dados utilizados;\n2. Permitir esclarecimento da composição familiar e da renda, com avaliação adequada e canais acessíveis;\n3. Reexaminar a decisão conforme o procedimento aplicável. Este exercício não determina prazo, multa, crime de desobediência ou restabelecimento automático do benefício.",
      alerta: "Sistemas federais de controle previdenciário que automatizam o cancelamento de direitos fundamentais sem callback de revisão humana institucionalizam a exclusão civil dos hipossuficientes.",
      minutaRecurso: "MODELO DIDÁTICO — CASO FICTÍCIO\nPEDIDO DE REVISÃO DE SUSPENSÃO DE BPC\n\nÀ autoridade administrativa competente\n\nO exemplo pressupõe divergência sobre composição familiar e renda. Solicita-se informação sobre a motivação, oportunidade de apresentar provas e reexame da situação conforme a legislação assistencial e o procedimento aplicável. A necessidade de avaliação social e os efeitos de eventual revisão devem ser examinados no caso concreto.\n\nEste texto não substitui a avaliação de elegibilidade nem garante restabelecimento.",
      pedidoLAI: "MODELO DIDÁTICO — CASO FICTÍCIO; requer adaptação jurídica e não garante resultado.\n\nPEDIDO DE EXPLICABILIDADE DE PENTE-FINO PREVIDENCIÁRIO (LAI)\n\nAO: CONTROLADORIA DO INSS / MINISTÉRIO DA PREVIDÊNCIA\n\nRequer-se a divulgação das seguintes informações sob amparo da Lei 12.527/11 e Artigo 20 da LGPD:\n\n1. Relação completa de chaves e variáveis territoriais de localização geocodificada integradas no sistema automatizado de pente-fino.\n2. Estatísticas nacionais de benefícios assistenciais restabelecidos judicialmente após suspensão por cruzamento de CNIS e eSocial."
    }
  }
];
