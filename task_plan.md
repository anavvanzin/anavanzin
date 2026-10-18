# Task Plan: Performance e peso do site anavanzin.com (auditoria 2026-10-18)

Use this file as the durable roadmap for the task. Create it before complex work and keep it current as phases change.

## Goal

Implementar as recomendações da auditoria de performance de 2026-10-18 e varrer o sitemap inteiro, reduzindo o peso frio das páginas sem regressão de qualidade visual, tipografia ou funcionalidade.

Site: https://anavanzin.com/ (branch `main`, deploy em Cloudflare Pages via `npm run build:pages`).

## Next Step

Nenhuma ação de implementação pendente. Próxima ação: decisões pendentes da Phase 7 (commit/deploy, política do estudar, specs velhas do redesign, hold do loader) com a pesquisadora.

## Current Phase

Phase 7 — Entregas pendentes de decisão

## Phases

### Phase 1: Sincronização e correções de cache/head (itens 1, 2, 4, 7)

- [x] Fast-forward da `main` local para `origin/main` (auto-stash preservou edição local do AGENTS.md)
- [x] `_headers`: regra `/assets/*` com `max-age=604800, must-revalidate`
- [x] `_headers`: corrigir política de fontes (`immutable` 1 ano era falso; `fetch_fonts.py` regenera in-place) para 7 dias + revalidate
- [x] `_headers`: `/estudar/assets/*` immutable 1 ano (Vite fingerprinta JS/CSS)
- [x] `home.css`: remover `@import` duplicado de `/fonts/fonts.css`
- [x] `index.html`: `preconnect` ao googletagmanager + preload de `instrument-serif-latin.woff2` e `dm-sans-latin.woff2`
- **Status:** complete

### Phase 2: Imagens da home (item 3 + 6)

- [x] Gerar 12 derivativos `*-board-{500,1000}.jpg` das 6 figuras opacas do board (sips lê WebP, cwebp converte; PNGs com alpha preservados)
- [x] `index.html` board: `srcset`/`sizes` por span de coluna + `width`/`height` nas 9 figuras
- [x] Hero: gerar `ana-vanzin-research-1200.webp` (323 KB, cwebp via brew) e ligar no srcset
- **Status:** complete

### Phase 3: Páginas internas e CLS

- [x] `pixel-justitia-sky.png` (1,18 MB) e `avatar-pixel.png` (684 KB) → WebP q95 (127/119 KB), alpha preservado; 8 arquivos de referência atualizados
- [x] `publicacoes/contrato-visual.html`: preload de Playfair Display + DM Sans (CLS 0,0250 → 0,0123)
- [x] `atlas/index.html`: `width`/`height` nas 5 imagens do `ul.atlas-grid` (CLS 0,0321 → 0,0025)
- **Status:** complete

### Phase 4: Estudar (item 8)

- [x] Converter 18 JPGs (11 MB) e 3 PNGs de jogos para WebP; 28 referências em `config.ts`/`libraryDocs.ts` atualizadas
- [x] Code-splitting: `ExhibitionDetail` e `LibraryReader` com `React.lazy` (bundle inicial 394,6 → 345,7 KB gzip 126 → 113)
- [x] Corrigir race de foco com Suspense (retentativa de 100 ms até 4 s em `moveToDestination`)
- [x] Auto-hospedar as 3 famílias do Google Fonts (26 faces latin/latin-ext, 416 KB, zero requisições externas)
- [x] Remover `app-forest.png` (não referenciado, 103 KB)
- **Status:** complete

### Phase 5: Atlas iconocracia

- [x] Gerar 30 derivativos `-atlas-1000` (15 JPG + 15 WebP com alpha)
- [x] `parts.js`: gancho `RES()` reescreve `/assets/corpus/*.jpg|png` para derivativos
- [x] Verificar: 10,6 → 3,0 MB, zero 404, zero erros JS
- **Status:** complete

### Phase 6: Varredura do sitemap (53 páginas)

- [x] Medir todas as 53 URLs do sitemap.xml
- [x] `/apresentacao/` 7,98 → 0,77 MB (símbolos PNG 192 KB → WebP 3-4 KB; corpus → `-atlas-1000`; `loading="lazy"`)
- [x] `/manifesto/impressa.html` 7,08 → 1,12 MB (frontispício 340 → 51 KB)
- [x] `/mae` 3,16 → 1,20 MB; `/malleus/` 2,05 → 1,01 MB (planisfério 10.643 px → 2.000 px, 8 KB)
- [x] `conceitos.html`, `perfil.html`, `orientador/`, `iconocracia/` (landing), `404.html`, `_ds_bundle.js`, `icons.js`, `WindowContents.js`: `pixel-justitia.png` (804 KB) → WebP 53 KB
- [x] `/atlas/nacao-como-mulher/` auditada e julgada saudável (sem alteração; duas placas eager são o conteúdo)
- **Status:** complete

