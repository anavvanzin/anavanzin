# Handoff: Ecossistema Digital — Reformulação de Mentoria e Criação de Studio Web Cloudflare

## Session Metadata
- Created: 2026-11-09 08:07:00
- Project: /Users/anavanzin/Recuperacao/Projetos/anavanzin
- Branch: main
- Session duration: ~4 hours (concepção estratégica, alinhamento de briefing pessoal, execução técnica multiagente e validação E2E Playwright)

### Recent Commits (for context)
  - 9f8bce9 docs: correções da critique (contraste/aria) no log
  - 539f628 fix(av-os): contraste AA — h2 noturno, focus ring ouro, notas de arquivo, piso de texto e alvos >=24px; aria-current por pathname
  - 79c7ccb fix(home): preserve biography portrait aspect ratio
  - 8ed940f docs: Phase 8c (editoriais av-os) no log
  - 314717d feat(paginas): editoriais av-os — sobre, defesa, marginalia, metodologia, advocacia (thumb da defesa em hqdefault)

## Handoff Chain

- **Continues from**: None (fresh start)
- **Supersedes**: None

> This is the initial master handoff for the dual-front business architecture (Mentoria PPG & Studio Web Cloudflare).

## Current State Summary

Concluímos com 100% de sucesso a implementação estratégica e técnica das duas novas frentes comerciais da marca `ana vanzin inc` no ecossistema do site `anavanzin.com`. A Frente 1 (`mentoria.anavanzin.com` e sua cópia de staging em `av-os-staging/mentoria/index.html`) foi reformulada com 4 formatos de serviços e preços transparentes, nova narrativa de rigor sem adoecimento (abordando saúde mental, depressão e neuroatipicidade) e trajetórias reais da autora (OAB/Mestrado na graduação, transição planejada para o Doutorado UFSC para focar no livro da prova escrita). A Frente 2 (`studio/index.html` e `web/index.html` com suporte bilíngue PT/EN) foi criada do zero com tabela comparativa de 2 anos de hospedagem a R$ 0/mês na Cloudflare contra modelos de agência tradicional (WLab). Todas as pontes de navegação cruzada em `metodologia/index.html`, `estudar/index.html` e `index.html` foram inseridas, o kit operacional de 5 documentos foi gerado em `docs/kit-operacional/` e a suíte com 53 testes E2E Playwright está passando com 100% de sucesso (`PORT=8199 npx playwright test tests/mentoria.spec.js tests/ecosystem-frentes.spec.js`).

## Architecture Overview

O projeto `anavanzin.com` é um site estático e serverless de alta performance servido via Cloudflare Pages e Cloudflare Workers, sem bundlers pesados, utilizando HTML nativo, micro-scripts vanilla e o design system institucional `assets/av-os.css`. O subdomínio `mentoria.anavanzin.com` é servido pelo Worker `mentoria-ppg` ou diretamente de `mentoria/index.html`, espelhado em `av-os-staging/mentoria/index.html`. A nova rota `/studio` é servida como página estática bilíngue, com `/web` atuando como alias/redirecionador via `_redirects` e meta refresh.

## Critical Files

| File | Purpose | Relevance |
|------|---------|-----------|
| `mentoria/index.html` | Página canônica de `mentoria.anavanzin.com` | Frente 1: Posicionamento acadêmico, 4 planos com preços, "Rigor sem Adoecimento", prova de banca. |
| `av-os-staging/mentoria/index.html` | Espelho de staging da Mentoria | Mantido com paridade estrita conforme regra em `AGENTS.md`. |
| `studio/index.html` | Página comercial do estúdio web Cloudflare | Frente 2: Portfólio vivo, comparativo de custos em 2 anos, tabela de pacotes e toggle PT/EN. |
| `web/index.html` | Rota alias de redirecionamento | Garante redirecionamento instantâneo de `/web` para `/studio`. |
| `metodologia/index.html` | Guia aberto de métodos e PRISMA | Ponte editorial conectando o guia aberto à Leitura Crítica individual da Mentoria. |
| `estudar/index.html` | Plataforma aberta de estudo e técnicas | Ponte editorial conectando o sistema de estudo ao acompanhamento individual da Mentoria. |
| `index.html` | Home e hub institucional | Colofão técnico e modal de navegação atualizados com links para Studio e Mentoria. |
| `docs/kit-operacional/README.md` | Documentação operacional e comercial | Kit completo com fichas do Google Business Profile e guias de deploy Cloudflare. |
| `tests/mentoria.spec.js` | Suíte de testes da Mentoria (18 testes) | Valida rotas, preços, textos obrigatórios, responsividade e remoção de placeholders. |
| `tests/ecosystem-frentes.spec.js` | Suíte de testes do ecossistema (35 testes) | Valida rotas, links cruzados, integridade do Studio, toggle bilíngue e regras de borda. |

