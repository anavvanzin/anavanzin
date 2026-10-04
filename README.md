# ICONOCRACIA · *Iuris Memoria*

> **A alegoria feminina como tecnologia visual do Estado.**
> Uma cartografia comparada do corpo feminino alegórico na cultura jurídica de seis nações — França, Reino Unido, Alemanha, Estados Unidos, Bélgica e Brasil — entre 1789 e 2000. *Onde o Estado precisou ser visto, vestiu uma mulher.*

Tese de Doutorado · **Ana Vanzin** · Programa de Pós-Graduação em Direito (PPGD/UFSC) · Grupo Ius Gentium · Florianópolis · MMXXVI

🔗 **No ar:** https://anavvanzin.github.io/iconocracia/

---

## O que há aqui

Site estático (HTML + React via CDN), sem build. Abra `index.html` — é a capa que liga as duas superfícies:

| | Superfície | Descrição |
|---|---|---|
| **I** | [`atlas/`](./atlas/) — **Atlas da Pesquisa** | A tese em página única: argumento, *anatomia da alegoria*, a parede de 27 espécimes, os oito painéis warburguianos, a *radiografia do endurecimento* e o léxico iconocrático. Tom claro/cabinet e mais ajustes via painel de *Tweaks*. |
| **II** | [`atlas-lab/`](./atlas-lab/) — **Atlas Lab** | Laboratório de inquérito visual: modos **Aprendizagem** e **Pesquisa**, painéis do módulo ICONOCRACY, radar dos dez indicadores iconométricos e comparação de espécimes lado a lado. |

## Estrutura

```
index.html        capa (Iuris Memoria)
styles.css        entrada do design system (importa fontes + tokens)
tokens/           cores, tipografia, espaçamento, base
fonts/            Instrument Serif · Crimson Pro · JetBrains Mono
assets/corpus/    espécimes do corpus (proveniência real)
atlas/            Atlas da pesquisa (index.html · data.js · parts.jsx · tweaks-panel.jsx)
atlas-lab/        Atlas Lab (index.html · data.js · app.jsx)
.nojekyll         desativa o Jekyll no GitHub Pages
```

## Publicação

Domínio canônico: **anavanzin.com**.

### Cloudflare Pages

A configuração do projeto `anavanzin` usa `main` para produção e
`codex/pages-preflight` para prévia. O build é `npm run build:pages`, com saída
em `.worker-assets`. O corte do domínio canônico para Pages depende de validar
o deployment de produção e as rotas; `www` deve redirecionar ao domínio principal
preservando caminho e query string.

[`wrangler.jsonc`](wrangler.jsonc) é a fonte da configuração Functions. `MESAS`
usa o namespace existente de produção; a prévia usa um namespace distinto.
O binding D1 `corpus` existente é preservado somente em produção. O site não
consulta nem modifica esse banco neste pipeline.

O preparo do artifact usa arquivos rastreados do HEAD. Para validar mudanças
locais destinadas à publicação, faça um commit na feature branch antes do build.
Ferramentas, infraestrutura interna e mídia acima do limite ficam fora do artifact.

### Caminho de retorno

O Worker `anavanzin` anterior e seus dados continuam preservados. Antes de
publicar, é necessário isolar os dois Workers Builds legados ligados incorretamente
a este repo de `main` e `codex/pages-preflight`, sem apagar os serviços nem revogar
a conexão GitHub compartilhada. Veja o [procedimento de rollback](scripts/pages/ROLLBACK.md).

O workflow [GitHub Pages](.github/workflows/deploy-pages.yml) continua publicando
uma cópia a partir de `main`. Ele não é o mecanismo de publicação canônico do Pages.

### Vercel

Vercel está desativado para deploys automáticos de Git neste repo. O arquivo
[`vercel.json`](vercel.json) mantém `git.deploymentEnabled: false`; o domínio
canônico é `anavanzin.com`.

O site usa caminhos a partir da raiz do domínio. As rotas dos trabalhos e os
redirects históricos são preservados no artifact de publicação.

## Notas

- O corpus exibido é **demonstrativo e fiel ao schema** da pesquisa; a proveniência de cada peça acompanha sua legenda. Fontes: Gallica/BnF, Brasiliana, acervos institucionais (STF, Senado), numismática e filatelia de domínio público.
- As notas do modo Aprendizagem do Atlas Lab são salvas **localmente** no navegador (`localStorage`); a integração de IA é, por ora, um marcador reflexivo (*"em breve"*).

---

*© Ana Vanzin. Imagens reproduzidas para fins de pesquisa acadêmica; direitos dos respectivos acervos.*