### Phase 7: Entregas pendentes de decisão

- [x] Commit do changeset (10 commits `perf(*)`/`test` + 1 `docs`, `main` 11 à frente da `origin/main`; AGENTS.md deixado não commitado por ser edição local da pesquisadora)
- [ ] Push/deploy (deploy de produção na Cloudflare Pages acontece ao empurrar `main`)
- [ ] Política de indexação do `/estudar`: 23 testes de `publication.spec.js` falham (shells sem h1/body; injetar conteúdo gera CLS na troca do React; alternativas no findings.md)
- [ ] Triagem das specs velhas do redesign (~35 testes: hello.spec, home.spec, mobile-dialog testam DOM removido)
- [ ] Hold do loader: 705 ms (rede rápida) / 2,27 s (Fast3G), teto de 1,6 s; reduzir é decisão de desenho
- [ ] Atualização do AGENTS.md (edição local de Ana) para refletir o novo estado, se aplicável
- **Status:** pending

## Key Questions

1. O estudar deve ser indexável sem JS (resolver os 23 testes) ou permanecer como app client-side com canonical/noindex? → pendente com a pesquisadora.
2. As specs do redesign antigo (desktop-metáfora) devem ser reescritas para a home atual ou removidas? → pendente.
3. Qual o limite aceitável de hold do intro loader em redes móveis? → pendente.
4. Quando commitar e deployar o changeset acumulado? → pendente.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Derivativos com nomes novos (`-board-500`, `-atlas-1000`), originais intactos no disco | Fidelidade de corpus (AGENTS.md); originals continuam servindo atlas e og:image |
| PNGs com alpha nunca convertidos para JPEG | Fundo transparente viraria caixa branca sobre o papel; WebP preserva alpha |
| WebP q82–q95 conforme o tipo de imagem | q90 pixel art (bordas duras), q85 derivativos, q82 capas do estudar; teste cego a 400% sem ringing |
| Code-splitting apenas das rotas `LibraryReader`/`ExhibitionDetail` | Rotas já condicionais; Suspense com fallback mínimo e correção de foco validada pela spec de a11y |
| Fontes do estudar auto-hospedadas em `/estudar/fonts/` | Link externo do Google era render-blocking; consistência com o resto do site (woff2 self-hosted) |
| `sips` descartado como encoder JPEG | q60 ainda gerava 408 KB; cwebp q80 entrega 339 KB sem tocar dimensões |
| Regra `immutable` só para o que tem nome com hash | `/estudar/assets/*` (Vite fingerprinta); `/assets/*` e `/fonts/*.woff2` têm nomes estáveis → 7 dias |
| Teste obsoleto de intro reescrito em vez de removido | Preserva a propriedade de segurança (postMessage externo não dispensa o intro) contra o loader atual |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| `git pull` recusado por unstaged changes (config pull.rebase) | 1 | `git stash push -- AGENTS.md` → `merge --ff-only` → `stash pop` |
| Suíte pós-fixes com 62 falhas (assustador) | 1 | Baseline limpo stashado rodado em paralelo: 63 falhas pré-existentes → sem regressão |
| cwebp: `libpng error: ReadFunc: invalid read length` nos símbolos `sym-*.png` | 1 | Converter via `sips -s format png -Z` (tmp) → cwebp |
| 404 de `pixel-justitia.webp` em conceitos/perfil | 1 | `pixel-justitia.png` é arquivo distinto do `-sky`; gerado derivativo de 53 KB |
| Race de foco: 3 testes a11y falhando após React.lazy | 1 | `moveToDestination` retorna booleano; efeito re-tenta a cada 100 ms até 4 s |
| `sips -Z` no hero 1672→png para cwebp: perda silenciosa | 1 | Detectado por ls; refeito com saída verificada |
| Plugin superpowers registrado manualmente: skills não descobertas | 1 | Instalação manual revertida; caminho oficial é `/plugins install` no TUI |

## Notes

- Update phase status as work progresses: `pending` to `in_progress` to `complete`.
- Re-read the goal and next step before major decisions.
- Log errors promptly so failed approaches are not repeated.
- Artefatos de medição da sessão em `/tmp/webperf-av/` (results.json, summary.md, screenshots); /tmp é efêmero — re-gerar se necessário.
