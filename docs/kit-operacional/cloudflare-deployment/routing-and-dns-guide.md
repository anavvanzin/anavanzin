# Guia de Roteamento, DNS & Subdomínios na Cloudflare
## Mapeamento de Zonas, Regras de Borda & Registro.br

---

## 1. Topologia de Domínios e Subdomínios

O ecossistema `anavanzin.com` possui o domínio primário registrado no `Registro.br`, com autoridade DNS delegada aos servidores de nomes da **Cloudflare**. A partir desta zona raiz, múltiplos subdomínios e rotas são orquestrados:

```
                           REGISTRO.BR (Zona anavanzin.com.br / anavanzin.com)
                                                 │
                                 Nameservers Delegados para Cloudflare
                                 (ex: dina.ns.cloudflare.com / jim.ns.cloudflare.com)
                                                 │
                                                 ▼
                                     ZONA CLOUDFLARE DNS
                                                 │
        ┌────────────────────────┬───────────────┴────────────────┬────────────────────────┐
        ▼                        ▼                                ▼                        ▼
       Raiz                   Subdomínio                       Subdomínio               Subdomínio
  anavanzin.com        mentoria.anavanzin.com             studio.anavanzin.com      web.anavanzin.com
        │                        │                                │                        │
  Cloudflare Pages         Cloudflare Worker / Pages        Cloudflare Pages CNAME   Edge Redirect 301
  (Portal Principal,       (Landing Page PPG &             (Redireciona para        (Redireciona para
   /estudar, /metodologia)  Leitura Crítica)                /studio na raiz)         /studio na raiz)
```

---

## 2. Tabela de Registros DNS Recomendados (Painel Cloudflare DNS)

Para garantir que todos os pontos de entrada resolvam com SSL/TLS automático e aceleração de borda, configure as seguintes entradas na aba **DNS** do painel da Cloudflare:

| Tipo | Nome (Host) | Destino / Conteúdo | Proxy Status | TTL | Finalidade |
|---|---|---|---|---|---|
| **CNAME** | `@` (raiz) | `anavanzin.pages.dev` | **Proxied (Laranja)** | Auto | Aponta o domínio raiz para o projeto Cloudflare Pages |
| **CNAME** | `www` | `anavanzin.com` | **Proxied (Laranja)** | Auto | Canonicalização do prefixo www para a raiz |
| **CNAME** | `mentoria` | `anavanzin.pages.dev` | **Proxied (Laranja)** | Auto | Mapeia o subdomínio da Mentoria Acadêmica |
| **CNAME** | `studio` | `anavanzin.pages.dev` | **Proxied (Laranja)** | Auto | Mapeia o subdomínio comercial do Studio de Desenvolvimento |
| **CNAME** | `web` | `anavanzin.pages.dev` | **Proxied (Laranja)** | Auto | Alias técnico para redirecionamento |
| **TXT** | `@` | `google-site-verification=...` | DNS Only | Auto | Verificação de propriedade no Google Search Console |
| **MX** | `@` | Servidor de e-mail (ex: Cloudflare Email Routing / Google Workspace) | DNS Only | Auto | Roteamento dos e-mails institucionais `@anavanzin.com` |

> **Atenção:** Mantenha sempre o **Proxy Status como "Proxied" (nuvem laranja)**. Isso garante mitigação DDoS, compactação Brotli, suporte a HTTP/3 e certificado SSL/TLS gerenciado automaticamente.

---

## 3. Regras de Borda (`_redirects`)

O Cloudflare Pages processa o arquivo `_redirects` localizado na raiz do projeto compilado durante a fase de publicação (`.worker-assets/_redirects`). As regras são aplicadas com latência zero diretamente nos data centers de borda:

```ini
# ====================================================================
# Regras Canônicas de Roteamento — anavanzin.com
# ====================================================================

# 1. Frente 2 — Studio / Web Aliases
/web              /studio          301
/web/             /studio          301
/web/*            /studio/:splat   301

# 2. Rotas Históricas do Orientador (Preservação de Citações Acadêmicas)
/arno-dal-ri-site             https://arno-dal-ri.anavanzin.workers.dev/   301
/arno-dal-ri-site/            https://arno-dal-ri.anavanzin.workers.dev/   301
/arno-dal-ri-site/index.html  https://arno-dal-ri.anavanzin.workers.dev/   301

# 3. Exportações Legadas de Apresentações
/assets/Iconocracia%20-%20Apresentacao.dc.html  https://anavanzin.com/apresentacao/        301
/assets/Iconocracia%20-%20Apresentacao.dc       https://anavanzin.com/apresentacao/        301
/assets/Iconocracia%20-%20Manifesto.dc.html     https://anavanzin.com/manifesto/impressa   301
/assets/Iconocracia%20-%20Manifesto.dc          https://anavanzin.com/manifesto/impressa   301
/assets/Iconocracia%20-%20Video.dc.html         https://anavanzin.com/video/               301
/assets/Iconocracia%20-%20Video.dc              https://anavanzin.com/video/               301
/assets/Iconocracia%20-%20Video%20Vertical.dc.html https://anavanzin.com/video/            301
/assets/Iconocracia%20-%20Video%20Vertical.dc   https://anavanzin.com/video/               301
```

---

## 4. Mapeamento de Subdomínios Específicos

### A. Subdomínio `mentoria.anavanzin.com`
- **Ambiente de Produção:** Pode ser configurado como **Custom Domain** nas configurações do projeto Pages `anavanzin`, mapeando a rota interna `/mentoria/` como página inicial do subdomínio, ou operado via script Worker dedicado (`mentoria-ppg`) que serve os arquivos estáticos de `mentoria/index.html`.
- **Roteamento Interno:** Todas as pontes de `/metodologia/`, `/estudar/` e `index.html` utilizam o link absoluto canônico `https://mentoria.anavanzin.com`.

### B. Subdomínio `studio.anavanzin.com` e `web.anavanzin.com`
- **Ambiente de Produção:**
  - `studio.anavanzin.com` resolve o conteúdo de `https://anavanzin.com/studio`;
  - `web.anavanzin.com` redireciona via regra de borda HTTP 301 para `https://anavanzin.com/studio`.
- **Fallback Estático:** Caso o usuário acerte o servidor de arquivos estáticos sem resolução de borda, o arquivo `web/index.html` contém um `meta http-equiv="refresh"` e script `location.replace('/studio/')` que executa o redirecionamento instantâneo em menos de 10 milissegundos.

---

## 5. Cabeçalhos de Segurança Recomendados (`_headers`)

Para assegurar nota **A+** nos testes de segurança web (Mozilla Observatory / SSL Labs), o arquivo `_headers` injeta nos pontos de terminação TLS:

```ini
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:; font-src 'self' data:; connect-src 'self' https:;
```
