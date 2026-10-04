/* Original static teaching exercise. No model calls, input collection or persistence. */
(() => {
  'use strict';
  const demo = document.querySelector('.work-demo');
  const caseSelect = document.querySelector('#case-select');
  const tabs = Array.from(document.querySelectorAll('[data-phase]'));
  const phases = [1, 2, 3].map(number => document.querySelector(`#phase-${number}`));
  const voiceTexts = Array.from(document.querySelectorAll('#voices article p'));
  const reviewTexts = Array.from(document.querySelectorAll('#reviews dd'));
  const synthesisParagraphs = Array.from(document.querySelectorAll('#synthesis p'));
  const synthesisSteps = Array.from(document.querySelectorAll('#synthesis li'));
  const title = document.querySelector('#case-title');
  const description = document.querySelector('#case-description');
  const question = document.querySelector('#case-question');
  const previous = document.querySelector('#previous-phase');
  const next = document.querySelector('#next-phase');
  const status = document.querySelector('#demo-status');

  const examples = {
    rural: {
      title: title.textContent,
      description: description.textContent,
      question: question.textContent,
      voices: voiceTexts.map(element => element.textContent),
      reviews: reviewTexts.map(element => element.textContent),
      consensus: synthesisParagraphs[0].textContent,
      steps: synthesisSteps.map(element => element.textContent),
      dissent: synthesisParagraphs[1].textContent
    },
    cadastro: {
      title: 'Cadastro de renda divergente',
      description: 'Em um município fictício, um benefício social é suspenso após um cruzamento de cadastros. A notificação informa uma renda familiar acima do limite, mas não indica o período, a fonte ou os integrantes considerados. A família acredita que foi incluído um vínculo de trabalho já encerrado.',
      question: 'Como distinguir uma inconsistência de dados de uma conclusão sobre o direito ao benefício?',
      voices: [
        'A família precisa compreender a razão da suspensão e ter um caminho de contestação. No exercício, pede-se acesso aos registros que sustentam a decisão e à oportunidade de apresentar documentos. A suspeita de dado desatualizado não comprova o erro nem o direito ao benefício.',
        'É preciso saber quais bases foram cruzadas, quando foram atualizadas e como a renda foi calculada. Um vínculo antigo pode estar correto como registro histórico e incorreto para representar a renda atual. A investigação deve separar dado, período e regra de cálculo.',
        'A proposta de governança é permitir correção cadastral sem transferir à família a tarefa de resolver conflitos entre sistemas públicos. O responsável pela revisão deve poder rastrear a origem do dado e justificar a conclusão. O caso fictício não define o procedimento de um município real.',
        'A mensagem precisa mostrar o valor de renda considerado, o período e como conferir uma possível divergência. A família não deveria precisar dominar siglas de bancos de dados para compreender a suspensão. O projeto defende apoio humano e alternativa de atendimento acessível.'
      ],
      reviews: [
        'Delimita o direito de contestar. Deve evitar prometer restabelecimento imediato sem conhecer a regra do benefício e a prova disponível.',
        'Mostra que atualidade e finalidade do dado importam. Precisa explicar a investigação em linguagem que permita à família conferir as informações.',
        'Propõe rastreabilidade e responsabilidade. Ainda é necessário identificar quem pode corrigir cada registro e quem pode revisar a suspensão.',
        'Prioriza compreensão e acesso. A tradução da notificação só será útil se vier acompanhada de um canal que resolva a divergência.'
      ],
      consensus: 'As quatro leituras convergem na necessidade de conhecer a renda, o período e as fontes considerados. O exercício não estabelece se a suspensão foi correta: primeiro é preciso confrontar a fundamentação com os registros relevantes.',
      steps: [
        'Solicitar a memória de cálculo e a indicação dos registros usados na suspensão.',
        'Conferir períodos, composição familiar e atualidade dos dados, documentando possíveis divergências.',
        'Identificar os canais responsáveis pela correção e pela revisão, com apoio para compreender as respostas.'
      ],
      dissent: 'Há tensão entre responder rapidamente à suspensão e investigar os registros antes de recomendar uma medida. O projeto propõe comunicação e revisão com participação humana; os textos preparados não demonstram um resultado empírico nem antecipam a decisão administrativa.'
    },
    imovel: {
      title: 'Classificação de imóvel alterada',
      description: 'Uma pessoa recebe cobrança maior de tributo imobiliário em um município fictício. O portal passou a classificar o imóvel como de uso misto, mas não explica a alteração. A pessoa afirma que o imóvel continua exclusivamente residencial e não sabe se houve vistoria, cruzamento de dados ou regra automatizada.',
      question: 'O que fundamentou a nova classificação, e por qual caminho ela pode ser contestada?',
      voices: [
        'A cobrança precisa ser examinada a partir de sua fundamentação e das regras locais. O exercício propõe pedir a justificativa da reclassificação e verificar os meios de contestação. Não se pode concluir, apenas com esse relato fictício, que o valor é indevido.',
        'Não há evidência suficiente para atribuir a mudança a uma inteligência artificial. É necessário identificar os dados, a regra ou o modelo e a eventual participação humana. Uma classificação inferida a partir de imagens ou cadastros exige conferir sua correspondência com o uso efetivo.',
        'Uma alteração que afeta a cobrança deve ser rastreável: origem da informação, responsável e procedimento de revisão. O protótipo defende que a inovação técnica seja acompanhada de motivação verificável. A existência de um portal digital não valida o mérito da classificação.',
        'A pessoa precisa encontrar uma explicação direta sobre o que mudou e como apresentar informações contrárias. A interface deve evitar uma sequência de siglas e menus que esconda o responsável. O desenho do serviço precisa incluir quem não consegue navegar pelo portal.'
      ],
      reviews: [
        'Preserva a diferença entre contestar e obter razão no mérito. Deve identificar que a regra tributária concreta depende do município e não está definida no exercício.',
        'Não presume uma IA onde pode haver outra técnica. A revisão também deve conferir a categoria jurídica do imóvel, além da origem técnica do dado.',
        'Conecta a classificação à responsabilidade administrativa. Rastrear a alteração é necessário, mas não resolve sozinho a correção jurídica da cobrança.',
        'Expõe a dificuldade de acesso. Uma interface clara precisa conduzir a um procedimento efetivo de revisão, e não apenas oferecer uma explicação genérica.'
      ],
      consensus: 'A origem da alteração, a regra municipal aplicável e o caminho de revisão precisam ser identificados. O aumento da cobrança não demonstra, por si, uso de IA ou ilegalidade da classificação.',
      steps: [
        'Localizar a justificativa da alteração e a regra usada para classificar o imóvel.',
        'Verificar a origem, a data e a correspondência dos dados com o uso efetivo do imóvel.',
        'Identificar o responsável e o procedimento local para apresentar informações e pedir revisão.'
      ],
      dissent: 'O foco técnico na origem dos dados e o foco jurídico na categoria tributária são complementares, mas não equivalentes. O relator mantém ambas as questões abertas. Este roteiro didático não fixa prazos ou medidas para uma cobrança real.'
    }
  };

  const initialUrl = new URL(window.location.href);
  const requestedCase = initialUrl.searchParams.get('caso');
  const requestedPhase = Number(initialUrl.searchParams.get('fase'));
  let selectedCase = Object.hasOwn(examples, requestedCase) ? requestedCase : 'rural';
  let selectedPhase = [1, 2, 3].includes(requestedPhase) ? requestedPhase : 1;

  function updateUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('caso', selectedCase);
    url.searchParams.set('fase', String(selectedPhase));
    window.history.replaceState(null, '', url);
  }

  function announce() {
    status.textContent = `${examples[selectedCase].title}. Fase ${selectedPhase} de 3: ${tabs[selectedPhase - 1].textContent.trim()}. Textos preparados, sem geração por IA.`;
  }

  function displayCase() {
    const example = examples[selectedCase];
    caseSelect.value = selectedCase;
    title.textContent = example.title;
    description.textContent = example.description;
    question.textContent = example.question;
    voiceTexts.forEach((element, index) => { element.textContent = example.voices[index]; });
    reviewTexts.forEach((element, index) => { element.textContent = example.reviews[index]; });
    synthesisParagraphs[0].textContent = example.consensus;
    synthesisParagraphs[1].textContent = example.dissent;
    synthesisSteps.forEach((element, index) => { element.textContent = example.steps[index]; });
    document.querySelector('.work-key').open = false;
  }

  function displayPhase({ focus = false, syncUrl = true } = {}) {
    tabs.forEach((tab, index) => {
      const active = index + 1 === selectedPhase;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      phases[index].hidden = !active;
    });
    previous.disabled = selectedPhase === 1;
    next.disabled = selectedPhase === 3;
    document.querySelector('#phase-position').textContent = `Fase ${selectedPhase} de 3`;
    if (syncUrl) updateUrl();
    if (focus) tabs[selectedPhase - 1].focus();
    announce();
  }

  tabs.forEach((tab, index) => {
    phases[index].setAttribute('role', 'tabpanel');
    phases[index].setAttribute('aria-labelledby', tab.id);
    phases[index].tabIndex = 0;
    tab.addEventListener('click', () => {
      selectedPhase = index + 1;
      displayPhase();
    });
    tab.addEventListener('keydown', event => {
      const nextTab = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }[event.key];
      if (nextTab === undefined) return;
      event.preventDefault();
      selectedPhase = nextTab + 1;
      displayPhase({ focus: true });
    });
  });

  caseSelect.addEventListener('change', () => {
    selectedCase = caseSelect.value;
    displayCase();
    displayPhase();
  });
  previous.addEventListener('click', () => {
    selectedPhase = Math.max(1, selectedPhase - 1);
    displayPhase({ focus: true });
  });
  next.addEventListener('click', () => {
    selectedPhase = Math.min(3, selectedPhase + 1);
    displayPhase({ focus: true });
  });

  displayCase();
  displayPhase({ syncUrl: false });
  demo.dataset.enhanced = 'true';
  document.querySelector('.work-case-controls').hidden = false;
  document.querySelector('.work-tabs').hidden = false;
  document.querySelector('.work-step-navigation').hidden = false;
})();