## Important Context

A autora Ana Vanzin é advogada (OAB/SC 67.872) e doutoranda em Direito na UFSC, com tese em fase avançada sobre o corpus de Iconocracia. Suas decisões estratégicas guiam este projeto:
1. **Separar frentes sem romper o ecossistema**: Candidatos a mestrado/doutorado não querem ver jargão de TI ou agência web; advogados e grupos de pesquisa buscando sites não devem cair em dicas de seleção acadêmica. As páginas são autônomas, mas pontes sutis e colofões técnicos garantem tráfego mútuo.
2. **Preços Abertos e Transparentes**: A Mentoria adota a escada de 4 degraus (R$ 550, R$ 1.690, R$ 2.590 e R$ 390). O Studio Web comprova a economia de R$ 0/mês de servidor na Cloudflare comparado a mensalidades de agência tradicional (WLab e outras que cobram R$ 100–250/mês para sempre).
3. **Rigor sem Adoecimento**: O método valoriza a humanidade e acolhimento — Ana convive com depressão e neuroatipicidade, e seu método nasceu para organizar o estudo de forma antecipada e administrável (passou na OAB e mestrado na graduação, planejou o doutorado na entressafra para focar no livro da prova escrita).

## Immediate Next Steps

1. **Revisão Visual Local**: Navegar localmente em `http://localhost:8199/mentoria/` e `http://localhost:8199/studio/` para conferência final dos detalhes visuais com Ana.
2. **Git Commit & Push**: Submeter as alterações testadas para o repositório remoto Git (`git commit -m "feat(ecossistema): mentoria ppg reformulada, studio web cloudflare e pontes integradas"`).
3. **Publicação no Google Business Profile**: Cadastrar os serviços e agendar os posts utilizando os roteiros prontos em `docs/kit-operacional/google-business-profile/`.

## Key Patterns Discovered

- **Paridade Staging Obrigatória**: Qualquer alteração em `mentoria/index.html` deve ser espelhada em `av-os-staging/mentoria/index.html` conforme convenção de governança do repositório.
- **Isolamento de Servidor de Teste**: O Playwright utiliza `webServer` no `playwright.config.js`. Atualizamos a configuração para ler `PORT = process.env.PORT || 8080` de forma a evitar colisões quando portas locais estiverem ocupadas (e.g. Open WebUI ou outros serviços locais em 8080).
- **Design System `av-os.css`**: Não introduzir estilos inline desnecessários; utilizar as classes utilitárias e variáveis semânticas de cores (`--bg`, `--ink`, `--surface`, `--accent`, `--border`) para preservar acessibilidade e consistência visual.

## Work Completed

### Tasks Finished

- [x] Reformulação de `mentoria/index.html` e `av-os-staging/mentoria/index.html` com o novo posicionamento de consistência jurídica de projeto.
- [x] Inclusão da narrativa "Rigor sem Adoecimento · Método como Cuidado" integrando saúde mental, depressão, neuroatipicidade e trajetória real de Ana Vanzin.
- [x] Implementação da tabela de 4 formatos de acompanhamento com preços transparentes (R$ 550, R$ 1.690, R$ 2.590 e R$ 390).
- [x] Substituição de "Depoimentos em verificação" pela seção de prova metodológica "Na Prática · O que a banca realmente avalia" (3 cards comparativos).
- [x] Construção da página `studio/index.html` com suporte bilíngue PT/EN, portfólio real e comparativo de 2 anos de hospedagem Cloudflare (R$ 0/mês).
- [x] Criação da rota alias `web/index.html` e inclusão das regras de borda em `_redirects`.
- [x] Inserção de chamadas editoriais sutis para a Mentoria em `metodologia/index.html` e `estudar/index.html`.
- [x] Atualização de menus de navegação e colofão da Home em `index.html`.
- [x] Criação do Kit Operacional em `docs/kit-operacional/` com guias para Google Business Profile e Cloudflare.
- [x] Execução e aprovação de 53 de 53 testes E2E no Playwright.

