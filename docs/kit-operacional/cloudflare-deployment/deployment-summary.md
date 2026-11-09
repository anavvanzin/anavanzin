# Guia de Implantação Cloudflare (Deployment Summary)
## Arquitetura Serverless, Custos R$ 0/mês & Pipeline de Produção

---

## 1. Visão Geral da Arquitetura Técnica

O ecossistema `anavanzin.com` opera sobre a rede global anycast da **Cloudflare** (mais de 330 data centers no mundo), combinando:
1. **Cloudflare Pages**: Hospedagem estática de altíssima performance para arquivos HTML, CSS, JavaScript, imagens WebP e fontes WOFF2;
2. **Cloudflare Workers**: Funções serverless de borda para roteamento inteligente, headers de segurança e endpoints de API leves;
3. **Cloudflare KV**: Armazenamento chave-valor distribuído com leitura ultra-rápida na borda (utilizado na persistência do estado da mesa de trabalho `/mesa/`);
4. **Cloudflare D1**: Banco de dados relacional SQL serverless baseado em SQLite, projetado para acervos e consultas estruturadas de humanidades digitais;
5. **Zero Google Fonts / Fontes Auto-Hospedadas**: Todas as fontes (Instrument Serif, Crimson Pro, JetBrains Mono, DM Sans) são servidas localmente em formato `.woff2`, garantindo 100% de conformidade com a LGPD (zero chamadas externas a servidores de terceiros) e eliminando bloqueios de renderização (FOUC).

```
[ Usuário ] ──── HTTP/3 Anycast ────► [ Cloudflare Edge Network ]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
     Cloudflare Pages             Cloudflare Workers               Cloudflare KV / D1
   (HTML / CSS / WOFF2)         (Roteamento, Proxies)           (Estado da Mesa & Dados)
```

---

## 2. Estrutura de Custos e Por Que Custa R$ 0/Mês

A infraestrutura foi desenhada para operar com folga dentro do **Free Tier perpétuo da Cloudflare**, proporcionando nível industrial de segurança e velocidade sem qualquer custo de mensalidade:

| Serviço | Limites do Plano Gratuito Cloudflare | Uso Médio Estimado do Ecossistema | Custo Mensal |
|---|---|---|---|
| **Cloudflare Pages** | Builds ilimitados, 500 deploys/mês, largura de banda ilimitada | ~15-30 deploys/mês, largura de banda moderada | **R$ 0,00** |
| **Cloudflare Workers** | 100.000 requisições/dia | ~2.000 a 8.000 requisições/dia | **R$ 0,00** |
| **Cloudflare KV** | 100.000 leituras/dia, 1.000 escritas/dia, 1 GB armazenamento | ~500 leituras/dia, ~50 escritas/dia | **R$ 0,00** |
| **Cloudflare D1** | 5 milhões de leituras/dia, 100.000 escritas/dia, 5 GB armazenamento | < 10.000 leituras/dia | **R$ 0,00** |
| **Certificados SSL/TLS** | Emissão e renovação automática ilimitada (Universal SSL) | 100% dos subdomínios cobertos | **R$ 0,00** |
| **Proteção DDoS & WAF** | Mitigação ilimitada e automática de ataques de camada 3, 4 e 7 | Ativa 24/7 | **R$ 0,00** |
| **Domínio Próprio (.com.br)** | Registro e anuidade cobrados diretamente pelo Registro.br | ~R$ 40,00/ano (ou ~R$ 70/2 anos) | **~R$ 3,33/mês** |

> **Resultado Financeiro:** O custo fixo total de infraestrutura é de **R$ 0,00 por mês** à Cloudflare. O único encargo do proprietário é a taxa oficial de registro do domínio no `Registro.br`.

---

## 3. Preparação dos Artefatos e Scripts de Build

O projeto utiliza um pipeline limpo baseado em Node.js para empacotar o site estático e preparar a árvore de publicação das Cloudflare Pages.

### Scripts Disponíveis no `package.json`

```bash
# 1. Preparar e construir a árvore de ativos do Cloudflare Pages
npm run build:pages

# 2. Executar testes de integração do runtime Pages
npm run test:pages

# 3. Executar auditoria de integridade do catálogo SEO e sitemap
npm run seo:check

# 4. Regenerar metadados canônicos e sitemap.xml
npm run seo:write

# 5. Executar a suíte completa de testes E2E Playwright
npm run test
```

### O Script `build:pages` (`scripts/pages/build.mjs`)
O comando `npm run build:pages` executa:
1. Validação da presença dos pontos de entrada essenciais (`index.html`, `404.html`, etc.);
2. Sincronização dos diretórios rastreados do ecossistema para a pasta `.worker-assets/`;
3. Cópia do arquivo de rotas `_redirects` e `_headers` para o diretório de distribuição;
4. Verificação de integridade dos assets de humanidades digitais e fontes.

---

## 4. Configuração do `wrangler.jsonc`

O arquivo `wrangler.jsonc` declara as configurações do Worker de borda e vincula os namespaces de KV e D1:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "anavanzin-pages",
  "compatibility_date": "2026-10-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": ".worker-assets",
  "kv_namespaces": [
    {
      "binding": "MESAS",
      "id": "production_kv_mesas_id",
      "preview_id": "preview_kv_mesas_id"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "anavanzin_corpus",
      "database_id": "production_d1_database_id"
    }
  ]
}
```

---

## 5. Procedimento de Publicação em Produção

### Opção A: Deploy Automático via Git (Recomendado)
1. Cada `push` ou `merge` na branch `main` dispara automaticamente o build no dashboard da Cloudflare Pages;
2. Configuração no painel Cloudflare Pages:
   - **Build command:** `npm run build:pages`
   - **Build output directory:** `.worker-assets`
   - **Node.js Version:** `22.x` (definida via variável de ambiente `NODE_VERSION=22`)
3. A Cloudflare compila e propaga os novos arquivos para todos os edge locations mundiais em menos de 45 segundos.

### Opção B: Deploy Manual via CLI (`wrangler`)
```bash
# 1. Certifique-se de que o catálogo de publicação está limpo
npm run seo:check

# 2. Gere os artefatos de Pages
npm run build:pages

# 3. Publique diretamente via Wrangler Pages CLI
npx wrangler pages deploy .worker-assets --project-name=anavanzin
```
