# Algoritmo em Disputa — integração editorial

## Fonte e autoria

- Fonte de pesquisa, somente leitura: `source-audit/algoritmo-em-disputa`.
- Repositório: https://github.com/anavvanzin/algoritmo-em-disputa
- Instantâneo inspecionado: `391a96d878e115d541e8e4199855de6da1acfb4a`.
- `README.md` credita expressamente Andrej Karpathy/llm-council como origem.
- `5b28199722f2e551699dcdede95c4e11ef934224`, de 24/05/2026, registra adaptação por `anavvanzin`: personas brasileiras, tradução, caso INSS, literacia algorítmica e notícia humana. O commit registra coautoria técnica de Claude Opus 4.7.
- `391a96d`, de 13/07/2026, começa port para Workers: `config.ts` e `openrouter.ts`, sem entrypoint de aplicação.
- A coapresentação do seminário tem autoria de Ana Vitória Vanzin e Vinícius Oliveira. Esta página não atribui o código desse fork a Vinícius nem transforma as três versões em adoções profissionais independentes.

## Licença e limites de redistribuição

Não há `LICENSE` no snapshot. O README diz que segue a licença do projeto de origem, mas não identifica uma licença concreta. A auditoria do projeto também não encontrou licença explícita no upstream; `license:null` na API GitHub e `ISC` no package local não resolvem a licença do código herdado. Não copiar nem relicenciar a aplicação original. Esta integração contém HTML/CSS/JavaScript e exemplos didáticos escritos de forma original para o site, com links e atribuição às fontes. Nenhum código de backend, frontend, prompts ou asset do fork foi redistribuído.

## Decisões de publicação

- `/algoritmo-em-disputa/` é página editorial original e demonstração estática.
- Fonte pública: `algoritmo-em-disputa/index.html`, `work.css`, `demo.js`.
- Não expor FastAPI: o snapshot lista e lê conversas sem autenticação ou segregação, salvando prompts e respostas em JSON.
- Não configurar chave, consultar OpenRouter, implementar modelo ao vivo ou introduzir custo de API.
- Não coletar texto livre, dados pessoais ou relatos. Três situações são explicitamente fictícias. Todos os pareceres e críticas são roteiros preparados para esta publicação, sem resultados empíricos ou transcrição de saída de modelo.
- Fase 2 ilustra crítica cruzada sem inventar ranking ou escore real. Rótulos A–D ocultam a identificação da perspectiva; isso não é anonimização de dados pessoais.
- A página diferencia este fork (quatro modelos + relator via OpenRouter) de `prot-tipo` (uma chamada Gemini simulando quatro vozes).
- O port Worker não é descrito como funcional.
- Repositórios de origem e manuscritos não foram editados.

## Checagem jurídica

Conferidas em 03/10/2026 as fontes oficiais:

- https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm — art. 20 vigente permite pedido de revisão de decisão exclusivamente automatizada que afeta interesses, sem exigir expressamente pessoa natural; § 1º informações de critérios/procedimentos; § 2º possível auditoria ANPD em caso de negativa de informação por segredo comercial/industrial.
- https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm — art. 6º atos processuais eletrônicos/parágrafo único (não há § 2º); art. 19 Base Nacional de Serviços Públicos.

A proposta de supervisão/participação humana é apresentada como argumento do projeto, sem alegar que esses dispositivos a estabelecem literalmente. Exemplos não afirmam regras específicas de benefício, INSS ou tributação municipal.

## Breve de design

Página de estudo de caso para leitores do portfólio acadêmico, em desktop e celular. Prioridades: reconhecer origem e adaptação; compreender o que cada implementação faz; percorrer três fases sem fornecer dados. Preservar paleta e famílias do redesign (`styles.css`: Playfair Display/DM Sans, papel/ink/sienna). Referência aplicada: `.agents/skills/ui-craft-editorial/SKILL.md`. A restrição dessa skill a DM Sans cede ao pedido de integrar o estilo vigente. Assinatura visual: percurso numerado em três fases e pareceres A–D. Sem animação ou nova biblioteca. Escopo não inclui redesign global, backend, adoção institucional, manuscritos ou demonstração com IA real.

## Comportamento e verificação

- HTML contém explicação, créditos, relações de versão e referências para indexação sem JavaScript; canonical e robots são explícitos.
- Sem JS, caso rural e três fases ficam visíveis; controles interativos ficam ocultos.
- Com JS, seletor de três casos, três tabs com setas/Home/End, botões anterior/próxima e status acessível. URL preserva caso/fase nos parâmetros `caso` e `fase`; leitura inicial validada, valores inválidos caem no padrão.
- Renderização usa `textContent`; não recebe HTML nem consulta serviços externos.
- CSS local utiliza os tokens atuais e `styles.css`, sem editar a folha global.
- README interno em `scripts/`, já excluído da publicação por `.assetsignore`.
- Pai é responsável por incorporar a rota à policy, stage, commit e deploy. Não publicar este README.

Validação local concluída com `validate.cjs`, Chromium headless 1243 e servidor `127.0.0.1:8097`, em 03/10/2026: 27 combinações (três casos × três fases × viewports 1440, 390 e 320), controles anterior/próxima, setas/Home/End, correspondência de rótulos, parâmetros de URL válidos/inválidos e fallback sem JavaScript. Sem erro de JavaScript, asset HTTP ≥ 400, requisição externa ou overflow horizontal. Links locais `/`, `/trabalhos`, `/seminario8-dever-poder/` e `/prot-tipo/` retornaram 200. Capturas visuais do hero e da demonstração nos três tamanhos foram inspecionadas; sem corte de texto ou sobreposição. Evidências fora do site: `../validation/council/{report.json,*-hero.png,*-demo.png}`. Revisão independente read-only adicional verificou atribuição, fidelidade e 20 estados/interações do JavaScript, sem problema material.

Reexecutar com a versão de browser instalada pelo projeto:

```sh
node scripts/work-demos/algoritmo-em-disputa/validate.cjs
```

Variáveis opcionais: `WORK_DEMO_URL`, `WORK_DEMO_EVIDENCE`, `WORK_DEMO_CHROMIUM` (caminho de Chromium já instalado, se necessário). O script escreve somente evidências de validação e não altera o site.