## Files Modified

| File | Changes | Rationale |
|------|---------|-----------|
| `mentoria/index.html` | Reescrita de seções, preços, bio e colofão | Implementação da Frente 1 (Mentoria PPG). |
| `av-os-staging/mentoria/index.html` | Sincronização idêntica com canônica | Conformidade com regra de staging em `AGENTS.md`. |
| `studio/index.html` | Criação da página comercial do Studio | Implementação da Frente 2 (Arquitetura Web Cloudflare). |
| `web/index.html` | Criação de página de redirecionamento | Garantir roteamento limpo de `/web` para `/studio`. |
| `metodologia/index.html` | Adicionado card editorial contextual | Ponte editorial entre métodos abertos e consultoria individual. |
| `estudar/index.html` | Adicionado card editorial contextual | Ponte editorial entre técnicas de estudo e acompanhamento. |
| `index.html` | Atualizado colofão técnico e links de rodapé | Integrar descoberta do Studio e Mentoria no hub principal. |
| `_redirects` | Regras de redirect `/web` -> `/studio` | Regra de borda para Cloudflare Pages. |
| `scripts/publication.json` | Registro das novas rotas `/studio` e `/web` | Conformidade com pipeline de publicação e sitemap. |
| `playwright.config.js` | Parametrização dinâmica da porta `process.env.PORT` | Evitar conflitos com serviços locais na porta 8080. |
| `tests/mentoria.spec.js` | 18 testes automatizados E2E | Garantir regressão zero na Frente 1. |
| `tests/ecosystem-frentes.spec.js` | 35 testes automatizados E2E | Garantir integridade de rotas, pontes e responsividade. |
| `docs/kit-operacional/README.md` | Documentação geral do kit | Roteiro mestre e matriz de precificação. |

## Decisions Made

| Decision | Options Considered | Rationale |
|----------|-------------------|-----------|
| Endereço da Frente Web como `/studio` (com alias `/web`) | Subdomínio isolado apenas vs rota no domínio principal | Concentra autoridade de SEO no domínio principal `anavanzin.com` enquanto permite mapear `studio.anavanzin.com` via DNS/Cloudflare. |
| Preços abertos nos pacotes de entrada e intermediários | Esconder preços vs exibir tudo sob consulta | Filtra curiosos sem orçamento, acelera a decisão de compra de candidatos com editais abertos e comprova matematicamente a economia na Cloudflare. |
| Incorporação explícita de saúde mental e neuroatipicidade | Omitir vivência pessoal vs transformar em diferencial | Humaniza o método, elimina o terrorismo acadêmico tradicional e gera conexão genuína com pesquisadores reais. |

## Assumptions Made

- O deploy do site principal continuará sendo executado via Cloudflare Pages a partir da branch `main`.
- Os clientes da frente Studio serão instruídos a registrar seus domínios no Registro.br e utilizar a camada gratuita da Cloudflare Pages/Workers para ter custo de hospedagem de R$ 0/mês.

## Potential Gotchas

- Na porta `8080`, pode haver outro processo ouvindo no ambiente macOS da usuária (como Open WebUI). Por isso, a porta foi parametrizada para aceitar `PORT=XXXX` nos testes (e.g. `PORT=8199`).

## Environment State

### Tools/Services Used

- Playwright E2E (`npx playwright test`)
- Node.js & `http-server`
- Git

### Active Processes

- Nenhum processo permanente deixado em execução em segundo plano.

### Environment Variables

- `PORT`: Define a porta do servidor local para os testes do Playwright (e.g. `PORT=8199`).

## Related Resources

- `docs/kit-operacional/README.md` — Matriz completa de serviços e navegação do kit operacional.
- `docs/kit-operacional/google-business-profile/gbp-mentoria-academica.md` — Roteiro de cadastro e posts para a Mentoria.
- `docs/kit-operacional/google-business-profile/gbp-advocacia-e-studio.md` — Roteiro de cadastro e posts para o Studio e Advocacia.
- `docs/kit-operacional/cloudflare-deployment/routing-and-dns-guide.md` — Guia de configuração DNS na Cloudflare.
